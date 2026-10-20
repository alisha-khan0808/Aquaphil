# Aquaphil Water Care — Android app

React Native (Expo SDK 58 + Expo Router) customer app built from the [PRD](docs/Aquaphil_Water_Care_PRD.md).
Requires **Node 22+**.

## Run

```bash
npm install
npx expo start          # scan the QR code with Expo Go on an Android phone
npx expo start --web    # quick preview in a browser
```

Demo login: any valid 10-digit Indian mobile number, OTP `1234`.

## Build an APK

```bash
npx eas-cli@latest build -p android --profile preview      # installable APK
npx eas-cli@latest build -p android --profile production   # Play Store .aab
```

## Screens (PRD "Key Screens Needed")

| PRD screen | Route |
| --- | --- |
| Splash | `src/app/index.tsx` |
| Onboarding | `src/app/onboarding.tsx` |
| Login / Signup / OTP | `src/app/login.tsx` |
| Home | `src/app/(tabs)/index.tsx` |
| Product Listing | `src/app/products/index.tsx` |
| Product Details | `src/app/products/[id].tsx` |
| Cart & Checkout | `src/app/cart.tsx`, `src/app/checkout.tsx`, `src/app/order-success.tsx` |
| Service Booking | `src/app/(tabs)/service.tsx` |
| My Orders | `src/app/(tabs)/orders.tsx`, `src/app/order/[id].tsx` |
| Track Service | `src/app/track/[id].tsx` |
| Chat | `src/app/(tabs)/chat.tsx` |
| Profile | `src/app/(tabs)/profile.tsx` (+ `amc`, `addresses`, `payments`, `about`, `notifications`) |

## What is mocked

There is no backend yet. Data lives in `src/data/mock.ts` and app state in
`src/store/AppContext.tsx` (persisted with AsyncStorage). Swap these for the Node.js API when ready:

- OTP verification (fixed demo OTP) → MSG91 / Gupshup
- Payment (simulated delay) → Razorpay / Cashfree SDK
- Support chat (canned replies) → Socket.IO
- Technician assignment / status changes → admin panel

Brand colours are in `src/theme.ts`.
