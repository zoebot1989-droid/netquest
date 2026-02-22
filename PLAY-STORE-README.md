# NetQuest — Play Store Build Guide

## Prerequisites
- Node.js 18+
- Android Studio (with SDK 33+)
- Java 17+

## Setup (one-time)

```bash
# Install Capacitor (already done)
npm install @capacitor/core @capacitor/cli

# Add Android platform
npx cap add android
```

## Building the APK

```bash
# 1. Build the Next.js static export
npm run build

# 2. Sync web assets to Android project
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Choose AAB (Android App Bundle) for Play Store
3. Create or use existing keystore
4. Build release

## Quick Build (combined)

```bash
npm run build:android
npx cap open android
```

## App Configuration

- **App ID:** `com.netquest.app`
- **App Name:** NetQuest
- **Web Dir:** `out/` (Next.js static export)
- **Min SDK:** 22 (Android 5.1+)
- **Target SDK:** 34

## Icons

Current icons are SVG placeholders. Before Play Store submission:
1. Design proper PNG icons (192x192 and 512x512)
2. Place in `android/app/src/main/res/mipmap-*` directories
3. Use Android Studio's Image Asset Studio for all densities

## Play Store Submission

See `marketing/play-store-listing.md` for:
- App description (short + long)
- Screenshot descriptions
- Feature graphic specs
- Privacy policy template

## Future: Google Play Billing

The current subscription system uses localStorage (for testing).
To integrate real payments:
1. `npm install @capgo/capacitor-purchases` (or RevenueCat)
2. Set up products in Google Play Console
3. Replace `src/lib/subscription.ts` localStorage calls with billing API
