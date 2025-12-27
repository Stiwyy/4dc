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

* **Framework:** [React](https://reactjs.org/)
* **Wrapper:** [Electron](https://www.electronjs.org/) (Local Desktop Client)
* **State & Logic:** Custom Hooks / Context API

### Backend & Web

* **Framework:** [Next.js 16](https://nextjs.org/) (API Routes)
* **Hosting:** [Vercel](https://vercel.com/) (Serves the API and the Download Website)

### Database & Services

* **Database:** Google Firestore (NoSQL)
* **Auth:** Firebase Authentication
* **Server-Side Logic:** Firebase Admin SDK

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

Distributed under the MIT License. See `LICENSE` for more information.

