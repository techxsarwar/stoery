# 🌌 SOULPAD | The New Era of Storytelling

![SOULPAD Banner](https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop)

> **"Where Stories Come Alive."**  
> A premium, high-performance platform for writers and readers, powered by a dedicated AI engine and buttery-smooth motion design.

---

## ✨ Premium Features

### 🧠 **1. Dedicated AI Engine (Python/FastAPI)**
Our AI isn't just a wrapper. It's a high-concurrency microservice running on Render that delivers:
- ⚡ **Real-time Streaming**: Watch the AI "type" your story suggestions live.
- 🎨 **Creative Assistance**: Context-aware story continuation and world-building.
- 🚀 **High Performance**: Offloaded from the main frontend for maximum speed.

### 🌊 **2. Buttery-Smooth Experience**
Designed to feel like a premium agency site:
- 🖱️ **Lenis Smooth Scroll**: Elegant, momentum-based scrolling across all devices.
- 🎭 **Framer Motion Transitions**: Seamless page-to-page glides and entrance animations.
- 📱 **Responsive Design**: Brutalist-modern UI that looks stunning on mobile and desktop.

### 📚 **3. Advanced Reader & Editor**
- 📖 **Distraction-Free Reading**: High-contrast, typography-focused reading interface.
- ✍️ **Smart Editor**: Integrated AI tools directly in the writing flow.
- ⏳ **Reading Heartbeat**: Track your reading time and progress automatically.

### 🔍 **4. Discovery & Community**
- 🏷️ **Genre Exploration**: Instant filtering for Sci-Fi, Fantasy, Mystery, and more.
- 📈 **Trending Algorithms**: Real-time tracking of "Global Reads" and "Likes".
- 👥 **Author Profiles**: Verified chronicler status, follower systems, and portfolios.

---

## 🛠️ Technical Architecture

| Engine | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15+ (Turbopack)** | Global Edge delivery & SSR |
| **AI Microservice** | **FastAPI + Gunicorn** | High-performance AI streaming |
| **Database** | **PostgreSQL + Prisma** | Type-safe data modeling & caching |
| **Auth** | **Supabase Auth** | Secure, multi-provider authentication |
| **Styling** | **Vanilla CSS + Tailwind** | Custom Brutalist design system |
| **Animations** | **Framer Motion + Lenis** | Premium motion & scroll physics |

---

## 🚀 Getting Started

### 1. Clone the Universe
```bash
git clone https://github.com/techxsarwar/stoery.git
cd stoery
```

### 2. Install Dependencies
```bash
# Install Frontend
npm install

# Install AI Backend
cd backend && pip install -r requirements.txt
```

### 3. Environment Setup
Create a `.env` file in the root:
```env
# Database
DATABASE_URL="your_postgresql_url"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key"

# AI Backend
BACKEND_AI_URL="http://localhost:8000"
GEMINI_API_KEY="your_key"
```

### 4. Run Locally
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: AI Engine
cd backend
uvicorn main:app --reload
```

---

## 🎨 Design Language
SOULPAD uses a **Modern Brutalist** aesthetic:
- **Primary Color**: `#FFD700` (Electric Yellow)
- **Contrast**: Bold `#000000` borders and shadows.
- **Typography**: Space Grotesk & Outfit for a futuristic, sharp feel.

---

> [!IMPORTANT]
> **SOULPAD** is currently in **Production Beta**. AI streaming and Smooth Motion features require a high-speed connection for the best experience.

---

Made with ❤️ by the SOULPAD Team.
