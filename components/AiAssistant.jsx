import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your IMS Assistant. I can check stock levels (by SKU) and order statuses. How can I help?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { text: response.data.reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the AI server.", isBot: true, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-widget-container">
      {isOpen && (
        <div className="ai-chat-window card">
          <div className="ai-header">
            <h3>✨ IMS Assistant</h3>
            <button className="icon-btn secondary" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="ai-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message-bubble ${msg.isBot ? 'bot' : 'user'} ${msg.isError ? 'error' : ''}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="ai-message-bubble bot typing">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="ai-input-area">
            <input 
              type="text" 
              placeholder="Ask about stock or orders..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>Send</button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="ai-fab" onClick={() => setIsOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Ask AI
        </button>
      )}
    </div>
  );
}