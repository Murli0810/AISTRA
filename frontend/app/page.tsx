"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "gemini";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the container to the newest message chunk
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Combine both messages into a single state update to avoid fast-refresh loops
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "gemini", text: "" }
    ]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.body) throw new Error("ReadableStream data is unavailable.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Read the network stream chunks dynamically as they hit the browser
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });

        // Functional state mapping to update the streaming target item cleanly
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1
              ? { ...msg, text: msg.text + textChunk }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to fetch stream data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-[#222831] text-[#EEEEEE] font-sans">
      {/* Top Header */}
      <header className="p-4 bg-[#393E46] border-b border-[#222831] shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wide text-[#00ADB5]">AISTRA</h1>
      </header>

      {/* Messages Scrolling Arena */}
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-2xl px-4 py-3 rounded-xl shadow-sm text-sm whitespace-pre-wrap ${
              msg.sender === "user"
                ? "bg-[#00ADB5] text-[#222831] rounded-br-none"
                : "bg-[#393E46] text-[#EEEEEE] rounded-bl-none border border-[#222831]"
            }`}>
              {/* FIX: Changed text-s to text-xs to prevent rendering build hangs */}
              <span className="block text-xs opacity-70 font-semibold uppercase mb-1">
                {msg.sender === "user" ? "You" : "AISTRA"}
              </span>
              {msg.text || (isLoading && index === messages.length - 1 ? "▋" : "")}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </section>

      {/* Footer Form Input Panel */}
      <footer className="p-4 bg-[#393E46] border-t border-[#222831]">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your technical mentor a question..."
            disabled={isLoading}
            className="flex-1 bg-[#222831] border border-[#393E46] rounded-xl px-4 py-3 text-sm text-[#EEEEEE] focus:outline-none focus:border-[#00ADB5] placeholder-[#EEEEEE]/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#222831] hover:bg-[#00ADB5] hover:text-[#222831] text-[#EEEEEE] font-semibold px-6 py-3 rounded-xl text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </footer>
    </main>
  );
}