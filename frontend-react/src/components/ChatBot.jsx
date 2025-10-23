import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm AutoDeals Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Simple response logic
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to AutoDeals. How can I assist you with finding your dream car today?";
    } else if (message.includes('price') || message.includes('cost')) {
      return "Our cars range from affordable to luxury. You can browse our listings page to see prices, or I can help you find cars within your budget. What's your price range?";
    } else if (message.includes('listing') || message.includes('cars') || message.includes('available')) {
      return "We have a great selection of cars! Check out our Car Listings page to see all available vehicles. Would you like me to help you find something specific?";
    } else if (message.includes('order') || message.includes('buy') || message.includes('purchase')) {
      return "To order a car, you can visit our Order Now page or contact us directly. Would you like me to guide you through the process?";
    } else if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return "You can reach us at:\n≡ƒô₧ Phone: +1 (555) 123-4567\n≡ƒôº Email: info@autodeals.com\nOr visit our Contact page for more options!";
    } else if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Feel free to ask if you need anything else. Happy car shopping! ≡ƒÜù";
    } else if (message.includes('help')) {
      return "I can help you with:\nΓÇó Browsing car listings\nΓÇó Price inquiries\nΓÇó Ordering process\nΓÇó Contact information\nΓÇó General questions\n\nWhat would you like to know?";
    } else {
      return "I'd be happy to help! You can ask me about our car listings, prices, ordering process, or contact information. What would you like to know?";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`chat-bot-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
        {!isOpen && <span className="chat-pulse"></span>}
      </button>

      {/* Chat Panel */}
      <div className={`chat-bot-panel ${isOpen ? 'open' : ''}`}>
        {/* Chat Header */}
        <div className="chat-bot-header">
          <div className="chat-bot-header-content">
            <div className="chat-bot-avatar">
              <FaRobot />
            </div>
            <div className="chat-bot-title">
              <h3>AutoDeals Assistant</h3>
              <span className="chat-bot-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <button 
            className="chat-bot-close"
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-bot-messages">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`chat-message ${message.sender}`}
            >
              {message.sender === 'bot' && (
                <div className="message-avatar">
                  <FaRobot />
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message bot">
              <div className="message-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form className="chat-bot-input" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input-field"
          />
          <button 
            type="submit"
            className="chat-send-button"
            disabled={inputMessage.trim() === ''}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="chat-bot-overlay"
          onClick={toggleChat}
        />
      )}
    </>
  );
};

export default ChatBot;
