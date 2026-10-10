# Redline Outdoor & Power — Website Files

This is a complete static website built around the actual product photos supplied in your ZIP file. It uses HTML, CSS and JavaScript and can be opened locally or published using GitHub Pages.

## What's included

- `index.html` — website layout and content
- `styles.css` — responsive bright coral-red, sunshine-yellow, sky-blue and mint design
- `app.js` — search, category filters, photo galleries, mobile menu and WhatsApp links
- `products.js` — editable product names, categories, descriptions, photo IDs and optional variants
- `site-config.js` — business name, WhatsApp number, display phone and address links
- `assets/images/` — optimized copies of the supplied product photographs used by the website
- `image-index.csv` — mapping of each photo number to its original filename in the uploaded ZIP

The uploaded ZIP had 122 photo entries, including 3 exact duplicate files. The website uses the 119 distinct photos once or more in product galleries. Exact duplicate copies are not repeated in the website assets. Pictures were resized to a maximum 1600 px on their longest side and saved as optimized JPEGs for faster loading.

## Open the website on your computer

1. Extract `Redline_Outdoor_Power_Website.zip` into a folder.
2. Open the extracted folder.
3. Double-click `index.html`. Chrome, Edge, Firefox and other current browsers should open it.
4. Keep the `assets` folder next to `index.html`; do not move or rename the image files unless you also update the product photo IDs.

Some fonts are loaded from Google Fonts when internet access is available. If offline, the website uses system fallback fonts.

## Change the WhatsApp number or business details

Open `site-config.js` in Notepad or a code editor. Update these fields:

```js
businessName: 'Redline Outdoor & Power',
whatsappNumber: '27710331241',
displayPhone: '071 033 1241',
address: '58 Peter Place, Lyme Park, Sandton, Johannesburg, 2091, South Africa',
```

For `whatsappNumber`, use the country code and number only (no `+`, spaces or leading domestic zero). For example, South Africa number `071 033 1241` becomes `27710331241`.

**Number note:** the instructions supplied with the request mention both `0710331241` and `0638862322`. The site is set to `071 033 1241`, following the explicit WhatsApp ordering section and its supplied `wa.me` link. If the intended number is `063 886 2322`, change `whatsappNumber` to `27638862322` and `displayPhone` to `063 886 2322` in `site-config.js` before publishing.

The directions link is in `site-config.js` under `mapUrl` and can also be changed if the address changes.

## Edit products

Open `products.js`. Each product looks like this:

```js
{
  "id": "example-product",
  "name": "Example Product",
  "category": "Camping & Tents",
  "images": [27, 28],
  "description": "Short description based only on confirmed information.",
  "featured": true,
  "colours": ["Colours shown in photos"]
}
```

- `name`: shown as the product heading and used in the WhatsApp pre-filled message.
- `category`: used for the category filters. Products with the same category text appear under the same filter.
- `images`: photo numbers from `image-index.csv`. A number like `27` uses `assets/images/photo-027.jpg`. Product galleries can contain one or more image numbers.
- `description`: edit to add confirmed facts only.
- `featured`: set to `true` to put it near the top when “Featured first” is selected.
- `colours`: optional list of colours/variants that are actually shown or confirmed.

Price fields were not included because there were no confirmed product prices in the supplied information. Each card therefore says “Price on enquiry”. Update the catalogue after confirming prices and other specifications with your supplier.

## Publish free with GitHub Pages

1. Sign in or create an account at [GitHub](https://github.com/).
2. Create a new **public repository**, for example `redline-outdoor-power`.
3. Extract the website ZIP on your computer.
4. In the new GitHub repository, choose **Add file → Upload files** and upload everything *inside* the extracted website folder, including `index.html`, `styles.css`, `app.js`, `products.js`, `site-config.js`, `image-index.csv`, and the `assets` folder.
5. Commit the uploaded files to the repository's main branch.
6. Go to **Settings → Pages**.
7. Under build and deployment, choose **Deploy from a branch**; select branch `main` and folder `/ (root)`, then save.
8. Wait for GitHub Pages to publish, then open the site URL shown on the Pages settings screen. Publishing can take a few minutes.
9. Test the site on a phone and computer. Try search/category filters and click a product's WhatsApp button to confirm it opens the correct conversation.

GitHub may change its labels over time; use the Pages settings page for the current repository publishing options. You do not need a shopping-cart plugin or paid checkout for this WhatsApp enquiry flow.

## Important before publishing

- Confirm which WhatsApp number is correct; two numbers were included in the brief (see above).
- Confirm the business name is the one you want to use publicly.
- No walk-in service is claimed. The website asks customers to contact you before visiting.
- Product prices, stock, dimensions, technical specifications, certifications and delivery terms are not invented; ask customers to confirm details through WhatsApp.
