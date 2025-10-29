# 🚀 Vercel Deployment Guide for AthLink

## Prerequisites
- GitHub repository with your code
- Vercel account
- Supabase project configured
- Environment variables ready

## Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

## Step 2: Configure Environment Variables
Add these in Vercel Dashboard > Settings > Environment Variables:

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
```

## Step 3: Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Step 5: Custom Domain (Optional)
1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Troubleshooting
- Check build logs for errors
- Verify all environment variables are set
- Ensure database is accessible
- Check NextAuth configuration
