# AISTRA

A high-performance, asynchronous REST API backend engineered for real-time AI mentoring and conversational streaming. Built utilizing FastAPI and LangChain, the system interfaces directly with advanced LLM infrastructures to provide low-latency, stateful conversational workflows.

* **Live Frontend UI:** [https://aistra-azure.vercel.app](https://aistra-azure.vercel.app)
* **Live API Server:** [https://aistra.onrender.com](https://aistra.onrender.com)

## 🚀 Features

* **Asynchronous Streaming Output:** Leverages HTTP server-sent events (`text/event-stream`) via FastAPI's `StreamingResponse` for instantaneous, chunked token delivery.
* **Stateful Chat History:** Manages conversational memory dynamically using LangChain’s core message schemas (`HumanMessage`, `AIMessage`) to preserve context across interactions.
* **Optimized LLM Chain:** Implements a decoupled LangChain pipeline combining explicit system structuring, historical context tracking, and efficient string output parsing.
* **Production-Ready Configuration:** Built-in CORS middleware enabling seamless cross-origin frontend connectivity alongside Uvicorn-powered ASGI deployment.

## 🛠️ Tech Stack

* **Frontend:** NextJs
* **Core Framework:** FastAPI
* **Orchestration & AI Memory:** LangChain (Core & Google GenAI)
* **Underlying Model:** `gemini-2.5-flash`
* **Data Validation:** Pydantic v2
* **ASGI Server:** Uvicorn
* **Hosting Platforms:** Render (Backend API Service) & Vercel (Frontend Client Application)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Murli0810/AISTRA.git](https://github.com/Murli0810/AISTRA.git)
   cd AISTRA
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment Variables:**
   Create a .env file in the root directory and add your Google Gemini API key:
   ```Code snippet
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
4. **Launch the Server:**
   ```bash
   python server.py
   ```
