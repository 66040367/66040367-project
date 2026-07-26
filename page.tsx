'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Heart, Star, Zap, ChevronRight, Filter, 
  X, Check, Eye, Plus, Sparkles, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';

// ==========================================
// 1. Types & Interfaces
// ==========================================
export interface ProductItem {
  id: number;
  name: string;
  category: string;      // 'electronics' | 'clothing' | 'beauty' | 'food' | 'toys' | 'home'
  subCategory: string;   // 'จอคอม', 'ลิป', 'เสื้อผ้า' ฯลฯ
  price: number;
  originalPrice: number;
  rating: number;
  sold: number;
  image: string;
  badge?: 'HOT' | 'SALE' | 'NEW';
  spec: string;
}

// ==========================================
// 2. ข้อมูลสินค้าตัวท็อปต้นแบบ (Master Data)
// ==========================================
const BASE_PRODUCTS = [
  // --- คอมพิวเตอร์ & IT ตัวท็อป ---
  {
    subCategory: 'จอคอม',
    category: 'electronics',
    name: 'ASUS ROG Swift OLED PG32UCDM 31.5" 4K 240Hz',
    price: 49900,
    originalPrice: 53900,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    spec: 'QD-OLED 0.03ms, Type-C 90W, KVM Switch'
  },
  {
    subCategory: 'หูฟัง',
    category: 'electronics',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling',
    price: 12990,
    originalPrice: 14900,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    spec: 'Auto NC Optimizer, Battery 30 Hrs, LDAC'
  },
  {
    subCategory: 'CPU',
    category: 'electronics',
    name: 'AMD Ryzen 7 7800X3D AM5 (ตัวท็อปสายเกมมิ่ง)',
    price: 15900,
    originalPrice: 17500,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80',
    spec: '8 Cores 16 Threads, 3D V-Cache 96MB'
  },
  {
    subCategory: 'แรม',
    category: 'electronics',
    name: 'G.SKILL Trident Z5 RGB 64GB (32GBx2) DDR5 6400MHz',
    price: 9890,
    originalPrice: 11200,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
    spec: 'Intel XMP 3.0 Ready, CL32 Dual Channel'
  },
  {
    subCategory: 'เมาส์',
    category: 'electronics',
    name: 'Logitech G PRO X SUPERLIGHT 2 Wireless',
    price: 5290,
    originalPrice: 5990,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    spec: 'HERO 2 Sensor 32K DPI, น้ำหนักเบาพิเศษ 60g'
  },
  {
    subCategory: 'ไมค์',
    category: 'electronics',
    name: 'Shure SM7B Dynamic Studio Vocal Microphone',
    price: 16900,
    originalPrice: 18500,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    spec: 'Cardioid XLR Studio Standard, Air Suspension'
  },
  {
    subCategory: 'โทรศัพท์',
    category: 'electronics',
    name: 'iPhone 15 Pro Max 1TB Titanium Black',
    price: 63900,
    originalPrice: 66900,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    spec: 'A17 Pro Chip, 5x Telephoto Camera, Titanium'
  },
  {
    subCategory: 'โน๊ตบุ๊ค',
    category: 'electronics',
    name: 'ASUS ROG Strix SCAR 18 (i9-14900HX / RTX 4090 / 64GB)',
    price: 139900,
    originalPrice: 149900,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    spec: '18" ROG Nebula HDR 2.5K 240Hz Mini LED'
  },
  {
    subCategory: 'คอมประกอบ iHAVECPU',
    category: 'electronics',
    name: 'iHAVECPU Flagship : i9-14900K + RTX 4090 + RAM 64GB DDR5',
    price: 129000,
    originalPrice: 139000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    spec: 'เคส Lian Li O11 EVO + ชุดน้ำ 3 ตอน ประกัน 3 ปี'
  },

  // --- แฟชั่นผู้หญิง ---
  {
    subCategory: 'เสื้อผ้า',
    category: 'clothing',
    name: 'Mardi Mercredi T-Shirt Flowermardi White Green',
    price: 1890,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    spec: 'Cotton 100% สกรีนลายลายดอกไม้เอกลักษณ์เกาหลี'
  },
  {
    subCategory: 'กระเป๋า',
    category: 'clothing',
    name: 'Stand Oil Chubby Bag - Black Edition',
    price: 4190,
    originalPrice: 4600,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    spec: 'กระเป๋าหนังทรงโบว์ลิ่งเรโทร ช่องเก็บของคู่หน้า'
  },
  {
    subCategory: 'รองเท้า',
    category: 'clothing',
    name: 'Adidas Samba OG Cloud White Core Black',
    price: 3800,
    originalPrice: 4200,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    spec: 'รองเท้าสตรีทสไตล์คลาสสิก หนังแท้แต่งแถบหนังกลับ'
  },
  {
    subCategory: 'กระโปรง',
    category: 'clothing',
    name: 'กระโปรงจีบรอบเอวสูงสไตล์เกาหลี Minimal Pleated Skirt',
    price: 790,
    originalPrice: 990,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
    spec: 'ผ้าโพลีเอสเตอร์เกรดพรีเมียม ไม่ยับง่าย พร้อมซับใน'
  },
  {
    subCategory: 'กางเกง',
    category: 'clothing',
    name: 'กางเกงสแล็คเอวสูงทรงกระบอกใหญ่ High-Waist Wide Trouser',
    price: 890,
    originalPrice: 1190,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    spec: 'ทรงสวยช่วยให้ขาดูยาว ผ้าทิ้งตัวใส่นุ่มสบาย'
  },

  // --- เครื่องสำอาง & บิวตี้ ---
  {
    subCategory: 'ลิป',
    category: 'beauty',
    name: 'Dior Addict Lip Glow Color Reviver Balm #001 Pink',
    price: 1650,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
    spec: 'ลิปบาล์มเปลี่ยนสีตามอุณหภูมิ ชุ่มชื้น 24 ชั่วโมง'
  },
  {
    subCategory: 'บลัชออน',
    category: 'beauty',
    name: 'Rare Beauty Soft Pinch Liquid Blush #Hope',
    price: 1050,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    spec: 'บลัชออนลิควิด พิกเมนต์แน่น เกลี่ยง่าย ติดทนทั้งวัน'
  },
  {
    subCategory: 'เซรั่ม',
    category: 'beauty',
    name: 'Estée Lauder Advanced Night Repair Synchronized 50ml',
    price: 4850,
    originalPrice: 5300,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    spec: 'เซรั่มฟื้นบำรุงผิวยามค่ำคืนอันดับ 1 ลดริ้วรอย'
  },
  {
    subCategory: 'กันแดด',
    category: 'beauty',
    name: 'Anessa Perfect UV Sunscreen Skincare Milk SPF50+ 60ml',
    price: 1050,
    originalPrice: 1190,
    image: 'https://images.unsplash.com/photo-1608248597261-833250005a76?w=800&q=80',
    spec: 'กันแดดสูตรน้ำนม กันน้ำกันเหงื่อ คุมมันไม่เหนอะหนะ'
  },
  {
    subCategory: 'แผ่นมาส์กหน้า',
    category: 'beauty',
    name: 'SK-II Facial Treatment Mask (กล่อง 6 แผ่น)',
    price: 3550,
    originalPrice: 3900,
    image: 'https://images.unsplash.com/photo-1567928269937-ae146e45b428?w=800&q=80',
    spec: 'อุดมด้วย Pitera เข้มข้น ผิวกระจ่างใสฉ่ำวาว'
  },
  {
    subCategory: 'ที่เขียนคิ้ว',
    category: 'beauty',
    name: 'Benefit Precisely My Brow Pencil Ultra-Fine',
    price: 1200,
    originalPrice: 1350,
    image: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=800&q=80',
    spec: 'หัวดินสอเรียวเล็ก วาดเส้นคิ้วเป็นธรรมชาติ ติดทน 12 ชม.'
  },
  {
    subCategory: 'คอนทัวร์',
    category: 'beauty',
    name: 'Fenty Beauty Match Stix Contour Skinstick #Amber',
    price: 1300,
    originalPrice: 1450,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    spec: 'คอนทัวร์สติ๊กเนื้อครีมแมตต์ เกลี่ยง่าย สร้างมิติให้ใบหน้า'
  },
  {
    subCategory: 'ไฮไลท์',
    category: 'beauty',
    name: 'Dior Backstage Glow Face Palette #001 Universal',
    price: 2150,
    originalPrice: 2350,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    spec: 'พาเลตต์ไฮไลท์ 4 เฉดสี ชิมเมอร์เนื้อละเอียด ฉ่ำโกลว์'
  },
  {
    subCategory: 'คอนซีลเลอร์',
    category: 'beauty',
    name: 'NARS Radiant Creamy Concealer #Vanilla',
    price: 1500,
    originalPrice: 1650,
    image: 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=800&q=80',
    spec: 'คอนซีลเลอร์ปกปิดเยี่ยม ไม่เป็นคราบ ชุ่มชื้นยาวนาน'
  },
  {
    subCategory: 'รองพื้น',
    category: 'beauty',
    name: 'YSL All Hours Foundation SPF39 PA+++ 25ml',
    price: 2700,
    originalPrice: 2900,
    image: 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=800&q=80',
    spec: 'ปกปิดเรียบเนียน คุมมันยาวนาน 24 ชั่วโมง บางเบา'
  },
  {
    subCategory: 'คลีนซิ่ง',
    category: 'beauty',
    name: 'BIODERMA Sensibio H2O Micellar Water 500ml',
    price: 950,
    originalPrice: 1100,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    spec: 'คลีนซิ่งเช็ดเครื่องสำอาง สูตรอ่อนโยนสำหรับผิวแพ้ง่าย'
  },
  {
    subCategory: 'โฟมล้างหน้า',
    category: 'beauty',
    name: 'Senka Perfect Whip Facial Foam 120g',
    price: 199,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1608248597261-833250005a76?w=800&q=80',
    spec: 'วิปโฟมหนานุ่ม ทำความสะอาดล้ำลึก ผิวนุ่มชุ่มชื้น'
  },
  {
    subCategory: 'ครีมทาผิว',
    category: 'beauty',
    name: 'Cerave Moisturizing Cream for Dry Skin 454g',
    price: 795,
    originalPrice: 890,
    image: 'https://images.unsplash.com/photo-1608248597261-833250005a76?w=800&q=80',
    spec: 'ครีมบำรุงผิวสูตรเข้มข้น เสริมเกราะป้องกันผิวชุ่มชื้น'
  },

  // --- ของกิน ของเล่น ของแต่งห้อง ---
  {
    subCategory: 'ของกิน',
    category: 'food',
    name: 'Royce Chocolate Potato Chip Chocolate (190g)',
    price: 395,
    originalPrice: 450,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80',
    spec: 'มันฝรั่งทอดกรอบเคลือบช็อกโกแลตเข้มข้น นำเข้าจากญี่ปุ่น'
  },
  {
    subCategory: 'ของเล่น',
    category: 'toys',
    name: 'POP MART LABUBU THE MONSTERS Vinyl Plush Blind Box',
    price: 890,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    spec: 'กล่องสุ่มพวงกุญแจตุ๊กตาลาบูบู้เวอร์ชันนั่ง แท้ 100%'
  },
  {
    subCategory: 'ของตกแต่งห้อง',
    category: 'home',
    name: 'โคมไฟตั้งโต๊ะ Sunset Lamp RGB เปลี่ยนสีผ่าน App สมาร์ทโฟน',
    price: 450,
    originalPrice: 690,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    spec: 'ไฟสร้างบรรยากาศพระอาทิตย์ตก หมุนได้ 360 องศา'
  }
];

// ==========================================
// 3. ฟังก์ชันสร้างสินค้า 40 ชิ้น ต่อหมวดย่อยอัตโนมัติ
// ==========================================
const generateAllProducts = (): ProductItem[] => {
  const products: ProductItem[] = [];
  let idCounter = 1;

  BASE_PRODUCTS.forEach((base) => {
    for (let i = 1; i <= 40; i++) {
      const isHot = i % 4 === 0;
      const isSale = i % 5 === 0;
      const isNew = i % 7 === 0;

      products.push({
        id: idCounter++,
        name: i === 1 ? base.name : `${base.name} (Series Pro Gen-${i})`,
        category: base.category,
        subCategory: base.subCategory,
        price: base.price + ((i - 1) * 35),
        originalPrice: base.originalPrice + ((i - 1) * 50),
        rating: Number((4.5 + ((i % 5) * 0.1)).toFixed(1)),
        sold: (i * 42) + 15,
        image: base.image,
        badge: isHot ? 'HOT' : isSale ? 'SALE' : isNew ? 'NEW' : undefined,
        spec: `${base.spec} • Edition #${i}`
      });
    }
  });

  return products;
};

const ALL_PRODUCTS = generateAllProducts();

// ==========================================
// 4. Main Component
// ==========================================
export default function ECommerceStore() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // รายการหมวดหมู่ย่อยสำหรับ Filter
  const subCategoriesList = useMemo(() => {
    if (selectedCategory === 'all') {
      return Array.from(new Set(BASE_PRODUCTS.map(p => p.subCategory)));
    }
    return Array.from(new Set(BASE_PRODUCTS.filter(p => p.category === selectedCategory).map(p => p.subCategory)));
  }, [selectedCategory]);

  // กรองสินค้าตามเงื่อนไข
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSubCategory = selectedSubCategory === 'all' || product.subCategory === selectedSubCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.spec.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSubCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.sold - a.sold; // popular
    });
  }, [selectedCategory, selectedSubCategory, searchQuery, sortBy]);

  // เพิ่มลงตะกร้า
  const addToCart = (product: ProductItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // สลับสถานะถูกใจ
  const toggleFavorite = (productId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* 🟢 NAVBAR / HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedCategory('all'); setSelectedSubCategory('all'); setSearchQuery(''); }}>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200">
              N
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                NEXUS 367
              </span>
              <span className="text-[10px] font-bold text-slate-400 block tracking-widest -mt-1">PREMIUM STORE</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้าตัวท็อป เช่น จอคอม, ลิป, iPhone, iHAVECPU..."
              className="w-full bg-slate-100 text-slate-800 pl-11 pr-10 py-2.5 rounded-2xl text-sm border border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 🟢 MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Banner โปรโมชัน */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 mb-8 shadow-xl">
          <div className="relative z-10 max-w-lg space-y-3">
            <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30">
              🔥 Grand Opening Sale
            </span>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">
              ศูนย์รวมสินค้าตัวท็อป <br /><span className="text-indigo-400">มากกว่า 1,200+ รายการ</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              จัดเต็มทุกหมวดหมู่ สินค้าไอที สเปกโหด แฟชั่นเกาหลี เครื่องสำอางแบรนด์เนม ครบจบในที่เดียว
            </p>
          </div>
        </div>

        {/* 🟢 CATEGORY FILTER TABS */}
        <div className="space-y-4 mb-8">
          {/* หมวดหมู่หลัก */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', name: 'ทั้งหมด' },
              { id: 'electronics', name: '💻 คอมพิวเตอร์ & IT' },
              { id: 'beauty', name: '💄 เครื่องสำอาง & บิวตี้' },
              { id: 'clothing', name: '👗 แฟชั่นผู้หญิง' },
              { id: 'food', name: '🍱 ของกิน' },
              { id: 'toys', name: '🧸 ของเล่น Art Toy' },
              { id: 'home', name: '🏠 ของตกแต่งห้อง' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSelectedSubCategory('all'); }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* หมวดหมู่ย่อย (Sub-Categories) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> ย่อย:
            </span>
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              ทั้งหมด ({filteredProducts.length})
            </button>
            {subCategoriesList.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSubCategory === sub
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub} (40)
              </button>
            ))}
          </div>
        </div>

        {/* 🟢 BAR แสดงการเรียงลำดับ & จำนวนสินค้า */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-slate-500 font-semibold">
            พบสินค้า <span className="text-indigo-600 font-bold">{filteredProducts.length}</span> รายการ
          </p>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white text-xs font-bold text-slate-700 py-2 px-3 rounded-xl border border-slate-200/80 focus:outline-none"
            >
              <option value="popular">ขายดีที่สุด</option>
              <option value="price-low">ราคา: ต่ำ -> สูง</option>
              <option value="price-high">ราคา: สูง -> ต่ำ</option>
              <option value="rating">คะแนนรีวิวสูงสุด</option>
            </select>
          </div>
        </div>

        {/* 🟢 PRODUCT GRID (การ์ดสินค้าจัดเรียงสวยเป๊ะ) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                {/* 🖼️ ภาพสินค้า Aspect-Square 1:1 */}
                <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm border border-slate-100">
                      {product.subCategory}
                    </span>
                    {product.badge && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm flex items-center gap-0.5 ${
                        product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        <Zap className="w-2.5 h-2.5 fill-current" /> {product.badge}
                      </span>
                    )}
                  </div>

                  {/* ปุ่ม Favorite */}
                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-600 hover:text-rose-500 transition-all z-10"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* 📝 รายละเอียดสินค้า */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-medium">
                      {product.spec}
                    </p>
                  </div>

                  <div>
                    {/* Rating & Sold */}
                    <div className="flex items-center gap-1 text-amber-500 text-[10px] mb-1.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-slate-700">{product.rating}</span>
                      <span className="text-slate-400 ml-1">ขายแล้ว {product.sold}</span>
                    </div>

                    {/* Price & Add Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-indigo-600 font-black text-sm block">
                          ฿{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-slate-400 text-[10px] line-through block -mt-1">
                            ฿{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => addToCart(product, e)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 🟢 MODAL: ดูรายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-square w-full bg-slate-50 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-500 mt-1">{selectedProduct.spec}</p>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-100">
                <div>
                  <span className="text-slate-400 text-xs">ราคาพิเศษ</span>
                  <div className="text-2xl font-black text-indigo-600">฿{selectedProduct.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-current" /> {selectedProduct.rating} / 5.0
                  </div>
                  <span className="text-xs text-slate-400">ยอดขาย {selectedProduct.sold} ชิ้น</span>
                </div>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> ใส่ตะกร้าเลย
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 SIDEBAR: ตะกร้าสินค้า */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="font-extrabold text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" /> ตะกร้าสินค้าของคุณ
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 overflow-y-auto max-h-[60vh] pr-1">
                {cart.length === 0 ? (
                  <p className="text-center text-slate-400 py-10 text-xs">ไม่มีสินค้าในตะกร้า</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <img src={item.product.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{item.product.name}</h4>
                        <span className="text-indigo-600 font-black text-xs">฿{item.product.price.toLocaleString()}</span>
                      </div>
                      <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        x{item.quantity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>ราคารวมทั้งหมด:</span>
                <span className="text-xl font-black text-indigo-600">฿{totalPrice.toLocaleString()}</span>
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200 transition-all">
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
