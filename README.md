<div align="center">

# 🧠 ClearMind
### Your AI-Powered Mental Health Companion

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Gemini 2.0](https://img.shields.io/badge/Gemini-2.0%20Flash-blue.svg)](https://ai.google.dev/gemini-api)
[![Auth0](https://img.shields.io/badge/Auth0-Secured-orange.svg)](https://auth0.com)
[![Snowflake](https://img.shields.io/badge/Snowflake-Ready-29B5E8.svg)](https://snowflake.com)

[🚀 Live Demo](#-quick-start) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing) • [🏆 Features](#-key-features)

![ClearMind Banner](https://img.shields.io/badge/Mental%20Health-Accessible%20%7C%20Private%20%7C%20Free-purple?style=for-the-badge)

</div>

---

## 🌟 Overview

**ClearMind** is an AI-powered mental health companion that makes professional emotional support accessible to everyone. Using Google's cutting-edge Gemini 2.0 AI, ClearMind provides empathetic, context-aware conversations with complete privacy and zero cost.

### 💡 Why ClearMind?

- **🆓 100% Free** - No subscriptions, no hidden costs
- **🔒 Privacy First** - Your data stays on your device
- **🤖 AI-Powered** - Powered by Google Gemini 2.0 Flash
- **📊 Analytics Ready** - Mood tracking with Snowflake integration
- **🌐 Open Source** - MIT licensed for community impact
- **♿ Accessible** - Works on any device, anywhere

---

## 🏆 Hackathon Prize Alignment

### ✅ Best Use of Gemini API
- Latest **Gemini 2.0 Flash Experimental** model
- Context-aware conversations (4-message history)
- Structured JSON responses with mood detection
- AI-generated wellness insights every 5 conversations
- Advanced prompt engineering for empathetic responses

### ✅ Best Use of Snowflake API
- Mood history tracking with timestamps
- Anonymized data export to Snowflake Data Cloud
- Real-time analytics dashboard
- Time-series mood pattern visualization
- Production-ready data schema

### ✅ Best Use of DigitalOcean Gradient AI
- Fully Dockerized application
- Static build for edge deployment
- CDN-ready React build
- Scalable client-side architecture
- Cost-effective deployment ($0 infrastructure)

### ✅ Best Use of Auth0
- Secure OAuth 2.0 authentication with PKCE flow
- Privacy-focused (supports anonymous usage)
- No PII collection
- Integrated with landing page auto-login
- Token-based API security

### ✅ Best Documentation
- Comprehensive setup guides
- Deployment documentation
- Inline code comments
- API reference
- Troubleshooting guides

### ✅ Code for Good
- **Mental health accessibility** for everyone
- **Free and open-source** (MIT License)
- **Privacy-first architecture**
- **Mobile-responsive design**
- **Offline-capable** after first load
- **ARIA labels** for screen readers

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```powershell
# Clone the repository
git clone https://github.com/Tejaji-0/OSH.git
cd OSH

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Copy environment template
copy .env.example .env
```

### Environment Configuration

**Backend `.env`:**
```env
PORT=3000
MOCK=true                                    # Set to false for production
GEMINI_API_KEY=your_gemini_api_key_here
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USER=your_username
SNOWFLAKE_PAT=your_personal_access_token
```

**Frontend `client/.env`:**
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:3000
VITE_ENABLE_AUTH=true
VITE_ENABLE_SNOWFLAKE_EXPORT=true
VITE_AUTH0_DOMAIN=your_domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
```

### Run Development Mode

**Terminal 1 (Backend):**
```powershell
npm start
```

**Terminal 2 (Frontend):**
```powershell
cd client
npm run dev
```

Open **http://localhost:5173** in your browser! 🎉

### Build for Production

```powershell
cd client
npm run build
cd ..
npm start
```

Open **http://localhost:3000** for the production build.

---

## 🎨 Key Features

### 🤖 Intelligent AI Conversations
- **Context-aware responses** using Gemini 2.0
- **Mood detection** from conversation content
- **Personalized wellness tips** embedded in replies
- **Multi-turn awareness** for natural dialogue

### 📊 Mental Health Analytics
- **Real-time mood tracking** with visual timeline
- **Conversation counter** with floating badge
- **AI-generated insights** every 5 conversations
- **Mood pattern recognition** over time
- **Export to Snowflake** for advanced analytics

### 🎭 Beautiful User Experience
- **Modern glassmorphism UI** with animations
- **Landing page** with auto-login flow
- **Responsive design** for all devices
- **Smooth transitions** and micro-interactions
- **Loading states** with thinking indicators
- **Collapsible stats panel** for data visualization

### 🔒 Privacy & Security
- **Client-side processing** - no backend data storage
- **Local storage only** - your data stays with you
- **Auth0 integration** - secure, optional authentication
- **No PII collection** - completely anonymous
- **HTTPS ready** for production deployment

### 🛠️ Developer Experience
- **Well-documented code** with inline comments
- **Environment-based configuration**
- **Error handling** with user-friendly messages
- **Rate limit detection** and graceful fallbacks
- **Comprehensive testing** setup

---

## 📖 Documentation

### 📚 Available Guides

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[AUTH0_SETUP_GUIDE.md](AUTH0_SETUP_GUIDE.md)** - Auth0 configuration
- **[SNOWFLAKE_SETUP.md](SNOWFLAKE_SETUP.md)** - Snowflake integration
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - User manual
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines

### 🔧 API Reference

#### Chat with AI
```javascript
POST /api/coach
Content-Type: application/json

{
  "text": "I'm feeling stressed about work"
}

Response:
{
  "mood": "anxious",
  "reply": "I hear you're feeling stressed about work..."
}
```

#### Export to Snowflake
```javascript
POST /api/export/snowflake
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user-id",
  "moodHistory": [...],
  "timestamp": "2025-10-19T12:00:00Z"
}
```

#### Health Check
```javascript
GET /api/ping

Response:
{
  "ok": true,
  "time": "2025-10-19T12:00:00Z"
}
```

---

## 🏗️ Architecture

```
ClearMind/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── Chat.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SnowflakeExport.jsx
│   │   │   └── ...
│   │   ├── auth/            # Auth0 integration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── .env                 # Frontend config
│
├── src/                     # Express backend
│   ├── server.js            # Main server
│   ├── clients.js           # Gemini & Snowflake clients
│   ├── services/            # Business logic
│   │   └── snowflakeExport.js
│   └── config.js            # Configuration
│
├── .env                     # Backend config
├── Dockerfile               # Docker configuration
└── package.json             # Dependencies
```

### Tech Stack

**Frontend:**
- ⚛️ React 18 with Vite
- 🎨 CSS3 with Glassmorphism effects
- 🔐 Auth0 React SDK
- 📊 LocalStorage for data persistence

**Backend:**
- 🚀 Node.js + Express
- 🤖 Google Gemini 2.0 API
- ❄️ Snowflake Node.js SDK
- 🔒 Helmet + CORS for security

**DevOps:**
- 🐳 Docker
- 📦 npm for package management
- 🧪 Jest for testing
- 🎯 GitHub Actions for CI/CD

---

## 🐳 Docker Deployment

```powershell
# Build the image
docker build -t clearmind .

# Run the container
docker run -p 3000:3000 --env-file .env clearmind

# Access at http://localhost:3000
```

### DigitalOcean Deployment

1. Push image to container registry
2. Create App Platform service
3. Set environment variables
4. Map port 3000
5. Deploy! 🚀

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🧪 Testing

```powershell
# Run tests
npm test

# Run linting
npm run lint

# Run with coverage
npm test -- --coverage
```

---

## 🤝 Contributing

We welcome contributions! ClearMind is built for the community, by the community.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## 📊 Project Stats

- **Lines of Code:** ~5,000+
- **Components:** 15+ React components
- **API Endpoints:** 5 production routes
- **Documentation Files:** 10+ guides
- **Test Coverage:** Comprehensive unit tests
- **Response Time:** < 2 seconds (Gemini 2.0)

---

## 🌍 Social Impact

### Making Mental Health Accessible

- **24/7 Availability** - Support whenever you need it
- **Zero Cost** - Remove financial barriers
- **No Stigma** - Private, judgment-free conversations
- **Global Reach** - Available anywhere with internet
- **Open Source** - Community-driven improvements

### Privacy First

- ✅ No data collection without consent
- ✅ Local storage only
- ✅ No conversation logging
- ✅ Anonymous usage supported
- ✅ Clear privacy notices

### Not a Replacement for Therapy

ClearMind is designed to **complement**, not replace, professional mental health care. If you're experiencing a crisis:
- 🆘 **US:** Call 988 (Suicide & Crisis Lifeline)
- 🌐 **International:** Visit https://findahelpline.com

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Free to use, modify, and distribute
Copyright (c) 2025 Tejaji-0
```

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For the incredible AI API
- **Auth0** - For secure authentication solutions
- **Snowflake** - For enterprise-grade data platform
- **DigitalOcean** - For scalable infrastructure
- **Open Source Community** - For inspiration and support

---

## 📞 Contact & Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/Tejaji-0/OSH/issues)
- **Discussions:** [Join the conversation](https://github.com/Tejaji-0/OSH/discussions)
- **Email:** [Support via GitHub](https://github.com/Tejaji-0)

---

## 🎯 Roadmap

### Coming Soon
- [ ] Mobile app (React Native)
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Community features (anonymous forums)
- [ ] Therapist finder integration
- [ ] Crisis detection and intervention

---

<div align="center">

### 🧠 ClearMind - Because everyone deserves access to mental health support

**[⭐ Star this repo](https://github.com/Tejaji-0/OSH)** if you find it helpful!

Made with ❤️ for mental health awareness

[🏠 Homepage](#-clearmind) • [📖 Docs](#-documentation) • [🚀 Deploy](#-docker-deployment) • [🤝 Contribute](#-contributing)

---

**🌟 "Making mental wellness accessible to everyone, everywhere." 🌟**

</div>
