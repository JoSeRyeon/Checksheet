import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchMessages = () => {
      api.get('/chat').then(res => setMessages(res.data));
    };
    fetchMessages();
    // const interval = setInterval(fetchMessages, 1000);
    // return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    api.post('/chat', { user_id: userId, message: input })
      .then((res) => {
        setInput('');
        setMessages(res.data)
      });
  };

  return (
    <div>
      <h2>채팅</h2>
      <div style={{border:'1px solid #ccc', height:200, overflowY:'scroll'}}>
        {messages.map(msg => <div key={msg.id}>{msg.user_id}: {msg.message}</div>)}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}
