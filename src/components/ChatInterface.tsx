import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { marked } from 'marked';
import { ChatMessage } from '../types';
import { generateResponse } from '../utils/openai';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // const context = "";
      const response = await generateResponse(input, "");
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error generating a response. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="gradient-bg p-6 text-white">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <Sparkles className="w-8 h-8" />
          <h1 className="text-2xl font-light tracking-wide">Feline Predator Assistant</h1>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto p-4 overflow-y-auto">
          <div className="space-y-6 ">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-animation flex items-start space-x-3 opacity-0 ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    message.role === 'assistant'
                      ? 'bg-white'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  }`}
                >
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: marked(message.content, { breaks: true }) 
                    }}
                  />
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 message-animation">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="bg-white border-t">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}