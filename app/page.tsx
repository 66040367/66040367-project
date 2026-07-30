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

// --- CATEGORY & SUBCATEGORY CONFIGURATION ---
const MAIN_CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด' },
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

// --- HIGH QUALITY DIRECT RELIABLE UNSPLASH IMAGES ---
const PRODUCT_DATA_RAW = [
  // --- อุปกรณ์ไอที (IT) ---
  {
    name: 'iPhone 15 Pro Max 256GB เครื่องศูนย์ไทย TH พร้อมประกัน',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 41900,
    originalPrice: 48900,
    rating: 4.9,
    soldCount: '1.8พัน+',
    badge: 'PAYDAY',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Samsung Galaxy S24 Ultra AI 5G กล้อง 200MP ซูม 100 เท่า',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 39900,
    originalPrice: 46900,
    rating: 4.9,
    soldCount: '2.5พัน+',
    badge: 'ร้านแนะนำ',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'iPad Pro 11 นิ้ว M4 ชิปความเร็วสูง หน้าจอ Tandem OLED',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 35900,
    originalPrice: 39900,
    rating: 5.0,
    soldCount: '850+',
    badge: 'ส่งฟรี',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'iPad Air 6 รุ่นใหม่ 11 นิ้ว ชิป M2 รองรับ Apple Pencil Pro',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 21900,
    originalPrice: 24900,
    rating: 4.8,
    soldCount: '3.1พัน+',
    badge: 'PAYDAY',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'MacBook Air M3 13 นิ้ว SSD 256GB เครื่องบางเบา แบตอึด 18 ชม.',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 34900,
    originalPrice: 39900,
    rating: 4.9,
    soldCount: '1.2พัน+',
    badge: 'ร้านแนะนำ',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'ASUS ROG Zephyrus G16 โน๊ตบุ๊คเกมมิ่ง RTX 4070 จอ 240Hz',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 59900,
    originalPrice: 65900,
    rating: 4.8,
    soldCount: '420+',
    badge: 'ลดแรง',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'คอมพิวเตอร์ตั้งโต๊ะจัดเซ็ต Core i7 Gen 14 + RTX 4060Ti พร้อมใช้งาน',
    mainCategory: 'it',
    subCategory: 'คอมพิวเตอร์',
    price: 29900,
    originalPrice: 35900,
    rating: 4.9,
    soldCount: '650+',
    badge: 'PAYDAY',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'USB 3.0 / Type-C HUB Adapter 4 ใน 1 แท่นต่อขยายโน๊ตบุ๊คและไอแพด',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 159,
    originalPrice: 450,
    rating: 4.8,
    soldCount: '10พัน+ ชิ้น',
    badge: 'ช้อปปี้ถูกชัวร์',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'แท่นวางโน๊ตบุ๊คและไอแพด อะลูมิเนียม ปรับความสูงได้ 7 ระดับ พกพาสะดวก',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 129,
    originalPrice: 320,
    rating: 4.9,
    soldCount: '8.4พัน+',
    badge: 'ส่งฟรี',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
  },

  // --- สกินแคร์ & บิวตี้ ---
  {
    name: 'Aura เซรั่มไฮยาลูรอนสูตรเข้มข้น 50ml เติมความชุ่มชื้น ผิวฉ่ำวาว',
    mainCategory: 'beauty',
    subCategory: 'เซรั่ม & มอยส์เจอไรเซอร์',
    price: 380,
    originalPrice: 890,
    rating: 4.9,
    soldCount: '5.2พัน+',
    badge: 'ขายดี',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Glow ครีมกันแดด SPF50+ PA++++ เนื้อบางเบา คุมมัน คืนความสดใส',
    mainCategory: 'beauty',
    subCategory: 'กันแดด & คลีนซิ่ง',
    price: 290,
    originalPrice: 550,
    rating: 4.8,
    soldCount: '12พัน+ ชิ้น',
    badge: 'ร้านแนะนำ',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Velvet ลิปแมตต์เนื้อกำมะหยี่ ติดทนนาน 16 ชั่วโมง ไม่ติดแมสก์',
    mainCategory: 'beauty',
    subCategory: 'เครื่องสำอาง & ลิปสติก',
    price: 189,
    originalPrice: 350,
    rating: 4.7,
    soldCount: '9.1พัน+',
    badge: 'PAYDAY',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Luxe น้ำหอม Eau De Parfum 50ml กลิ่นดอกไม้ฝรั่งเศส หอมติดทนทั้งวัน',
    mainCategory: 'beauty',
    subCategory: 'บำรุงผิวกาย & น้ำหอม',
    price: 690,
    originalPrice: 1290,
    rating: 4.9,
    soldCount: '2.1พัน+',
    badge: 'ส่งฟรี',
    location: 'ปทุมธานี',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  },

  // --- แฟชั่น & เครื่องแต่งกาย ---
  {
    name: 'SUN เสื้อครอปคอวิลิก แขนระบาย ผูกเอว สไตล์ซัมเมอร์ 2026 น่ารักพรีเมียม',
    mainCategory: 'fashion',
    subCategory: 'เสื้อยืด & เสื้อครอป',
    price: 94,
    originalPrice: 212,
    rating: 4.8,
    soldCount: '2พัน+ ชิ้น',
    badge: 'ลด 56%',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'BOOM Baby Tee เสื้อยืดเบบี้ที สกรีนลายสตรีท ทรงสวยผ้าคอตตอน 100%',
    mainCategory: 'fashion',
    subCategory: 'เสื้อยืด & เสื้อครอป',
    price: 62,
    originalPrice: 138,
    rating: 4.8,
    soldCount: '521 ชิ้น',
    badge: 'ร้านแนะนำ',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'กางเกงยีนส์ทรงกระบอกใหญ่สไตล์วินเทจ Y2K เอวสูง เก็บทรงสวย',
    mainCategory: 'fashion',
    subCategory: 'กางเกง & ยีนส์',
    price: 259,
    originalPrice: 590,
    rating: 4.7,
    soldCount: '4.3พัน+',
    badge: 'PAYDAY',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'รองเท้าผ้าใบสตรีทแฟชั่น มินิมอล ใส่สบายแมตช์ได้กับทุกชุด',
    mainCategory: 'fashion',
    subCategory: 'กระเป๋า & รองเท้า',
    price: 490,
    originalPrice: 1100,
    rating: 4.9,
    soldCount: '6.7พัน+',
    badge: 'ส่งฟรี',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80'
  },

  // --- ของแต่งบ้าน & ไลฟ์สไตล์ ---
  {
    name: '75cm ชั้นวางจอคอม แท่นวางโต๊ะทำงาน จัดระเบียบโต๊ะ เพิ่มความสูงจอ',
    mainCategory: 'home',
    subCategory: 'เฟอร์นิเจอร์ & ชั้นวาง',
    price: 45,
    originalPrice: 80,
    rating: 4.9,
    soldCount: '10พัน+ ชิ้น',
    badge: 'ช้อปปี้ถูกชัวร์',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'โคมไฟตั้งโต๊ะมินิมอล ปรับแสงได้ 3 โทนสี ชาร์จ USB ถนอมสายตา',
    mainCategory: 'home',
    subCategory: 'โคมไฟ & ไฟแต่งห้อง',
    price: 199,
    originalPrice: 450,
    rating: 4.8,
    soldCount: '3.4พัน+',
    badge: 'ร้านแนะนำ',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'แก้วน้ำเก็บความเย็น สแตนเลส 304 ขนาด 900ml เก็บความเย็นได้นาน 24 ชม.',
    mainCategory: 'home',
    subCategory: 'เครื่องครัว & แก้วน้ำ',
    price: 169,
    originalPrice: 390,
    rating: 4.9,
    soldCount: '15พัน+ ชิ้น',
    badge: 'PAYDAY',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
  },

  // --- เกมมิ่งเกียร์ ---
  {
    name: 'BASIKE Mechanical Gaming Keyboard ไฟ RGB สวิตช์ไทย 101 คีย์',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 195,
    originalPrice: 590,
    rating: 4.8,
    soldCount: '8.2พัน+',
    badge: 'ลด 67%',
    location: 'สมุทรสาคร',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'เมาส์เกมมิ่งไร้สาย 16000 DPI น้ำหนักเบา 59 กรัม ไฟ RGB Custom',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 590,
    originalPrice: 1290,
    rating: 4.9,
    soldCount: '3.1พัน+',
    badge: 'ส่งฟรี',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'หูฟังเกมมิ่ง Surround 7.1 ไมค์ตัดเสียงรบกวน ฟองน้ำนุ่มใส่สบาย',
    mainCategory: 'gaming',
    subCategory: 'หูฟัง & ไมโครโฟน',
    price: 450,
    originalPrice: 990,
    rating: 4.8,
    soldCount: '4.5พัน+',
    badge: 'PAYDAY',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
  },

  // --- สปอร์ต & เอาต์ดอร์ ---
  {
    name: 'เสื่อโยคะ TPE หนา 8mm กันลื่น ซับแรงกระแทก แถมฟรีสายสะพาย',
    mainCategory: 'sports',
    subCategory: 'อุปกรณ์ออกกำลังกาย',
    price: 220,
    originalPrice: 490,
    rating: 4.9,
    soldCount: '7.8พัน+',
    badge: 'ร้านแนะนำ',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'เต็นท์สนามกางอัตโนมัติ กันน้ำ กัน UV นอนได้ 3-4 คน พกพาสะดวก',
    mainCategory: 'sports',
    subCategory: 'แคมปิ้ง & เต็นท์',
    price: 790,
    originalPrice: 1890,
    rating: 4.8,
    soldCount: '2.9พัน+',
    badge: 'ส่งฟรี',
    location: 'ปทุมธานี',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80'
  }
];

// Fallback image generator (guarantees NO BROKEN IMAGES)
const getFallbackSvg = (text: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#FFF5F2"/>
    <rect x="20" y="20" width="560" height="560" rx="20" fill="#FFE8E0" stroke="#FF5722" stroke-width="4" stroke-dasharray="8 8"/>
    <circle cx="300" cy="240" r="80" fill="#FF5722" opacity="0.15"/>
    <path d="M260 260 L340 260 L320 220 L300 240 L280 210 Z" fill="#FF5722"/>
    <text x="300" y="380" font-family="sans-serif" font-size="28" font-weight="bold" fill="#EE4D2D" text-anchor="middle">367 Official Product</text>
    <text x="300" y="420" font-family="sans-serif" font-size="20" fill="#666" text-anchor="middle">${text.slice(0, 25)}...</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart & Checkout States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  // Address Form State
  const [address, setAddress] = useState({ name: '', phone: '', detail: '', payment: 'promptpay' });

  // Get current subcategories list for active main category
  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs || [] : [];
  }, [selectedMainCat]);

  // Filter products dynamically
  const filteredProducts = useMemo(() => {
    return PRODUCT_DATA_RAW.filter(item => {
      const matchMain = selectedMainCat === 'all' || item.mainCategory === selectedMainCat;
      const matchSub = selectedSubCat === 'ทั้งหมด' || item.subCategory === selectedSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMain && matchSub && matchSearch;
    });
  }, [selectedMainCat, selectedSubCat, searchQuery]);

  // Cart helper functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.name === product.name);
      if (existing) {
        return prev.map(item =>
          item.product.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productName: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.name === productName) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setCart([]);
      setOrderSuccess(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-slate-800 font-sans pb-20">
      
      {/* 🌟 Top Promo Banner (Shopee Style) */}
      <div className="bg-[#EE4D2D] text-white text-xs sm:text-sm py-1.5 px-4 font-medium flex justify-between items-center shadow-inner">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="bg-white text-[#EE4D2D] font-black px-2 py-0.5 rounded text-xs">PAYDAY</span>
            <span>🔥 ร้านค้าช้อปปี้แนะนำ 367 | แจกโค้ดส่วนลดสูงสุด 80% + ส่งฟรีขั้นต่ำ ฿0</span>
          </span>
          <span className="hidden md:inline text-xs opacity-90">ดาวน์โหลดแอป 367 Shop | ติดต่อฝ่ายบริการลูกค้า</span>
        </div>
      </div>

      {/* 🚀 Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Shop Brand Logo "367" */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => { setSelectedMainCat('all'); setSelectedSubCat('ทั้งหมด'); setSearchQuery(''); }}
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-[#FF5722] to-[#EE4D2D] text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md shadow-orange-200">
              367
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                367 <span className="text-[#EE4D2D]">Shop</span>
              </span>
              <span className="text-xs bg-[#EE4D2D] text-white font-bold px-1.5 py-0.2 rounded mt-1 inline-block">
                Mall Official
              </span>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าในร้าน 367..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-3 text-base bg-slate-100 border-2 border-[#EE4D2D]/20 rounded-2xl focus:bg-white focus:border-[#EE4D2D] focus:outline-none transition-all placeholder:text-slate-400 font-medium"
              />
              <svg className="w-6 h-6 text-[#EE4D2D] absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button className="absolute right-2 top-2 bottom-2 bg-[#EE4D2D] hover:bg-[#d63f21] text-white font-bold px-5 rounded-xl transition text-sm">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#EE4D2D] font-bold px-5 py-3 rounded-2xl transition shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline text-base">ตะกร้า</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#EE4D2D] text-white text-xs font-black px-2 py-0.5 rounded-full border-2 border-white animate-pulse">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* 🏷️ Main Categories Nav Bar */}
      <nav className="bg-white border-b border-slate-200 py-3 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedMainCat(cat.id);
                  setSelectedSubCat('ทั้งหมด');
                }}
                className={`px-5 py-2.5 rounded-xl text-base font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-[#EE4D2D] text-white shadow-md shadow-orange-200 scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategories (หมวดย่อย) Display */}
          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCat(sub)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedSubCat === sub
                      ? 'bg-orange-100 text-[#EE4D2D] border border-orange-300 font-bold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
        
        {/* Active Filter Info */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name} 
              {selectedSubCat !== 'ทั้งหมด' && <span className="text-[#EE4D2D]"> &gt; {selectedSubCat}</span>}
            </h1>
            <p className="text-slate-500 text-base mt-1 font-medium">
              พบสินค้าคุณภาพ {filteredProducts.length} รายการจากร้าน 367
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
              >
                {/* Product Image with Fail-safe Fallback */}
                <div className="relative aspect-square bg-slate-50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackSvg(product.name);
                    }}
                  />
                  {/* Badge Overlays (Shopee Style) */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.badge && (
                      <span className="bg-[#EE4D2D] text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                        {product.badge}
                      </span>
                    )}
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded shadow">
                      ร้านแนะนำ
                    </span>
                  </div>
                </div>

                {/* Content Container - Big clear text */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 hover:text-[#EE4D2D] transition-colors leading-snug">
                      {product.name}
                    </h3>

                    {/* Tags & Rating */}
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span>ขายแล้ว {product.soldCount}</span>
                    </div>
                  </div>

                  {/* Price & Location */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-[#EE4D2D]">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        {product.location}
                      </span>

                      {/* Add to Cart Action */}
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#EE4D2D] hover:bg-[#d63f21] text-white font-bold p-2.5 rounded-xl shadow transition-all active:scale-95"
                        title="เพิ่มลงตะกร้า"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 my-8">
            <p className="text-2xl font-bold text-slate-700">ไม่พบสินค้าในหมวดหมู่นี้</p>
            <p className="text-slate-500 text-base mt-2">ลองเลือกระบุหมวดหมู่อื่นดูนะครับ</p>
            <button
              onClick={() => { setSelectedMainCat('all'); setSelectedSubCat('ทั้งหมด'); setSearchQuery(''); }}
              className="mt-4 px-6 py-2.5 bg-[#EE4D2D] text-white rounded-xl font-bold text-base hover:bg-[#d63f21] transition"
            >
              ดูสินค้าทั้งหมด
            </button>
          </div>
        )}
      </main>

      {/* 🛒 Shopping Cart Slide-over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900">ตะกร้าสินค้าของคุณ</span>
                <span className="bg-[#EE4D2D] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalCartItems} รายการ
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length > 0 ? (
                cart.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-white border"
                      onError={(e) => { (e.target as HTMLImageElement).src = getFallbackSvg(item.product.name); }}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-base font-black text-[#EE4D2D]">฿{item.product.price.toLocaleString()}</p>
                      
                      {/* Quantity buttons */}
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          onClick={() => updateQuantity(item.product.name, -1)}
                          className="w-7 h-7 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.name, 1)}
                          className="w-7 h-7 bg-white border border-slate-300 rounded-lg text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <p className="text-lg font-bold">ไม่มีสินค้าในตะกร้า</p>
                  <p className="text-sm mt-1">เลือกสินค้าที่คุณชอบแล้วเพิ่มลงตะกร้าได้เลย!</p>
                </div>
              )}
            </div>

            {/* Drawer Footer / Checkout button */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-white space-y-3">
                <div className="flex justify-between items-center text-lg font-black">
                  <span>ราคารวมทั้งหมด:</span>
                  <span className="text-2xl text-[#EE4D2D]">฿{totalCartPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 bg-[#EE4D2D] hover:bg-[#d63f21] text-white font-black text-lg rounded-xl shadow-lg transition"
                >
                  ไปที่หน้าชำระเงิน &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📄 Checkout & Order Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 relative">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-xl"
            >
              ✕
            </button>

            {orderSuccess ? (
              /* Success Screen */
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900">สั่งซื้อสินค้าสำเร็จ!</h3>
                <p className="text-slate-500 mt-2 font-medium">หมายเลขคำสั่งซื้อ: <span className="font-bold text-[#EE4D2D]">#367-{(Math.random()*1000000).toFixed(0)}</span></p>
                <p className="text-sm text-slate-400 mt-1">ร้านค้า 367 กำลังเตรียมจัดส่งสินค้าให้คุณ</p>
              </div>
            ) : (
              /* Order Form */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 border-b pb-3">ยืนยันคำสั่งซื้อ (367 Shop)</h3>

                {/* Items Summary */}
                <div className="max-h-32 overflow-y-auto space-y-2 bg-slate-50 p-3 rounded-xl border">
                  {cart.map((c, idx) => (
                    <div key={idx} className="flex justify-between text-sm font-medium">
                      <span className="line-clamp-1">{c.product.name} x {c.quantity}</span>
                      <span className="font-bold text-[#EE4D2D]">฿{(c.product.price * c.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600">ชื่อ-นามสกุล ผู้รับ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={address.name}
                      onChange={e => setAddress({ ...address, name: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-slate-100 border rounded-xl text-sm focus:outline-none focus:border-[#EE4D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081-234-5678"
                      value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-slate-100 border rounded-xl text-sm focus:outline-none focus:border-[#EE4D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">ที่อยู่จัดส่ง *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={address.detail}
                      onChange={e => setAddress({ ...address, detail: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-slate-100 border rounded-xl text-sm focus:outline-none focus:border-[#EE4D2D]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">วิธีการชำระเงิน</label>
                    <select
                      value={address.payment}
                      onChange={e => setAddress({ ...address, payment: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-slate-100 border rounded-xl text-sm font-bold focus:outline-none focus:border-[#EE4D2D]"
                    >
                      <option value="promptpay">สแกน QR พร้อมเพย์ (PromptPay)</option>
                      <option value="cod">เก็บเงินปลายทาง (COD)</option>
                      <option value="card">บัตรเครดิต / บัตรเดบิต</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400">ยอดชำระสุทธิ</p>
                    <p className="text-2xl font-black text-[#EE4D2D]">฿{totalCartPrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#EE4D2D] hover:bg-[#d63f21] text-white font-black rounded-xl shadow-lg transition"
                  >
                    ยืนยันสั่งซื้อ
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
