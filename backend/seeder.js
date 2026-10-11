import dotenv from "dotenv";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { connectDB } from "./config/db.js";

dotenv.config();

export const SAMPLE_SEED_PRODUCTS = [
  {
    slug: "aura-h1-anc",
    name: "Aura Studio Pro Wireless ANC",
    brand: "Aura Soundworks",
    category: "Audio",
    price: 349.99,
    originalPrice: 429.99,
    rating: 4.9,
    reviewsCount: 384,
    inStock: true,
    stockCount: 18,
    badge: "Bestseller",
    isFeatured: true,
    description: "Engineered with custom 45mm neodymium drivers, active acoustic noise cancellation, and aerospace-grade aluminum cups for an unrivaled high-fidelity listening session.",
    features: [
      "Hybrid ANC with Transparency Mode",
      "Up to 55 hours playtime with USB-C Quick Charge",
      "Lossless Bluetooth 5.4 with LDAC & aptX HD",
      "Ergonomic memory foam protein leather earcups"
    ],
    specs: {
      "Driver Size": "45mm Custom Neodymium",
      "Battery Life": "55 Hours (ANC off), 42 Hours (ANC on)",
      "Frequency Response": "10Hz - 40,000Hz",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.4, 3.5mm Aux, USB-C Audio"
    },
    colors: ["Space Black", "Titanium Silver", "Midnight Navy"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["headphones", "anc", "audio", "wireless", "bluetooth", "studio"]
  },
  {
    slug: "aura-watch-ultra",
    name: "Chrono Apex Titanium Smartwatch",
    brand: "Vanguard Tech",
    category: "Wearables",
    price: 499.00,
    originalPrice: 599.00,
    rating: 4.8,
    reviewsCount: 219,
    inStock: true,
    stockCount: 12,
    badge: "Staff Pick",
    isFeatured: true,
    description: "Grade 5 titanium casing, sapphire crystal 2000-nit AMOLED display, dual-frequency precision GPS, and medical-grade bio-sensors built for extreme athletes and modern pioneers.",
    features: [
      "Always-On Ultra Retina AMOLED with sapphire glass",
      "14-day battery reserve with intelligent solar trickle",
      "ECG, SpO2, HRV & deep sleep tracking algorithms",
      "100M Water Resistant with dive computer mode"
    ],
    specs: {
      "Case Material": "Grade 5 Aerospace Titanium",
      "Display": "1.43-inch AMOLED, 466x466 (2000 nits)",
      "Battery": "Up to 14 Days Typical Use",
      "Water Resistance": "10 ATM / 100 Meters",
      "Sensors": "Bio-Tracker 5.0, Dual GPS, Altimeter, Compass"
    },
    colors: ["Brushed Titanium", "Stealth Onyx", "Alpine Orange"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["smartwatch", "fitness", "wearables", "gps", "titanium"]
  },
  {
    slug: "lumina-desk-lamp",
    name: "Lumina Minimalist Smart Horizon Bar",
    brand: "Lumina Design",
    category: "Smart Living",
    price: 129.50,
    originalPrice: 169.00,
    rating: 4.7,
    reviewsCount: 156,
    inStock: true,
    stockCount: 25,
    badge: "Trending",
    isFeatured: false,
    description: "Precision asymmetric optical design that illuminates your entire desk surface with zero glare on monitor screens. Touch gesture dimming and ambient circadian color sync.",
    features: [
      "Ra98 Ultra-high color rendering index (true daylight)",
      "Zero screen glare optical architecture",
      "Stepless color temperature adjustment (2700K - 6500K)",
      "Integrated wireless puck remote control"
    ],
    specs: {
      "Illuminance": "Up to 1000 Lux @ 45cm",
      "Color Temp": "2700K - 6500K Tunable",
      "Power": "USB Type-C 5V/2A",
      "Material": "Anodized Matte Aluminum Alloy"
    },
    colors: ["Space Gray", "Matte Silver"],
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["lighting", "desk", "smart home", "minimalist", "office"]
  },
  {
    slug: "kinesis-mech-keyboard",
    name: "Vortex 75 Custom Mechanical Keyboard",
    brand: "Vortex Labs",
    category: "Computing",
    price: 219.00,
    originalPrice: 249.00,
    rating: 4.9,
    reviewsCount: 512,
    inStock: true,
    stockCount: 8,
    badge: "Hot Deal",
    isFeatured: true,
    description: "Gasket-mounted acoustic dampening with five layers of sound foam, pre-lubed linear switches, CNC machined aluminum chassis, and south-facing per-key RGB backlighting.",
    features: [
      "Hot-swappable 5-pin PCB with QMK / VIA support",
      "CNC 6063 Aluminum body with brass weight bar",
      "Factory lubed Gateron Oil King linear switches",
      "Tri-mode: 2.4GHz, Bluetooth 5.1, USB-C"
    ],
    specs: {
      "Layout": "75% Compact (82 Keys + Rotary Knob)",
      "Mounting Style": "Gasket Mount with FR4 Plate",
      "Battery": "4000mAh Rechargeable Lithium",
      "Keycaps": "Double-shot PBT Cherry Profile"
    },
    colors: ["Retro Beige", "Anodized Navy", "Frost White"],
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["keyboard", "mechanical", "gaming", "computing", "custom"]
  },
  {
    slug: "apex-leather-backpack",
    name: "Nomad X Waterproof Tech Roll-Top Backpack",
    brand: "Nomad Goods",
    category: "Accessories",
    price: 189.00,
    originalPrice: 220.00,
    rating: 4.6,
    reviewsCount: 94,
    inStock: true,
    stockCount: 30,
    badge: "Eco-Friendly",
    isFeatured: false,
    description: "Crafted from 100% recycled Cordura ballistic fabric with magnetic Fidlock closures and dedicated padded suspension compartments for a 16\" laptop and tech organizers.",
    features: [
      "Weatherproof Cordura 840D recycled nylon",
      "Magnetic German Fidlock buckles",
      "Suspended protective 16-inch laptop pocket",
      "Hidden RFID-blocking passport compartment"
    ],
    specs: {
      "Capacity": "22L expandable to 28L",
      "Dimensions": "48 x 31 x 16 cm",
      "Weight": "1.1 kg",
      "Zippers": "YKK AquaGuard weather-sealed"
    },
    colors: ["Obsidian Black", "Olive Drab", "Slate Gray"],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["backpack", "travel", "accessories", "tech bag", "laptop bag"]
  },
  {
    slug: "zenith-wireless-mouse",
    name: "AeroGlide Ergonomic Wireless Mouse",
    brand: "Vortex Labs",
    category: "Computing",
    price: 99.00,
    originalPrice: 120.00,
    rating: 4.8,
    reviewsCount: 167,
    inStock: true,
    stockCount: 22,
    badge: "New Release",
    isFeatured: false,
    description: "Featherlight 49-gram magnesium alloy honeycomb frame paired with a PixArt 3395 sensor offering 26,000 DPI and true 4000Hz polling rate for pixel-perfect tracking.",
    features: [
      "Ultra-lightweight 49g magnesium exoskeleton",
      "PixArt PAW3395 26K DPI optical sensor",
      "Optical micro switches rated for 90M clicks",
      "Lag-free 4K wireless receiver included"
    ],
    specs: {
      "Sensor": "PixArt PAW3395 (26,000 DPI, 650 IPS)",
      "Polling Rate": "Up to 4000Hz Wireless",
      "Weight": "49g ± 2g",
      "Battery Life": "Up to 80 Hours on 1000Hz"
    },
    colors: ["Polar White", "Carbon Black", "Cyber Red"],
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["mouse", "wireless", "gaming", "computing", "ergonomic"]
  },
  {
    slug: "soundwave-earbuds",
    name: "Pulse True Wireless Spatial Earbuds",
    brand: "Aura Soundworks",
    category: "Audio",
    price: 179.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviewsCount: 280,
    inStock: true,
    stockCount: 15,
    badge: "Popular",
    isFeatured: true,
    description: "Compact wireless earbuds featuring dynamic head-tracking spatial audio, quad-mic beamforming noise cancellation, and IPX7 sweat and storm resistance.",
    features: [
      "360° Dynamic Spatial Audio with head tracking",
      "IPX7 waterproof rating for heavy workouts",
      "Wireless charging case with digital LED battery indicator",
      "Multipoint connection: switch between laptop and phone"
    ],
    specs: {
      "Driver": "11mm Beryllium-coated diaphragm",
      "Battery": "9 hours per charge + 27 hours case",
      "Waterproofing": "IPX7",
      "Codecs": "AAC, SBC, LHDC 5.0"
    },
    colors: ["Frost White", "Midnight Onyx", "Sage Green"],
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["earbuds", "audio", "wireless", "tws", "workout"]
  },
  {
    slug: "zenith-leather-wallet",
    name: "MagSafe Minimalist RFID Cardholder",
    brand: "Nomad Goods",
    category: "Accessories",
    price: 49.00,
    originalPrice: 65.00,
    rating: 4.5,
    reviewsCount: 88,
    inStock: true,
    stockCount: 45,
    badge: "",
    isFeatured: false,
    description: "Premium vegetable-tanned Italian leather with integrated neodymium magnets for ultra-strong MagSafe attachment and RFID-shielded card protection.",
    features: [
      "Holds up to 4 cards + folded cash bills",
      "High-grade N52 neodymium magnetic grip",
      "Full grain Italian Horween leather with natural patina",
      "Quick thumb-ejection access slot"
    ],
    specs: {
      "Material": "Horween Full Grain Leather",
      "Capacity": "4 Cards + Cash",
      "Compatibility": "iPhone 12 through 16 MagSafe series",
      "Thickness": "6.5mm ultra-slim"
    },
    colors: ["Caramel Tan", "Rustic Brown", "Charcoal"],
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["wallet", "leather", "magsafe", "edc", "accessories"]
  }
];

export const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Seeding initial products into database...");
      await Product.insertMany(SAMPLE_SEED_PRODUCTS);
      console.log(`\x1b[32m✔ ${SAMPLE_SEED_PRODUCTS.length} Products Seeded!\x1b[0m`);
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@aura.store";
    const adminExists = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!adminExists) {
      console.log("Seeding default Admin & Customer accounts...");
      await User.create([
        {
          name: "Aura System Admin",
          email: adminEmail.toLowerCase(),
          password: process.env.ADMIN_PASSWORD || "Admin@123456",
          isAdmin: true,
        },
        {
          name: "Alex Mercer",
          email: "customer@aura.store",
          password: "Customer@123456",
          isAdmin: false,
        },
      ]);
      console.log(`\x1b[32m✔ Admin (${adminEmail}) and Customer (customer@aura.store) Created!\x1b[0m`);
    }
  } catch (error) {
    console.error("Seeder error:", error.message);
  }
};

// If run directly from CLI (npm run seed)
if (process.argv[1] && process.argv[1].endsWith("seeder.js")) {
  connectDB().then(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    await seedDatabase();
    console.log("Database reset and seeded successfully.");
    process.exit(0);
  });
}
