COFFEE SHOP - SINGLE QR UPDATE

This update changes the customer QR so the same QR can be used for:
1. Customer access: scanning the URL at /access/TOKEN signs the customer in
   and redirects to /customer/card.
2. Admin stamping: the admin scanner reads the same URL, extracts TOKEN,
   and opens /admin/verify for approval.

The QR uses the existing STAMP credential as the shared credential.
The Prisma schema does not need to change. Existing LOGIN credentials remain
accepted by /access/[token] so previously issued login QR links continue to work.

INSTALL:
1. Back up your project first.
2. Extract this ZIP into your project root, allowing it to replace the listed files.
3. Confirm APP_URL in your local .env and Vercel environment variables is the
   public HTTPS base URL of your deployed app, without a trailing slash.
   Example: https://your-coffee-app.vercel.app
4. Keep SESSION_PASSWORD unchanged and at least 32 characters long.
5. Run:
     npx prisma generate
     npm run build
6. Restart the dev server or redeploy to Vercel.

No database migration is required for these code changes.

IMPORTANT:
- The QR is a bearer credential. Anyone who obtains a copy can open that
  customer's loyalty card. Do not post customer QR codes publicly.
- The customer does not need to type a password when scanning this QR.
- Admin authentication is still required to approve a stamp.
- For iPhone camera scanning, the QR must contain a reachable HTTPS URL.
  Do not use localhost in APP_URL for a phone outside the computer.
