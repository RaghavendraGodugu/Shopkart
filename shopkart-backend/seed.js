const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product.model");

const products = [
  // ─── ELECTRONICS ─────────────────────────────────────────────────────────
  {
    name: "Apple iPhone 15 Pro (256GB) - Natural Titanium",
    description:
      "Experience the most pro iPhone ever. With a titanium design, the A17 Pro chip, USB‑C with USB 3 speeds, and the most powerful camera system on iPhone yet.",
    price: 129900,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop",
    stock: 30,
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G (512GB) - Titanium Black",
    description:
      "Galaxy AI is here. Packed with a built-in S Pen, 200MP camera, and generative AI features that transform how you communicate, create and stay productive.",
    price: 109999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop",
    stock: 25,
  },
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    description:
      "Industry-leading noise cancellation with 8 mics and auto NC Optimizer. Up to 30-hour battery life with quick charging. Industry leading call quality, wearing comfort and multipoint connection.",
    price: 24990,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop",
    stock: 50,
  },
  {
    name: "Apple MacBook Air 15-inch M2 Chip (8GB RAM, 256GB SSD)",
    description:
      "Designed around the M2 chip with a 15.3-inch Liquid Retina display, up to 18 hours battery and all-day performance in a fanless, silent design.",
    price: 119900,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1611186871525-7c4ede8db3fa?w=800&auto=format&fit=crop",
    stock: 15,
  },
  {
    name: "boAt Airdopes 141 TWS Ear Buds",
    description:
      "Powered by 8mm drivers for a truly immersive audio experience. Up to 42 hours playback, ENx technology for clear calls, and IPX4 water resistance.",
    price: 999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop",
    stock: 200,
  },
  {
    name: "OnePlus 12R 5G (16GB RAM, 256GB) - Iron Gray",
    description:
      "Snapdragon 8 Gen 2 processor with a 6.78-inch 2K ProXDR LTPO display, 50MP triple camera, and 100W SUPERVOOC charging. Smooth as silk, fast as lightning.",
    price: 42999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop",
    stock: 35,
  },
  {
    name: "LG 27-inch 4K UHD IPS Monitor (27UL550-W)",
    description:
      "27-inch 4K UHD IPS display with HDR10 support, 99% sRGB wide colour gamut, AMD FreeSync, height-adjustable stand, and USB-C connectivity.",
    price: 32999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop",
    stock: 20,
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse",
    description:
      "Ultra-fast MagSpeed scrolling, 8K DPI sensor, quiet clicks, and USB-C charging. Works on virtually any surface — even glass. 70-day battery life.",
    price: 7995,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop",
    stock: 60,
  },
  {
    name: "Canon EOS R50 Mirrorless Camera (Body Only)",
    description:
      "24.2MP APS-C sensor, DIGIC X processor, eye-tracking AF, 4K video, and a compact vari-angle touchscreen. The ideal camera for content creators.",
    price: 71995,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
    stock: 12,
  },
  {
    name: "Xiaomi Smart Band 8 Pro",
    description:
      "1.74-inch AMOLED display, 14-day battery life, 150+ workout modes, SpO2 monitoring, sleep tracking, and GPS. Your ultimate fitness companion.",
    price: 4499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&auto=format&fit=crop",
    stock: 100,
  },

  // ─── FASHION ─────────────────────────────────────────────────────────────
  {
    name: "Raymond Men's Regular Fit Blazer - Navy Blue",
    description:
      "Crafted from premium poly-viscose fabric. This sharp navy blazer features a single-breasted design with notch lapels, flap pockets, and a full-lining for a polished look.",
    price: 4999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    stock: 45,
  },
  {
    name: "Levi's Men's 511 Slim Fit Stretch Jeans",
    description:
      "Sits below the waist with a slim fit through the thigh, narrowing to the ankle. Made with stretch denim for all-day comfort. Classic 5-pocket styling.",
    price: 3299,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
    stock: 80,
  },
  {
    name: "Allen Solly Women's Solid A-Line Midi Dress",
    description:
      "Elegant A-line midi dress in a versatile solid colour. Round neck, 3/4th sleeves, and a flared skirt make it perfect for office and casual occasions.",
    price: 1799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop",
    stock: 60,
  },
  {
    name: "Nike Air Force 1 '07 Sneakers - White",
    description:
      "The radiance of the original Air Force 1 lives on in the AF1 '07, the b-ball OG that puts a fresh spin on what you know best: crisp leather, '80s construction and the perfect amount of flash.",
    price: 7495,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
    stock: 40,
  },
  {
    name: "Wildcraft Nylon Backpack 30L - Black",
    description:
      "30L capacity with a spacious main compartment, laptop sleeve, and organiser pockets. Ergonomic shoulder straps and breathable back panel for all-day comfort.",
    price: 2299,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop",
    stock: 55,
  },
  {
    name: "Fossil Men's Machine Chronograph Watch",
    description:
      "A bold, industrial-inspired design with chronograph functionality, mineral crystal glass, and stainless steel case. Day-date display. Water resistant to 50m.",
    price: 8995,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop",
    stock: 30,
  },
  {
    name: "H&M Women's Oversized Cropped Hoodie - Olive Green",
    description:
      "Relaxed, oversized fit with a cropped length. Soft brushed fabric on the inside, kangaroo pocket, and ribbed cuffs and hem. Essential streetwear staple.",
    price: 1499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop",
    stock: 90,
  },
  {
    name: "Titan Raga Women's Analog Watch - Rose Gold",
    description:
      "Exquisitely crafted dial with crystal embellishments, stainless steel case and mesh strap. A timeless piece that complements both ethnic and western wear.",
    price: 5995,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=800&auto=format&fit=crop",
    stock: 25,
  },

  // ─── BOOKS ──────────────────────────────────────────────────────────────
  {
    name: "Atomic Habits by James Clear",
    description:
      "The #1 New York Times bestseller. Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones. With practical strategies that will teach you exactly how to form good habits.",
    price: 399,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop",
    stock: 150,
  },
  {
    name: "The Psychology of Money by Morgan Housel",
    description:
      "Timeless lessons on wealth, greed, and happiness. Doing well with money isn't necessarily about what you know. It's about how you behave — and behaviour is hard to teach.",
    price: 349,
    category: "Books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop",
    stock: 120,
  },
  {
    name: "Rich Dad Poor Dad by Robert T. Kiyosaki",
    description:
      "This #1 personal finance book of all time will teach you what the rich teach their kids about money — that the poor and middle class do not. A must-read for anyone seeking financial freedom.",
    price: 299,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop",
    stock: 200,
  },
  {
    name: "The Alchemist by Paulo Coelho",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. A fable about following your dream.",
    price: 249,
    category: "Books",
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&auto=format&fit=crop",
    stock: 175,
  },
  {
    name: "Deep Work by Cal Newport",
    description:
      "Rules for focused success in a distracted world. Deep work is the ability to focus without distraction on a cognitively demanding task — a skill that is becoming increasingly rare and increasingly valuable.",
    price: 369,
    category: "Books",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop",
    stock: 90,
  },
  {
    name: "Zero to One by Peter Thiel",
    description:
      "Notes on Startups, or How to Build the Future. Every moment in business happens only once. The next Bill Gates will not build an operating system. The next Larry Page or Sergey Brin won't make a search engine.",
    price: 399,
    category: "Books",
    image: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=800&auto=format&fit=crop",
    stock: 110,
  },

  // ─── HOME ────────────────────────────────────────────────────────────────
  {
    name: "Prestige Iris 750W Mixer Grinder (3 Jars)",
    description:
      "750W motor with 3 stainless steel jars — liquidising, multipurpose, and chutney jar. 3-speed control with incher, flow breaker, and easy-to-clean design.",
    price: 2999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop",
    stock: 40,
  },
  {
    name: "Milton Thermosteel Flip Lid Flask 1000ml",
    description:
      "Double-wall vacuum insulated stainless steel construction. Keeps beverages hot for 24 hours and cold for 12 hours. Flip lid design for easy one-hand operation.",
    price: 749,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop",
    stock: 120,
  },
  {
    name: "IKEA KALLAX Shelf Unit (4x2) - White",
    description:
      "Versatile shelf unit that works as a room divider. Create your own combination — use boxes, baskets, or doors to personalise. Can be placed horizontally or vertically.",
    price: 8499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    stock: 15,
  },
  {
    name: "Philips SmartSleep Wake-Up Light Alarm Clock",
    description:
      "Sunrise simulation gradually increases light 30 minutes before your set alarm. 5 nature-inspired wake-up sounds and FM radio. Clinically proven to help you wake up feeling more refreshed.",
    price: 6999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    stock: 30,
  },
  {
    name: "Bombay Dyeing 500TC Cotton King Bedsheet Set",
    description:
      "100% pure cotton, 500 thread count bedsheet with 2 pillow covers. Pre-shrunk fabric with fade-resistant dye. Machine washable. King size (108\"×108\").",
    price: 1899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop",
    stock: 65,
  },
  {
    name: "Nespresso Vertuo Pop Coffee Machine",
    description:
      "One-touch coffee brewing with Centrifusion technology. Five coffee sizes from Espresso to Alto. Auto blend recognition with barcodes on Nespresso capsules. 19-bar pressure pump.",
    price: 12999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop",
    stock: 22,
  },
  {
    name: "Dyson V12 Detect Slim Cordless Vacuum Cleaner",
    description:
      "Powered by a Dyson's most powerful digital motor. Laser Detect illuminates invisible dust. LCD screen shows real-time performance. Up to 60 minutes of run time.",
    price: 44900,
    category: "Home",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    stock: 10,
  },
  {
    name: "Sarom Stainless Steel Cookware Set (5-Piece)",
    description:
      "Premium tri-ply stainless steel construction with aluminium core for even heat distribution. Includes 16cm milk pan, 20cm saucepan, 24cm kadhai, 24cm frying pan, and lid set.",
    price: 3499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    stock: 35,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing products so re-running the seed doesn't duplicates.
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products successfully`);
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

seedProducts();
