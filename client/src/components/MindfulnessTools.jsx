import { useState, useEffect } from 'react';
import './MindfulnessTools.css';

function MindfulnessTools({ isOpen, onClose }) {
  const [activeExercise, setActiveExercise] = useState(null);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');

  const exercises = [
    {
      id: 'box-breathing',
      name: '📦 Box Breathing',
      description: '4-4-4-4 breathing pattern',
      duration: '2 minutes',
      instructions: 'Breathe in for 4, hold for 4, out for 4, hold for 4',
      timing: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }, // Equal 4-4-4-4
      totalCycle: 16 // seconds
    },
    {
      id: 'deep-breathing',
      name: '🌊 Deep Breathing',
      description: 'Long, slow breaths',
      duration: '3 minutes',
      instructions: 'Breathe deeply and slowly, focusing on your breath',
      timing: { inhale: 5, holdIn: 2, exhale: 6, holdOut: 2 }, // Longer exhale
      totalCycle: 15 // seconds
    },
    {
      id: '478-breathing',
      name: '✨ 4-7-8 Technique',
      description: 'Relaxation breathing',
      duration: '2 minutes',
      instructions: 'Inhale 4 seconds, hold 7 seconds, exhale 8 seconds',
      timing: { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 }, // 4-7-8 pattern
      totalCycle: 19 // seconds
    },
    {
      id: 'gratitude',
      name: '🙏 Gratitude Meditation',
      description: 'Reflect on positive things',
      duration: '5 minutes',
      instructions: 'Think of 3 things you\'re grateful for today',
      timing: { inhale: 4, holdIn: 3, exhale: 5, holdOut: 3 }, // Calm meditation
      totalCycle: 15 // seconds
    },
    {
      id: 'body-scan',
      name: '🧘 Body Scan',
      description: 'Progressive relaxation',
      duration: '10 minutes',
      instructions: 'Relax each part of your body from head to toe',
      timing: { inhale: 6, holdIn: 2, exhale: 7, holdOut: 3 }, // Very slow
      totalCycle: 18 // seconds
    }
  ];

  const affirmations = [
    "I am capable of handling whatever comes my way",
    "My feelings are valid and I deserve care",
    "I choose peace and calm in this moment",
    "I am enough, exactly as I am",
    "Each breath brings me closer to calm",
    "I release what I cannot control",
    "I am worthy of love and compassion",
    "This too shall pass"
  ];

  const [currentAffirmation, setCurrentAffirmation] = useState(
    affirmations[Math.floor(Math.random() * affirmations.length)]
  );

  const startBreathing = (exercise) => {
    setActiveExercise(exercise);
    setIsBreathing(true);
    setBreathCount(0);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setActiveExercise(null);
  };

  useEffect(() => {
    if (isBreathing && activeExercise) {
      const timing = activeExercise.timing;
      const totalCycle = activeExercise.totalCycle * 1000; // Convert to ms
      
      // Count complete breath cycles
      const breathInterval = setInterval(() => {
        setBreathCount(prev => prev + 1);
      }, totalCycle);
      
      // Phase transition logic based on exercise timing
      let phaseTimeout;
      const runPhaseSequence = () => {
        setBreathPhase('inhale');
        
        // After inhale duration, move to hold-in
        phaseTimeout = setTimeout(() => {
          if (timing.holdIn > 0) {
            setBreathPhase('hold-in');
            
            // After hold-in duration, move to exhale
            phaseTimeout = setTimeout(() => {
              setBreathPhase('exhale');
              
              // After exhale duration, move to hold-out (if any)
              phaseTimeout = setTimeout(() => {
                if (timing.holdOut > 0) {
                  setBreathPhase('hold-out');
                  
                  // After hold-out, cycle repeats
                  phaseTimeout = setTimeout(runPhaseSequence, timing.holdOut * 1000);
                } else {
                  // No hold-out, restart immediately
                  runPhaseSequence();
                }
              }, timing.exhale * 1000);
            }, timing.holdIn * 1000);
          } else {
            // No hold-in, go straight to exhale
            setBreathPhase('exhale');
            phaseTimeout = setTimeout(() => {
              if (timing.holdOut > 0) {
                setBreathPhase('hold-out');
                phaseTimeout = setTimeout(runPhaseSequence, timing.holdOut * 1000);
              } else {
                runPhaseSequence();
              }
            }, timing.exhale * 1000);
          }
        }, timing.inhale * 1000);
      };
      
      runPhaseSequence();
      
      return () => {
        clearInterval(breathInterval);
        clearTimeout(phaseTimeout);
      };
    }
  }, [isBreathing, activeExercise]);

  const getBreathInstruction = () => {
    if (!activeExercise) return 'Breathe...';
    
    const timing = activeExercise.timing;
    
    switch (breathPhase) {
      case 'inhale':
        return `🌊 Breathe In... (${timing.inhale}s)`;
      case 'hold-in':
        return timing.holdIn > 0 ? `⏸️ Hold... (${timing.holdIn}s)` : '';
      case 'exhale':
        return `💨 Breathe Out... (${timing.exhale}s)`;
      case 'hold-out':
        return timing.holdOut > 0 ? `✨ Rest... (${timing.holdOut}s)` : '';
      default:
        return 'Breathe...';
    }
  };

  const newAffirmation = () => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setCurrentAffirmation(randomAffirmation);
  };

  if (!isOpen) return null;

  return (
    <div className="mindfulness-overlay">
      <div className="mindfulness-container">
        <div className="mindfulness-header">
          <h2>🧘 Mindfulness Tools</h2>
          <button className="close-mindfulness" onClick={onClose}>✕</button>
        </div>

        {!activeExercise ? (
          <>
            <div className="affirmation-card">
              <h3>✨ Daily Affirmation</h3>
              <p className="affirmation-text">{currentAffirmation}</p>
              <button onClick={newAffirmation} className="new-affirmation-btn">
                Get New Affirmation
              </button>
            </div>

            <div className="exercises-grid">
              <h3>Choose a Breathing Exercise</h3>
              {exercises.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-icon">{exercise.name}</div>
                  <div className="exercise-details">
                    <h4>{exercise.description}</h4>
                    <p>{exercise.instructions}</p>
                    <span className="duration">{exercise.duration}</span>
                  </div>
                  <button 
                    onClick={() => startBreathing(exercise)}
                    className="start-exercise-btn"
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>

            <div className="quick-tips">
              <h3>💡 Quick Tips</h3>
              <ul>
                <li>Find a quiet, comfortable space</li>
                <li>Close your eyes if it feels comfortable</li>
                <li>Focus on your breath, not perfection</li>
                <li>Practice regularly for best results</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="breathing-session">
            <h3>{activeExercise.name}</h3>
            <p className="session-instructions" key={breathPhase}>{getBreathInstruction()}</p>
            
            <div className="breath-visualizer">
              <div 
                className={`breath-orb breath-phase-${breathPhase}`}
                style={{
                  '--cycle-duration': `${activeExercise.totalCycle}s`,
                  '--inhale-duration': `${activeExercise.timing.inhale}s`,
                  '--exhale-duration': `${activeExercise.timing.exhale}s`
                }}
              ></div>
              <p className="breath-count">Breath Cycle {breathCount + 1}</p>
              <p className="cycle-info">{activeExercise.id === 'box-breathing' ? '📦 4-4-4-4 Pattern' : activeExercise.id === '478-breathing' ? '✨ 4-7-8 Pattern' : `⏱️ ${activeExercise.totalCycle}s cycle`}</p>
            </div>
            
            <button onClick={stopBreathing} className="stop-btn">
              Complete Session
            </button>
            
            <div className="session-progress">
              <div className="progress-text">
                {breathCount >= 5 ? 'Amazing progress! You\'re doing wonderfully! 🌟' : 'Keep breathing... You\'re doing great! 💫'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MindfulnessTools;
