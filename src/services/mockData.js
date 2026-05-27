// ─── Mock Products for demo/fallback when backend is unavailable ──────────────

export const MOCK_CATEGORIES = [
  { _id: "cat1", name: "Electronics", slug: "electronics" },
  { _id: "cat2", name: "Fashion", slug: "fashion" },
  { _id: "cat3", name: "Home & Living", slug: "home-living" },
  { _id: "cat4", name: "Sports", slug: "sports" },
  { _id: "cat5", name: "Beauty", slug: "beauty" },
  { _id: "cat6", name: "Books", slug: "books" },
];

export const MOCK_PRODUCTS = [
  {
    _id: "p1", slug: "airpods-pro-2nd-gen",
    name: "AirPods Pro 2nd Gen",
    description: "Premium wireless earbuds with Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio. Up to 30 hours of listening time.",
    price: 24999, comparePrice: 29999,
    category: { _id: "cat1", name: "Electronics", slug: "electronics" },
    brand: "Apple", stock: 50, ratings: 4.8, numReviews: 124,
    featured: true, trending: true, sold: 234,
    images: [{ url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600" }],
    tags: ["wireless", "earbuds", "apple"],
  },
  {
    _id: "p2", slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with up to 30-hour battery life.",
    price: 29990, comparePrice: 34990,
    category: { _id: "cat1", name: "Electronics", slug: "electronics" },
    brand: "Sony", stock: 30, ratings: 4.7, numReviews: 89,
    featured: true, sold: 156,
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" }],
    tags: ["headphones", "sony", "wireless"],
  },
  {
    _id: "p3", slug: "premium-minimalist-watch",
    name: "Premium Minimalist Watch",
    description: "Swiss-inspired minimalist watch with sapphire crystal glass and Italian leather strap.",
    price: 4999, comparePrice: 7999,
    category: { _id: "cat2", name: "Fashion", slug: "fashion" },
    brand: "TimeCraft", stock: 75, ratings: 4.5, numReviews: 67,
    featured: true, sold: 89,
    images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" }],
    tags: ["watch", "minimalist", "fashion"],
  },
  {
    _id: "p4", slug: "mechanical-gaming-keyboard",
    name: "Mechanical Gaming Keyboard",
    description: "Full RGB mechanical keyboard with Cherry MX switches and aluminum frame.",
    price: 8499, comparePrice: 11999,
    category: { _id: "cat1", name: "Electronics", slug: "electronics" },
    brand: "RazerPro", stock: 40, ratings: 4.6, numReviews: 203,
    trending: true, sold: 312,
    images: [{ url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600" }],
    tags: ["keyboard", "gaming", "mechanical"],
    flashSale: { active: true, discount: 20 },
  },
  {
    _id: "p5", slug: "linen-bedroom-set",
    name: "Linen Bedroom Set",
    description: "Premium linen bedsheet set with 2 pillow covers. 400 thread count, breathable and hypoallergenic.",
    price: 2499, comparePrice: 3999,
    category: { _id: "cat3", name: "Home & Living", slug: "home-living" },
    brand: "CozyCraft", stock: 100, ratings: 4.3, numReviews: 45, sold: 67,
    images: [{ url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600" }],
    tags: ["bedroom", "linen", "home"],
  },
  {
    _id: "p6", slug: "smart-fitness-band-pro",
    name: "Smart Fitness Band Pro",
    description: "Track your health 24/7 with heart rate, SpO2, stress levels, and 14-day battery life.",
    price: 3499, comparePrice: 4999,
    category: { _id: "cat1", name: "Electronics", slug: "electronics" },
    brand: "FitPulse", stock: 60, ratings: 4.4, numReviews: 178,
    trending: true, sold: 445,
    images: [{ url: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600" }],
    tags: ["fitness", "smartwatch", "health"],
  },
  {
    _id: "p7", slug: "wireless-charging-pad",
    name: "15W Fast Wireless Charger",
    description: "Universal Qi wireless charging pad with 15W fast charging for all compatible devices.",
    price: 1299, comparePrice: 1999,
    category: { _id: "cat1", name: "Electronics", slug: "electronics" },
    brand: "ChargePro", stock: 80, ratings: 4.2, numReviews: 92, sold: 210,
    images: [{ url: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600" }],
    tags: ["charger", "wireless", "fast charging"],
  },
  {
    _id: "p8", slug: "running-shoes-ultra",
    name: "Ultra Boost Running Shoes",
    description: "Lightweight responsive running shoes with energy return foam and breathable mesh upper.",
    price: 6999, comparePrice: 9999,
    category: { _id: "cat4", name: "Sports", slug: "sports" },
    brand: "SpeedMax", stock: 45, ratings: 4.6, numReviews: 134, sold: 178,
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600" }],
    tags: ["running", "shoes", "sports"],
  },
  {
    _id: "p9", slug: "vitamin-c-serum",
    name: "Vitamin C Brightening Serum",
    description: "20% Vitamin C serum with hyaluronic acid. Brightens skin, reduces dark spots, boosts collagen.",
    price: 899, comparePrice: 1499,
    category: { _id: "cat5", name: "Beauty", slug: "beauty" },
    brand: "GlowLab", stock: 200, ratings: 4.5, numReviews: 256, sold: 890,
    trending: true,
    images: [{ url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600" }],
    tags: ["skincare", "vitamin c", "serum"],
  },
  {
    _id: "p10", slug: "atomic-habits-book",
    name: "Atomic Habits",
    description: "An easy and proven way to build good habits and break bad ones by James Clear.",
    price: 399, comparePrice: 599,
    category: { _id: "cat6", name: "Books", slug: "books" },
    brand: "Penguin", stock: 500, ratings: 4.9, numReviews: 1240, sold: 2340,
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600" }],
    tags: ["book", "self-help", "habits"],
  },
  {
    _id: "p11", slug: "coffee-maker-pro",
    name: "Espresso Coffee Maker Pro",
    description: "15-bar pressure espresso machine with milk frother. Brews rich, authentic espresso at home.",
    price: 12999, comparePrice: 17999,
    category: { _id: "cat3", name: "Home & Living", slug: "home-living" },
    brand: "BrewMaster", stock: 25, ratings: 4.7, numReviews: 67, sold: 89,
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600" }],
    tags: ["coffee", "espresso", "kitchen"],
  },
  {
    _id: "p12", slug: "yoga-mat-premium",
    name: "Premium Non-Slip Yoga Mat",
    description: "6mm thick eco-friendly yoga mat with superior grip, alignment lines and carrying strap.",
    price: 1499, comparePrice: 2299,
    category: { _id: "cat4", name: "Sports", slug: "sports" },
    brand: "ZenFlex", stock: 90, ratings: 4.4, numReviews: 88, sold: 312,
    images: [{ url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600" }],
    tags: ["yoga", "fitness", "mat"],
  },
];

export function filterMockProducts({ keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12, featured, trending, flashSale }) {
  let products = [...MOCK_PRODUCTS];

  if (keyword) {
    const kw = keyword.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw) ||
      p.tags?.some(t => t.toLowerCase().includes(kw))
    );
  }

  if (category) {
    products = products.filter(p => p.category?.slug === category);
  }

  if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
  if (rating) products = products.filter(p => p.ratings >= Number(rating));
  if (featured === "true") products = products.filter(p => p.featured);
  if (trending === "true") products = products.filter(p => p.trending);
  if (flashSale === "true") products = products.filter(p => p.flashSale?.active);

  const sortMap = {
    newest: (a, b) => b._id.localeCompare(a._id),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    popular: (a, b) => b.sold - a.sold,
    rating: (a, b) => b.ratings - a.ratings,
  };
  if (sortMap[sort]) products.sort(sortMap[sort]);

  const total = products.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = products.slice(start, start + limit);

  return { products: paged, total, pages, page: Number(page) };
}
