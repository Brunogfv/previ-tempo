# 🌤️ Previsão do Tempo

Aplicação web para consultar a previsão do tempo com interface moderna, mapa interativo e previsão para 5 dias.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-orange)

---

## 📸 Preview

```
┌──────────────────────────────────────────┐
│          ⛅ Previsão do Tempo             │
│                                          │
│  ┌─────────────────────────────────┐     │
│  │  🔍 [Digite uma cidade...] [Buscar] │  │
│  └─────────────────────────────────┘     │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  ──── barra de cor dinâmica ────    │ │
│  │                                      │ │
│  │  ☀️  28°C    São Paulo, BR          │ │
│  │            Céu limpo                 │ │
│  │            Sensação: 26°C            │ │
│  │                                      │ │
│  │  💧 45%   💨 12 km/h   🌡️ 1013 hPa  │ │
│  │  ⬆️ 30°/22°  🌅 06:30  🌇 17:45      │ │
│  │  ☁️ 10%   👁️ 10.0 km                │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  📅 Previsão para os próximos dias       │
│  ┌─────┬─────┬─────┬─────┬─────┐        │
│  │ Seg │ Ter │ Qua │ Qui │ Sex │        │
│  │ ☀️  │ ⛅  │ ☁️  │ 🌧️  │ ☀️  │        │
│  │28°/ │26°/ │24°/ │22°/ │27°/ │        │
│  │ 20° │ 19° │ 18° │ 17° │ 21° │        │
│  └─────┴─────┴─────┴─────┴─────┘        │
│                                          │
│  🗺️ Localização                          │
│  ┌─────────────────────────────────┐     │
│  │          🗺️ MAPA                │     │
│  └─────────────────────────────────┘     │
└──────────────────────────────────────────┘
```

---

## ✨ Funcionalidades

- **🌡️ Clima atual**: temperatura, sensação térmica, umidade, vento, pressão
- **📅 Previsão de 5 dias**: máximas e mínimas com ícones do clima
- **🗺️ Mapa interativo**: localização da cidade com Leaflet + OpenStreetMap
- **🌅🌇 Nascer e pôr do sol**: horários calculados automaticamente
- **🎨 Tema dinâmico**: cores e fundo mudam conforme o clima e horário
- **📱 Responsivo**: funciona em desktop e mobile
- **🔒 Privacidade**: dados processados no servidor, sem rastreamento

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Backend | Python + Flask |
| Frontend | HTML5 + CSS3 + JavaScript |
| Mapa | Leaflet.js + OpenStreetMap |
| API de Clima | OpenWeatherMap |
| Deploy | Render (cloud) |

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Python 3.10+
- Conta gratuita em [OpenWeatherMap](https://openweathermap.org/api)

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/Brunogfv/previ-tempo.git
cd previsao-tempo

# 2. Criar ambiente virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Criar arquivo .env na raiz do projeto
#    e colocar sua chave da API:
echo OWM_API_KEY=sua_chave_aqui > .env

# 5. Rodar
python app.py
```

Abrir no navegador: **http://127.0.0.1:5000**

---

## ☁️ Deploy no Render

1. Criar conta em [render.com](https://render.com) (login com GitHub)
2. Clicar em **New +** → **Web Service**
3. Conectar ao repositório do GitHub
4. Configurar:

| Configuração | Valor |
|-------------|-------|
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Plan** | Free |

5. Adicionar **Environment Variables**:
   - `OWM_API_KEY` = sua chave da API
   - `PYTHON_VERSION` = `3.11.9`

6. Clicar em **Deploy Web Service**

---

## 📁 Estrutura do projeto

```
previsao-tempo/
├── app.py                # Servidor Flask
├── requirements.txt      # Dependências
├── .env                  # Chave da API (local, não versionado)
├── .gitignore
├── README.md
├── templates/
│   └── index.html        # Página principal
└── static/
    ├── css/
    │   └── style.css     # Estilos e temas
    └── js/
        └── script.js     # Lógica do frontend e mapa
```

---

## 🌐 API própria

O projeto expõe um endpoint JSON:

```
GET /api/weather?cidade=Sao+Paulo
```

Exemplo de resposta:

```json
{
  "cidade": "São Paulo",
  "pais": "BR",
  "temperatura": 28,
  "sensacao": 26,
  "descricao": "Céu limpo",
  "umidade": 45,
  "vento": 12.6,
  "pressao": 1013,
  "nascer_sol": "06:30",
  "por_sol": "17:45",
  "nuvens": 10,
  "visibilidade": 10000,
  "previsao": [
    { "dia": "Seg", "data": "01/06", "max": 28, "min": 20 }
  ]
}
```

---

## 📄 Licença

Este projeto é de uso pessoal. Sinta-se livre para modificar e usar como quiser.
