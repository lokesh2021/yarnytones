# Yarny Tones: handmade crochet shop

A no-build static website. Open `index.html` through any static host (or a local server), and it just works.

## Run it locally
```bash
cd ~/Desktop/yarnytones && python3 -m http.server 5173
```
Then open http://127.0.0.1:5173

## Things to change before going live ✏️
All in **`js/config.js`**:
- `whatsapp`: the real number (country code + number, digits only, e.g. `919812345678`). **Orders and custom requests are sent here.**
- `email`, `instagram`, `upiId`, `ownerName`, `city`
- `stats` and `rating`: replace with real numbers
- Shipping rules, gift-wrap and name-tag prices

In **`js/products.js`**:
- `YT_TESTIMONIALS` are placeholders. Swap in real customer reviews.
- Products, prices, stock and colourways all live here (instructions at the top of the file).

## Adding real photos
Put images in an `images/` folder and add to a product:
```js
photos: ["images/bunny-1.jpg", "images/bunny-2.jpg"],
```
Photos replace the drawn illustration. You can also set `photo: "images/bunny-lilac.jpg"` on each colourway.

## How ordering works
No payment gateway is needed. At checkout, the customer's order (items, total, address) opens in WhatsApp,
ready to send to you. You confirm, they pay by UPI/bank transfer. Custom Studio requests work the same way.

## Hosting (free)
Drag the folder onto https://app.netlify.com/drop, or push it to GitHub Pages / Vercel / Cloudflare Pages.
