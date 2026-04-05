# Reclaim Africa - Claim Submission Portal

Multi-step claim submission portal for Reclaim Africa, a Nigerian fintech helping people recover unclaimed financial assets.

## Features

- ✅ Multi-step claim form (5 steps with progress bar)
- ✅ User authentication (JWT-based with httpOnly cookies)
- ✅ Admin panel for claim management
- ✅ In-app notifications system
- ✅ Browser push notifications
- ✅ Email notifications (Resend integration - removed)
- ✅ Professional UI with gold & black branding
- ✅ Mobile-responsive design
- ✅ Help Center with FAQs

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Axios

**Backend:**
- Python 3.9+
- FastAPI
- MongoDB (Motor async driver)
- PyJWT (authentication)
- BCrypt (password hashing)
- PyWebPush (push notifications)

**Database:**
- MongoDB

## Project Structure

```
/app
├── backend/
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── public/
│   │   ├── reclaim-africa-logo.jpg
│   │   └── service-worker.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   ├── NotificationBell.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── PushNotificationPrompt.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   └── usePushNotifications.js
│   │   ├── pages/
│   │   │   ├── Landing.js
│   │   │   ├── Signup.js
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── NewClaim.js
│   │   │   ├── MyClaims.js
│   │   │   ├── Notifications.js
│   │   │   ├── Help.js
│   │   │   └── Admin.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── .env
└── README.md
```

## Setup Instructions

### Backend Setup

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Set up environment variables in `backend/.env`:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=reclaim_africa
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=reclaimafrica.founder@gmail.com
ADMIN_PASSWORD=Founder12344
FRONTEND_URL=http://localhost:3000
```

3. Run the backend:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
yarn install
```

2. Set up environment variables in `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

3. Run the frontend:
```bash
yarn start
```

The app will be available at `http://localhost:3000`

## Admin Credentials

- **Email**: reclaimafrica.founder@gmail.com
- **Password**: Founder12344

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Claims
- `POST /api/claims` - Submit new claim
- `GET /api/claims` - Get user's claims

### Admin
- `GET /api/admin/claims` - Get all claims (admin only)
- `PATCH /api/admin/claims/{id}/status` - Update claim status (admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read

### Push Notifications
- `GET /api/push/vapid-public-key` - Get VAPID public key
- `POST /api/push/subscribe` - Subscribe to push
- `POST /api/push/unsubscribe` - Unsubscribe from push

## Deployment

### Prerequisites
- MongoDB instance (MongoDB Atlas recommended)
- Node.js 16+ and Python 3.9+
- Domain name (optional)

### Environment Variables
Update the `.env` files with production values before deploying.

## Features Implemented

1. **User Registration & Login** - Secure JWT authentication
2. **Multi-Step Claim Form** - 5 steps with validation
3. **Admin Panel** - View and manage all claims
4. **Claim Status Updates** - Admin can update status (Submitted → Under Review → Completed)
5. **In-App Notifications** - Real-time notification system
6. **Push Notifications** - Browser push when claim status changes
7. **Help Center** - Comprehensive FAQs
8. **Professional Branding** - Custom logo and color scheme

## License

Copyright © 2024 Reclaim Africa. All rights reserved.
