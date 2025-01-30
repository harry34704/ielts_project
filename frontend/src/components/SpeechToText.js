import React, { useState } from "react";
import axios from "axios";

function SpeechToText() {
  const [text, setText] = useState("");

  const handleTranscribe = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    const result = await axios.post("http://127.0.0.1:8000/speech/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setText(result.data.transcription);
  };

  return (
    <div>
      <h3>Speech to Text</h3>
      <input type="file" accept="audio/*" onChange={handleTranscribe} />
      <p>{text}</p>
    </div>
  );
}

export default SpeechToText;
