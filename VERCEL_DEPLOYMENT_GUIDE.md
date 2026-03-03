# Resurgo — Vercel Deployment Guide

## 1️⃣ Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/log in with your GitHub account (shaykhedeee)
3. Click **"Add New Project"**
4. Select **"GitHub"** as the Git provider
5. Search and select **`ascend`** repository
6. Click **"Import"**

## 2️⃣ Configure Environment Variables in Vercel Dashboard

In the Vercel project settings, add these environment variables:

### Resend Email (NEW)
```
RESEND_API_KEY = re_7gMehfmx_4yGwYArG2LmCFfWq9SMnMzmf
RESEND_FROM_EMAIL = Resurgo <noreply@resurgo.life>
EMAIL_INTERNAL_SECRET = resurgo-internal-secret-change-this
```

### Clerk Auth (EXISTING)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = [copy from Clerk dashboard]
CLERK_SECRET_KEY = [copy from Clerk dashboard]
CLERK_WEBHOOK_SECRET = [copy from Clerk webhook settings]
```

### Convex Backend (EXISTING)
```
NEXT_PUBLIC_CONVEX_URL = [copy from Convex project]
CONVEX_DEPLOY_KEY = [copy from Convex deploy key]
```

### AI Providers (EXISTING)
```
GROQ_API_KEY = [your Groq API key]
GOOGLE_AI_STUDIO_KEY = [your Gemini API key]
OPENROUTER_API_KEY = [optional]
```

### Google Analytics (EXISTING)
```
NEXT_PUBLIC_GA_ID = G-F1VLMSS8FB
```

**All above variables should be set for Environment: Production, Preview, and Development**

## 3️⃣ Deploy

1. In the Vercel dashboard, click **"Deploy"**
   - OR from terminal: `vercel deploy --prod`
2. Wait for build to complete (~3-5 minutes)
3. Visit your deployment at: **https://resurgo.life**

## 4️⃣ Set Up UptimeRobot Health Monitoring

### Your UptimeRobot API Keys:
- **Main API Key**: `u3344698-2d524904b7d148634b0a406a`
- **Read-Only Key**: `ur3344698-71374e8890c90c189a400830`
- **Monitor API Key**: `m802469450-022b656ca4ac87708d715c5f`

### Create Monitor Manually (Easiest):
1. Go to [uptimerobot.com/dashboard](https://uptimerobot.com/dashboard)
2. Click **"Add New Monitor"**
3. Setup:
   - **Monitor Type**: HTTP(S)
   - **URL**: `https://resurgo.life/api/health`
   - **Friendly Name**: `Resurgo Health Check`
   - **Check Interval**: 5 minutes
   - **Notifications**: Email (required)
4. Click **"Create Monitor"**

### Or Use the Setup Script:
```bash
# Set API key as env variable
$env:UPTIMEROBOT_API_KEY = "u3344698-2d524904b7d148634b0a406a"

# Run the setup script
node scripts/setup-uptimerobot.js
```

## 5️⃣ Verify Everything Works

✅ **Check Deployment**
- Visit https://resurgo.life
- Check that homepage loads
- Sign up/log in works
- Dashboard loads

✅ **Check Health Endpoint**
- Visit https://resurgo.life/api/health
- Should return JSON with status, service, version, timestamp

✅ **Check Email (Optional)**
- Test sendWelcomeEmail via Convex dashboard
- Or send test email: `curl -X POST https://resurgo.life/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"type":"welcome","to":"test@example.com","name":"Test"}'`

✅ **Check UptimeRobot**
- Monitor should show as "UP"
- Email alerts configured
- History tracking uptime %

## 6️⃣ Set Up Domain & SSL

Vercel handles SSL automatically. Your domain is registered at **resurgo.life** - ensure DNS is pointed to Vercel:

**DNS Records Needed:**
```
A record:    @ → 76.76.19.21
CNAME record: www → cname.vercel-dns.com.
```

Check status in Vercel Dashboard → Settings → Domains

## 7️⃣ Next: APK Build & Distribution

When ready to build the Android APK for Firebase App Distribution (free, no Google Play fee):

```bash
# 1. Sync Capacitor
npm run android:sync

# 2. Build release APK
npm run android:build:release

# 3. Upload to Firebase App Distribution
# (Requires firebase-tools and project setup)
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk \
  --app=1:YOUR_PROJECT_ID:android:YOUR_APP_ID \
  --testers="your-email@gmail.com"
```

---

**Status**: All code changes committed ✅
**Deployment**: Ready to deploy 🚀
**Next**: Connect GitHub → Deploy on Vercel → Set Env Vars → Test

