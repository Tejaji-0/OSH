import { useState } from 'react';
import './TherapyMode.css';

function TherapyMode({ isOpen, onClose, onSendMessage }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [breathPhase, setBreathPhase] = useState('inhale');

  // Breathing animation cycle
  useState(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setBreathPhase(prev => {
          if (prev === 'inhale') return 'hold-in';
          if (prev === 'hold-in') return 'exhale';
          if (prev === 'exhale') return 'hold-out';
          return 'inhale';
        });
      }, 1250); // 5 seconds total cycle (4 phases × 1.25s)
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const breathTexts = {
    'inhale': 'Breathe in slowly... 🌊',
    'hold-in': 'Hold gently... ⏸️',
    'exhale': 'Breathe out slowly... 💨',
    'hold-out': 'Rest... ✨'
  };

  const guidedPrompts = [
    {
      question: "Let's start gently. Take a deep breath. What brought you here today?",
      placeholder: "I've been feeling..."
    },
    {
      question: "That sounds important. Can you tell me more about when these feelings started?",
      placeholder: "It began when..."
    },
    {
      question: "I hear you. What would help you feel even a little bit better right now?",
      placeholder: "I think it would help if..."
    },
    {
      question: "That's a good insight. What's one small step you could take today toward that?",
      placeholder: "I could try..."
    }
  ];

  const handleResponse = (text) => {
    if (!text.trim()) return;
    
    setResponses([...responses, text]);
    onSendMessage(`[Therapy Mode] ${guidedPrompts[step].question}\n\nUser: ${text}`);
    
    if (step < guidedPrompts.length - 1) {
      setTimeout(() => setStep(step + 1), 1000);
    } else {
      setTimeout(() => {
        onSendMessage("[Therapy Mode Complete] Thank you for sharing. Let's continue our conversation.");
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="therapy-overlay" onClick={(e) => e.target.className === 'therapy-overlay' && onClose()}>
      <div className="therapy-container">
        <div className="therapy-header">
          <h2>🧘 Therapy Mode</h2>
          <p>Guided conversation for deeper reflection</p>
          <button className="close-therapy" onClick={onClose}>✕</button>
        </div>
        
        <div className="breathing-indicator">
          <div className="breath-circle"></div>
          <p>{breathTexts[breathPhase]}</p>
        </div>
        
        <div className="therapy-progress">
          {guidedPrompts.map((_, i) => (
            <div 
              key={i} 
              className={`progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            />
          ))}
        </div>
        
        <div className="therapy-question">
          <p>{guidedPrompts[step].question}</p>
        </div>
        
        <div className="therapy-input-area">
          <textarea
            placeholder={guidedPrompts[step].placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleResponse(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <button 
            onClick={(e) => {
              const textarea = e.target.previousSibling;
              handleResponse(textarea.value);
              textarea.value = '';
            }}
            className="therapy-send-btn"
          >
            Continue →
          </button>
        </div>
        
        <div className="therapy-tip">
          💡 Take your time. There's no rush.
        </div>
      </div>
    </div>
  );
}

export default TherapyMode;
