# Reclaim Africa - Setup Instructions

## Overview
This is a multi-step claim submission portal for Reclaim Africa, a Nigerian fintech helping people recover unclaimed financial assets.

## Features Implemented
- ✅ User Registration & Login with JWT authentication
- ✅ Admin Panel for claim management
- ✅ Multi-step claim form (5 steps with progress bar)
- ✅ Dashboard with claims tracking
- ✅ Help Center with FAQs
- ✅ Mobile-responsive design with gold (#D4AF37) and black (#0A0908) theme

## Admin Credentials
- **Email**: reclaimafrica.founder@gmail.com
- **Password**: Founder12344

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
