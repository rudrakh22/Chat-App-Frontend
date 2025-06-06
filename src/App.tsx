import { useState, useRef, useEffect } from "react";
import "./App.css";
import { GrSend } from "react-icons/gr";

function App() {
  const [messages, setMessages] = useState<string[]>(["hi there"]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null); 

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value;
    if (!message || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message,
        },
      })
    );
    //@ts-ignore
    inputRef.current.value = "";
  };

  return (
    <div className="w-screen h-screen bg-gray-950 p-10 flex flex-col gap-4">
      <p className="text-purple-300 text-center font-bold text-3xl">
        Welcome to Chat Application
      </p>

      {/* Messages Area */}
      <div className="w-full h-full max-w-[50%] mx-auto border border-gray-700 rounded-xl shadow-inner overflow-y-auto flex flex-col gap-2 p-6 bg-gray-900">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="text-gray-800 p-2 px-5 border border-gray-300 max-w-max rounded-xl bg-gradient-to-br from-gray-100 to-white shadow-sm"
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Input + Button */}
      <div className="flex items-center gap-4 max-w-[50%] mx-auto w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-600 text-white text-xl font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 cursor-pointer flex items-center gap-2"
        >
          <span>Send</span>
          <GrSend className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default App;
