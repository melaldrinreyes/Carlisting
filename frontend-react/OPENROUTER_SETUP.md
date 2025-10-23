# OpenRouter API Setup Guide

This guide will help you set up the OpenRouter API with SDK for the AutoDeals ChatBot.

## Why OpenRouter with SDK?

OpenRouter provides:
- ✅ **Multiple AI Models**: Access GPT-3.5, GPT-4, Claude, and more
- ✅ **CORS Support**: Works perfectly from frontend applications
- ✅ **SDK Integration**: Clean, type-safe API calls using OpenAI SDK
- ✅ **Pay-per-use**: No subscription required
- ✅ **Reliable**: Better uptime and response rates

## Step 1: Get Your API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Click "Sign In" or "Get Started"
3. Sign up using your Google account or email
4. Navigate to [API Keys](https://openrouter.ai/keys)
5. Click "Create Key"
6. Give it a name (e.g., "AutoDeals ChatBot")
7. Copy your API key (starts with `sk-or-v1-`)

## Step 2: Add API Key to Your Project

1. Open the `.env` file in the `frontend-react` folder
2. Replace the placeholder with your actual API key:

```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

3. Save the file
4. Restart your dev server (Ctrl+C, then `npm run dev`)

## Step 3: Test the ChatBot

1. Open your app at `http://localhost:5173/`
2. Click the car icon button on the right side
3. Type a message and press Enter
4. The AI should respond within a few seconds

## Current Configuration

The ChatBot is configured to use:
- **SDK**: OpenAI SDK with OpenRouter baseURL
- **Model**: `meta-llama/llama-3.1-8b-instruct:free` (**100% FREE - No credits needed!**)
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 300 (concise responses)
- **Context**: Last 6 messages for conversation continuity
- **Client-side**: Uses `dangerouslyAllowBrowser: true` for frontend usage

**Note:** This FREE model doesn't require any payment or credits! It's powered by Meta's LLaMA 3.1 and works great for most chatbot needs.

## Fallback System

If OpenRouter API fails, the ChatBot automatically falls back to:
1. **Hugging Face BlenderBot** (backup AI)
2. **Rule-based responses** (final fallback)

## Console Logs

Open browser DevTools (F12 → Console) to see:
- `Using OpenRouter SDK...` - SDK initialized
- `API Key loaded: Yes (length: X)` - Key detected
- `OpenRouter SDK response received` - Response parsed successfully

## Troubleshooting

### Issue: "OpenRouter API key not configured"
**Solution**: Make sure your `.env` file has the correct key and restart the dev server.

### Issue: "401 Unauthorized"
**Solution**: Your API key may be invalid. Generate a new one at [openrouter.ai/keys](https://openrouter.ai/keys).

### Issue: "Insufficient credits"
**Solution**: You're using a FREE model, so this shouldn't happen! If it does, try switching to another free model like `google/gemma-2-9b-it:free`.

### Issue: ChatBot uses fallback responses
**Solution**: Check browser console for errors. Ensure you have credits in your OpenRouter account.

## Security Notes

- ✅ The `.env` file is in `.gitignore` and won't be committed
- ✅ API keys are only loaded on the client side (acceptable for OpenRouter)
- ✅ Never share your API key publicly
- ✅ Use environment variables for production deployment

## Cost Optimization

The current model is **100% FREE!**
- **LLaMA 3.1 8B**: Completely free, no charges
- No credits needed in your OpenRouter account
- Unlimited usage (subject to fair use policies)
- Great quality responses for chatbot applications

To monitor usage:
1. Visit [OpenRouter Dashboard](https://openrouter.ai/activity)
2. See your free model usage statistics

## Alternative Models

You can switch to other models by changing the `model` parameter in `ChatBot.jsx`:

```javascript
model: 'meta-llama/llama-3.1-8b-instruct:free',  // Current (100% FREE!)
// model: 'google/gemma-2-9b-it:free',            // Also FREE
// model: 'mistralai/mistral-7b-instruct:free',   // Also FREE
// model: 'openai/gpt-3.5-turbo',                 // Paid but faster (requires credits)
// model: 'openai/gpt-4',                         // Paid, most intelligent (requires credits)
```

## Production Deployment

For Vercel deployment:
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `VITE_OPENROUTER_API_KEY` = `your-key-here`
4. Redeploy your application

---

**Need Help?** 
- OpenRouter Docs: https://openrouter.ai/docs
- Support: https://discord.gg/openrouter
