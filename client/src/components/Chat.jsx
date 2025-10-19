import { useEffect, useRef } from 'react';
import './Chat.css';

function Chat({ messages }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat" ref={chatRef} aria-live="polite" aria-label="Chat messages">
      {messages.map((msg, idx) => (
        <div key={idx} className={`msg ${msg.role}`}>
          <div className="bubble">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}

export default Chat;
