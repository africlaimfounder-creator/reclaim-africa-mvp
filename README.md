# Reclaim Africa - Standalone Frontend App

Multi-step claim submission portal for Reclaim Africa, a Nigerian fintech helping people recover unclaimed financial assets.

## ⚠️ Standalone Version

This is a **frontend-only application** that runs entirely in the browser using localStorage for data persistence. No backend server required!

## Features

- ✅ Multi-step claim form (5 steps with progress bar)
- ✅ User authentication (stored locally)
- ✅ Claims management
- ✅ In-app notifications
- ✅ Professional UI with gold & black branding
- ✅ Mobile-responsive design
- ✅ Help Center with FAQs
- ✅ All data stored in browser localStorage

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- localStorage for data persistence

## Quick Start

### Install Dependencies

```bash
cd frontend
yarn install
```

### Run the App

```bash
yarn start
```

The app will open at `http://localhost:3000`

## Default Login Credentials

**Admin Account:**
- Email: `reclaimafrica.founder@gmail.com`
- Password: `Founder12344`

Or create a new account from the signup page!

## Project Structure

```
frontend/
├── public/
│   ├── reclaim-africa-logo.jpg
│   └── service-worker.js
├── src/
│   ├── components/
│   │   ├── Navigation.js
│   │   ├── NotificationBell.js
│   │   ├── ProtectedRoute.js
│   │   └── PushNotificationPrompt.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Landing.js
│   │   ├── Signup.js
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── NewClaim.js
│   │   ├── MyClaims.js
│   │   ├── Notifications.js
│   │   └── Help.js
│   ├── utils/
│   │   └── seedAdmin.js
│   ├── App.js
│   ├── App.css
│   └── index.css
└── package.json
```

## How It Works

### Data Storage

All data is stored in browser localStorage:
- **Users**: `localStorage.users` - Array of all registered users
- **Current User**: `localStorage.currentUser` - Currently logged-in user
- **Claims**: `localStorage.claims_{userId}` - Claims for each user
- **Notifications**: `localStorage.notifications_{userId}` - Notifications for each user

### Features

1. **User Registration & Login**
   - Create account with full name, email, phone, password
   - Login with email/password
   - Auto-seeded admin account

2. **Multi-Step Claim Form**
   - Step 1: Asset type selection (12 types)
   - Step 2: Who is claiming
   - Step 3: Documents available
   - Step 4: Personal details
   - Step 5: Service tier selection
   - Step 6: Confirmation

3. **Claims Management**
   - View all submitted claims
   - Track claim status (Submitted, Under Review, Completed)
   - Filter and search

4. **Notifications**
   - Welcome notification on signup
   - Claim submission confirmation
   - Real-time notification bell
   - View all notifications page

5. **Help Center**
   - Comprehensive FAQs
   - Contact information

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/africlaimfounder-creator/reclaim-africa-mvp)

### Manual Deployment

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `frontend`
5. Deploy!

**No environment variables needed** - it's all frontend!

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Data Persistence

Data persists as long as you don't:
- Clear browser data/cache
- Use incognito/private mode
- Delete localStorage manually

**Tip**: Export your data regularly by copying localStorage in browser dev tools!

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build

# The build folder is ready to deploy
```

## License

Copyright © 2024 Reclaim Africa. All rights reserved.
