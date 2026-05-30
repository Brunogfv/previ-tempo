let map = null;
let marker = null;

document.getElementById("search-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("city-input");
    const cidade = input.value.trim();
    if (!cidade) return;

    showLoading();
    limparErro();
    document.getElementById("weather-result").classList.add("hidden");

    try {
        const resp = await fetch(`/api/weather?cidade=${encodeURIComponent(cidade)}`);
        const data = await resp.json();

        if (!resp.ok) {
            mostrarErro(data.erro || "Erro ao buscar dados");
            hideLoading();
            return;
        }

        preencherTela(data);
        hideLoading();
    } catch (err) {
        mostrarErro("Erro de conexão. Verifique se o servidor está rodando.");
        hideLoading();
    }
});

function preencherTela(data) {
    document.getElementById("city-name").textContent = `${data.cidade}, ${data.pais}`;
    document.getElementById("temp-value").textContent = data.temperatura;
    document.getElementById("weather-desc").textContent = data.descricao;
    document.getElementById("feels-like").textContent = data.sensacao;
    document.getElementById("umidade").textContent = `${data.umidade}%`;
    document.getElementById("vento").textContent = `${data.vento} km/h`;
    document.getElementById("pressao").textContent = `${data.pressao} hPa`;
    document.getElementById("max-min").textContent = `${data.max}° / ${data.min}°`;
    document.getElementById("nascer-sol").textContent = data.nascer_sol || "--";
    document.getElementById("por-sol").textContent = data.por_sol || "--";
    document.getElementById("nuvens").textContent = data.nuvens !== undefined ? `${data.nuvens}%` : "--";
    document.getElementById("visibilidade").textContent = data.visibilidade !== undefined ? `${(data.visibilidade / 1000).toFixed(1)} km` : "--";

    const iconEl = document.getElementById("weather-icon");
    iconEl.src = data.icone_url;
    iconEl.alt = data.descricao;

    aplicarTema(data);
    atualizarBackground(data);

    if (data.previsao) {
        const container = document.getElementById("forecast-cards");
        container.innerHTML = data.previsao.map((d) => `
            <div class="forecast-card">
                <div class="day">${d.dia}</div>
                <div class="date">${d.data}</div>
                <img src="${d.icone_url}" alt="${d.descricao}">
                <div class="temps">
                    <span class="max">${d.max}°</span>
                    <span class="min">${d.min}°</span>
                </div>
                <div class="desc">${d.descricao}</div>
            </div>
        `).join("");
    }

    document.getElementById("weather-result").classList.remove("hidden");
    atualizarMapa(data.lat, data.lon, data.cidade);
}

function aplicarTema(data) {
    const t = data.temperatura;
    const icone = data.icone || "";
    const isNoite = icone.endsWith("n");
    const accent = document.getElementById("weather-accent");

    document.body.classList.toggle("noite", isNoite);

    let corInicio, corFim;
    if (isNoite) {
        corInicio = "#1e1b4b";
        corFim = "#312e81";
    } else if (t >= 30) {
        corInicio = "#dc2626";
        corFim = "#ea580c";
    } else if (t >= 20) {
        corInicio = "#ea580c";
        corFim = "#f59e0b";
    } else if (t >= 10) {
        corInicio = "#2563eb";
        corFim = "#06b6d4";
    } else {
        corInicio = "#6366f1";
        corFim = "#06b6d4";
    }
    accent.style.background = `linear-gradient(90deg, ${corInicio}, ${corFim})`;
}

function atualizarBackground(data) {
    const icone = data.icone || "";
    const bg = document.getElementById("weather-bg");
    const isNoite = icone.endsWith("n");

    let grad;
    if (isNoite) {
        grad = "linear-gradient(135deg, #050614, #0c0e2b, #141845, #0f112e)";
    } else if (icone.startsWith("01")) {
        grad = "linear-gradient(135deg, #0c3483, #1a4ba3, #2d6bcb, #1a4ba3)";
    } else if (icone.startsWith("02")) {
        grad = "linear-gradient(135deg, #0c2b5e, #1a4a8a, #2d6bcb, #1a4a8a)";
    } else if (icone.startsWith("03") || icone.startsWith("04")) {
        grad = "linear-gradient(135deg, #1a1a2e, #2d2d44, #3d3d5c, #2d2d44)";
    } else if (icone.startsWith("09") || icone.startsWith("10")) {
        grad = "linear-gradient(135deg, #0f172a, #1e293b, #334155, #1e293b)";
    } else if (icone.startsWith("11")) {
        grad = "linear-gradient(135deg, #0f0f1a, #1a1a30, #2a1a30, #1a1a30)";
    } else if (icone.startsWith("50")) {
        grad = "linear-gradient(135deg, #1a1a2e, #2d2d3a, #3d3d4a, #2d2d3a)";
    } else {
        grad = "linear-gradient(135deg, #0c0e2b, #1a1e4b, #2d336b, #1a1e4b)";
    }
    bg.style.background = grad;
    bg.style.backgroundSize = "400% 400%";
}

function atualizarMapa(lat, lon, nome) {
    if (!map) {
        map = L.map("map", {
            zoomControl: true,
            attributionControl: false,
        }).setView([lat, lon], 10);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }

    if (marker) map.removeLayer(marker);

    marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${nome}</b>`)
        .openPopup();
}

document.getElementById("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("search-form").requestSubmit();
});

function showLoading() {
    document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
    document.getElementById("loading").classList.add("hidden");
}

function mostrarErro(msg) {
    const el = document.getElementById("error");
    el.textContent = msg;
    el.classList.remove("hidden");
}

function limparErro() {
    document.getElementById("error").classList.add("hidden");
}
