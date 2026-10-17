/* ============================================================
   YARNY TONES — SHOP SETTINGS
   ------------------------------------------------------------
   This is the only file you need to touch to change contact
   details, prices for extras, shipping rules, etc.
   Anything marked  ✏️  is a placeholder — swap in the real thing!
   ============================================================ */

window.YT_CONFIG = {
  brand: "Yarny Tones",
  tagline: "Little loops of joy, hooked by hand.",

  // ✏️ WhatsApp number with country code, digits only (e.g. 91 + 10-digit number)
  whatsapp: "919929934802",
  // ✏️ Where order copies / custom requests can be emailed
  email: "hello@yarnytones.in",
  // ✏️ Instagram handle without the @
  instagram: "yarnytones",
  // ✏️ UPI ID for payments (shown at checkout + used for "Pay with UPI" link)
  upiId: "yarnytones@okaxis",
  // ✏️ Shown on the story section (leave "" to keep it anonymous)
  ownerName: "",
  city: "India",

  currency: "INR",
  locale: "en-IN",

  freeShippingOver: 1499, // orders at or above this ship free
  shippingFee: 99,
  giftWrapPrice: 49,
  nameTagPrice: 99,
  cashOnDelivery: false, // set true to offer COD at checkout

  // ✏️ Social proof shown on the homepage — keep these honest!
  stats: [
    { value: 1200, suffix: "+", label: "pieces hooked by hand" },
    { value: 48, suffix: "", label: "yarn colours on the shelf" },
    { value: 350, suffix: "+", label: "happy humans (and pets)" },
    { value: 0, suffix: "", label: "machines. ever." },
  ],
  rating: { score: 4.9, count: "350+" },

  // Fun extras — turn off if you prefer a calmer site
  yarnCursor: true, // the dangling yarn thread that follows the mouse
  preloader: true, // the "winding the yarn" intro (shows once per visit)
};
