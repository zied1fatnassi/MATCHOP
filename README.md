# MtchOp 🎯

**Match Your Opportunity** - A modern student-company matching platform built with React.

![MtchOp](https://img.shields.io/badge/MtchOp-v1.0.0-6366f1)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20FR-green)

## 📖 About

MtchOp connects students with companies through an intuitive swipe-based matching experience. Students can discover internships and job opportunities, while companies can find exceptional talent.

### Key Features

- 🎯 **Swipe to Match** - Tinder-like interface for job discovery
- 💬 **Real-time Chat** - Message your matches directly
- 🌐 **Multilingual** - English & French support (RTL-ready for Arabic)
- 📱 **Mobile-first** - Responsive design for all devices
- ✨ **Modern UI** - Glassmorphism design with smooth animations

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router DOM 7 |
| Styling | Vanilla CSS with CSS Variables |
| Icons | Lucide React |
| i18n | react-i18next |
| Database | Supabase (optional) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mtchop.git
   cd mtchop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**: http://localhost:5173

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Student & Company flow pages
├── lib/              # Utilities (i18n config)
├── locales/          # EN/FR translation files
├── types/            # JSDoc type definitions
└── index.css         # Global styles & design system
```

---

## 🌐 Internationalization

| Language | Status |
|----------|--------|
| 🇬🇧 English | ✅ Complete |
| 🇫🇷 French | ✅ Complete |
| 🇸🇦 Arabic | 🔜 Planned (RTL-ready) |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

### Build Command
```bash
npm run build
```

---

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

See `.env.example` for full list.

---

## 📄 License

MIT License

---

<p align="center">Made with ❤️ by the MtchOp Team</p>
