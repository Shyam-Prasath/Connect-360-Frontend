# Connect360

Connect360 is a **decentralized social and collaboration platform** built for secure communication, networking, and file sharing. Users can connect with others, exchange documents, chat, make video calls, and interact in a fully blockchain-enabled environment. It combines modern web technologies, Web3 login, and real-time features for seamless collaboration.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Folder Structure](#folder-structure)    

---

## Features

### Authentication & Blockchain
- **MetaMask Wallet Login**: Users can sign in using Ethereum/Polygon wallets.  
- **OTP & Email Verification**: Traditional email verification for added security.  
- **Role-Based Redirection**: Users are redirected based on profile completion.

### Communication & Networking
- **Real-Time Chat**: Connect with users via direct messaging.  
- **Video Calls**: Peer-to-peer WebRTC video calls.  
- **Accept/Ignore Requests**: Manage friend or connection requests.  
- **Notifications & Alerts**: Real-time notice board and alerts for messages or requests.

### File & Document Management
- **File Uploads in Chat**: Upload files and folders in chat conversations.  
- **Notice File Uploads**: Upload folders or files in notice posts.  
- **Document Exchange**: Securely share documents with other users.  
- **Version Control & History**: Optional tracking of uploaded documents.

### Dashboard & UI
- **Expandable Sidebar**: Smooth animations, color-coded navigation items, and logout functionality.  
- **Progress Indicators**: Onboarding steps and verification progress tracking.  
- **Animated Feedback**: Success, error, and status messages with subtle animations.  
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile.

### Security
- **Blockchain-Based Authentication**: Ensures ownership of accounts.  
- **OTP Expiry & Notices**: OTP expires in 10 minutes, never share codes.  
- **Encrypted Communication**: WebRTC and secure storage for sensitive data.

---

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, Lucide React Icons  
- **Backend**: Node.js, Express.js (for APIs)  
- **Database**: MongoDB / PostgreSQL for user data and document metadata  
- **Blockchain**: Ethereum / Polygon integration via MetaMask  
- **Real-Time**: Socket.IO for chat and video signaling  
- **File Storage**: IPFS or cloud storage for documents  
- **Authentication**: MetaMask & OTP-based login  
- **AI/Utilities**: Optional integration for document verification or analysis  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/connect360.git
cd connect360
````

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file for environment variables:

```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_CHAIN_ID=1
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

---

## Usage

1. Open the app at `http://localhost:5173`.
2. Login using MetaMask or email + OTP.
3. Complete profile setup if required.
4. Navigate via sidebar to access:

   * **Home**: Dashboard overview.
   * **Share/Upload**: Post files or folders to your network.
   * **Invite Connections**: Send requests to other users.
   * **Notice/Post**: Create public notices with file attachments.
   * **My Network**: Manage connections, accept/ignore requests.
5. Chat with users, upload files/folders, or initiate video calls.
6. Logout securely via sidebar.

---

## Folder Structure

```
connect360/
├─ public/
├─ src/
│  ├─ api/               # Axios instance and API calls
│  ├─ components/        # UI components (Sidebar, Chat, VideoCall, Upload, etc.)
│  ├─ pages/             # Page views (Home, VerifyOtp, Profile, Chat, Notice)
│  ├─ hooks/             # Custom React hooks (useMetaMask, useSidebar)
│  ├─ contracts/         # Blockchain contracts (optional)
│  ├─ utils/             # Helper functions (file upload, Web3 utils)
│  ├─ App.jsx
│  └─ main.jsx
├─ .env
├─ package.json
└─ README.md
```
