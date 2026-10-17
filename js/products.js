/* ============================================================
   YARNEY TONES — CATALOGUE
   ------------------------------------------------------------
   HOW TO ADD A PRODUCT
   Copy one of the blocks below and change the values.

   id        unique, url-friendly (used in the link: #/product/<id>)
   art       which illustration to draw (see list in js/art.js), OR
   photos    ["images/my-photo.jpg", ...] — real photos replace the drawing
   stock     "ready"  → in stock, ships fast (set `qty` for "only N left")
             "made"   → made to order (set `days` for how long it takes)
   colorways each one recolours the drawing. c1 = main, c2 = accent, c3 = detail.
             If you use photos, you can add `photo: "images/x.jpg"` per colorway.
   ============================================================ */

window.YT_CATEGORIES = [
  { id: "amigurumi", name: "Amigurumi Pals", blurb: "Squishy friends with tiny faces", art: "bear", bg: "#F9E1D8", colors: { c1: "#C99872", c2: "#F3DCC2", c3: "#E8837B" } },
  { id: "flowers", name: "Forever Flowers", blurb: "Bouquets that never wilt", art: "tulips", bg: "#E5EEDC", colors: { c1: "#F2A7B8", c2: "#EADBC4", c3: "#E8837B" } },
  { id: "wearables", name: "Wearables", blurb: "Hats, beanies & cosy things", art: "beanie", bg: "#E3EAF4", colors: { c1: "#A9CFE0", c2: "#4F6D9A", c3: "#FBF3E6" } },
  { id: "bags", name: "Bags & Totes", blurb: "Granny squares, carried proudly", art: "tote", bg: "#FBEBC8", colors: { c1: "#FBF3E6", c2: "#EDA93F", c3: "#E8837B" } },
  { id: "home", name: "Home Bits", blurb: "Coasters, plant pals & more", art: "coasters", bg: "#EFE4F6", colors: { c1: "#FFFFFF", c2: "#F6D27A", c3: "#C9B6E4" } },
  { id: "tiny", name: "Tiny Things", blurb: "Keychains & pocket joy", art: "strawberry", bg: "#FCE0E0", colors: { c1: "#E5534B", c2: "#7FA67A", c3: "#FFF3C4" } },
];

/* Yarn shelf — used by the Custom Studio colour picker */
window.YT_YARNS = [
  { name: "Marshmallow", hex: "#FBF3E6" },
  { name: "Oat Milk", hex: "#EADBC4" },
  { name: "Peach Fizz", hex: "#F7B79B" },
  { name: "Blush", hex: "#F4C2C2" },
  { name: "Rosewater", hex: "#E8837B" },
  { name: "Cherry", hex: "#D9534F" },
  { name: "Butter", hex: "#F6D27A" },
  { name: "Marigold", hex: "#EDA93F" },
  { name: "Pistachio", hex: "#C5DDA0" },
  { name: "Sage", hex: "#9DB59A" },
  { name: "Forest", hex: "#4E7A5A" },
  { name: "Baby Blue", hex: "#A9CFE0" },
  { name: "Denim", hex: "#4F6D9A" },
  { name: "Lavender", hex: "#C9B6E4" },
  { name: "Plum", hex: "#7A4F7E" },
  { name: "Cocoa", hex: "#7B5543" },
  { name: "Caramel", hex: "#C99872" },
  { name: "Charcoal", hex: "#45404A" },
];

window.YT_PRODUCTS = [
  {
    id: "bun-bun-bunny",
    name: "Bun-Bun the Bunny",
    category: "amigurumi",
    art: "bunny",
    price: 1299,
    compareAt: 1499,
    stock: "ready",
    qty: 3,
    badge: "Bestseller",
    bg: "#FBE3DE",
    rating: 5,
    reviews: 64,
    nameTag: true,
    short: "A floppy-eared cuddle buddy in a tiny dress, with a bow she refuses to take off.",
    description:
      "Bun-Bun is hooked round by round in soft milk-cotton yarn, stuffed till perfectly squishy, and finished with hand-embroidered cheeks. Her ears are just floppy enough for nervous fiddling. Makes a dreamy baby-shower gift or desk companion.",
    details: ["Approx. 22 cm tall (ears up!)", "100% milk-cotton yarn, hypoallergenic fibrefill", "Safety-stitched eyes — no small parts"],
    colorways: [
      { name: "Cream Puff", c1: "#F6EBDD", c2: "#F2B5AE", c3: "#E8837B" },
      { name: "Lilac Dream", c1: "#EDE5F7", c2: "#C9B6E4", c3: "#7A4F7E" },
      { name: "Mint Choc", c1: "#DCEBDA", c2: "#8C6A55", c3: "#F4C2C2" },
      { name: "Cocoa Bean", c1: "#C99872", c2: "#FBF3E6", c3: "#E8837B" },
    ],
  },
  {
    id: "honey-bear",
    name: "Honey the Bear",
    category: "amigurumi",
    art: "bear",
    price: 1499,
    stock: "made",
    days: "5–7",
    badge: "Made for you",
    bg: "#F7E7D3",
    rating: 5,
    reviews: 41,
    nameTag: true,
    short: "A chunky little bear with a scarf, made to order in your colours.",
    description:
      "Honey is the bear who'll sit through every movie night, exam season and long-distance call. Each one is made to order, so tell us the scarf colour and we'll hook it just for you.",
    details: ["Approx. 20 cm tall", "Soft acrylic-cotton blend", "Made to order — your bear starts the day you order"],
    colorways: [
      { name: "Honey", c1: "#C99872", c2: "#F3DCC2", c3: "#E8837B" },
      { name: "Panda-ish", c1: "#F7F2EA", c2: "#45404A", c3: "#9DB59A" },
      { name: "Strawberry Milk", c1: "#F4C2C2", c2: "#FBF3E6", c3: "#7A4F7E" },
      { name: "Midnight", c1: "#5D5566", c2: "#C9B6E4", c3: "#F6D27A" },
    ],
  },
  {
    id: "forever-tulips",
    name: "Forever Tulips",
    category: "flowers",
    art: "tulips",
    price: 1199,
    stock: "ready",
    qty: 6,
    badge: "Gifting fave",
    bg: "#EAF0E0",
    rating: 5,
    reviews: 88,
    short: "Three tulips that will never wilt, droop, or need water. Ever.",
    description:
      "A bouquet for the person who forgets to water plants (we see you). Three hand-crocheted tulips with wired stems you can bend, wrapped in kraft paper and tied with a ribbon.",
    details: ["3 stems, approx. 32 cm tall", "Bendable wired stems", "Comes wrapped & ready to gift"],
    colorways: [
      { name: "Pink Lemonade", c1: "#F2A7B8", c2: "#EADBC4", c3: "#E8837B" },
      { name: "Sunshine", c1: "#F6D27A", c2: "#F7E9D7", c3: "#EDA93F" },
      { name: "Lavender Fields", c1: "#C9B6E4", c2: "#E8E1D5", c3: "#7A4F7E" },
      { name: "Classic Red", c1: "#D9534F", c2: "#EADBC4", c3: "#45404A" },
    ],
  },
  {
    id: "sunny-in-a-pot",
    name: "Sunny in a Pot",
    category: "flowers",
    art: "sunflower",
    price: 649,
    stock: "ready",
    qty: 8,
    badge: "New",
    bg: "#FDF0CC",
    rating: 5,
    reviews: 23,
    short: "A grinning sunflower in a tiny terracotta pot. Instant good mood.",
    description:
      "Sunny lives on desks, windowsills and bedside tables, and grins at everyone who walks past. The pot is crocheted too, filled so it stands up all on its own.",
    details: ["Approx. 18 cm tall", "Pot is weighted to stand upright", "Cotton yarn, wired stem"],
    colorways: [
      { name: "Classic", c1: "#F6C445", c2: "#8C6A55", c3: "#D9825B" },
      { name: "Pink Sun", c1: "#F4A6B7", c2: "#7A4F7E", c3: "#F7E9D7" },
      { name: "Moonflower", c1: "#FBF3E6", c2: "#F6D27A", c3: "#9DB59A" },
    ],
  },
  {
    id: "granny-square-tote",
    name: "Granny Square Tote",
    category: "bags",
    art: "tote",
    price: 1899,
    stock: "made",
    days: "7–10",
    badge: "Made for you",
    bg: "#FBEFD5",
    rating: 5,
    reviews: 37,
    short: "A roomy tote stitched from granny squares, lined so nothing slips through.",
    description:
      "Big enough for a laptop, a book, snacks and a spare hair clip. Every square is stitched separately and joined by hand, with a fabric lining inside and sturdy double-stitched handles.",
    details: ["Approx. 36 × 38 cm", "Fabric lined with inner pocket", "Holds up to 5 kg"],
    colorways: [
      { name: "Marigold", c1: "#FBF3E6", c2: "#EDA93F", c3: "#E8837B" },
      { name: "Garden Party", c1: "#FBF3E6", c2: "#9DB59A", c3: "#F4A6B7" },
      { name: "Blue Hour", c1: "#F2EEE6", c2: "#4F6D9A", c3: "#A9CFE0" },
      { name: "Retro", c1: "#45404A", c2: "#F6D27A", c3: "#E8837B" },
    ],
  },
  {
    id: "cloud-bucket-hat",
    name: "Cloud Bucket Hat",
    category: "wearables",
    art: "bucket",
    price: 1099,
    stock: "ready",
    qty: 2,
    badge: "Only 2 left",
    bg: "#E2EEF4",
    rating: 5,
    reviews: 29,
    short: "A slouchy bucket hat with a little daisy patch. Very main-character.",
    description:
      "Light, breathable cotton bucket hat that keeps its shape. Wear it brim-down for picnics or flipped up for concerts. The little daisy is hand-sewn on.",
    details: ["Fits head 54–58 cm", "Breathable cotton", "Hand wash, dry flat"],
    colorways: [
      { name: "Sky", c1: "#A9CFE0", c2: "#FBF3E6", c3: "#4F6D9A" },
      { name: "Matcha", c1: "#C5DDA0", c2: "#FBF3E6", c3: "#4E7A5A" },
      { name: "Strawberry", c1: "#F4C2C2", c2: "#FBF3E6", c3: "#D9534F" },
    ],
  },
  {
    id: "pom-pom-beanie",
    name: "Pom Pom Beanie",
    category: "wearables",
    art: "beanie",
    price: 999,
    stock: "made",
    days: "4–6",
    badge: "",
    bg: "#E9E4F3",
    rating: 5,
    reviews: 52,
    nameTag: true,
    short: "A ribbed beanie topped with an obnoxiously big pom pom.",
    description:
      "Thick, stretchy ribbing, a fold-over cuff, and a pom pom big enough to be seen from space. Made to order in your size and colours, perfect for hill-station trips.",
    details: ["Adult & kids sizes", "Wool-blend for warmth", "Detachable pom pom"],
    colorways: [
      { name: "Berry", c1: "#7A4F7E", c2: "#C9B6E4", c3: "#F4C2C2" },
      { name: "Fresh Snow", c1: "#FBF3E6", c2: "#EADBC4", c3: "#A9CFE0" },
      { name: "Pumpkin Spice", c1: "#D9825B", c2: "#7B5543", c3: "#F6D27A" },
      { name: "Ocean", c1: "#A9CFE0", c2: "#4F6D9A", c3: "#FBF3E6" },
    ],
  },
  {
    id: "daisy-coasters",
    name: "Daisy Coaster Set",
    category: "home",
    art: "coasters",
    price: 599,
    stock: "ready",
    qty: 10,
    badge: "",
    bg: "#F1E8F6",
    rating: 4.9,
    reviews: 71,
    short: "A set of 4 daisy coasters that make your chai look prettier.",
    description:
      "Thick, absorbent cotton coasters shaped like daisies. Set of four in one colourway. Your coffee table will thank you, and so will your mum.",
    details: ["Set of 4, approx. 11 cm wide", "Thick, absorbent cotton", "Machine washable on gentle"],
    colorways: [
      { name: "Lilac Daisy", c1: "#FFFFFF", c2: "#F6D27A", c3: "#C9B6E4" },
      { name: "Sage Daisy", c1: "#FFFFFF", c2: "#F6D27A", c3: "#9DB59A" },
      { name: "Peach Daisy", c1: "#FFFFFF", c2: "#EDA93F", c3: "#F7B79B" },
    ],
  },
  {
    id: "prickly-pal",
    name: "Prickly Pal Cactus",
    category: "home",
    art: "cactus",
    price: 699,
    stock: "ready",
    qty: 5,
    badge: "",
    bg: "#E4EFDF",
    rating: 5,
    reviews: 33,
    short: "The only cactus that's safe to hug. Comes with a flower crown.",
    description:
      "A plant that thrives on zero sunlight and zero water. Prickly Pal comes in a crocheted pot with a little flower on top and a very smug smile.",
    details: ["Approx. 16 cm tall", "Weighted pot", "No watering required (please don't)"],
    colorways: [
      { name: "Classic Green", c1: "#7FA67A", c2: "#D9825B", c3: "#F4A6B7" },
      { name: "Minty", c1: "#B5D8C3", c2: "#FBF3E6", c3: "#F6D27A" },
      { name: "Desert Night", c1: "#4E7A5A", c2: "#45404A", c3: "#E8837B" },
    ],
  },
  {
    id: "ollie-octopus",
    name: "Ollie the Octopus",
    category: "amigurumi",
    art: "octopus",
    price: 899,
    stock: "ready",
    qty: 4,
    badge: "",
    bg: "#E1EEF5",
    rating: 5,
    reviews: 46,
    nameTag: true,
    short: "Eight curly arms, one flower, and a whole lot of personality.",
    description:
      "Ollie's curly tentacles are perfect for little hands to grab. Gentle on skin and safe for babies, he's a favourite for new parents and anyone who needs a squeeze.",
    details: ["Approx. 14 cm wide", "Baby-safe embroidered eyes", "Milk-cotton yarn"],
    colorways: [
      { name: "Lagoon", c1: "#A9CFE0", c2: "#FBF3E6", c3: "#F4A6B7" },
      { name: "Coral", c1: "#F7B79B", c2: "#FBF3E6", c3: "#F6D27A" },
      { name: "Grape", c1: "#C9B6E4", c2: "#FBF3E6", c3: "#9DB59A" },
    ],
  },
  {
    id: "toadstool-keychain",
    name: "Toadstool Keychain",
    category: "tiny",
    art: "mushroom",
    price: 299,
    stock: "ready",
    qty: 15,
    badge: "",
    bg: "#FBE2DC",
    rating: 5,
    reviews: 112,
    short: "A tiny forest friend for your keys, bag or pencil case.",
    description:
      "A happy little toadstool on a sturdy keyring. Small enough for a pocket, cute enough to get you compliments at the metro station.",
    details: ["Approx. 6 cm (without ring)", "Metal keyring", "Cotton yarn"],
    colorways: [
      { name: "Fly Agaric", c1: "#D9534F", c2: "#FBF3E6", c3: "#FFFFFF" },
      { name: "Lavender Cap", c1: "#C9B6E4", c2: "#FBF3E6", c3: "#FFFFFF" },
      { name: "Butterscotch", c1: "#EDA93F", c2: "#FBF3E6", c3: "#FFF7E0" },
    ],
  },
  {
    id: "strawberry-keychain",
    name: "Strawberry Keychain",
    category: "tiny",
    art: "strawberry",
    price: 249,
    stock: "ready",
    qty: 20,
    badge: "Under ₹300",
    bg: "#FCE3E1",
    rating: 5,
    reviews: 97,
    short: "A berry sweet bag charm. Seeds stitched on one by one.",
    description:
      "We embroider every seed by hand, so yes, we've counted them. Clip it on your bag, your keys or your bestie's birthday gift.",
    details: ["Approx. 5 cm (without ring)", "Metal keyring", "Cotton yarn"],
    colorways: [
      { name: "Strawberry", c1: "#E5534B", c2: "#7FA67A", c3: "#FFF3C4" },
      { name: "Strawberry Milk", c1: "#F4A6B7", c2: "#9DB59A", c3: "#FFFFFF" },
      { name: "Golden Berry", c1: "#F6D27A", c2: "#7FA67A", c3: "#FFFFFF" },
    ],
  },
];

/* What people can ask for in the Custom Studio */
window.YT_CUSTOM_TYPES = [
  { id: "amigurumi", name: "Amigurumi pal", desc: "Bears, bunnies, pets, you!", art: "bear", min: 899, max: 2199, days: "5–8 days" },
  { id: "flowers", name: "Forever flowers", desc: "Bouquets & single stems", art: "tulips", min: 449, max: 1999, days: "4–7 days" },
  { id: "wearable", name: "Something to wear", desc: "Beanies, hats, tops", art: "beanie", min: 899, max: 2999, days: "6–10 days" },
  { id: "bag", name: "A bag or tote", desc: "Totes, pouches, sling bags", art: "tote", min: 1199, max: 3299, days: "7–12 days" },
  { id: "home", name: "Home & decor", desc: "Coasters, plant pals, garlands", art: "coasters", min: 399, max: 1799, days: "4–8 days" },
  { id: "surprise", name: "Something else", desc: "Dream big, we'll figure it out", art: "yarn", min: 299, max: 3499, days: "We'll let you know" },
];

/* ✏️ Placeholder reviews — please replace with real ones from your customers! */
window.YT_TESTIMONIALS = [
  { text: "I ordered a custom bunny for my niece's first birthday and I'm not exaggerating when I say she hasn't let go of it since.", name: "Priya", place: "Bengaluru", item: "Custom bunny", art: "bunny", bg: "#FBE3DE", colors: { c1: "#F6EBDD", c2: "#F2B5AE", c3: "#E8837B" } },
  { text: "The tulips are still sitting on my desk looking brand new. Best anniversary gift. My partner cried. I cried.", name: "Rohan", place: "Pune", item: "Forever Tulips", art: "tulips", bg: "#EAF0E0", colors: { c1: "#F2A7B8", c2: "#EADBC4", c3: "#E8837B" } },
  { text: "The tote is so well made, and she even sent progress pictures on WhatsApp while making it. Such a sweet experience.", name: "Aisha", place: "Mumbai", item: "Granny Square Tote", art: "tote", bg: "#FBEFD5", colors: { c1: "#FBF3E6", c2: "#9DB59A", c3: "#F4A6B7" } },
  { text: "Got four strawberry keychains for my whole friend group. We're officially a fruit gang now.", name: "Meera", place: "Delhi", item: "Strawberry Keychain", art: "strawberry", bg: "#FCE3E1", colors: { c1: "#E5534B", c2: "#7FA67A", c3: "#FFF3C4" } },
  { text: "Packaging was adorable, with a handwritten note and everything. The beanie fits perfectly and the pom pom is huge (in the best way).", name: "Kabir", place: "Chandigarh", item: "Pom Pom Beanie", art: "beanie", bg: "#E9E4F3", colors: { c1: "#7A4F7E", c2: "#C9B6E4", c3: "#F4C2C2" } },
];

window.YT_FAQ = [
  { q: "What's the difference between ready-to-ship and made-to-order?", a: "Ready-to-ship pieces are already made and waiting for a home, so they're packed and dispatched in 1–2 days. Made-to-order pieces are hooked from scratch after you order, usually 4–10 days depending on the piece, and you can tweak the colours." },
  { q: "Can I get something totally custom?", a: "Yes please! Head to the Custom Studio, tell us what you're dreaming of (a pet lookalike, your favourite character, a bag in your wedding colours…), and we'll reply on WhatsApp with a quote and timeline." },
  { q: "Do you ship across India?", a: "Yep, we ship pan-India with tracked couriers. Shipping is free on orders above ₹1,499, otherwise it's a flat ₹99. International shipping is available on request, just message us." },
  { q: "How do I pay?", a: "Once you place your order we confirm it on WhatsApp, then you can pay by UPI (GPay, PhonePe, Paytm) or bank transfer. For custom orders we take a 50% advance before we start hooking." },
  { q: "How do I care for my crochet piece?", a: "Hand wash in cool water with a mild detergent, gently squeeze (don't wring!) and dry flat in the shade. Amigurumi can be spot-cleaned with a damp cloth." },
  { q: "Can I return or exchange?", a: "Since everything is handmade (and custom pieces are made just for you) we can't take returns, but if anything arrives damaged, message us within 48 hours with a photo and we'll make it right." },
];
