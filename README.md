# Slack Clone with ElevenLabs ConvAI Integration

A modern, feature-rich Slack clone built with React and TypeScript, featuring integrated voice assistance powered by ElevenLabs ConvAI API.

## 🚀 Features

### Core Chat Functionality
- **Multi-channel support** with channel-specific content
- **Direct messaging system** with real-time conversations
- **Message reactions** and emoji support
- **File attachments** with preview support
- **Threading system** for organized discussions
- **Typing indicators** for real-time feedback
- **Responsive design** that works on all devices

### Advanced Features
- **Voice Assistant Integration** using ElevenLabs ConvAI
- **Real-time transcript capture** from voice conversations
- **Channel-specific content** for realistic workplace scenarios
- **Persistent message storage** across channel switches
- **Modern UI/UX** with Slack-inspired design

### Channels Available
- **#general** - Team project updates and collaboration
- **#announcements** - Company-wide announcements and news
- **#dev-team** - Technical discussions and code reviews
- **#design** - Design mockups and feedback
- **#marketing** - Campaign results and event planning

### Direct Messages
- **Team Members** - Sarah Chen, Mike Johnson, Emily Rodriguez, Alex Thompson
- **Helpdesk Agent** - AI-powered support with voice assistance

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom components
- **Voice AI**: ElevenLabs ConvAI API
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Drag & Drop**: DND Kit

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- ElevenLabs API key (for voice features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trueinf/slackhelpdesk.git
   cd slackhelpdesk
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file in project root
   echo "VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here" > .env.local
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎤 Voice Assistant Setup

### Getting ElevenLabs API Key
1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Navigate to your profile settings
3. Generate an API key
4. Add it to your `.env.local` file

### Using Voice Features
1. Navigate to **Direct Messages** → **Helpdesk Agent**
2. Look for the blue voice assistant section
3. Click the microphone to start voice conversation
4. View real-time transcripts in the chat window

## 📁 Project Structure

```
src/
├── components/
│   └── generated/
│       ├── ChatInterface.tsx      # Main chat component
│       ├── Sidebar.tsx           # Channel/DM navigation
│       ├── MessageList.tsx       # Message display
│       ├── MessageInput.tsx      # Message composition
│       ├── ChatHeader.tsx        # Channel/DM header
│       └── ...                   # Other UI components
├── dnd-kit/                      # Drag & drop utilities
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── settings/                     # App configuration
```

## 🔧 Configuration

### Environment Variables
- `VITE_ELEVENLABS_API_KEY` - Your ElevenLabs API key for voice features

### Customization
- **Channels**: Modify `CHANNEL_MESSAGES` in `ChatInterface.tsx`
- **DMs**: Update `DM_MESSAGES` and `MOCK_DMS` 
- **Styling**: Customize Tailwind classes throughout components
- **Voice Agent**: Change agent ID in ConvAI integration

## 🎯 Key Features Explained

### Channel-Specific Content
Each channel has realistic, context-appropriate conversations:
- **#announcements**: CEO funding news, HR updates, security notices
- **#dev-team**: Code reviews, API improvements, deployment updates
- **#design**: Mockups, accessibility improvements, design feedback
- **#marketing**: Campaign results, event planning, performance metrics

### Voice Transcript Capture
- **Hybrid Approach**: Keeps ConvAI widget UI while capturing transcripts
- **Real-time Processing**: WebSocket connection for live transcript data
- **Smart Display**: Voice messages appear with 🎤 emoji and "(Voice)" labels
- **Persistent Storage**: Transcripts saved to conversation history

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Desktop Enhanced**: Full feature set on larger screens
- **Modern UI**: Clean, professional Slack-inspired interface

## 🚀 Deployment

### Build for Production
```bash
yarn build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Production
Make sure to set `VITE_ELEVENLABS_API_KEY` in your deployment platform's environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ElevenLabs](https://elevenlabs.io) for the amazing ConvAI API
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

For support, email support@trueinf.com or create an issue in this repository.

---

**Built with ❤️ by TrueInf Team**