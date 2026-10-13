# Rojul Tot Frontend

React and Vite frontend for the Rojul Tot construction machinery, drawings, projects, and related services platform.

## Live deployment

- **Live website:** https://rojul-tot-frontend.vercel.app/
- **Backend API:** https://web-production-c75a0.up.railway.app/
- **Frontend hosting:** Vercel
- **Backend hosting:** Railway
- **Image/document storage:** Supabase Storage

## Technology

- React
- Vite
- JavaScript (confirm exact language and dependencies in `package.json`)

## Local setup

Run commands from the frontend directory containing `package.json`.

### 1. Install Node.js

Install a supported Node.js LTS version if needed.

### 2. Install packages

```bash
npm install
```

### 3. Configure the API URL

Check the source code for the exact environment variable used for the API base URL. Vite client-side variables normally start with `VITE_`.

If the source uses `VITE_API_URL`, create `.env.local`:

```dotenv
VITE_API_URL=https://web-production-c75a0.up.railway.app
```

Use the variable name your code actually reads. Restart Vite after changing local environment variables.

**Never put `SUPABASE_SERVICE_ROLE_KEY` or other private secrets in frontend variables.** `VITE_` variables are visible to browser visitors.

### 4. Start the development server

```bash
npm run dev
```

Vite prints the local URL, commonly `http://localhost:5173/`.

### 5. Build and preview

```bash
npm run build
npm run preview
```

Use the scripts defined in `package.json` if they differ.

## Backend connection

API base URL:
```text
https://web-production-c75a0.up.railway.app
```

Confirmed public endpoints:
- `GET /api/machinery/public/`
- `GET /api/drawings/public/`

Other routes may require authentication. Handle missing/expired credentials separately from server errors.

## Supabase images and documents

Buckets used by the backend:

- `machinery-images` — public
- `project-images` — public
- `drawing-previews` — public
- `profile-images` — public
- `drawing-files` — private

Use image/preview fields returned by the API. If an image fails, open the exact URL returned by the API and verify bucket, folder, filename, and access settings. `2_bedroom.jpg` and `2 bedroom.jpg` are different object names.

Do not construct public URLs for private drawing documents. Use the backend's authenticated purchase/download flow.

## Deploying to Vercel

1. Push frontend changes to the repository connected to Vercel.
2. Configure the API URL variable expected by the source code (for example, `VITE_API_URL`).
3. Apply it to the required Vercel environments.
4. Redeploy after changing environment variables.
5. Test machinery, drawings, projects, authentication, and other important workflows.

Do not add backend service-role keys to Vercel frontend variables.

## Troubleshooting

- **API data missing:** Check browser console/Network tab, API base URL, route, authentication, and Railway status.
- **Image missing:** Open the exact URL returned by the API; check `404`, `403`, filename, folder, and bucket access.
- **Environment variable change has no effect:** Confirm the source uses that exact variable name, restart Vite, or redeploy Vercel.
- **Build error:** Run `npm install` and `npm run build`, then inspect the first meaningful error.

## Before committing

- Keep `.env.local` and secrets out of Git.
- Never commit service-role keys, tokens, or payment secrets.
- Run `npm run build` before deploying.
- Test the production website after deployment.


## Screenshots

The screenshots below show the live Rojul Tot frontend interface.

### Home page
<img width="950" height="418" alt="image" src="https://github.com/user-attachments/assets/a4a97d93-42d1-4e06-be67-591cf7e45f29" />

### Machinery listings
<img width="957" height="350" alt="image" src="https://github.com/user-attachments/assets/0d9e81e0-c702-43a1-acfe-f1d3882b2f6e" />


### Drawings
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/5e1dffc6-4987-4e5e-ae75-62fff9ed248a" />

### Projects
<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/b2249100-ec99-455f-89ca-0e84ded038e2" />


### Contact
<img width="957" height="414" alt="image" src="https://github.com/user-attachments/assets/452d7549-95cc-4fb7-947c-5feb9674b1fd" />



---

## Author and maintainer

- **Name:** Japheth Kiprono
- **Email:** japhethkiprono2020@gmail.com
- **GitHub:** https://github.com/Jblue254/
- **Live frontend:** https://rojul-tot-frontend.vercel.app/
- **Live backend:** https://web-production-c75a0.up.railway.app/

## MIT License

Copyright (c) 2026 Japheth Kiprono
