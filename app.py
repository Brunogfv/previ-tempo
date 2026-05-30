import os
from datetime import datetime
from collections import defaultdict

import requests
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("OWM_API_KEY", "SUA_CHAVE_AQUI")
BASE_URL = "https://api.openweathermap.org/data/2.5"
DIAS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]


def get_weather_data(cidade):
    params = {"q": cidade, "appid": API_KEY, "units": "metric", "lang": "pt_br"}
    try:
        weather_resp = requests.get(f"{BASE_URL}/weather", params=params, timeout=10)
        if weather_resp.status_code != 200:
            return None
        current = weather_resp.json()

        forecast_resp = requests.get(f"{BASE_URL}/forecast", params=params, timeout=10)
        forecast_data = forecast_resp.json() if forecast_resp.status_code == 200 else None
    except requests.RequestException:
        return {"erro_rede": True}

    return process_data(current, forecast_data)


def process_data(current, forecast_data):
    w = current["weather"][0]
    main = current["main"]
    wind = current["wind"]
    sys = current["sys"]

    def fmt_unix(ts):
        return datetime.fromtimestamp(ts).strftime("%H:%M")

    result = {
        "cidade": current["name"],
        "pais": current["sys"].get("country", ""),
        "lat": current["coord"]["lat"],
        "lon": current["coord"]["lon"],
        "temperatura": round(main["temp"]),
        "sensacao": round(main["feels_like"]),
        "descricao": w["description"].capitalize(),
        "icone": w["icon"],
        "icone_url": f"https://openweathermap.org/img/wn/{w['icon']}@2x.png",
        "umidade": main["humidity"],
        "vento": round(wind.get("speed", 0) * 3.6, 1),
        "pressao": main["pressure"],
        "max": round(main["temp_max"]),
        "min": round(main["temp_min"]),
        "nascer_sol": fmt_unix(sys.get("sunrise", 0)),
        "por_sol": fmt_unix(sys.get("sunset", 0)),
        "nuvens": current.get("clouds", {}).get("all", 0),
        "visibilidade": current.get("visibility", 0),
    }

    if forecast_data:
        result["previsao"] = process_forecast(forecast_data)

    return result


def process_forecast(forecast_data):
    days = defaultdict(list)
    for item in forecast_data["list"]:
        day = item["dt_txt"][:10]
        days[day].append(item)

    forecast = []
    for day_key in sorted(days.keys())[:5]:
        entries = days[day_key]
        temps = [e["main"]["temp"] for e in entries]
        icons = [e["weather"][0]["icon"] for e in entries]
        descs = [e["weather"][0]["description"] for e in entries]
        dt = datetime.strptime(day_key, "%Y-%m-%d")
        idx = len(icons) // 2
        forecast.append({
            "dia": DIAS_PT[dt.weekday()],
            "data": f"{dt.day:02d}/{dt.month:02d}",
            "max": round(max(temps)),
            "min": round(min(temps)),
            "icone": icons[idx],
            "icone_url": f"https://openweathermap.org/img/wn/{icons[idx]}@2x.png",
            "descricao": descs[idx].capitalize(),
        })

    return forecast


@app.route("/")
def index():
    import time
    return render_template("index.html", cache_buster=int(time.time()))


@app.route("/api/weather")
def api_weather():
    cidade = request.args.get("cidade", "").strip()
    if not cidade:
        return jsonify({"erro": "Informe uma cidade"}), 400
    data = get_weather_data(cidade)
    if data is None:
        return jsonify({"erro": "Cidade não encontrada"}), 404
    if isinstance(data, dict) and data.get("erro_rede"):
        return jsonify({"erro": "Erro de conexão com o servidor de clima. Tente novamente."}), 503
    return jsonify(data)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
