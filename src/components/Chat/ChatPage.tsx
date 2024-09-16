import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { fetchChatMessages, sendMessage } from '../../api';
import { Message } from '../../types';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchChatMessages();
      setMessages(fetchedMessages);
    };
    loadMessages();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    const response = await sendMessage(input);
    const botMessage: Message = {
      content: response,
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  return (
    <div className="flex flex-col h-screen">
      <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div
            key={generateUUID()}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;