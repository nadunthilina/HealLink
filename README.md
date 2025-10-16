# 🏥 HealLink - Caretaker Management System

A modern, responsive web application for revolutionizing caretaker coordination and patient management in Sri Lanka. Built with professional-grade architecture and best practices.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd HealLink

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup (separate terminal)
cd ../server
npm install
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📋 Project Structure

```
HealLink/
├── frontend/                    # React application
│   ├── public/                 # Static assets
│   │   └── images/            # Image assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx    # Navigation header
│   │   │   ├── Footer.jsx    # Site footer
│   │   │   ├── StarRating.jsx # Rating component
│   │   │   └── FAQItem.jsx   # FAQ accordion
│   │   ├── pages/            # Route components
│   │   │   ├── Landing.jsx   # Homepage
│   │   │   ├── Dashboard.jsx # User dashboard
│   │   │   └── Login.jsx     # Authentication
│   │   ├── state/            # State management
│   │   │   └── useAuth.js    # Authentication state
│   │   ├── styles.css        # Global styles
│   │   ├── main.jsx          # App entry point
│   │   └── App.jsx           # Main app component
│   ├── index.html            # HTML template
│   ├── package.json          # Dependencies & scripts
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── postcss.config.js     # PostCSS configuration  
│   └── vite.config.js        # Vite build configuration
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── models/           # Database models
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Express middleware
│   │   └── index.js          # Server entry point
│   └── package.json          # Backend dependencies
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with hooks
- **Build Tool**: Vite (fast development & build)
- **Styling**: Tailwind CSS (utility-first)
- **Routing**: React Router v6
- **State Management**: Zustand (lightweight)
- **Icons**: SVG icons & emojis

### Backend  
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, bcrypt
- **Logging**: Morgan

## 🎯 Features

### ✅ Implemented
- **Professional Landing Page** - Modern healthcare design
- **User Authentication** - Role-based login system
- **Responsive Design** - Mobile-first approach
- **Dashboard Interface** - Admin/Caretaker/Patient views
- **Component Architecture** - Reusable UI components
- **State Management** - Global auth state
- **Routing System** - Protected routes & lazy loading

### 🚧 Planned
- Caretaker profile management
- Schedule coordination system
- Real-time notifications
- Patient care tracking
- Feedback & rating system
- Reporting & analytics

## 🚀 Development Commands

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend
```bash
cd server

# Development server (with nodemon)
npm run dev

# Production server
npm start
```

## 🔧 Configuration

### Environment Variables
Create `.env` file in the server directory:

```env
# Server configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/heallink

# Authentication
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- **Primary Color**: `#0B24FB` (Healthcare blue)
- **Font**: Poppins for headings, Inter for body text
- **Custom Components**: Healthcare-specific styles

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

**HealLink Team**
- 📍 Badulla & Ampara, Sri Lanka
- 📞 077 8926365 | 076 4353335
- 🏥 Partnership with Badulla Hospital & Harshi Nursing Service

## 📄 License

This project is proprietary software developed for healthcare institutions in Sri Lanka.
