# FloodWatch Hyderabad

A React, TypeScript, and Vite community flood-reporting interface.

## Run locally

```sh
npm ci
npm run dev
```

For Firebase Authentication, copy `.env.example` to `.env.local` and fill in the
Firebase web app configuration. Firebase web configuration is used by the
browser; never put service-account credentials in a `VITE_*` variable or commit
them. Without Firebase configuration, the app uses local demo data and browser
storage, which is not shared between users.

## Publish through GitHub Actions to Firebase Hosting

The workflow at `.github/workflows/firebase-hosting.yml` builds the Vite app and
deploys the `dist` directory to the live Firebase Hosting channel whenever a
commit is pushed to `main`. It also supports manual runs from the GitHub Actions
tab.

1. The repository is configured for Firebase project `floodwatch-48b3a`.
   Register a Web app in that project's settings if you have not already.
2. In Firebase Authentication, enable the Email/Password provider.
3. Create or connect a GitHub repository, push this project to its `main`
   branch, and enable GitHub Actions for the repository.
4. Add these repository **Actions secrets** under **Settings → Secrets and
   variables → Actions**:

   - `FIREBASE_PROJECT_ID` — Firebase project ID.
   - `FIREBASE_SERVICE_ACCOUNT` — JSON for a service account authorized to
     deploy Firebase Hosting. Keep this private; never commit it or paste it
     into source files.
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

   The `VITE_FIREBASE_*` values are the web app configuration shown in Firebase
   project settings. They are compiled into the client bundle, so configure
   Firebase Security Rules and API-key restrictions appropriately; they are not
   a place for private credentials.

5. Push a commit to `main` or run **Build and deploy to Firebase Hosting**
   manually. The workflow fails before deployment if any required secret is
   missing.
6. In Firebase Console → Hosting, find the live site URL. Add that domain to
   Firebase Authentication's authorized domains.

Firebase Hosting serves the frontend and rewrites app routes to `index.html`.
The current report list and comments use browser-local storage; Firestore,
Storage uploads, and cross-user real-time synchronization are not wired up yet.
Publishing this frontend alone does not enable those backend features.
