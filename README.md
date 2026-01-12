# 4dc (4 Dealers Chat)

**A not so secure, real-time desktop messenger application built with React, Electron, and Next.js.**

4dc is a messaging platform designed with a focus on data privacy, real-time synchronization, and distinct user management. It combines the native experience of a desktop application (via Electron) with a scalable cloud backend (Next.js & Firebase).

## Key Features

### User Management

* **Registration:** Secure sign-up using Email, Password, and Username.
* **Identity:** Every user is assigned a unique system `userId`, allowing Usernames to be non-unique/flexible.
* **Authentication:** Managed via Firebase Authentication.

### Contacts & Connectivity

* **Add by ID:** Users connect by sharing their unique `userId`.
* **Friendship Flow:** Strict request-based system. A user must accept a contact request before any messages can be exchanged.

### Messaging System

* **Chat Types:** Support for both 1-on-1 Direct Messages and Group Chats.
* **Real-time:** Instant message delivery via Firestore real-time listeners.
* **Persistence:** Messages are stored in a NoSQL structure (Firestore) for history and syncing.

### Security & Privacy

* **Encryption:** Messages are encrypted before storage.
* **Access Control:** Only the intended recipient or group members can decrypt and read messages.
* **Data Safety:** No sensitive data is exposed unencrypted in the frontend. Private keys and secrets are managed server-side via the Firebase Admin SDK.

---

## Tech Stack

### Client (Desktop App)
* **Core:** [Electron](https://www.electronjs.org/) (v39)
* **Build Tool:** [Vite](https://vitejs.dev/) (via Electron Forge)
* **Frontend:** [React](https://react.dev/) (v19)
* **Styling:** Tailwind CSS (v3) + `clsx` / `tailwind-merge`
* **Icons:** Lucide React
* **Crypto:** `crypto-js` (AES Encryption)
* **Routing:** React Router DOM

### Backend & Web
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Styling:** Tailwind CSS (v4)
* **Animations:** Framer Motion
* **Server Logic:** Firebase Admin SDK

### Database & Services
* **Database:** Google Firestore (NoSQL)
* **Auth:** Firebase Authentication

---

## Getting Started / Local Development

Follow these steps to set up the project locally.

### Prerequisites
* **Node.js** (v20 or higher recommended)
* **npm** or **yarn**
* A **Firebase Project** (Google Account required)

### 1. Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. **Authentication:** Enable "Email/Password".
4. **Firestore Database:** Create a database in "Test Mode".
5. **Settings:**
   - Get your **Web App Config** (API Key, etc.) for the Client.
   - Generate a **Service Account Private Key** (JSON) for the Backend.

### 2. Clone the Repository
```bash
git clone https://github.com/Stiwyy/4dc.git
cd 4dc

```

### 3. Backend Setup (Next.js)

The backend handles the API and the landing page.

1. Navigate to the backend folder:
```bash
cd backend
npm install

```


2. Create a `.env.local` file:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

```


3. Start the server:
```bash
npm run dev

```


*Runs on http://localhost:3000*

### 4. Client Setup (Electron)

The desktop application.

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install

```


2. Create a `.env` file (Vite requires `VITE_` prefix for exposed vars, but check your implementation if you use standard `REACT_APP_` or `VITE_`):
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# Add other firebase config vars here

```


3. Start the Electron app:
```bash
npm start

```


*(This runs `electron-forge start`)*

### Building the Client

To create a distributable executable (exe, deb, etc.):

```bash
npm run make

```

---

## Architecture

The project is split into two main components:

1. **The Backend (Next.js):** Handles the marketing website (download page) and the API routes.
2. **The Client (Electron + React):** The actual application installed by the user.

**Data Structure (Firestore):**

* `users`: User profiles and public keys.
* `chats`: Metadata for conversations (participants, types).
* `messages`: Encrypted message content linked to chats.


---

## Disclaimer

Do not actually use this seriously. This is a joke project.

---

## License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.

