import React, { useState, useEffect, useRef } from 'react';
import { Send, Copy, ArrowDownToLine } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { fetchChatMessages, sendMessage } from '../../api';
import { Message } from '../../types';
import { Textarea } from '../ui/textarea';
import 'katex/dist/katex.min.css';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [rows, setRows] = useState(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageRef = useRef<string>('');

  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchChatMessages();
      setMessages(fetchedMessages);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      lastMessageRef.current = messages[messages.length - 1].content;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage: Message = {
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setRows(1);

    const response = await sendMessage(input);
    const botMessage: Message = {
      content: response,
      role: 'assistant',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const lineCount = e.target.value.split('\n').length;
    setRows(Math.min(lineCount, 5));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow line break
        return;
      } else {
        e.preventDefault();
        handleSend();
      }
    } else if (e.key === 'ArrowUp' && input === '') {
      e.preventDefault();
      setInput(lastMessageRef.current);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const insertMessage = (content: string) => {
    setInput(content);
    inputRef.current?.focus();
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
            <div className={`text-xs text-gray-500 mt-1 flex items-center
              ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <span>{message.timestamp.toLocaleTimeString()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyMessage(message.content)}
                className="ml-2"
              >
                <Copy size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertMessage(message.content)}
                className="ml-2"
              >
                <ArrowDownToLine size={16} />
              </Button>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={rows}
            className="resize-none"
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