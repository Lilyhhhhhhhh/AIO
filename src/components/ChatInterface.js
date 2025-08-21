'use client';

import { useState, useEffect, useRef } from 'react';

export default function ChatInterface({ user, okr }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 初始化聊天会话
  useEffect(() => {
    if (user) {
      // 添加欢迎消息
      setMessages([
        {
          role: 'assistant',
          content: '你好！我是你的学习助手。你可以问我任何问题，或者输入"今天做什么"获取基于你的OKR的任务推荐。'
        }
      ]);
      
      // 在实际应用中，这里会从数据库加载历史消息
    }
  }, [user]);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // 调用AI API获取回复
      const response = await getAIResponse(input);
      
      const assistantMessage = {
        role: 'assistant',
        content: response
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 显示错误消息
      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: '抱歉，处理您的请求时出现了错误。请稍后再试。'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 获取AI回复
  const getAIResponse = async (query) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          userId: user.id,
          okr
        }),
      });
      
      if (!response.ok) {
        throw new Error('API请求失败');
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('AI回复请求失败:', error);
      return '抱歉，我现在无法回答你的问题。请稍后再试。';
    }
  };

  // 处理按键事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-100 ml-auto max-w-[80%]' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="输入你的问题..."
            rows="2"
            disabled={loading}
          />
          <button 
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`px-4 py-2 rounded-r-lg ${
              loading || !input.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {loading ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
}
