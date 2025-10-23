import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaCar } from 'react-icons/fa';
import OpenAI from 'openai';
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
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

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

  // Initialize button position
  useEffect(() => {
    if (position.y === null) {
      // Default position: middle-bottom of right side
      const defaultY = window.innerHeight - 200; // Initial Y position
      setPosition({ x: null, y: defaultY }); // x is null, always stays on right side
    }
  }, [position]);

  // Handle drag start
  const handleDragStart = (e) => {
    if (isOpen) return; // Don't allow dragging when chat is open
    
    setIsDragging(true);
    
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    
    setDragOffset({
      x: 0,
      y: clientY - position.y
    });
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    
    const newY = clientY - dragOffset.y;
    
    // Keep button within viewport bounds (vertical only)
    const buttonSize = 60;
    const maxY = window.innerHeight - buttonSize - 20; // 20px padding from bottom
    
    setPosition({
      x: null, // Always stay on the right side
      y: Math.max(20, Math.min(newY, maxY)) // 20px padding from top
    });
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset, position]);

  const toggleChat = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  const getAIResponse = async (userMessage) => {
    try {
      // Using OpenRouter API with SDK
      const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
      
      // Check if API key is available
      if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === '62b24e2e3ce768d22fea05d7baabc7983b7c16d4111f157a2d7a6f371e684d7c') {
        console.log('OpenRouter API key not configured, using fallback');
        return await getAlternativeAIResponse(userMessage);
      }
      
      console.log('Using OpenRouter SDK...');
      console.log('API Key loaded:', OPENROUTER_API_KEY ? 'Yes (length: ' + OPENROUTER_API_KEY.length + ')' : 'No');
      
      // Initialize OpenAI SDK with OpenRouter configuration
      const openai = new OpenAI({
        apiKey: OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AutoDeals ChatBot'
        },
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
      
      // Build conversation context for better continuity
      const conversationMessages = [
        {
          role: 'system',
          content: `You are AutoDeals AI Assistant, an intelligent and knowledgeable virtual assistant for a premium car dealership. You excel at answering ANY question clearly, accurately, and conversationally.

AutoDeals Information (mention when relevant):
- Premium car dealership specializing in new & used vehicles
- Phone: +1 (555) 123-4567 | Email: info@autodeals.com
- Location: 123 Auto Street, Car City
- Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM
- Services: Sales, financing, trade-ins, test drives, warranties, maintenance

Your capabilities:
- Answer general knowledge questions (science, history, tech, entertainment, etc.)
- Provide car advice and automotive information
- Help with AutoDeals services and inquiries
- Engage in natural, friendly conversation
- Give detailed, informative responses

Be helpful, accurate, and conversational. Keep responses concise (2-4 sentences) but informative.`
        }
      ];

      // Add conversation history (last 6 messages)
      conversationHistory.slice(-6).forEach(msg => {
        conversationMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });

      // Add current user message
      conversationMessages.push({
        role: 'user',
        content: userMessage
      });

      // Use SDK to make the API call
      const completion = await openai.chat.completions.create({
        model: 'openai/gpt-3.5-turbo',
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 300
      });

      console.log('OpenRouter SDK response received');
      
      if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
        const generatedText = completion.choices[0].message.content.trim();
        
        if (generatedText.length > 10) {
          return generatedText;
        }
      }
      
      throw new Error('Invalid OpenRouter response');
    } catch (error) {
      console.error('OpenRouter SDK Error:', error);
      return await getAlternativeAIResponse(userMessage);
    }
  };

  const getAlternativeAIResponse = async (userMessage) => {
    try {
      // Alternative: Use a different free AI API
      const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: conversationHistory
              .filter(m => m.sender === 'user')
              .map(m => m.text)
              .slice(-3),
            generated_responses: conversationHistory
              .filter(m => m.sender === 'bot')
              .map(m => m.text)
              .slice(-3),
            text: userMessage
          },
          parameters: {
            max_length: 200
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.generated_text) {
          return data.generated_text.trim();
        }
      }
      
      // If both APIs fail, use enhanced responses
      return getFallbackResponse(userMessage);
    } catch (error) {
      console.error('Alternative AI Error:', error);
      return getFallbackResponse(userMessage);
    }
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
      {!isOpen && (
        <button 
          ref={buttonRef}
          className={`chat-bot-button ${isDragging ? 'dragging' : ''}`}
          style={{
            top: position.y !== null ? `${position.y}px` : '50%',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onClick={toggleChat}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          aria-label="Toggle chat"
          title="Drag vertically to move"
        >
          <FaComments />
          <span className="chat-pulse"></span>
        </button>
      )}

      {/* Chat Panel */}
      <div className={`chat-bot-panel ${isOpen ? 'open' : ''}`}>
        {/* Chat Header */}
        <div className="chat-bot-header">
          <div className="chat-bot-header-content">
            <div className="chat-bot-avatar">
              <FaCar />
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
                  <FaCar />
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
                <FaCar />
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
