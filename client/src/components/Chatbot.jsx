import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/ai/chatbot', { message: input });
      const botMessage = { role: 'bot', text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {isOpen ? (
        <div style={{ width: '300px', border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}>
          <div style={{ padding: '10px', background: '#3399cc', color: 'white', borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>Support Chat</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ height: '250px', overflowY: 'auto', padding: '10px' }}>
            {messages.length === 0 && <p style={{ color: '#999' }}>Hi! How can I help you?</p>}
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', marginBottom: '8px' }}>
                <span style={{
                  background: msg.role === 'user' ? '#3399cc' : '#f1f1f1',
                  color: msg.role === 'user' ? 'white' : 'black',
                  padding: '6px 10px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  maxWidth: '80%',
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <p style={{ color: '#999' }}>Typing...</p>}
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '5px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button onClick={handleSend} disabled={loading}>Send</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{ background: '#3399cc', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '20px', cursor: 'pointer' }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;