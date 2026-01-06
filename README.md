<div align="center">
  <h1>🐍 Kobra - Code. Stream. Strike.</h1>
  <p><strong>The All-in-One Studio for Creative Streamers</strong></p>
  <p>Revolutionary browser-based streaming studio that combines powerful editing tools with seamless live broadcasting</p>
</div>

---

## 📖 About the Project

**Kobra** is a modern browser-based platform for streaming and content creation. It combines advanced editing tools with live streaming capabilities. Create, code, and engage your audience like never before.

## ✨ Features

### 🎨 Multiple Editors
- **Code Editor** - Syntax-highlighted code editor with interactive preview
- **AI Chat (Chester)** - AI assistant powered by Google Gemini to help with content creation
- **Text Editor** - Advanced text editor for writing notes, scripts, and blog posts
- **Universal Canvas** - Flexible workspace with webcam and screen sharing support

### 🎥 Streaming & Recording
- Screen recording for streams
- Recording storage in Firebase Storage
- Project and recording management
- "Go Live" and "Prepare" modes

### 👤 Authentication & Management
- Firebase Authentication (Email/Password and Anonymous)
- Project management (create, edit, duplicate, delete)
- User profile with avatar
- Guest mode for quick start

### 🌍 Internationalization
- English and Polish language support
- Easy language switching
- Fully internationalized interface

### 🎨 Personalization
- Light and dark themes
- Modern, responsive interface
- Intuitive navigation

## 🚀 Requirements

- **Node.js** 18+ (LTS version recommended)
- **npm** or **yarn**
- Firebase account (for authentication and storage)
- Google Gemini API key (optional, for AI features)

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Kobra - Code. Stream. Strike."
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** The Gemini API key is optional. The application will work without it, but AI features will be disabled.

### 4. Configure Firebase

Firebase is already configured in `firebase/config.ts`. If you want to use your own Firebase project:

1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Anonymous)
3. Create Firestore Database
4. Create Storage Bucket
5. Update `firebase/config.ts` with your own configuration data

## 🎯 Running

### Development mode

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🏗️ Project Structure

```
.
├── components/          # React components
│   ├── editors/        # Editors (Code, AI, Text, Universal)
│   ├── Dashboard.tsx   # Main dashboard
│   ├── StreamView.tsx  # Streaming view
│   └── ...
├── contexts/           # React Contexts (Settings)
├── services/           # Services (Auth, Firebase, Gemini)
├── hooks/              # Custom React Hooks
├── lib/                # Helper libraries (translations)
├── firebase/           # Firebase configuration
├── types.ts            # TypeScript type definitions
├── constants.tsx       # Application constants
└── App.tsx             # Main application component
```

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **Firebase** - Backend (Auth, Firestore, Storage)
- **Google Gemini AI** - AI assistant (Chester)
- **Tailwind CSS** - Styling (via CDN)

## 📝 Main Features

### Project Creation
- Editor type selection when creating a project
- Quick streaming mode (Quick Stream)
- Project management with context menu
- Duplicate and rename projects

### Streaming
- Content preparation before streaming
- "Go Live" mode for live streams
- Screen recording for streams
- Automatic recording saves

### AI Assistant (Chester)
- AI chat powered by Google Gemini
- Help with content creation and problem solving
- Fun, friendly assistant personality

### Explore
- Browse public projects and recordings
- Discover content from other creators

## 🔧 Configuration

### Firebase Security Rules

Make sure you have appropriate security rules in Firebase:

**Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /recordings/{recordingId} {
      allow read: if true; // Public recordings
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /recordings/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🤝 Support

If you have questions or need help:
- Open an issue in the repository
- Contact us through the contact form in the application

## 📄 License

This project is private. All rights reserved.

---

<div align="center">
  <p>Made with ❤️ by the Kobra Team</p>
  <p>🐍 Code. Stream. Strike. 🐍</p>
</div>
