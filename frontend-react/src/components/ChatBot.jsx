import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaCar } from 'react-icons/fa';
import OpenAI from 'openai';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
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

  const toggleChat = async () => {
    if (!isDragging) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      
      // Generate AI greeting when chat opens for the first time
      if (newIsOpen && !isInitialized && messages.length === 0) {
        setIsInitialized(true);
        setIsTyping(true);
        
        try {
          const greeting = await getAIResponse("Hey! A customer just opened the chat. Give them a warm, friendly greeting. Introduce yourself as Alex, the car specialist from AutoDeals. Let them know you're here to help with any car-related questions. Keep it short, welcoming, and car-focused!");
          
          const botMessage = {
            id: Date.now(),
            text: greeting,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages([botMessage]);
          setConversationHistory([{ text: greeting, sender: 'bot' }]);
        } catch (error) {
          console.error('Error generating greeting:', error);
          // Fallback greeting if AI fails
          const fallbackGreeting = {
            id: Date.now(),
            text: "Hey there! ≡ƒæï I'm Alex from AutoDeals. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages([fallbackGreeting]);
          setConversationHistory([{ text: fallbackGreeting.text, sender: 'bot' }]);
        } finally {
          setIsTyping(false);
        }
      }
    }
  };

  const getAIResponse = async (userMessage) => {
    try {
      // Using OpenRouter API with SDK
      const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
      
      // Check if API key is available
      if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
        console.log('OpenRouter API key not configured, using fallback');
        return await getAlternativeAIResponse(userMessage);
      }
      
      console.log('Using OpenRouter SDK with FREE model...');
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
      
      console.log('OpenAI SDK initialized successfully');
      
      // Build conversation context for better continuity
      const conversationMessages = [
        {
          role: 'system',
          content: `You are Alex, a friendly car specialist working at AutoDeals, a premium car dealership. You ONLY discuss car-related topics.

STRICT TOPIC RESTRICTION:
- You ONLY answer questions about cars, vehicles, automotive topics, and AutoDeals services
- If someone asks about anything NOT related to cars or AutoDeals, politely redirect them back to car topics
- Examples of OFF-TOPIC questions to reject: weather, cooking, sports, movies, science, math, general knowledge, politics, etc.
- Examples of ALLOWED topics: car models, features, pricing, financing, maintenance, test drives, trade-ins, automotive technology, car buying advice, vehicle comparisons

COMMUNICATION STYLE:
- Talk like a real person, not a robot - use casual language and natural expressions
- Show genuine enthusiasm about cars and helping customers
- Use contractions (I'm, you're, we've, can't, don't) to sound natural
- Express personality - be friendly, understanding, and personable
- Use emojis sparingly (😊, 👍, 🚗, ✨) to add warmth
- Be concise but friendly (2-4 sentences usually)

AutoDeals Information (mention naturally when relevant):
- Premium car dealership with amazing new & used vehicles
- Phone: +1 (555) 123-4567 | Email: info@autodeals.com
- Location: 123 Auto Street, Car City
- Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM
- Services: Sales, financing, trade-ins, test drives, warranties, and maintenance

RESPONSE GUIDELINES:
For CAR-RELATED questions: Answer helpfully and enthusiastically
For NON-CAR questions: Say something like:
- "Hey, I appreciate the question, but I'm here specifically to help with cars and AutoDeals services! 🚗 Is there anything about vehicles or car shopping I can help you with?"
- "That's an interesting topic, but I'm your car specialist! 😊 Let's keep our chat focused on vehicles and how I can help you find your perfect car. What are you looking for?"
- "I'd love to help, but my expertise is all about cars! 🚗 Ask me anything about our inventory, financing, or what vehicle would be perfect for you!"

Remember: You ONLY discuss cars, vehicles, and AutoDeals. Always redirect non-car topics back to automotive assistance!`
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

      // Use SDK to make the API call with FREE model
      console.log('Calling OpenRouter API with FREE model...');
      const completion = await openai.chat.completions.create({
        model: 'google/gemma-2-9b-it:free', // FREE Google Gemma model - highly reliable!
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      });

      console.log('OpenRouter SDK response received:', completion);
      
      if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
        const generatedText = completion.choices[0].message.content.trim();
        console.log('AI Response:', generatedText);
        
        if (generatedText.length > 10) {
          return generatedText;
        }
      }
      
      throw new Error('Invalid OpenRouter response - no valid content received');
    } catch (error) {
      console.error('OpenRouter SDK Error Details:', {
        message: error.message,
        stack: error.stack,
        error: error,
        type: error.constructor.name
      });
      console.log('Falling back to alternative AI...');
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
      return "Here's how to reach us! 📞\n\n📞 Phone: +1 (555) 123-4567\n📧 Email: info@autodeals.com\n📍 Address: 123 Auto Street, Car City\n⏰ Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM\n\nYou can also fill out our contact form for a quick response!";
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
    
    console.log('User sent message:', userText);
    
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
      console.log('Getting AI response...');
      // Get AI response
      const responseText = await getAIResponse(userText);
      
      console.log('AI response received:', responseText);
      
      // Add small delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const botResponse = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      console.log('Adding bot response to chat');
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
