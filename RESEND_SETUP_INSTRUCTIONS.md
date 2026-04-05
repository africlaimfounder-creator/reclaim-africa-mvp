# Resend Email Setup Instructions

## Current Status
✅ Resend API key is configured: `re_ToktzxfY_536784pYe1v1Y3so1DyjTWMB`  
❌ Domain verification required to send emails

## Why Emails Aren't Sending Yet

Resend requires domain verification for security. You cannot use `gmail.com` or other public email providers as the sender address. You need to:

1. **Own a domain** (e.g., `reclaimafrica.com`, `reclaimafrica.ng`)
2. **Verify it with Resend**
3. **Use that domain for the sender email**

## Step-by-Step Setup

### Option 1: If You Already Own a Domain (Recommended)

1. **Go to Resend Domains**  
   Visit: https://resend.com/domains

2. **Add Your Domain**  
   - Click "Add Domain"
   - Enter your domain (e.g., `reclaimafrica.com`)
   - Follow the DNS verification steps

3. **Update DNS Records**  
   Resend will provide DNS records to add to your domain registrar:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)

4. **Wait for Verification** (usually 5-30 minutes)

5. **Update the Sender Email**  
   Once verified, update `/app/backend/.env`:
   ```env
   SENDER_EMAIL="noreply@reclaimafrica.com"
   # or
   SENDER_EMAIL="notifications@reclaimafrica.com"
   ```

6. **Restart Backend**
   ```bash
   sudo supervisorctl restart backend
   ```

### Option 2: Use Resend's Test Domain (For Development Only)

For testing purposes, you can use Resend's onboarding domain:

1. **Update Sender Email**  
   In `/app/backend/.env`:
   ```env
   SENDER_EMAIL="onboarding@resend.dev"
   ```

2. **Important Limitations**:
   - ⚠️ Can ONLY send to your verified email: `reclaimafrica.founder@gmail.com`
   - ⚠️ Cannot send to customers
   - ⚠️ Not suitable for production

3. **Restart Backend**
   ```bash
   sudo supervisorctl restart backend
   ```

### Option 3: Get a Free Domain

If you don't have a domain yet:

1. **Get a domain** from:
   - Namecheap (~$10/year for .com)
   - Hostinger (~$1/year for first year)
   - Cloudflare (~$10/year)
   - Nigeria-specific: `.ng` domains from NiRA

2. **Follow Option 1 steps** to verify with Resend

## Testing Email Functionality

Once your domain is verified, test by:

### 1. Create a New User
```bash
curl -X POST "https://reclaim-dashboard.preview.emergentagent.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "08012345678",
    "password": "TestPass123"
  }'
```
Should send welcome email ✉️

### 2. Submit a Claim
Login and submit a claim through the UI - should send confirmation email ✉️

### 3. Update Claim Status (Admin)
Login as admin, change a claim status - should send status update email ✉️

## Current Email Templates

The app sends 3 types of emails:

1. **Welcome Email** - When user registers
2. **Claim Submitted** - When user submits a claim
3. **Claim Status Update** - When admin changes claim status

All emails use your brand colors (gold #D4AF37) and include the tagline "We only get paid when you get paid."

## Recommended Domain Setup

For production, I recommend:
- **Domain**: `reclaimafrica.com` or `reclaimafrica.ng`
- **Sender Email**: `noreply@reclaimafrica.com`
- **Sender Name**: "Reclaim Africa"

This looks professional and builds trust with users.

## Need Help?

- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- DNS Help: Contact your domain registrar's support

## Current Configuration

Your current settings in `/app/backend/.env`:
```env
RESEND_API_KEY="re_ToktzxfY_536784pYe1v1Y3so1DyjTWMB"
SENDER_EMAIL="reclaimafrica.founder@gmail.com"  # ❌ Needs to be changed
```

Once you verify a domain, change SENDER_EMAIL to use your verified domain.
