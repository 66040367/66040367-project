'use client';

import React, { useState, useMemo } from 'react';

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  mainCategory: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  soldCount: string;
  badge?: string;
  location: string;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// --- CATEGORY CONFIGURATION ---
const MAIN_CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด', subs: [] },
  { 
    id: 'it', 
    name: 'อุปกรณ์ไอที', 
    subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'] 
  },
  { 
    id: 'beauty', 
    name: 'สกินแคร์ & บิวตี้', 
    subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง', 'เครื่องสำอาง & ลิปสติก', 'บำรุงผิวกาย & น้ำหอม'] 
  },
  { 
    id: 'fashion', 
    name: 'แฟชั่น & เครื่องแต่งกาย', 
    subs: ['ทั้งหมด', 'เสื้อยืด & เสื้อครอป', 'กางเกง & ยีนส์', 'แจ็กเก็ต & ฮู้ดดี้', 'กระเป๋า & รองเท้า'] 
  },
  { 
    id: 'home', 
    name: 'ของแต่งบ้าน & ไลฟ์สไตล์', 
    subs: ['ทั้งหมด', 'โคมไฟ & ไฟแต่งห้อง', 'เครื่องหอม & อโรม่า', 'เฟอร์นิเจอร์ & ชั้นวาง', 'เครื่องครัว & แก้วน้ำ'] 
  },
  { 
    id: 'gaming', 
    name: 'เกมมิ่งเกียร์', 
    subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'] 
  },
  { 
    id: 'sports', 
    name: 'สปอร์ต & เอาต์ดอร์', 
    subs: ['ทั้งหมด', 'อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'] 
  }
];

// --- EXTENDED PRODUCTS CATALOG (30+ ITEMS) ---
const PRODUCTS_DATA: Product[] = [
  // --- IT & GADGETS ---
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB เครื่องศูนย์ไทย TH ประกันศูนย์ 1 ปีเต็ม',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 41900,
    originalPrice: 48900,
    rating: 4.9,
    soldCount: '2.1พัน+',
    badge: 'HOT',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra AI 5G กล้อง 200MP ซูม 100 เท่า',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 39900,
    originalPrice: 46900,
    rating: 4.9,
    soldCount: '1.8พัน+',
    badge: 'MALL',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80'
  },
  {
    id: 3,
    name: 'iPad Pro 11 นิ้ว M4 ชิปความเร็วสูง หน้าจอ Tandem OLED ชัดสมจริง',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 35900,
    originalPrice: 39900,
    rating: 5.0,
    soldCount: '920+',
    badge: 'ส่งฟรี',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'
  },
  {
    id: 4,
    name: 'iPad Air 6 รุ่นใหม่ 11 นิ้ว ชิป M2 รองรับ Apple Pencil Pro',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 21900,
    originalPrice: 24900,
    rating: 4.8,
    soldCount: '3.4พัน+',
    badge: 'BEST',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80'
  },
  {
    id: 5,
    name: 'MacBook Air M3 13 นิ้ว SSD 256GB เครื่องบางเบา แบตอึด 18 ชม.',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 34900,
    originalPrice: 39900,
    rating: 4.9,
    soldCount: '1.5พัน+',
    badge: 'MALL',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'
  },
  {
    id: 6,
    name: 'ASUS ROG Zephyrus G16 โน๊ตบุ๊คเกมมิ่ง RTX 4070 จอ 240Hz',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 59900,
    originalPrice: 65900,
    rating: 4.8,
    soldCount: '450+',
    badge: 'ลด 10%',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80'
  },
  {
    id: 7,
    name: 'คอมพิวเตอร์ตั้งโต๊ะจัดเซ็ต Core i7 Gen 14 + RTX 4060Ti พร้อมใช้งาน',
    mainCategory: 'it',
    subCategory: 'คอมพิวเตอร์',
    price: 29900,
    originalPrice: 35900,
    rating: 4.9,
    soldCount: '780+',
    badge: 'RECOMMEND',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&q=80'
  },
  {
    id: 8,
    name: 'USB 3.0 / Type-C HUB Adapter 4 ใน 1 แท่นต่อขยายโน๊ตบุ๊คและไอแพด',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 159,
    originalPrice: 450,
    rating: 4.8,
    soldCount: '12พัน+',
    badge: 'ถูกชัวร์',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500&q=80'
  },
  {
    id: 9,
    name: 'แท่นวางโน๊ตบุ๊ค อะลูมิเนียม ปรับความสูงได้ 7 ระดับ พกพาสะดวก',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 129,
    originalPrice: 320,
    rating: 4.9,
    soldCount: '9.2พัน+',
    badge: 'ส่งฟรี',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
  },

  // --- BEAUTY & SKINCARE ---
  {
    id: 10,
    name: 'Aura Hyaluron Concentrated Serum 50ml เติมความชุ่มชื้น ผิวฉ่ำวาว',
    mainCategory: 'beauty',
    subCategory: 'เซรั่ม & มอยส์เจอไรเซอร์',
    price: 380,
    originalPrice: 890,
    rating: 4.9,
    soldCount: '6.5พัน+',
    badge: 'BEST SELLER',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80'
  },
  {
    id: 11,
    name: 'UV Defense Sunscreen SPF50+ PA++++ เนื้อบางเบา คุมมัน กันน้ำ',
    mainCategory: 'beauty',
    subCategory: 'กันแดด & คลีนซิ่ง',
    price: 290,
    originalPrice: 550,
    rating: 4.8,
    soldCount: '15พัน+',
    badge: 'MALL',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80'
  },
  {
    id: 12,
    name: 'Velvet Matte Lipstick ลิปสติกเนื้อแมตต์กำมะหยี่ ติดทนนาน ไม่ตกร่อง',
    mainCategory: 'beauty',
    subCategory: 'เครื่องสำอาง & ลิปสติก',
    price: 199,
    originalPrice: 390,
    rating: 4.9,
    soldCount: '8.1พัน+',
    badge: 'HOT',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80'
  },
  {
    id: 13,
    name: 'Luxury Rose Body Lotion & Eau De Parfum เซ็ตโลชั่นบำรุงผิวและน้ำหอม',
    mainCategory: 'beauty',
    subCategory: 'บำรุงผิวกาย & น้ำหอม',
    price: 590,
    originalPrice: 1200,
    rating: 4.9,
    soldCount: '2.3พัน+',
    badge: 'PREMIUM',
    location: 'ปทุมธานี',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&q=80'
  },

  // --- FASHION ---
  {
    id: 14,
    name: 'Oversized Cotton T-Shirt เสื้อยืดสตรีทสไตล์ ทรงหลวม ผ้าคอตตอน 100%',
    mainCategory: 'fashion',
    subCategory: 'เสื้อยืด & เสื้อครอป',
    price: 180,
    originalPrice: 350,
    rating: 4.8,
    soldCount: '11พัน+',
    badge: 'HOT',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80'
  },
  {
    id: 15,
    name: 'Vintage Straight Denim Jeans กางเกงยีนส์ทรงกระบอกตรง สไตล์วินเทจ',
    mainCategory: 'fashion',
    subCategory: 'กางเกง & ยีนส์',
    price: 490,
    originalPrice: 890,
    rating: 4.7,
    soldCount: '4.2พัน+',
    badge: 'MALL',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80'
  },
  {
    id: 16,
    name: 'Urban Street Hoodie เสื้อแจ็กเก็ตฮู้ดดี้ผ้านุ่ม กันหนาว กันลม ใส่สบาย',
    mainCategory: 'fashion',
    subCategory: 'แจ็กเก็ต & ฮู้ดดี้',
    price: 390,
    originalPrice: 790,
    rating: 4.8,
    soldCount: '3.1พัน+',
    badge: 'RECOMMEND',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80'
  },
  {
    id: 17,
    name: 'Minimalist Leather Canvas Bag กระเป๋าหนังผสมผ้าแคนวาส ทรงสวย',
    mainCategory: 'fashion',
    subCategory: 'กระเป๋า & รองเท้า',
    price: 320,
    originalPrice: 650,
    rating: 4.9,
    soldCount: '5.6พัน+',
    badge: 'ส่งฟรี',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80'
  },

  // --- HOME & LIFESTYLE ---
  {
    id: 18,
    name: 'Minimalist LED Desk Lamp โคมไฟอ่านหนังสือ ปรับแสงได้ 3 โหมด ถนอมสายตา',
    mainCategory: 'home',
    subCategory: 'โคมไฟ & ไฟแต่งห้อง',
    price: 250,
    originalPrice: 590,
    rating: 4.9,
    soldCount: '7.8พัน+',
    badge: 'MALL',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80'
  },
  {
    id: 19,
    name: 'Aroma Scented Soy Candle เทียนหอมไขถั่วเหลืองธรรมชาติ สร้างบรรยากาศผ่อนคลาย',
    mainCategory: 'home',
    subCategory: 'เครื่องหอม & อโรม่า',
    price: 159,
    originalPrice: 320,
    rating: 4.9,
    soldCount: '4.5พัน+',
    badge: 'BEST',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80'
  },
  {
    id: 20,
    name: 'Wooden Desktop Organizer ชั้นวางจอคอมอเนกประสงค์ พร้อมช่องเก็บของ',
    mainCategory: 'home',
    subCategory: 'เฟอร์นิเจอร์ & ชั้นวาง',
    price: 290,
    originalPrice: 600,
    rating: 4.8,
    soldCount: '12พัน+',
    badge: 'ถูกชัวร์',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80'
  },
  {
    id: 21,
    name: 'Stainless Tumbler 900ml แก้วน้ำเก็บความเย็น-ร้อน ไร้หยดน้ำเกาะ',
    mainCategory: 'home',
    subCategory: 'เครื่องครัว & แก้วน้ำ',
    price: 220,
    originalPrice: 450,
    rating: 4.9,
    soldCount: '18พัน+',
    badge: 'HOT',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80'
  },

  // --- GAMING GEAR ---
  {
    id: 22,
    name: 'RGB Mechanical Gaming Keyboard คีย์บอร์ดเกมมิ่ง ไฟ RGB สวิตช์ไทย',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 690,
    originalPrice: 1290,
    rating: 4.8,
    soldCount: '9.4พัน+',
    badge: 'MALL',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80'
  },
  {
    id: 23,
    name: '7.1 Surround Gaming Headset หูฟังเกมมิ่งพร้อมไมโครโฟนตัดเสียงรบกวน',
    mainCategory: 'gaming',
    subCategory: 'หูฟัง & ไมโครโฟน',
    price: 550,
    originalPrice: 1100,
    rating: 4.8,
    soldCount: '6.1พัน+',
    badge: 'BEST',
    location: 'สมุทรสาคร',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80'
  },
  {
    id: 24,
    name: 'Gaming Monitor 27 นิ้ว FHD 240Hz 1ms จอโค้งเพื่อการเล่นเกมลื่นไหล',
    mainCategory: 'gaming',
    subCategory: 'จอมอนิเตอร์ & โต๊ะเก้าอี้',
    price: 4990,
    originalPrice: 6900,
    rating: 4.9,
    soldCount: '1.2พัน+',
    badge: 'RECOMMEND',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80'
  },

  // --- SPORTS & OUTDOORS ---
  {
    id: 25,
    name: 'Resistance Bands Set เซ็ตสายยางยืดออกกำลังกาย 5 ระดับ พร้อมถุงพกพา',
    mainCategory: 'sports',
    subCategory: 'อุปกรณ์ออกกำลังกาย',
    price: 149,
    originalPrice: 350,
    rating: 4.8,
    soldCount: '14พัน+',
    badge: 'ถูกชัวร์',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80'
  },
  {
    id: 26,
    name: 'Automatic Camping Tent เต็นท์สนามกางอัตโนมัติ กันน้ำ กัน UV สำหรับ 3-4 คน',
    mainCategory: 'sports',
    subCategory: 'แคมปิ้ง & เต็นท์',
    price: 890,
    originalPrice: 1890,
    rating: 4.9,
    soldCount: '3.8พัน+',
    badge: 'ส่งฟรี',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=80'
  },
  {
    id: 27,
    name: 'Lightweight Running Shoes รองเท้าวิ่งและออกกำลังกาย ระบายอากาศได้ดี',
    mainCategory: 'sports',
    subCategory: 'รองเท้า & เสื้อผ้ากีฬา',
    price: 450,
    originalPrice: 990,
    rating: 4.8,
    soldCount: '7.5พัน+',
    badge: 'HOT',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'
  }
];

// SVG Fallback URI (Indigo Palette Theme)
const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="500" height="500" fill="%23EEF2FF"/><text x="50%" y="45%" font-family="sans-serif" font-size="28" font-weight="bold" fill="%234F46E5" text-anchor="middle">367 Official Store</text><text x="50%" y="55%" font-family="sans-serif" font-size="18" fill="%236B7280" text-anchor="middle">สินค้าคุณภาพ พร้อมจัดส่ง</text></svg>`;

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Order Modal States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

  // Checkout Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'promptpay'
  });

  // Subcategories Memo
  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs : [];
  }, [selectedMainCat]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(item => {
      const matchMain = selectedMainCat === 'all' || item.mainCategory === selectedMainCat;
      const matchSub = selectedSubCat === 'ทั้งหมด' || item.subCategory === selectedSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMain && matchSub && matchSearch;
    });
  }, [selectedMainCat, selectedSubCat, searchQuery]);

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalCartPrice = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  // Submit Order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedOrderId(`367-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderSuccess(true);
    setTimeout(() => {
      setCart([]);
      setOrderSuccess(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-24">
      
      {/* 🔮 Top Banner Bar - Midnight & Emerald */}
      <div className="bg-slate-900 text-slate-200 text-xs sm:text-sm py-2 px-4 font-medium border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              367 VIP
            </span>
            <span>⚡ สั่งซื้อวันนี้ รับคูปองส่วนลดสูงสุด 500 บาท + ส่งฟรีทั่วประเทศ</span>
          </div>
          <span className="hidden md:inline text-xs text-slate-400">ร้านค้าทางการ 367 Flagship Store</span>
        </div>
      </div>

      {/* 🚀 Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Cyber Indigo Logo "367 Shop" */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => { setSelectedMainCat('all'); setSelectedSubCat('ทั้งหมด'); setSearchQuery(''); }}
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              367
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                367 <span className="text-indigo-600">STORE</span>
              </span>
              <span className="text-[10px] bg-slate-900 text-emerald-400 font-bold px-2 py-0.5 rounded mt-1 inline-block tracking-widest uppercase">
                Official Premium
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าในร้าน 367..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 text-sm sm:text-base bg-slate-100 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 rounded-xl transition text-xs sm:text-sm shadow-sm">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold px-4 py-2.5 rounded-2xl transition shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline text-sm">ตะกร้า</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-white shadow">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* 🏷️ Main & Sub Categories Navigation */}
      <nav className="bg-white border-b border-slate-200 py-3 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedMainCat(cat.id);
                  setSelectedSubCat('ทั้งหมด');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategories Pill Navigation */}
          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto mt-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-indigo-400 uppercase whitespace-nowrap mr-1">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCat(sub)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubCat === sub
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* 🛍️ Main Product Grid */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              {selectedSubCat !== 'ทั้งหมด' && <span className="text-indigo-600"> &gt; {selectedSubCat}</span>}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              คัดสรรสินค้าคุณภาพ {filteredProducts.length} รายการสำหรับคุณ
            </p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_SVG;
                      }}
                    />
                    
                    {/* Unique Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.badge && (
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm tracking-wider">
                          {product.badge}
                        </span>
                      )}
                      <span className="bg-slate-900 text-indigo-300 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        367 VIP
                      </span>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-3 sm:p-4">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-1.5">
                      {product.subCategory}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 h-9 leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span>ขายแล้ว {product.soldCount}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="p-3 sm:p-4 pt-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-black text-indigo-600">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      📍 {product.location}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-xl shadow transition-all active:scale-95"
                      title="เพิ่มลงตะกร้า"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 my-8">
            <p className="text-lg font-bold text-slate-700">ไม่พบสินค้าที่คุณกำลังค้นหา</p>
            <button
              onClick={() => { setSelectedMainCat('all'); setSelectedSubCat('ทั้งหมด'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
            >
              ดูสินค้าทั้งหมดในร้าน
            </button>
          </div>
        )}
      </main>

      {/* 🛒 Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            
            {/* Cart Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black">ตะกร้าสินค้า (367 Store)</span>
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-white border"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_SVG; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                      <p className="text-sm font-black text-indigo-600 mt-0.5">฿{item.product.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 bg-white border border-slate-300 rounded-md text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 bg-white border border-slate-300 rounded-md text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 font-medium text-sm">
                  ไม่มีสินค้าในตะกร้า
                </div>
              )}
            </div>

            {/* Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                <div className="flex justify-between items-center text-base font-black">
                  <span>ราคารวมทั้งหมด:</span>
                  <span className="text-xl text-indigo-600">฿{totalCartPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-xl shadow-lg transition"
                >
                  ดำเนินการสั่งซื้อ &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📄 Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative border border-slate-100">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {orderSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  ✓
                </div>
                <h3 className="text-xl font-black text-slate-900">สั่งซื้อสินค้าสำเร็จ!</h3>
                <p className="text-slate-500 text-sm mt-1">หมายเลขคำสั่งซื้อ: <span className="font-bold text-indigo-600">{generatedOrderId}</span></p>
                <p className="text-xs text-slate-400 mt-2">ขอบคุณที่วางใจเลือกอุดหนุนร้าน 367 Store ครับ</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 border-b pb-3">ยืนยันคำสั่งซื้อ (367 Official)</h3>

                {/* Items Summary */}
                <div className="max-h-28 overflow-y-auto space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  {cart.map((c) => (
                    <div key={c.product.id} className="flex justify-between font-medium">
                      <span className="truncate max-w-[240px]">{c.product.name} x {c.quantity}</span>
                      <span className="font-bold text-indigo-600">฿{(c.product.price * c.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Form Controls */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ชื่อ-นามสกุล ผู้รับ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081-234-5678"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ที่อยู่จัดส่ง *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">วิธีการชำระเงิน</label>
                    <select
                      value={formData.payment}
                      onChange={e => setFormData({ ...formData, payment: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-indigo-600"
                    >
                      <option value="promptpay">สแกน QR พร้อมเพย์ (PromptPay)</option>
                      <option value="cod">เก็บเงินปลายทาง (COD)</option>
                      <option value="card">บัตรเครดิต / บัตรเดบิต</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400">ยอดชำระสุทธิ</p>
                    <p className="text-xl font-black text-indigo-600">฿{totalCartPrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-md transition"
                  >
                    ยืนยันการชำระเงิน
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
