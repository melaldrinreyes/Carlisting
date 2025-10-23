# AutoDeals AI ChatBot Setup

The chatbot can work in two modes:

## 1. Enhanced Fallback Mode (Default)
Works out of the box with intelligent rule-based responses. No API key needed!

## 2. AI-Powered Mode (Optional)
Get dynamic, context-aware responses using OpenAI or compatible APIs.

### Setup Steps:

1. **Get an API Key**
   - OpenAI: https://platform.openai.com/api-keys
   - Or use any OpenAI-compatible API (LocalAI, LM Studio, etc.)

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Add your credentials**
   ```env
   VITE_AI_API_KEY=your_actual_api_key_here
   VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
   VITE_AI_MODEL=gpt-3.5-turbo
   ```

4. **Restart dev server**
   ```bash
   npm run dev
   ```

### Supported AI Providers:

- **OpenAI** (GPT-3.5, GPT-4)
  - URL: `https://api.openai.com/v1/chat/completions`
  - Models: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`

- **LocalAI** (Self-hosted)
  - URL: `http://localhost:8080/v1/chat/completions`
  - Models: Any compatible model

- **LM Studio** (Local)
  - URL: `http://localhost:1234/v1/chat/completions`
  - Models: Downloaded models

- **Azure OpenAI**
  - URL: `https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT/chat/completions?api-version=2023-05-15`
  - Add header: `api-key` instead of `Authorization`

### Features:

✅ Context-aware conversations
✅ Remembers chat history (last 10 messages)
✅ AutoDeals-specific knowledge
✅ Fallback to smart responses if AI unavailable
✅ Typing indicators
✅ Timestamp tracking
✅ Mobile responsive

### Cost Considerations:

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (very affordable)
- **GPT-4**: More expensive but higher quality
- **Local models**: Free but requires setup

### Security Note:

⚠️ Never commit your `.env` file to git!
The `.gitignore` already excludes it.

### Troubleshooting:

**ChatBot not using AI?**
- Check if `.env` file exists
- Verify API key is correct
- Ensure dev server was restarted after adding .env
- Check browser console for errors

**API errors?**
- The bot automatically falls back to smart responses
- Check your API key validity
- Verify you have API credits/quota

**Local AI not working?**
- Make sure your local AI server is running
- Check the port matches your configuration
- Test the API endpoint with curl/Postman first
