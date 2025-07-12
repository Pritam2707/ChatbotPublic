# 💬 ChatBot 

**ChatBot** is a hybrid **AI chatbot** and **group messenger** app built with **React**, **Tailwind CSS**, and **Firebase**. It blends real-time group chat features with conversational AI — designed for fast, smart, and social communication.


## 🚀 Features

- 🤖 **Integrated AI chatbot** in every conversation (private or group)
- 👥 **Group chat support** with dynamic room creation
- 🔐 **UID-based user system** (no usernames/emails required)
- 🧠 **Real-time chat** powered by Firebase Firestore
- 🎨 **Responsive UI** built with Tailwind CSS

## 🧱 Tech Stack

| Tech         | Role                              |
|--------------|-----------------------------------|
| **React**    | Frontend framework                |
| **Tailwind CSS**| Styling & layout              |
| **Firebase** | Auth, Firestore, Realtime updates |
| **AI**       |Propieratory Server(Currently Down)|



## 🔧 Environment Setup

### 1. Clone the Repo


### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

Then set up your `.env` file:


### 4. Run the App

```
npm run dev
```

Visit `http://localhost:3000` in your browser.


## 🤖 How the AI Chatbot Works

* The chatbot is available inside any group or private chat.
* It listens for prompts prefixed with or auto-responds in bot-enabled groups.


## 🔐 UID-Based Auth

* No complex login — users are assigned unique `uid`s on session creation
* Firebase Auth can be extended with Google or anonymous login

---

## ⚙️ Firebase Features Used

* 🔥 Firestore for real-time chat data
* 🔐 Firebase Auth with UID mapping
* 📤 Firebase Hosting (optional for deploy)


## 🌍 Deploy

To deploy on Firebase Hosting:

```
npm run build
firebase deploy
```

Or use [Vercel](https://vercel.com) with environment variables.


## 📜 License

MIT License. See [LICENSE](LICENSE) for more details.


## ✨ Author

* Built by [Pritam2707](https://github.com/Pritam2707)
* Contributions welcome!
