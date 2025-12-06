## Project Overview (Non-technical)

This document explains, in plain language, what each important file and folder in this codebase does. It is written for people who are not programmers so you can understand where features live, what they do, and where to look when you want to change something or test a feature.

---

### At the top level

- `README.md` — A general project introduction and quick start notes. Think of this as the high-level instruction card for the whole project.
- `transparent-treats-main/` — The website (frontend) code. This is what users see in their browser.
- `backend/` — The server (backend) code. This is the part that stores data, handles login, and answers requests from the website.

---

### Frontend (what runs in the browser)

Files are under `transparent-treats-main/src/`.

- `App.tsx` — The site shell. It arranges the overall pages and navigation. If you want to add a new page or change the menu, this is where to look.
- `index.css`, `App.css` — Styling (colors, spacing, fonts). Small visual changes can be made here.
- `main.tsx` — The little starter that boots the web app. You usually don't need to edit this.

Key folders and files:

- `components/` — Small, reusable building blocks that the pages use (buttons, cards, forms, etc.).
  - `Nav.tsx` — The top navigation bar (logo, links, sign in/out). Change this to adjust the header.
  - `BarcodeScanner.tsx` — The camera/scanner component that can read barcodes or QR codes. It handles camera permissions, selecting the back camera, a flashlight toggle (if available), and a simple scanning overlay for better user feedback.
  - `IngredientCard.tsx`, `IngredientModal.tsx`, `ImpactScore.tsx` — Pieces used to show product details and ingredient explanations.

- `pages/` — Full pages a user navigates to.
  - `Index.tsx` — The homepage.
  - `Products.tsx` — The product list page.
  - `ProductDemo.tsx` — Shows one product's details.
  - `Scan.tsx` — The scanning page that uses the `BarcodeScanner` component, lets users manually enter a code, shows recent scans, and guides the user to product details or the submission form.
  - `SubmitProduct.tsx` — A form users use to send new product information to the backend. The form can be pre-filled when a scan finds no match.

- `services/api.ts` — The bridge between the website and the backend. It contains functions like "look up a product" or "submit a product." The app calls these functions instead of contacting the server directly. This file also provides fallback behavior: if the real server is not enabled, the app will use a small built-in dataset so the site still works for demos.

- `data/products.ts` — A sample dataset of products used when the real backend is not connected. Useful for demos and local use.

- `components/ui/` — A collection of small UI helpers (buttons, dialogs, inputs). These are styling wrappers around visual widgets so the rest of the app looks consistent.

---

### Backend (what runs on the server)

Files are under `backend/src/`.

- `index.ts` — The server starter. This sets up the web server and the main routes (the addresses where the website can ask questions).

Major folders inside `backend/src`:

- `routes/` — Each file here defines a group of related web endpoints (API addresses):
  - `auth.ts` — Login, register, and token refresh. This is where account sign-in is handled.
  - `products.ts` — Product-related operations: list products, look up by ID or barcode, submit a new product, and show user submissions.
  - `admin.ts` — Functions used by moderators/admins: list pending product submissions and approve or reject them.
  - `user.ts` — User-specific operations such as viewing a profile.

- `db/` — Database helpers and scripts.
  - `pool.ts` — Connects to the database.
  - `queries.ts` — Named operations to read and write users, products, submissions. For example, it contains the function that finds a product by barcode.
  - `migrate.ts`, `seed.ts` — Tools to set up the database structure and add sample data for testing.

- `schemas/` — Validation rules; they make sure the data sent to the server looks like the server expects (for example, when a user submits a product, the form includes the fields the server needs).

- `middleware/` — Code that runs before or after requests; for example, checking whether someone is logged in, limiting how often an endpoint can be used, or formatting error responses.

- `types/` — Where data shapes are defined so the server code knows that a "product" contains fields such as name, barcode, and ingredients.

Support files at the backend root:

- `Dockerfile` and `docker-compose.yml` — Files that make it easy to run the server and a local database together inside containers for development. If you prefer, you can run the server directly without Docker, but these files simplify local setup.
- `.env.example` — Shows recommended environment settings (like database address and secret keys). Copy this file to `.env` and update values to run locally.

---

### Developer & Test Helpers

- `msw` (Mock Service Worker) files and configuration — Used during development to simulate the server in the browser when the backend is not running.
- `package.json` files (both frontend and backend) — Contain the list of software packages used by each side of the app and useful commands such as "start the dev server" or "build the site".

---

### How the barcode/QR workflow works (user-facing)

1. A user opens the website and clicks the "Scan" page (`/scan`).
2. The browser asks for permission to use the camera. The scanner component tries to pick the back camera and shows a visible rectangle so users know where to aim.
3. When a barcode or QR code is detected, the website calls the backend to see if a matching product exists. If a product is found, the app shows the product details. If not, it offers a pre-filled submission form so the user can add the product (the `SubmitProduct` page).
4. If the device does not allow camera access or detection fails, the user can upload a photo of the barcode or type the code manually.

This flow is implemented by combining the scanner component (`BarcodeScanner.tsx`), the scan page (`Scan.tsx`), the submit page (`SubmitProduct.tsx`), and the backend lookup endpoint in `backend/src/routes/products.ts`.

---

### Where to look for common tasks (quick pointers)

- Change header menu text or links: edit `transparent-treats-main/src/components/Nav.tsx`.
- Modify the scanner UI or behavior: edit `transparent-treats-main/src/components/BarcodeScanner.tsx`.
- Change how products are looked up or saved: edit `transparent-treats-main/src/services/api.ts` (frontend) and `backend/src/db/queries.ts` + `backend/src/routes/products.ts` (backend).
- Add a new frontend page: create a new file in `transparent-treats-main/src/pages/` and add a route in `App.tsx`.
- Populate or reset sample data: run `backend/src/db/seed.ts` (there are scripts and Docker helpers provided to run this).

---

### Troubleshooting (non-technical)

- If the website shows no products or login fails, check whether the backend (server) is running. The frontend can use a built-in demo dataset if the server is not active, but some features (login, submissions) need the server.
- If the camera does not start on a phone, make sure the website is served over HTTPS (browsers require camera access for secure sites) and that the browser has permission to use the camera.
- If a scan is slow or not detecting: try good lighting, hold the device steadily, and make sure the barcode is fully visible inside the scanner rectangle.

---

If you'd like, I can also:

- Create a short user guide (screenshots + step-by-step) for non-technical testers on how to scan and submit a product.
- Produce a short video or animated GIF demonstrating the scan flow.

File location: `CODEBASE_OVERVIEW_NONTECH.md` (project root)
