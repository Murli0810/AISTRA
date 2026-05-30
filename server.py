import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()

app= FastAPI(title="Gemini AI Mentor Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

model= ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature= 0.7)


prompt= ChatPromptTemplate([
    ("system","You are an elite communicator. Talk to the user and solve his queries."),
    MessagesPlaceholder(variable_name="history"),
    ("human","{input}")
])
chain= prompt | model | StrOutputParser()

chat_history= []

async def response_streamer(user_message: str):
    try:

        full_response=""

        for chunk in chain.stream({"input": user_message,"history":chat_history}):
            full_response += chunk
            yield f"{chunk}"

        chat_history.append(HumanMessage(content=user_message))
        chat_history.append(AIMessage(content=full_response))

    except Exception as e:
        yield f"Error during streaming processing: {str(e)}"

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be blank.")
    
    return StreamingResponse(
        response_streamer(request.message),
        media_type="text/event-stream"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload= True)