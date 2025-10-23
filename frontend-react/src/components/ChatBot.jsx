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

      // Use SDK to make the API call with FREE unlimited model
      console.log('Calling OpenRouter API with Qwen 2.5 7B (FREE & unlimited)...');
      const completion = await openai.chat.completions.create({
        model: 'qwen/qwen-2.5-7b-instruct:free', // FREE unlimited model - very stable
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 500
      });

      console.log('✅ OpenRouter API SUCCESS! Response:', completion);
      console.log('Model used:', completion.model);
      console.log('Finish reason:', completion.choices[0]?.finish_reason);
      
      if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
        const generatedText = completion.choices[0].message.content.trim();
        console.log('AI Response:', generatedText);
        
        if (generatedText.length > 10) {
          return generatedText;
        }
      }
      
      throw new Error('Invalid OpenRouter response');
    } catch (error) {
      console.error('❌ OpenRouter API FAILED!');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      // Check for specific error types
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        console.error('🔑 API KEY ISSUE: Check if your OpenRouter API key is valid');
      } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        console.error('⏱️ RATE LIMIT: Free model is being used too much, trying fallback...');
      } else if (error.message?.includes('model')) {
        console.error('🤖 MODEL ISSUE: LLaMA model might not be available right now');
      }
      
      console.log('Falling back to alternative AI...');
      return await getAlternativeAIResponse(userMessage);
    }
  };

  const getAlternativeAIResponse = async (userMessage) => {
    try {
      console.log('🔄 Trying alternative AI: Hugging Face Blenderbot...');
      // Alternative: Use Hugging Face BlenderBot - a conversational AI
      const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: userMessage,
          parameters: {
            max_length: 200,
            min_length: 20
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Blenderbot response:', data);
        
        // Handle array response
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
          const aiText = data[0].generated_text.trim();
          console.log('✅ Blenderbot AI Response:', aiText);
          return aiText;
        }
        // Handle object response
        if (data && data.generated_text) {
          const aiText = data.generated_text.trim();
          console.log('✅ Blenderbot AI Response:', aiText);
          return aiText;
        }
      }
      
      console.log('⚠️ Blenderbot failed, trying another free AI...');
      return await getThirdAIResponse(userMessage);
    } catch (error) {
      console.error('❌ Alternative AI Error:', error);
      return await getThirdAIResponse(userMessage);
    }
  };

  const getThirdAIResponse = async (userMessage) => {
    try {
      console.log('🔄 Trying third AI option: GPT-2...');
      // Try GPT-2 as third option (completely free, no API key needed)
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Customer: ${userMessage}\nAutoDeals AI Assistant:`,
          parameters: {
            max_length: 150,
            temperature: 0.8,
            return_full_text: false
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
          const aiText = data[0].generated_text.trim();
          console.log('✅ GPT-2 AI Response:', aiText);
          return aiText;
        }
      }
      
      // Last resort: intelligent dynamic response
      console.log('⚠️ All AI APIs unavailable, generating intelligent response...');
      return getIntelligentResponse(userMessage);
    } catch (error) {
      console.error('❌ Third AI Error:', error);
      return getIntelligentResponse(userMessage);
    }
  };

  const getIntelligentResponse = (userMessage) => {
    console.log('🤖 Using intelligent response generator for:', userMessage);
    const message = userMessage.toLowerCase();
    
    // AI-style conversational responses (more dynamic than static)
    const responses = {
      greeting: [
        "Hello! 👋 I'm your AI assistant at AutoDeals. I'm here to help you discover the perfect vehicle. What brings you here today?",
        "Hi there! Welcome to AutoDeals! I'm an AI trained to help with all your car needs. How can I assist you?",
        "Hey! Great to see you! I'm AutoDeals' AI assistant. Tell me, what kind of vehicle are you dreaming about?"
      ],
      general: [
        `I'd love to help you with "${userMessage}"! At AutoDeals, we offer comprehensive automotive solutions. Could you tell me more specifically what you're looking for - pricing, financing, or vehicle options?`,
        `That's an interesting question about "${userMessage}"! Let me help you with that. Are you interested in browsing our inventory, learning about financing, or scheduling a test drive?`,
        `Great question! Regarding "${userMessage}", I can provide detailed information. Would you like to know about our car listings, payment options, or dealership services?`
      ]
    };
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon)/i)) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    // Return contextual general response
    return responses.general[Math.floor(Math.random() * responses.general.length)];
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
