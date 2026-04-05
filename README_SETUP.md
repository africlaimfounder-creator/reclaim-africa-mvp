# Reclaim Africa - Setup Instructions

## Overview
This is a multi-step claim submission portal for Reclaim Africa, a Nigerian fintech helping people recover unclaimed financial assets.

## Features Implemented
- ✅ User Registration & Login with JWT authentication
- ✅ Admin Panel for claim management
- ✅ Multi-step claim form (5 steps with progress bar)
- ✅ Dashboard with claims tracking
- ✅ Help Center with FAQs
- ✅ Email notifications (Resend integration)
- ✅ Mobile-responsive design with gold (#D4AF37) and black (#0A0908) theme

## Admin Credentials
- **Email**: reclaimafrica.founder@gmail.com
- **Password**: Founder12344

## Email Notifications Setup

The app is configured to send email notifications using Resend for:
1. Welcome email when user creates account
2. Claim submission confirmation
3. Claim status updates

### To Enable Email Notifications:

1. Create a free account at [resend.com](https://resend.com)
2. Get your API key from Dashboard → API Keys
3. Update `/app/backend/.env`:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   SENDER_EMAIL=onboarding@resend.dev
   ```
4. Restart backend:
   ```bash
   sudo supervisorctl restart backend
   ```

### Current Status:
- Email code is implemented and working
- API key needs to be updated with a real Resend key
- Emails are currently logged in backend but won't send until API key is updated

## Testing

Test credentials have been saved to `/app/memory/test_credentials.md`

## Pages
1. **Landing Page** (`/`) - Welcome page with Create Account and Login buttons
2. **Signup** (`/signup`) - User registration
3. **Login** (`/login`) - User/Admin login
4. **Dashboard** (`/dashboard`) - User dashboard with claims overview
5. **New Claim** (`/new-claim`) - Multi-step claim submission form
6. **My Claims** (`/my-claims`) - View all user's claims
7. **Help Center** (`/help`) - FAQs and contact information
8. **Admin Panel** (`/admin`) - Admin-only claim management

## Technology Stack
- **Frontend**: React, Tailwind CSS, Lucide React icons
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Authentication**: JWT with httpOnly cookies
- **Email**: Resend API
- **Fonts**: Outfit (headings), Manrope (body), JetBrains Mono (monospace)

## Asset Types
Currently supporting:
- ✅ Unclaimed Dividends (Active)
- 🔒 11 other asset types (Coming Soon)

## Service Tiers
- Guided Self Recovery (10% fee, min ₦5,000)
- Partial Manual Recovery (15% fee)
- Full Automated Recovery (Coming Soon)

## Nigerian States
All 36 states + FCT Abuja are included in the claim form.
