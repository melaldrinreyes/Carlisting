# DeepSeek AI Integration Setup

## Overview
Your chatbot now uses DeepSeek API for intelligent, conversational AI responses.

## Setup Instructions

### 1. Get Your DeepSeek API Key
1. Visit https://platform.deepseek.com/
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Add API Key to Project
1. Open the `.env` file in the `frontend-react` folder
2. Replace `your-deepseek-api-key-here` with your actual API key:
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-actual-key-here
   ```
3. Save the file

### 3. Restart Development Server
If the dev server is running, restart it to load the new environment variable:
```bash
npm run dev
```

## Features

### DeepSeek Chat Model
- **Model**: `deepseek-chat`
- **Capabilities**: 
  - General knowledge questions
  - Car and automotive expertise
  - AutoDeals business information
  - Natural conversation
  - Context-aware responses

### Configuration
- **Temperature**: 0.7 (balanced creativity and accuracy)
- **Max Tokens**: 300 (concise responses)
- **Top P**: 0.95 (diverse vocabulary)
- **Conversation History**: Last 6 messages for context

### Fallback System
If DeepSeek API fails or is not configured:
1. Falls back to Hugging Face BlenderBot (free)
2. Finally uses enhanced rule-based responses

## Testing

Test the chatbot with various questions:
- General: "What is artificial intelligence?"
- Cars: "What's the difference between hybrid and electric cars?"
- Business: "What are your hours?"
- Fun: "Tell me a joke"

## Pricing
Check current DeepSeek pricing at: https://platform.deepseek.com/pricing

## Security
- ✅ API key is stored in `.env` file (not committed to git)
- ✅ `.env` is in `.gitignore`
- ⚠️ Never share your API key publicly
- ⚠️ Don't commit `.env` file to version control

## Support
For DeepSeek API issues: https://platform.deepseek.com/docs
