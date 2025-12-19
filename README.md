# MatchOp 🎯

**Match Your Opportunity** - A modern student-company matching platform built with React.

![MatchOp](https://img.shields.io/badge/MatchOp-v1.0.0-6366f1)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20FR-green)

## 📖 About

MatchOp connects students with companies through an intuitive swipe-based matching experience. Students can discover internships and job opportunities, while companies can find exceptional talent.

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
   git clone https://github.com/zied1fatnassi/MATCHOP.git
   cd MATCHOP
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

## 🔐 Authentication

MatchOp uses **Supabase Auth** for secure authentication. All authentication goes through Supabase - no demo or bypass modes.

### Security Features

- ✅ **Supabase Auth** - Industry-standard authentication
- ✅ **Strong Password Policy** - 8+ chars, uppercase, lowercase, number, special char
- ✅ **Email Verification** - Required before login
- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Input Validation** - Frontend + Backend validation
- ✅ **Loading States** - Clear UI feedback during auth
- ✅ **Error Handling** - User-friendly error messages

### Password Requirements

| Requirement | Description |
|-------------|-------------|
| Length | Minimum 8 characters |
| Uppercase | At least 1 uppercase letter (A-Z) |
| Lowercase | At least 1 lowercase letter (a-z) |
| Number | At least 1 digit (0-9) |
| Special | At least 1 special character (!@#$%^&*) |

### Supabase Configuration

1. **Enable Email Verification**:
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable "Confirm email" under Email Auth

2. **Set Password Requirements**:
   - Authentication → Settings → Password Requirements
   - Set minimum length to 8

3. **Run RLS Policies**:
   ```bash
   # In Supabase SQL Editor, run:
   database/rls_policies.sql
   ```

4. **Environment Variables**:
   ```bash
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

> ⚠️ **Important**: Never expose your Supabase service role key in the frontend.

---

## 📄 License

MIT License

---

<p align="center">Made with ❤️ by the MatchOp Team</p>

