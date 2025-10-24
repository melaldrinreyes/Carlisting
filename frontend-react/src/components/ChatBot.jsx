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


  // SDK-based: Use OpenAI SDK with OpenRouter
  const getAIResponse = async (userMessage) => {
    try {
      const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
      if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
        console.log('OpenRouter API key not configured, using fallback');
        return await getFallbackResponse(userMessage);
      }

      // Initialize OpenAI SDK with OpenRouter configuration
      const openai = new OpenAI({
        apiKey: OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AutoDeals ChatBot'
        },
        dangerouslyAllowBrowser: true
      });

      // Build conversation context for better continuity
      const conversationMessages = conversationHistory.slice(-6).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      conversationMessages.push({ role: 'user', content: userMessage });

      // Use SDK to make the API call with FREE unlimited model
      const completion = await openai.chat.completions.create({
        model: 'google/gemma-2-9b-it:free', // FREE unlimited model - very stable
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 300
      });

      if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
        const generatedText = completion.choices[0].message.content.trim();
        if (generatedText.length > 0) {
          return generatedText;
        }
      }
      throw new Error('Invalid OpenRouter response');
    } catch (error) {
      console.error('OpenRouter API FAILED!', error);
      return await getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Enhanced rule-based responses with many car-related alternatives
    const responses = [];
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      responses.push(
        "Hello! 👋 Welcome to AutoDeals. I'm here to help you find your perfect car. What are you looking for today?",
        "Hi there! 🚗 Ready to explore our latest car deals? Let me know what features or models interest you!",
        "Hey! I'm your car assistant. Ask me about SUVs, sedans, electric cars, or anything automotive!"
      );
    }
    if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
      responses.push(
        "Our inventory ranges from affordable daily drivers to luxury vehicles. 💰\n\nTypical price ranges:\n• Economy cars: $15,000 - $25,000\n• Mid-size sedans: $25,000 - $40,000\n• SUVs: $30,000 - $60,000\n• Luxury vehicles: $50,000+\n\nWhat's your budget range? I can help you find the best options!",
        "Looking for a car within a specific budget? Let me know your price range and I'll suggest the best matches!",
        "We offer vehicles for every budget. Are you interested in new, used, or certified pre-owned cars?"
      );
    }
    if (message.includes('suv') || message.includes('sedan') || message.includes('truck') || message.includes('sports')) {
      responses.push(
        "Great choice! 🚗 We have excellent options in that category. Check out our Car Listings page to see all available vehicles with detailed specs and photos. Would you like to know about specific features or compare models?",
        "SUVs are perfect for families and adventure! Want to know about our top-rated SUVs or compare them to sedans?",
        "Trucks, sedans, sports cars—we have them all! Ask me for towing capacity, horsepower, or safety ratings."
      );
    }
    if (message.includes('electric') || message.includes('ev') || message.includes('hybrid')) {
      responses.push(
        "We have eco-friendly options! 🌱⚡\n\nOur green vehicle lineup includes:\n• Full electric vehicles (EVs)\n• Plug-in hybrids\n• Traditional hybrids\n\nThey offer great fuel savings and environmental benefits. Would you like to know more about charging, range, or incentives?",
        "Interested in electric or hybrid cars? I can tell you about range, charging stations, and government rebates!",
        "EVs and hybrids are great for the environment and your wallet. Want to compare models or learn about maintenance?"
      );
    }
    if (message.includes('financing') || message.includes('loan') || message.includes('payment')) {
      responses.push(
        "We offer flexible financing options! 💳\n\n• Competitive interest rates\n• Multiple loan terms (36-72 months)\n• Trade-in evaluations\n• Special offers for qualified buyers\n\nOur finance team can work with your credit situation. Would you like to discuss monthly payment estimates?",
        "Need help with car financing? I can explain down payments, monthly installments, and special offers.",
        "We partner with top lenders to get you the best rates. Want to pre-qualify or estimate your monthly payment?"
      );
    }
    if (message.includes('test drive') || message.includes('visit') || message.includes('showroom')) {
      responses.push(
        "We'd love to see you at our showroom! 🏢\n\nSchedule a test drive:\n📍 123 Auto Street, Car City\n📞 Call: +1 (555) 123-4567\n⏰ Mon-Fri: 9AM-6PM, Sat: 10AM-4PM\n\nYou can also visit our Order page to request a specific vehicle test drive!",
        "Test drives are the best way to experience a car! Would you like to book one for a specific model?",
        "Our showroom is open and ready for your visit. Want directions or to reserve a time for a test drive?"
      );
    }
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('reach')) {
      responses.push(
        "Here's how to reach us! 📞\n\n• Phone: +1 (555) 123-4567\n• Email: info@autodeals.com\n• Address: 123 Auto Street, Car City\n⏰ Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM\n\nYou can also fill out our contact form for a quick response!",
        "You can call, email, or visit us anytime. Would you like our WhatsApp or Messenger contact as well?",
        "Our team is always available to help. Prefer a callback or email follow-up? Just let me know!"
      );
    }
    if (message.includes('warranty') || message.includes('guarantee')) {
      responses.push(
        "All our vehicles come with protection! 🛡️\n\n• Comprehensive warranty coverage\n• Extended warranty options\n• Certified pre-owned guarantees\n• 30-day exchange policy\n\nWe stand behind every vehicle we sell. Need details on a specific car?",
        "Worried about warranty? I can explain coverage, duration, and what’s included for each model.",
        "Ask me about our certified pre-owned guarantees and extended service plans for peace of mind."
      );
    }
    if (message.includes('trade') || message.includes('trade-in')) {
      responses.push(
        "We accept trade-ins! 🔄\n\nGet the best value for your current vehicle:\n• Free appraisal\n• Competitive offers\n• Quick process\n• Apply trade value to your purchase\n\nBring your car by or describe it to us, and we'll give you an estimate!",
        "Thinking of trading in your car? I can estimate its value and explain the trade-in process.",
        "Trade-ins are easy with us! Want to know what documents you need or how we calculate your offer?"
      );
    }
    if (message.includes('thank') || message.includes('thanks')) {
      responses.push(
        "You're very welcome! 😊 I'm here anytime you need help. Happy car shopping, and feel free to ask me anything else! 🚗✨",
        "Glad I could help! If you have more questions about cars, features, or deals, just ask.",
        "Thank you for chatting! Let me know if you want to see more cars or need advice."
      );
    }
    if (message.includes('help') || message.includes('assist') || message.includes('can you')) {
      responses.push(
        "I'm here to help with everything! 🤝\n\n✅ Browse our inventory\n✅ Compare cars and features\n✅ Pricing and financing info\n✅ Test drive scheduling\n✅ Trade-in valuations\n✅ Warranty details\n✅ Contact information\n\nWhat specific question can I answer for you?",
        "Need assistance? I can help you compare models, explain features, or guide you through the buying process.",
        "Ask me anything about cars, from maintenance tips to the latest tech and safety features!"
      );
    }
    // Tons of extra car-related responses for variety
    if (message.includes('maintenance') || message.includes('service') || message.includes('oil') || message.includes('tire')) {
      responses.push(
        "Regular maintenance keeps your car running smoothly! Need a schedule or tips for oil changes and tire care?",
        "We offer full service and maintenance packages. Want to book a service or learn about our specials?",
        "Ask me about recommended service intervals, warranty coverage, or how to keep your car in top shape.",
        "Did you know regular tire rotations can extend the life of your tires? I can share a maintenance checklist!",
        "Our certified technicians can handle everything from oil changes to brake inspections. Want to book a slot?",
        "Keeping up with maintenance boosts your car’s resale value. Need a reminder schedule?"
      );
    }
    if (message.includes('features') || message.includes('tech') || message.includes('technology') || message.includes('infotainment')) {
      responses.push(
        "Modern cars come packed with tech! Want to know about Apple CarPlay, Android Auto, or advanced safety features?",
        "Looking for a car with the latest infotainment or driver-assist tech? I can recommend models!",
        "Ask me about adaptive cruise control, lane-keeping assist, or wireless charging features.",
        "Heads-up displays, surround cameras, and smart navigation are popular features—want details?",
        "Interested in remote start, heated seats, or panoramic sunroofs? I can list models that offer them!",
        "Some cars now offer voice assistants and over-the-air updates. Want to know which ones?"
      );
    }
    if (message.includes('compare') || message.includes('vs') || message.includes('difference')) {
      responses.push(
        "Comparing cars? Tell me the models and I’ll highlight the differences in specs, price, and features.",
        "I can help you compare fuel economy, safety ratings, and resale value between any two vehicles.",
        "Let me know which cars you want to compare—I'll give you a detailed breakdown!",
        "Want a side-by-side comparison of trims, engines, or tech packages? Just name the models!",
        "I can show you pros and cons for each car to help you decide. Which models are you considering?"
      );
    }
    if (message.includes('color') || message.includes('interior') || message.includes('leather') || message.includes('trim')) {
      responses.push(
        "We offer a variety of colors and interior trims. Want to see photos or check availability?",
        "Leather seats, sunroofs, premium audio—let me know your must-have features!",
        "Ask about customizations, color options, or special edition packages for your favorite model.",
        "Some models offer two-tone interiors and ambient lighting. Want to see examples?",
        "Looking for a sporty red or a classic black? I can check our inventory for your preferred color!"
      );
    }
    if (message.includes('mileage') || message.includes('mpg') || message.includes('fuel')) {
      responses.push(
        "Fuel efficiency is important! I can provide MPG ratings and tips for saving on gas.",
        "Want to know the mileage on a specific car or compare hybrid vs. gas models? Just ask!",
        "Ask me about fuel types, tank capacity, or how to maximize your car’s range.",
        "I can explain the difference between city and highway mileage. Which car are you interested in?",
        "Some hybrids get over 50 MPG! Want to see our most fuel-efficient options?"
      );
    }
    if (message.includes('insurance') || message.includes('coverage') || message.includes('policy')) {
      responses.push(
        "Need help with car insurance? I can explain coverage types and help you get a quote.",
        "Ask about insurance requirements for new or used cars, or how to lower your premium.",
        "Want to bundle insurance with your purchase? I can connect you with our partners.",
        "Comprehensive, liability, collision—need help choosing the right policy?",
        "I can share tips for getting the best insurance rates for your vehicle."
      );
    }
    if (message.includes('delivery') || message.includes('ship') || message.includes('pickup')) {
      responses.push(
        "We offer delivery and pickup options for your convenience. Want to schedule a home delivery?",
        "Ask about shipping fees, delivery times, or how to track your vehicle’s arrival.",
        "Curbside pickup and contactless delivery are available! Let me know your preference.",
        "We can deliver your new car right to your driveway. Want to know how it works?",
        "Prefer to pick up at the dealership? I can reserve a time for you!"
      );
    }
    if (message.includes('review') || message.includes('rating') || message.includes('testimonials')) {
      responses.push(
        "Our customers love us! Want to read reviews or see our latest ratings?",
        "Check out testimonials from happy buyers on our website or social media.",
        "I can share recent customer experiences or connect you with a sales specialist for more info.",
        "We’re proud of our 5-star ratings! Want to see what people are saying about us?",
        "Would you like to leave a review or hear about our most popular models?"
      );
    }
    // Even more generic car-related responses for unmatched queries
    if (responses.length === 0) {
      const extraFallbacks = [
        // ...existing 100+ responses...
        // --- BEGIN ADDITIONAL RESPONSES ---
        "Looking for a car with a built-in dash cam? I can show you which models offer this feature.",
        "Want to know about the best cars for rideshare drivers? I have recommendations.",
        "Ask me about the benefits of regular wheel alignment.",
        "Need help with your car's emergency kit? I can suggest what to include.",
        "Looking for a car with a hybrid powertrain? I can explain the advantages.",
        "Want to know about the best cars for snow and ice? I have suggestions.",
        "Ask about our eco-friendly vehicle options.",
        "Looking for a car with a built-in vacuum cleaner? I can check availability.",
        "Want to know about the best cars for dog owners? I have tips and model suggestions.",
        "Ask me about the benefits of regular windshield wiper replacement.",
        "Need help with your car's child safety seat installation? I can guide you.",
        "Looking for a car with a hands-free trunk release? I can help you find one.",
        "Want to know about the best cars for outdoor sports equipment? I have ideas.",
        "Ask about our car subscription services.",
        "Looking for a car with a built-in air purifier? I can show you options.",
        "Want to know about the best cars for fuel savings? I can provide a list.",
        "Ask me about the benefits of regular engine diagnostics.",
        "Need help with your car's remote app setup? I can assist.",
        "Looking for a car with a built-in cooler or fridge? I can check our inventory.",
        "Want to know about the best cars for tall drivers? I have recommendations.",
        "Ask about our car care workshops and events.",
        "Looking for a car with a massage seat feature? I can help you find one.",
        "Want to know about the best cars for short commutes? I have suggestions.",
        "Ask me about the benefits of regular exhaust system checks.",
        "Need help with your car's parking assist system? I can explain how it works.",
        "Looking for a car with a customizable ambient lighting system? I can show you models.",
        "Want to know about the best cars for student athletes? I have ideas.",
        "Ask about our car detailing specials.",
        "Looking for a car with a built-in sunshade? I can check availability.",
        "Want to know about the best cars for long-term reliability? I have data.",
        "Ask me about the benefits of regular cabin air filter changes.",
        "Need help with your car's tire rotation schedule? I can provide reminders.",
        "Looking for a car with a built-in navigation traffic service? I can help you choose.",
        "Want to know about the best cars for outdoor photography? I have suggestions.",
        "Ask about our extended test drive program.",
        "Looking for a car with a built-in garage door opener? I can show you options.",
        "Want to know about the best cars for city deliveries? I have recommendations.",
        "Ask me about the benefits of regular paint protection.",
        "Need help with your car's seat memory settings? I can assist.",
        "Looking for a car with a built-in rear sunshade? I can check our inventory.",
        "Want to know about the best cars for camping and overlanding? I have ideas.",
        "Ask about our car care product bundles.",
        "Looking for a car with a built-in wireless hotspot? I can help you find one.",
        "Want to know about the best cars for music festivals? I have suggestions.",
        "Ask me about the benefits of regular undercarriage cleaning.",
        "Need help with your car's adaptive headlights? I can explain the technology.",
        "Looking for a car with a built-in heads-up navigation display? I can show you models.",
        "Want to know about the best cars for weekend sports leagues? I have recommendations.",
        "Ask about our car wash membership plans.",
        "Looking for a car with a built-in emergency SOS system? I can check availability.",
        "Want to know about the best cars for scenic drives? I have route suggestions too.",
        "Ask me about the benefits of regular fuel system cleaning.",
        "Need help with your car's remote window controls? I can assist.",
        "Looking for a car with a built-in tire inflator? I can help you find one.",
        "Want to know about the best cars for tech startups? I have ideas.",
        "Ask about our car care loyalty program.",
        "Looking for a car with a built-in pet barrier? I can show you options.",
        "Want to know about the best cars for cross-country travel? I have recommendations.",
        "Ask me about the benefits of regular spark plug checks.",
        "Need help with your car's rain-sensing wipers? I can explain how they work.",
        "Looking for a car with a built-in dash display for towing? I can check our inventory.",
        "Want to know about the best cars for remote work? I have suggestions.",
        "Ask about our car care video tutorials.",
        "Looking for a car with a built-in 360-degree camera? I can help you choose.",
        "Want to know about the best cars for new parents? I have tips.",
        "Ask me about the benefits of regular timing belt checks.",
        "Need help with your car's heated windshield? I can assist.",
        "Looking for a car with a built-in trailer brake controller? I can show you models.",
        "Want to know about the best cars for outdoor concerts? I have ideas.",
        "Ask about our car care mobile app.",
        "Looking for a car with a built-in child monitoring camera? I can check availability.",
        "Want to know about the best cars for food delivery? I have recommendations.",
        "Ask me about the benefits of regular power steering checks.",
        "Need help with your car's lane departure warning system? I can explain.",
        "Looking for a car with a built-in air suspension system? I can help you find one.",
        "Want to know about the best cars for outdoor yoga? I have suggestions.",
        "Ask about our car care newsletter.",
        "Looking for a car with a built-in night vision system? I can show you options.",
        "Want to know about the best cars for remote learning? I have ideas.",
        "Ask me about the benefits of regular wheel balancing.",
        "Need help with your car's automatic high beams? I can assist.",
        "Looking for a car with a built-in solar roof? I can check our inventory.",
        "Want to know about the best cars for hiking trips? I have recommendations.",
        "Ask about our car care referral rewards.",
        "Looking for a car with a built-in anti-theft system? I can help you choose.",
        "Want to know about the best cars for art shows? I have suggestions.",
        "Ask me about the benefits of regular brake fluid changes.",
        "Need help with your car's gesture controls? I can explain how they work.",
        "Looking for a car with a built-in rear cross-traffic alert? I can show you models.",
        "Want to know about the best cars for gardening enthusiasts? I have ideas.",
        "Ask about our car care gift cards.",
        "Looking for a car with a built-in heated rear seats? I can check availability.",
        "Want to know about the best cars for photography road trips? I have suggestions.",
        "Ask me about the benefits of regular engine air filter changes.",
        "Need help with your car's auto-dimming mirrors? I can assist.",
        "Looking for a car with a built-in hands-free tailgate? I can help you find one.",
        "Want to know about the best cars for outdoor picnics? I have ideas.",
        "Ask about our car care appointment scheduler.",
        "Looking for a car with a built-in heated washer nozzles? I can check our inventory.",
        "Want to know about the best cars for music production? I have recommendations.",
        "Ask me about the benefits of regular coolant flushes.",
        "Need help with your car's automatic parking system? I can explain how it works.",
        "Looking for a car with a built-in Wi-Fi extender? I can show you options.",
        "Want to know about the best cars for family reunions? I have suggestions.",
        "Ask about our car care customer support hotline.",
        "Looking for a car with a built-in hands-free sliding doors? I can help you find one.",
        "Want to know about the best cars for tailgating parties? I have ideas.",
        "Ask me about the benefits of regular fuel filter changes.",
        "Need help with your car's automatic emergency braking? I can explain.",
        "Looking for a car with a built-in digital key? I can check availability.",
        "Want to know about the best cars for science fairs? I have suggestions.",
        "Ask about our car care online chat support.",
        "Looking for a car with a built-in rear seat reminder? I can show you models.",
        "Want to know about the best cars for outdoor movie nights? I have ideas.",
        "Ask me about the benefits of regular transmission fluid changes.",
        "Need help with your car's voice recognition system? I can assist.",
        "Looking for a car with a built-in digital instrument cluster? I can help you choose.",
        "Want to know about the best cars for science teachers? I have recommendations.",
        "Ask about our car care video call consultations.",
        "Looking for a car with a built-in heated armrests? I can check our inventory.",
        "Want to know about the best cars for outdoor painting? I have suggestions.",
        "Ask me about the benefits of regular oxygen sensor checks.",
        "Need help with your car's remote diagnostics? I can explain how it works.",
        "Looking for a car with a built-in power folding mirrors? I can show you options.",
        "Want to know about the best cars for outdoor reading? I have ideas.",
        "Ask about our car care online booking system.",
        "Looking for a car with a built-in heated cup holders? I can check availability.",
        "Want to know about the best cars for outdoor stargazing? I have suggestions.",
        "Ask me about the benefits of regular EGR valve checks.",
        "Need help with your car's automatic seat adjustment? I can assist.",
        "Looking for a car with a built-in rear window sunshade? I can help you find one.",
        "Want to know about the best cars for outdoor sketching? I have ideas.",
        "Ask about our car care express service lanes.",
        "Looking for a car with a built-in heated steering wheel rim? I can check our inventory.",
        "Want to know about the best cars for outdoor meditation? I have suggestions.",
        "Ask me about the benefits of regular PCV valve checks.",
        "Need help with your car's remote start scheduling? I can explain how it works."
      ];
      return extraFallbacks[Math.floor(Math.random() * extraFallbacks.length)];
    }
    // Pick a random response for variety
    return responses[Math.floor(Math.random() * responses.length)];
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
