# B@D FASHION ER.EXE

A mobile-friendly, retro-web prototype for B@D Fashion ER: a garment repair, alteration, redesign, and reuse intake experience.

## Features
- Retro desktop-window visual language with red accents
- Mobile-responsive layout
- One-question-at-a-time garment triage
- Preliminary price range based on simple rules
- Case summary for the customer to review
- Email draft generation using `mailto:`
- Optional photo selection (local only; no upload)

## Run locally
Open `index.html` in your browser. No build step or dependencies are required.

## Publish with GitHub Pages
1. Create a new GitHub repository, for example `fashion-er-exe`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under build/deployment, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub Pages to publish the site. The URL will appear in the Pages settings.

## Important prototype limitations
- This is a front-end demo. It does not save cases to a database or send data to B@D.
- The photo input does not upload images; customers must attach photos to the generated email manually.
- The price range is illustrative and must be calibrated against actual labor, materials, and business costs before public use.
- `mailto:` opens the visitor's configured email app. Replace the recipient with a real business email once you decide where cases should go.
- Do not collect sensitive personal information in this prototype.

## Suggested next development steps
1. Set the real business inbox and update the `mailto:` destination.
2. Test the questionnaire and estimates on mobile.
3. Add a real submission backend or trusted form service for photo uploads and case tracking.
4. Create a private admin case inbox and repair-history records.
5. Embed the experience into Shopify as a custom section or connect it through a suitable app/proxy.
