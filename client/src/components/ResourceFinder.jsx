import './ResourceFinder.css';

function ResourceFinder({ isOpen, onClose }) {
  const resources = [
    {
      category: 'Crisis Helplines',
      items: [
        { name: 'National Suicide Prevention Lifeline', contact: '988', available: '24/7', country: 'USA' },
        { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7', country: 'USA' },
        { name: 'SAMHSA Helpline', contact: '1-800-662-4357', available: '24/7', country: 'USA' },
        { name: 'Vandrevala Foundation', contact: '+91-9999666555', available: '24/7', country: 'India' },
        { name: 'iCall', contact: '+91-9152987821', available: 'Mon-Sat 8AM-10PM', country: 'India' }
      ]
    },
    {
      category: 'Free Online Therapy',
      items: [
        { name: 'BetterHelp Financial Aid', url: 'https://www.betterhelp.com/financial-aid/', description: 'Sliding scale therapy' },
        { name: 'Open Path Collective', url: 'https://openpathcollective.org/', description: '$30-$80 per session' },
        { name: 'NAMI Helpline', contact: '1-800-950-6264', available: 'Mon-Fri 10AM-10PM ET', country: 'USA' },
        { name: 'Manodharshan', contact: '+91-1800-599-0019', available: '24/7', country: 'India' }
      ]
    },
    {
      category: 'Mental Health Apps',
      items: [
        { name: 'Calm', description: 'Meditation and sleep', url: 'https://www.calm.com/' },
        { name: 'Headspace', description: 'Mindfulness and meditation', url: 'https://www.headspace.com/' },
        { name: 'Sanvello', description: 'Mood tracking and therapy', url: 'https://www.sanvello.com/' },
        { name: 'Wysa', description: 'AI therapy chatbot', url: 'https://www.wysa.io/' }
      ]
    },
    {
      category: 'Community Support',
      items: [
        { name: 'NAMI Support Groups', url: 'https://www.nami.org/Support-Education', description: 'Peer support groups' },
        { name: 'Mental Health America', url: 'https://www.mhanational.org/', description: 'Resources and advocacy' },
        { name: 'The Mighty', url: 'https://themighty.com/', description: 'Mental health community' },
        { name: 'Reddit r/mentalhealth', url: 'https://www.reddit.com/r/mentalhealth/', description: 'Online peer support' }
      ]
    },
    {
      category: 'Self-Help Resources',
      items: [
        { name: 'MindTools', url: 'https://www.mindtools.com/', description: 'Stress management techniques' },
        { name: 'Mental Health Foundation', url: 'https://www.mentalhealth.org.uk/', description: 'Educational resources' },
        { name: 'Psychology Today', url: 'https://www.psychologytoday.com/', description: 'Find therapists near you' },
        { name: 'Mayo Clinic Mental Health', url: 'https://www.mayoclinic.org/mental-health', description: 'Medical information' }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="resource-overlay">
      <div className="resource-container">
        <div className="resource-header">
          <h2>🌐 Mental Health Resources</h2>
          <p>Professional help and support networks</p>
          <button className="close-resource" onClick={onClose}>✕</button>
        </div>

        <div className="emergency-banner">
          <strong>⚠️ In Crisis?</strong> If you're in immediate danger, please call emergency services (911 in USA, 112 in Europe, 100 in India) or go to your nearest emergency room.
        </div>

        <div className="resources-list">
          {resources.map((section, idx) => (
            <div key={idx} className="resource-category">
              <h3>{section.category}</h3>
              <div className="resource-items">
                {section.items.map((item, i) => (
                  <div key={i} className="resource-item">
                    <div className="resource-item-header">
                      <h4>{item.name}</h4>
                      {item.country && <span className="country-badge">{item.country}</span>}
                    </div>
                    
                    {item.description && <p className="resource-desc">{item.description}</p>}
                    
                    {item.contact && (
                      <div className="resource-contact">
                        <span className="contact-label">Contact:</span>
                        <span className="contact-value">{item.contact}</span>
                      </div>
                    )}
                    
                    {item.available && (
                      <div className="resource-hours">
                        <span className="hours-label">Available:</span>
                        <span className="hours-value">{item.available}</span>
                      </div>
                    )}
                    
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        Visit Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="disclaimer">
          <p><strong>Disclaimer:</strong> ClearMind is not a replacement for professional mental health care. These resources are provided for informational purposes. Always consult with qualified mental health professionals for diagnosis and treatment.</p>
        </div>
      </div>
    </div>
  );
}

export default ResourceFinder;
