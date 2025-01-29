import React from "react";
import SpeechToText from "./SpeechToText";
import Chat from "./Chat";
import Scoring from "./Scoring";

function Dashboard() {
  return (
    <div>
      <h2>Welcome to IELTS Practice</h2>
      <p>Improve your IELTS score with our AI-powered practice platform</p>
      <SpeechToText />
      <Chat />
      <Scoring />
    </div>
  );
}

export default Dashboard;
