import React, { useState } from "react";
import axios from "axios";

function Scoring() {
  const [text, setText] = useState("");
  const [scores, setScores] = useState(null);

  const handleScore = async () => {
    const result = await axios.post("http://127.0.0.1:8000/scoring/", {
      username: "test_user",
      text,
    });
    setScores(result.data.scores);
  };

  return (
    <div>
      <h3>IELTS Scoring</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleScore}>Get Score</button>
      {scores && (
        <div>
          <p>Fluency: {scores.fluency}</p>
          <p>Grammar: {scores.grammar}</p>
          <p>Lexical Resource: {scores.lexical_resource}</p>
        </div>
      )}
    </div>
  );
}

export default Scoring;
