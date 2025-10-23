import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm AutoDeals AI Assistant. I can help you find the perfect car, answer questions about our inventory, pricing, financing options, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
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

  const getAIResponse = async (userMessage) => {
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    const apiUrl = import.meta.env.VITE_AI_API_URL;
    const model = import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo';

    // If no API key, use enhanced fallback
    if (!apiKey || !apiUrl) {
      console.log('Using enhanced AI fallback mode');
      return getEnhancedFallbackResponse(userMessage);
    }

    try {
      // Build conversation context for AI
      const systemMessage = {
        role: 'system',
        content: `You are AutoDeals AI Assistant, a knowledgeable and friendly car dealership virtual assistant.

Your role:
- Help customers find their perfect car
- Answer questions about vehicles, pricing, features, and specifications
- Guide customers through the buying/ordering process
- Provide financing information and options
- Assist with test drive scheduling
- Handle trade-in inquiries
- Offer warranty and service information

AutoDeals Information:
📞 Phone: +1 (555) 123-4567
📧 Email: info@autodeals.com
📍 Address: 123 Auto Street, Car City
⏰ Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM

Guidelines:
- Be warm, helpful, and professional
- Keep responses concise but informative (2-4 sentences)
- Use relevant emojis sparingly for engagement
- If asked about specific inventory, suggest checking the Car Listings page
- For detailed quotes, recommend contacting the sales team
- Always prioritize customer satisfaction

Respond naturally and conversationally.`
      };

      // Get last 5 conversation pairs for context
      const recentMessages = conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            systemMessage,
            ...recentMessages,
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 250,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      }
      
      throw new Error('Invalid AI response format');
    } catch (error) {
      console.error('AI Error:', error);
      return getEnhancedFallbackResponse(userMessage);
    }
  };

  const getEnhancedFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Use sentiment analysis for better responses
    const isQuestion = message.includes('?') || message.startsWith('how') || 
                      message.startsWith('what') || message.startsWith('when') || 
                      message.startsWith('where') || message.startsWith('why') ||
                      message.startsWith('can') || message.startsWith('do');
    
    return getFallbackResponse(userMessage);
  };

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Enhanced rule-based responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! 👋 Welcome to AutoDeals. I'm here to help you find your perfect car. What are you looking for today?";
    } else if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
      return "Our inventory ranges from affordable daily drivers to luxury vehicles. 💰\n\nTypical price ranges:\n• Economy cars: $15,000 - $25,000\n• Mid-size sedans: $25,000 - $40,000\n• SUVs: $30,000 - $60,000\n• Luxury vehicles: $50,000+\n\nWhat's your budget range? I can help you find the best options!";
    } else if (message.includes('suv') || message.includes('sedan') || message.includes('truck') || message.includes('sports')) {
      return "Great choice! 🚗 We have excellent options in that category. Check out our Car Listings page to see all available vehicles with detailed specs and photos. Would you like to know about specific features or compare models?";
    } else if (message.includes('electric') || message.includes('ev') || message.includes('hybrid')) {
      return "We have eco-friendly options! 🌱⚡\n\nOur green vehicle lineup includes:\n• Full electric vehicles (EVs)\n• Plug-in hybrids\n• Traditional hybrids\n\nThey offer great fuel savings and environmental benefits. Would you like to know more about charging, range, or incentives?";
    } else if (message.includes('financing') || message.includes('loan') || message.includes('payment')) {
      return "We offer flexible financing options! 💳\n\n• Competitive interest rates\n• Multiple loan terms (36-72 months)\n• Trade-in evaluations\n• Special offers for qualified buyers\n\nOur finance team can work with your credit situation. Would you like to discuss monthly payment estimates?";
    } else if (message.includes('test drive') || message.includes('visit') || message.includes('showroom')) {
      return "We'd love to see you at our showroom! 🏢\n\nSchedule a test drive:\n📍 123 Auto Street, Car City\n📞 Call: +1 (555) 123-4567\n⏰ Mon-Fri: 9AM-6PM, Sat: 10AM-4PM\n\nYou can also visit our Order page to request a specific vehicle test drive!";
    } else if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('reach')) {
      return "Here's how to reach us! 📞\n\n� Phone: +1 (555) 123-4567\n📧 Email: info@autodeals.com\n📍 Address: 123 Auto Street, Car City\n⏰ Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM\n\nYou can also fill out our contact form for a quick response!";
    } else if (message.includes('warranty') || message.includes('guarantee')) {
      return "All our vehicles come with protection! 🛡️\n\n• Comprehensive warranty coverage\n• Extended warranty options\n• Certified pre-owned guarantees\n• 30-day exchange policy\n\nWe stand behind every vehicle we sell. Need details on a specific car?";
    } else if (message.includes('trade') || message.includes('trade-in')) {
      return "We accept trade-ins! 🔄\n\nGet the best value for your current vehicle:\n• Free appraisal\n• Competitive offers\n• Quick process\n• Apply trade value to your purchase\n\nBring your car by or describe it to us, and we'll give you an estimate!";
    } else if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! 😊 I'm here anytime you need help. Happy car shopping, and feel free to ask me anything else! 🚗✨";
    } else if (message.includes('help') || message.includes('assist') || message.includes('can you')) {
      return "I'm here to help with everything! 🤝\n\n✅ Browse our inventory\n✅ Compare cars and features\n✅ Pricing and financing info\n✅ Test drive scheduling\n✅ Trade-in valuations\n✅ Warranty details\n✅ Contact information\n\nWhat specific question can I answer for you?";
    } else {
      return "That's a great question! 🤔 I'd be happy to provide more specific information. Could you tell me more about what you're looking for? Are you interested in:\n\n• Viewing our car listings?\n• Learning about prices?\n• Scheduling a test drive?\n• Financing options?\n• Something else?\n\nJust let me know!";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;

    const userText = inputMessage;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const responseText = await getAIResponse(userText);
      
      // Add small delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const botResponse = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setConversationHistory(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: "I apologize, I'm having trouble connecting right now. 😅 But I can still help you! Try asking about our cars, pricing, or contact information.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
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
