# AdSense Setup Guide — Toolkit

The site is built **AdSense-ready**: ad placeholder slots are marked on every tool
page, and legal pages (About, Privacy, Contact, Terms) required for approval
already exist.

## What YOU need to do (10–15 min, on your phone)

### Step 1 — Create an AdSense account (free)
1. Go to **https://www.google.com/adsense** and sign in with your Google account.
2. Add your site URL (e.g. `https://toolkit.pages.dev` — your real URL after deploy).
3. Google gives you a small verification snippet OR asks you to verify via
   meta tag — follow their on-screen steps.

### Step 2 — Paste your Publisher ID into the site
1. In AdSense dashboard find your **Publisher ID**: looks like `ca-pub-1234567890123456`.
2. Open `index.html`, find the commented AdSense block in `<head>`,
   replace `ca-pub-XXXXXXXXXXXXXXXX` with your ID and **uncomment** the script tag.
3. (Optional) Turn on **Auto Ads** in AdSense dashboard — Google then places ads
   automatically on all pages. Easiest option.
4. (Optional) For manual placements: uncomment the marked ad-unit blocks on tool
   pages and paste the ad code AdSense gives you for each slot.

### Step 3 — Request review
1. In AdSense, click **"Request review"** / submit the site.
2. Google reviews in a few days to ~2 weeks. Requirements they check:
   - Original, useful content ✅ (6 real tools + guides + FAQ)
   - About / Contact / Privacy pages ✅ (included)
   - Site is live and navigable ✅ (after Cloudflare deploy)
   - No copied content, no policy violations ✅

### Step 4 — Earn
- After approval, ads appear automatically.
- Payment threshold: **$100** — Google pays to YOUR bank account (you add it in
  the AdSense dashboard; nobody else ever sees it).
- **Honest note:** earnings need visitors. Share tool pages on social media,
  WhatsApp groups, and let Google index the pages (submit sitemap in Search Console).

## Files
- `index.html` — AdSense script placeholder in `<head>` (commented)
- `tools/*.html` — `<!-- AdSense: ... -->` markers + visible "Advertisement" slots
- `about.html`, `contact.html`, `privacy.html`, `terms.html` — approval requirements
