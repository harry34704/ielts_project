import React, { useState } from "react";
import axios from "axios";

function Chat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleChat = async () => {
    const result = await axios.post("http://127.0.0.1:8000/chat/", {
      user_input: input,
    });
    setResponse(result.data.examiner_response);
  };

  return (
    <div>
      <h3>Chat with IELTS Examiner</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleChat}>Send</button>
      <p>{response}</p>
    </div>
  );
}

export default Chat;
