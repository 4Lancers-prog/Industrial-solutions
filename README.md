# Industrial Solutions - Website (React + Node/Express + MongoDB)

Two pages: **Home** (`/`: hero video, equipment cards, product catalogue, videos, gallery, process timeline, enquiry form) and **About** (`/about`: who we are, services, why choose us, industries, FAQ, contact).

## Run it (Node 18+ required)
```bash
# 1. install
npm run install:all

# 2. configure the backend
cp server/.env.example server/.env      # then edit MONGODB_URI and ADMIN_TOKEN

# 3. start MongoDB (local) or use a MongoDB Atlas connection string in MONGODB_URI

# 4. two terminals
npm run dev:server     # API on http://localhost:5000
npm run dev:client     # site on http://localhost:5173
```
Open http://localhost:5173. Enquiries submitted in the form on the Home page (`/#enquiry`) are saved in MongoDB (collection `enquiries`).

Read saved enquiries:
```bash
curl -H "x-admin-token: YOUR_ADMIN_TOKEN" http://localhost:5000/api/enquiries
```

## Production
```bash
npm run build     # builds client/dist
npm start         # Express serves the API and the built site on one port
```
Set `CLIENT_ORIGIN` (server) and `VITE_SITE_URL` (client) to the real domain.

## What the client edits
| Change | File |
|---|---|
| Phone, email, address, WhatsApp number, map link | `client/src/config/site.js` |
| Products, categories, photos, gallery | `client/src/data/products.js` |
| Services, process steps, industries, why-us | `client/src/data/services.js` |
| FAQ | `client/src/data/faq.js` |
| Colours | `:root` in `client/src/styles.css` |
| Photos (WebP) | `client/public/images/` |
| Videos and their poster images | `client/public/videos/` (used in `HeroSection.jsx` and `VideoShowcase.jsx`) |
| Fonts (Sora for headings, Plus Jakarta Sans for text) | `client/index.html` and `--font`, `--font-head` in `styles.css` |

## Honesty rules built in
- No invented specs, prices, certifications or clients. Cards show "Specifications available on request".
- The enquiry form shows "received" only after the server confirms it saved the enquiry. If the server is unreachable it shows an error and offers WhatsApp.
- "Send via WhatsApp" opens a prefilled chat to 918951272366; every product card has its own prefilled WhatsApp link.

## Photos intentionally not used as product photos
- `WhatsApp_Image..._7_20_28_PM.jpeg` ("Hydraulic Trainer System Model HTR-200") carries an AI-generator watermark, so it is not a real product photo and the model number is not verified.
- `WhatsApp_Image..._9_39_23_PM.jpeg` is a small catalogue-style image whose origin is unclear.
- `WhatsApp_Image..._9_36_24_PM.jpeg` (Industrial Solutions flyer) uses generic imagery. Its QR code was not verified, so it is not reproduced.
- The two different videos you sent (the third is a duplicate) ARE now on the Home page, compressed for web (about 5-6 MB each; they only download when played, and the short hero preview loop is about 1 MB).
Use any of these only if the client confirms they are genuine and approved.

## Animations
Hero entrance, drifting grid and glow, scrolling category strip, scroll progress bar, staggered card reveals, animated process line, hover effects. All switch off automatically for visitors who enable "reduce motion" in their device settings.

## Colour palette
| Use | Colour |
|---|---|
| Backgrounds, headings, header, footer | Navy `#0B1F33` |
| Buttons, active menu item, highlights | Teal `#16B8A6` (text on it: `#06222A`) |
| Links and small accents | Blue `#155EEF` |
| Light sections | `#F4F7FA` |
| Body text / muted text | `#172B3A` / `#64748B` |
| Glow effects in the dark timeline and orb sections only | Amber `#FF9A4D` |
Change them in `client/src/styles.css` (`:root`).

## Notes
- Menu: Home, About Us, Services, Works (plus the Request a Quote button). Edit in `client/src/config/site.js` (`NAV_LINKS`).
- Pictures are shown at their own real size; they are never stretched larger than the photo.
