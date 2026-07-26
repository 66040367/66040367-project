'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Plus, Minus, Trash2, X, CheckCircle2, Truck, Eye, Filter, Flame, Zap, ShieldCheck } from 'lucide-react';

interface ReviewBreakdown {
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: number;
  category: string;
  subCategory: string;
  badge?: 'HOT' | 'SALE' | 'NEW';
  images: string[];
  description: string;
  reviews: ReviewBreakdown;
  searchKeywords: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 🎯 คลังรูปภาพแยกเฉพาะแบบเจาะจง 100% ไม่ซ้ำ ไม่วนมั่ว
const PRODUCT_DATA_SOURCE: Record<string, { name: string; images: string[] }[]> = {
  export interface ProductItem {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  sold: number;
  image: string;
  badge?: 'HOT' | 'SALE' | 'NEW';
  spec: string;
}

export const TOP_PRODUCTS_DATA: ProductItem[] = [
  // ==========================================
  // 💻 หมวดหมู่: คอมพิวเตอร์ & IT ตัวท็อป
  // ==========================================
  
  // --- จอคอมพิวเตอร์ (Monitor) ---
  {
    id: 101,
    name: 'ASUS ROG Swift OLED PG32UCDM 31.5" 4K 240Hz',
    category: 'electronics',
    subCategory: 'จอคอม',
    price: 49900,
    originalPrice: 53900,
    rating: 5.0,
    sold: 142,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    badge: 'HOT',
    spec: 'QD-OLED 0.03ms, Type-C 90W, KVM Switch'
  },
  {
    id: 102,
    name: 'Samsung Odyssey OLED G9 49" Dual QHD 240Hz Curved',
    category: 'electronics',
    subCategory: 'จอคอม',
    price: 52900,
    originalPrice: 59900,
    rating: 4.9,
    sold: 89,
    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80',
    badge: 'SALE',
    spec: '0.03ms GTG, Smart TV OS, Neo Quantum Processor'
  },
  {
    id: 103,
    name: 'LG UltraGear 27GS95QE-B 27" OLED QHD 240Hz',
    category: 'electronics',
    subCategory: 'จอคอม',
    price: 29900,
    originalPrice: 32900,
    rating: 4.8,
    sold: 210,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
    spec: 'G-Sync Compatible, DisplayHDR True Black 400'
  },

  // --- CPU ---
  {
    id: 110,
    name: 'Intel Core i9-14900KS LGA1700 (6.2GHz Turbo)',
    category: 'electronics',
    subCategory: 'CPU',
    price: 26900,
    originalPrice: 28900,
    rating: 4.9,
    sold: 310,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    badge: 'HOT',
    spec: '24 Cores (8P+16E) 32 Threads, 36MB Smart Cache'
  },
  {
    id: 111,
    name: 'AMD Ryzen 7 7800X3D AM5 (ตัวท็อปสายเกมมิ่งอันดับ 1)',
    category: 'electronics',
    subCategory: 'CPU',
    price: 15900,
    originalPrice: 17500,
    rating: 5.0,
    sold: 850,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80',
    badge: 'HOT',
    spec: '8 Cores 16 Threads, 3D V-Cache 96MB'
  },

  // --- แรม (RAM) ---
  {
    id: 120,
    name: 'G.SKILL Trident Z5 RGB 64GB (32GBx2) DDR5 6400MHz Cl32',
    category: 'electronics',
    subCategory: 'แรม',
    price: 9890,
    originalPrice: 11200,
    rating: 4.9,
    sold: 430,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
    spec: 'Intel XMP 3.0 Ready, Aluminum Heatspreader'
  },
  {
    id: 121,
    name: 'CORSAIR DOMINATOR TITANIUM RGB 32GB (16GBx2) DDR5 7200MHz',
    category: 'electronics',
    subCategory: 'แรม',
    price: 8490,
    originalPrice: 9500,
    rating: 5.0,
    sold: 190,
    image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=800&q=80',
    badge: 'NEW',
    spec: 'DHX Cooling Technology, Custom Top Bars'
  },

  // --- เมาส์ (Mouse) ---
  {
    id: 130,
    name: 'Logitech G PRO X SUPERLIGHT 2 Wireless Gaming Mouse',
    category: 'electronics',
    subCategory: 'เมาส์',
    price: 5290,
    originalPrice: 5990,
    rating: 5.0,
    sold: 1200,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    badge: 'HOT',
    spec: 'HERO 2 Sensor 32,000 DPI, น้ำหนักเบาพิเศษ 60g, 2000Hz Polling'
  },
  {
    id: 131,
    name: 'Razer Viper V3 Pro Wireless - Black Edition',
    category: 'electronics',
    subCategory: 'เมาส์',
    price: 5690,
    originalPrice: 6290,
    rating: 4.9,
    sold: 640,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    spec: 'Focus Pro 35K Gen-2 Optical Sensor, 8000Hz HyperPolling'
  },

  // --- ไมค์ (Microphone) ---
  {
    id: 140,
    name: 'Shure SM7B Dynamic Studio Vocal Microphone',
    category: 'electronics',
    subCategory: 'ไมค์',
    price: 16900,
    originalPrice: 18500,
    rating: 5.0,
    sold: 520,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    badge: 'HOT',
    spec: 'Cardioid XLR Studio Standard, Air Suspension Shock Isolation'
  },
  {
    id: 141,
    name: 'Rode NT-USB+ Professional USB Microphone',
    category: 'electronics',
    subCategory: 'ไมค์',
    price: 7290,
    originalPrice: 8100,
    rating: 4.8,
    sold: 310,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    spec: 'Revolution Preamp, High-power Headphone Output, USB-C'
  },

  // --- หูฟัง (Headphones) ---
  {
    id: 150,
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    category: 'electronics',
    subCategory: 'หูฟัง',
    price: 12990,
    originalPrice: 14900,
    rating: 4.9,
    sold: 1580,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    badge: 'HOT',
    spec: 'Auto NC Optimizer, 8 Mics for ANC, Battery 30 Hrs, LDAC'
  },

  // --- โน๊ตบุ๊ค (Laptop) ---
  {
    id: 160,
    name: 'ASUS ROG Strix SCAR 18 (i9-14900HX / RTX 4090 / RAM 64GB / SSD 2TB)',
    category: 'electronics',
    subCategory: 'โน๊ตบุ๊ค',
    price: 139900,
    originalPrice: 149900,
    rating: 5.0,
    sold: 45,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    badge: 'HOT',
    spec: '18" ROG Nebula HDR 2.5K 240Hz Mini LED, Conductonaut Extreme Liquid Metal'
  },

  // --- โทรศัพท์ (Smartphone) ---
  {
    id: 170,
    name: 'iPhone 15 Pro Max 1TB Titanium Black',
    category: 'electronics',
    subCategory: 'โทรศัพท์',
    price: 63900,
    originalPrice: 66900,
    rating: 4.9,
    sold: 2100,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    badge: 'HOT',
    spec: 'A17 Pro Chip, 5x Telephoto Camera, Aerospace-Grade Titanium'
  },
  {
    id: 171,
    name: 'Samsung Galaxy S24 Ultra 1TB Titanium Gray (พร้อม S-Pen)',
    category: 'electronics',
    subCategory: 'โทรศัพท์',
    price: 62900,
    originalPrice: 65900,
    rating: 4.9,
    sold: 1890,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
    badge: 'HOT',
    spec: 'Snapdragon 8 Gen 3, Galaxy AI Built-in, 200MP Main Camera'
  },

  // --- คอมประกอบ IHAVECPU สเปกเทพ ---
  {
    id: 180,
    name: 'คอมประกอบ iHAVECPU : Intel i9-14900K + RTX 4090 24GB + RAM 64GB DDR5 (ชุดน้ำ 3 ตอน)',
    category: 'electronics',
    subCategory: 'คอมประกอบ iHAVECPU',
    price: 129000,
    originalPrice: 139000,
    rating: 5.0,
    sold: 120,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    badge: 'HOT',
    spec: 'เคส Lian Li O11 Dynamic EVO, พาวเวอร์ซัพพลาย 1200W 80+ Gold ประกันศูนย์ไทย 3 ปี'
  },

  // ==========================================
  // 💄 หมวดหมู่: เครื่องสำอาง & บิวตี้
  // ==========================================
  
  // --- ลิปสติก (Lipstick) ---
  {
    id: 201,
    name: 'Dior Addict Lip Glow Color Reviver Balm #001 Pink',
    category: 'beauty',
    subCategory: 'ลิป',
    price: 1650,
    originalPrice: 1800,
    rating: 5.0,
    sold: 4500,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
    badge: 'HOT',
    spec: 'ลิปมันเปลี่ยนสีในตำนาน ชุ่มชื้นยาวนาน 24 ชั่วโมง'
  },
  {
    id: 202,
    name: 'CHANEL Rouge Allure Velvet Luminous Matte #58 Rouge Vie',
    category: 'beauty',
    subCategory: 'ลิป',
    price: 1850,
    originalPrice: 2000,
    rating: 4.9,
    sold: 2300,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    spec: 'เนื้อแมตต์กำมะหยี่ นุ่มลื่น สัมผัสเบาสบายปาก'
  },

  // --- บลัชออน (Blush) ---
  {
    id: 210,
    name: 'Rare Beauty Soft Pinch Liquid Blush #Hope',
    category: 'beauty',
    subCategory: 'บลัชออน',
    price: 1050,
    originalPrice: 1200,
    rating: 5.0,
    sold: 3800,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    badge: 'HOT',
    spec: 'บลัชออนเนื้อลิควิด เกลี่ยง่าย ติดทนนานตลอดวัน'
  },

  // --- เซรั่ม (Serum) ---
  {
    id: 220,
    name: 'Estée Lauder Advanced Night Repair Synchronized Multi-Recovery Complex 50ml',
    category: 'beauty',
    subCategory: 'เซรั่ม',
    price: 4850,
    originalPrice: 5300,
    rating: 5.0,
    sold: 5100,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    badge: 'HOT',
    spec: 'เซรั่มฟื้นบำรุงผิวยามค่ำคืนอันดับ 1 ลดเลือนริ้วรอย'
  },

  // --- กันแดด (Sunscreen) ---
  {
    id: 230,
    name: 'Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++ 60ml',
    category: 'beauty',
    subCategory: 'กันแดด',
    price: 1050,
    originalPrice: 1190,
    rating: 4.9,
    sold: 8900,
    image: 'https://images.unsplash.com/photo-1608248597261-833250005a76?w=800&q=80',
    badge: 'HOT',
    spec: 'กันแดดสูตรน้ำนม กันน้ำ กันเหงื่อ ไม่เหนียวเหนอะหนะ'
  },

  // --- แผ่นมาส์กหน้า (Sheet Mask) ---
  {
    id: 240,
    name: 'SK-II Facial Treatment Mask (กล่อง 6 แผ่น)',
    category: 'beauty',
    subCategory: 'แผ่นมาส์กหน้า',
    price: 3550,
    originalPrice: 3900,
    rating: 5.0,
    sold: 1200,
    image: 'https://images.unsplash.com/photo-1567928269937-ae146e45b428?w=800&q=80',
    spec: 'อุดมด้วย Pitera เข้มข้น ผิวกระจ่างใสทันทีหลังใช้'
  },

  // --- รองพื้น (Foundation) ---
  {
    id: 250,
    name: 'YSL All Hours Foundation SPF39 PA+++ 25ml',
    category: 'beauty',
    subCategory: 'รองพื้น',
    price: 2700,
    originalPrice: 2900,
    rating: 4.9,
    sold: 2100,
    image: 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=800&q=80',
    badge: 'HOT',
    spec: 'ปกปิดระดับคัสตอม คุมมันยาวนาน 24 ชั่วโมง บางเบาเป็นธรรมชาติ'
  },

  // ==========================================
  // 👗 หมวดหมู่: แฟชั่นผู้หญิง & กระเป๋า & รองเท้า
  // ==========================================
  
  // --- กระเป๋า (Bags) ---
  {
    id: 301,
    name: 'Mardi Mercredi Bag Classy Canvas Tote Black',
    category: 'clothing',
    subCategory: 'กระเป๋า',
    price: 3290,
    originalPrice: 3800,
    rating: 4.8,
    sold: 1400,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    badge: 'HOT',
    spec: 'กระเป๋าผ้าแคนวาสทรงสวย ดีไซน์ยอดฮิตจากเกาหลี'
  },
  {
    id: 302,
    name: 'Stand Oil Chubby Bag - Black',
    category: 'clothing',
    subCategory: 'กระเป๋า',
    price: 4190,
    originalPrice: 4600,
    rating: 4.9,
    sold: 980,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    spec: 'กระเป๋าหนังทรงโบว์ลิ่งเรโทร มีช่องเก็บของด้านหน้า 2 ช่อง'
  },

  // --- เสื้อผ้า (Women Clothes) ---
  {
    id: 310,
    name: 'Mardi Mercredi T-Shirt Flowermardi White Green',
    category: 'clothing',
    subCategory: 'เสื้อผ้า',
    price: 1890,
    originalPrice: 2200,
    rating: 4.9,
    sold: 3400,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    badge: 'HOT',
    spec: 'เสื้อยืดลายดอกไม้เอกลักษณ์ ผ้า Cotton 100% สวมใส่สบาย'
  },

  // --- รองเท้า (Shoes) ---
  {
    id: 320,
    name: 'Adidas Samba OG Cloud White Core Black',
    category: 'clothing',
    subCategory: 'รองเท้า',
    price: 3800,
    originalPrice: 4200,
    rating: 5.0,
    sold: 6200,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    badge: 'HOT',
    spec: 'รองเท้าสตรีทสไตล์คลาสสิก หนังแท้แต่งแถบหนังกลับ'
  },

  // ==========================================
  // 🍱 หมวดหมู่: ของกิน & สแน็ค
  // ==========================================
  {
    id: 401,
    name: 'Royce Chocolate Potato Chip Chocolate (190g)',
    category: 'food',
    subCategory: 'ของกิน',
    price: 395,
    originalPrice: 450,
    rating: 5.0,
    sold: 4200,
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&q=80',
    badge: 'HOT',
    spec: 'มันฝรั่งทอดกรอบคลุกเคล้าช็อกโกแลตเข้มข้น นำเข้าจากฮอกไกโด'
  },

  // ==========================================
  // 🧸 หมวดหมู่: ของเล่น & Art Toys
  // ==========================================
  {
    id: 501,
    name: 'POP MART LABUBU THE MONSTERS - Have a Seat Vinyl Plush Blind Box',
    category: 'toys',
    subCategory: 'ของเล่น',
    price: 890,
    originalPrice: 1200,
    rating: 5.0,
    sold: 9500,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    badge: 'HOT',
    spec: 'กล่องสุ่มพวงกุญแจตุ๊กตาลาบูบู้เวอร์ชันนั่ง แท้ 100%'
  },

  // ==========================================
  // 🏠 หมวดหมู่: ของตกแต่งห้อง & Lifestyle
  // ==========================================
  {
    id: 601,
    name: 'โคมไฟตั้งโต๊ะ Sunset Lamp RGB เปลี่ยนสีผ่านแอปสมาร์ทโฟน',
    category: 'home',
    subCategory: 'ของตกแต่งห้อง',
    price: 450,
    originalPrice: 690,
    rating: 4.8,
    sold: 1800,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    spec: 'ไฟสร้างบรรยากาศพระอาทิตย์ตก หมุนได้ 360 องศา ปรับความสว่างได้'
  }
];

const GENERATE_PRODUCTS = (): Product[] => {
  let list: Product[] = [];
  let idCounter = 1;

  const categories = [
    {
      main: 'electronics',
      subs: ['จอคอมพิวเตอร์', 'เคสคอมพิวเตอร์', 'คีย์บอร์ด', 'เมาส์', 'ไมโครโฟน']
    },
    {
      main: 'clothing',
      subs: ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย']
    },
    {
      main: 'shoes',
      subs: ['รองเท้าแฟชั่น']
    },
    {
      main: 'beauty',
      subs: ['เครื่องสำอาง', 'น้ำหอม', 'สกินแคร์']
    }
  ];

  categories.forEach((cat) => {
    cat.subs.forEach((subName) => {
      const sourceItems = PRODUCT_DATA_SOURCE[subName] || [];
      
      // สร้างสินค้าหลากหลายตามคลังรูป
      sourceItems.forEach((item, idx) => {
        const badges: ('HOT' | 'SALE' | 'NEW')[] = ['HOT', 'SALE', 'NEW'];
        const price = Math.floor(Math.random() * 8000) + 450;
        
        list.push({
          id: idCounter,
          name: `${item.name} - LALANA367`,
          price: price,
          originalPrice: Math.floor(price * 1.25),
          rating: Number((Math.random() * (5.0 - 4.5) + 4.5).toFixed(1)),
          sold: Math.floor(Math.random() * 500) + 50,
          category: cat.main,
          subCategory: subName,
          badge: badges[idx % badges.length],
          images: [item.images[0], item.images[0]],
          description: `สินค้าคุณภาพพรีเมียม ${item.name} ผ่านการ QC ทุกชิ้น ประกันศูนย์ไทย มีบริการดูแลหลังการขายโดย LALANA367`,
          reviews: { star5: 180, star4: 25, star3: 4, star2: 0, star1: 0 },
          searchKeywords: `${item.name} ${subName} lalana367`.toLowerCase(),
        });
        idCounter++;
      });
    });
  });

  return list;
};

const ALL_PRODUCTS = GENERATE_PRODUCTS();

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: CartItem[]; total: number } | null>(null);

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.images[0] }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      return product.name.toLowerCase().includes(term) || product.searchKeywords.includes(term);
    }
    const matchesMainCat = selectedMainCategory === 'all' || product.category === selectedMainCategory;
    const matchesSubCat = selectedSubCategory === 'all' || product.subCategory === selectedSubCategory;
    return matchesMainCat && matchesSubCat;
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCompletedOrder({ items: [...cart], total: totalPrice });
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
      {/* Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setSearchTerm(''); setSelectedMainCategory('all'); setSelectedSubCategory('all'); }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black px-3.5 py-1.5 rounded-xl text-lg tracking-wider shadow-md shadow-indigo-200">
              LALANA
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-widest hidden sm:inline">367</span>
          </div>

          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="ค้นหา จอคอม, คีย์บอร์ด, เสื้อผ้าผู้ชาย, น้ำหอม..."
              className="w-full py-2.5 pl-4 pr-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition text-sm shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <X className="absolute right-3.5 top-3 text-slate-400 w-4 h-4 cursor-pointer hover:text-slate-600" onClick={() => setSearchTerm('')} />
            ) : (
              <Search className="absolute right-3.5 top-3 text-slate-400 w-4 h-4" />
            )}
          </div>

          <div className="relative p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center gap-2 border border-indigo-100">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">ตะกร้าของคุณ</span>
            <span className="bg-indigo-600 text-white font-black rounded-full h-5 w-5 flex items-center justify-center text-[11px] shadow-sm">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {isCheckoutSuccess && completedOrder ? (
        <main className="max-w-xl mx-auto px-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">สั่งซื้อสินค้าเรียบร้อยแล้ว!</h2>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-center gap-3 text-indigo-600">
              <Truck className="w-5 h-5 animate-bounce" />
              <span className="font-semibold text-sm">พร้อมจัดส่งด่วนโดย LALANA Express 🚛</span>
            </div>

            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-700 text-sm">สรุปการสั่งซื้อ:</h3>
              <div className="space-y-2">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl text-xs border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-xl" />
                      <div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-slate-500">จำนวน: {item.quantity} ชิ้น</p>
                      </div>
                    </div>
                    <span className="font-bold text-indigo-600">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-slate-100 text-slate-900">
                <span>ยอดชำระสุทธิ:</span>
                <span className="text-indigo-600 text-xl font-black">฿{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => { setIsCheckoutSuccess(false); setCompletedOrder(null); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-indigo-100"
            >
              กลับไปเลือกซื้อสินค้าต่อ
            </button>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Banner Promo */}
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> MID-YEAR SALE 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ไอที & แฟชั่นแบรนด์เนม ลดสูงสุด 50%</h1>
              <p className="text-xs sm:text-sm text-indigo-100">สินค้าแท้ 100% พร้อมประกันศูนย์ไทย ส่งฟรีทั่วประเทศ</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/20">
                <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-emerald-300" />
                <span className="text-[10px] font-semibold block">ของแท้ 100%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/20">
                <Truck className="w-6 h-6 mx-auto mb-1 text-sky-300" />
                <span className="text-[10px] font-semibold block">ส่งฟรีด่วน</span>
              </div>
            </div>
          </div>

          {/* หมวดหมู่หลัก */}
          <div className="flex flex-wrap gap-2 mb-4 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { key: 'all', label: '⚡ สินค้าทั้งหมด' },
              { key: 'electronics', label: '🖥️ ไอที & คอมพิวเตอร์' },
              { key: 'clothing', label: '👔 เสื้อผ้าแฟชั่น' },
              { key: 'shoes', label: '👟 รองเท้า' },
              { key: 'beauty', label: '💄 ความงาม & สกินแคร์' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setSelectedMainCategory(cat.key); setSelectedSubCategory('all'); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                  selectedMainCategory === cat.key && !searchTerm
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* หมวดย่อย (ยืดหยุ่นตามหมวดหลัก) */}
          {selectedMainCategory !== 'all' && !searchTerm && (
            <div className="flex flex-wrap gap-2 mb-6 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 items-center">
              <span className="text-indigo-900 text-xs font-bold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-indigo-600" /> หมวดย่อย:
              </span>
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedSubCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                ทั้งหมด
              </button>

              {selectedMainCategory === 'electronics' && ['จอคอมพิวเตอร์', 'เคสคอมพิวเตอร์', 'คีย์บอร์ด', 'เมาส์', 'ไมโครโฟน'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
              {selectedMainCategory === 'clothing' && ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
              {selectedMainCategory === 'shoes' && ['รองเท้าแฟชั่น'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
              {selectedMainCategory === 'beauty' && ['เครื่องสำอาง', 'น้ำหอม', 'สกินแคร์'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
            </div>
          )}

          {/* รายการสินค้า + ตะกร้าด้านขวา */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <section className="lg:col-span-3">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-slate-800 border-l-4 border-indigo-600 pl-3">
                  {searchTerm ? `ผลการค้นหา "${searchTerm}"` : 'คอลเลกชันสินค้าแนะนำ'}
                </h2>
                <span className="text-slate-500 text-xs">พบ {filteredProducts.length} รายการ</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative overflow-hidden h-52 bg-slate-50">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {/* Tag Badge */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                            {product.subCategory}
                          </span>
                          {product.badge && (
                            <span className={`text-[10px] font-black px-2 py-1 rounded-xl text-white shadow-sm flex items-center gap-0.5 ${
                              product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}>
                              <Zap className="w-3 h-3 fill-current" /> {product.badge}
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-indigo-600" /> ดูรายละเอียด
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">{product.name}</h3>
                          <div className="flex items-center gap-1.5 mt-2 text-amber-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold text-slate-800">{product.rating}</span>
                            <span className="text-slate-400 text-[11px] ml-1">ขายแล้ว {product.sold} ชิ้น</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-indigo-600 font-black text-base block">฿{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-slate-400 text-[10px] line-through">฿{product.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-2xl transition shadow-md shadow-indigo-100 hover:scale-105 active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-12 text-center rounded-3xl shadow-sm">
                  <p className="text-slate-500 text-sm">ไม่พบสินค้าที่คุณต้องการ</p>
                </div>
              )}
            </section>

            {/* 🛒 ตะกร้าสินค้าด้านขวา (ดีไซน์คลีน ลบสินค้าได้ทันที) */}
            <aside className="bg-white border border-slate-200 p-5 rounded-3xl h-fit sticky top-20 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold border-b border-slate-100 pb-3 text-slate-800 flex items-center justify-between">
                <span>ตะกร้าสินค้า</span>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-0.5 rounded-full">{cart.length}</span>
              </h2>

              {cart.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">ไม่มีสินค้าในตะกร้า</p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between gap-3">
                        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-xl shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-xs truncate">{item.name}</p>
                          <p className="text-indigo-600 font-bold text-xs mt-0.5">฿{(item.price * item.quantity).toLocaleString()}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="bg-white hover:bg-slate-200 p-1 rounded-md border border-slate-200 text-slate-600 transition">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="bg-white hover:bg-slate-200 p-1 rounded-md border border-slate-200 text-slate-600 transition">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition shrink-0"
                          title="ลบออกจากตะกร้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between font-bold text-slate-800 text-sm">
                      <span>ราคารวมทั้งหมด:</span>
                      <span className="text-indigo-600 font-black text-base">฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-xs transition shadow-md shadow-indigo-100"
                    >
                      ยืนยันการสั่งซื้อ
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </main>
      )}

      {/* MODAL ดูรายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-lg">
                    {selectedProduct.subCategory}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 leading-snug">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-2 text-amber-500 text-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-slate-800">{selectedProduct.rating}</span>
                    <span className="text-slate-400 ml-1">ขายแล้ว {selectedProduct.sold} ชิ้น</span>
                  </div>
                  <p className="text-2xl font-black text-indigo-600 pt-1">฿{selectedProduct.price.toLocaleString()}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">{selectedProduct.description}</p>

                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-xs transition shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> เพิ่มลงตะกร้าสินค้า
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
