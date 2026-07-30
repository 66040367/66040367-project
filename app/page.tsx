'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Trash2, Plus, Minus, X, CheckCircle2, 
  CreditCard, Truck, ArrowLeft, Star, Sparkles, QrCode, 
  Banknote, ShieldCheck, Zap, Heart, ArrowUpDown, 
  RefreshCw, Lock, Eye, SlidersHorizontal, ChevronRight, Check
} from 'lucide-react';

// ==========================================
// 1. Types & Data Structures
// ==========================================
interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string;
  image: string;
  description: string;
  specs: string[];
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

// Main Categories & Subcategories
const CATEGORY_MAP: { [key: string]: string[] } = {
  'ทั้งหมด': [],
  'สกินแคร์ & บิวตี้': ['ทั้งหมดในหมวดนี้', 'เซรั่ม & เอสเซนส์', 'คลีนซิ่ง & โฟมล้างหน้า', 'กันแดด & บำรุงผิวหน้า', 'น้ำหอม & อโรมา'],
  'ไอที & แก็ดเจ็ต': ['ทั้งหมดในหมวดนี้', 'หูฟัง & ลำโพง', 'สมาร์ตวอทช์ & คีย์บอร์ด', 'อุปกรณ์ไอที & แก็ดเจ็ต'],
  'แฟชั่น & เครื่องแต่งกาย': ['ทั้งหมดในหมวดนี้', 'กระเป๋า & เป้', 'แว่นตา & แอคเซสเซอรี', 'เสื้อผ้า & หมวก'],
  'ของแต่งบ้าน & ไลฟ์สไตล์': ['ทั้งหมดในหมวดนี้', 'โคมไฟ & ของแต่งบ้าน', 'กาแฟ & เครื่องครัว', 'เทียนหอม & อโรมา'],
  'เกมมิ่งเกียร์': ['ทั้งหมดในหมวดนี้', 'คีย์บอร์ดเกมมิ่ง', 'เมาส์ & หูฟังเกมมิ่ง', 'อุปกรณ์เกมมิ่ง']
};

// 30+ Realistic Mock Products
const PRODUCTS: Product[] = [
  // สกินแคร์ & บิวตี้
  {
    id: 1,
    name: 'LLN367 Botanical Youth Serum 50ml',
    category: 'สกินแคร์ & บิวตี้',
    subCategory: 'เซรั่ม & เอสเซนส์',
    price: 1890,
    rating: 4.9,
    reviews: 528,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=700&auto=format&fit=crop',
    description: 'เซรั่มเข้มข้นฟื้นฟูผิวด้วยสารสกัดจากพฤกษชาติ ช่วยให้ผิวกระจ่างใส ลดเลือนริ้วรอย และเติมความชุ่มชื้นล้ำลึก 24 ชั่วโมง',
    specs: ['ขนาด 50 ml', 'ปราศจากพาราเบนและน้ำหอม', 'เหมาะกับทุกสภาพผิว', 'ผลิตในประเทศฝรั่งเศส'],
    inStock: true
  },
  {
    id: 2,
    name: 'Gentle Deep Balance Foam Cleanser 150ml',
    category: 'สกินแคร์ & บิวตี้',
    subCategory: 'คลีนซิ่ง & โฟมล้างหน้า',
    price: 790,
    rating: 4.8,
    reviews: 312,
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=700&auto=format&fit=crop',
    description: 'โฟมล้างหน้าสูตรอ่อนโยน pH 5.5 ทำความสะอาดล้ำลึกถึงรูขุมขน โดยไม่ทำลายเกราะป้องกันผิวธรรมชาติ',
    specs: ['ขนาด 150 ml', 'ค่า pH 5.5 สมดุลผิว', 'มีส่วนผสมของ Centella', 'ล้างเครื่องสำอางกันน้ำได้'],
    inStock: true
  },
  {
    id: 3,
    name: 'Invisible Water Sunscreen SPF50+ PA++++',
    category: 'สกินแคร์ & บิวตี้',
    subCategory: 'กันแดด & บำรุงผิวหน้า',
    price: 950,
    rating: 4.9,
    reviews: 640,
    badge: 'MUST HAVE',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=700&auto=format&fit=crop',
    description: 'กันแดดเนื้อเบาบางเบาเหมือนน้ำ ไม่เหนียวเหนอะหนะ ปกป้องผิวจาก UVA/UVB และแสงสีฟ้าจากหน้าจอคอมพิวเตอร์',
    specs: ['ขนาด 60 ml', 'SPF50+ PA++++', 'สูตรคุมมัน 12 ชั่วโมง', 'ไม่ทิ้งคราบขาว'],
    inStock: true
  },
  {
    id: 4,
    name: 'Velvet Rose Eau De Parfum 100ml',
    category: 'สกินแคร์ & บิวตี้',
    subCategory: 'น้ำหอม & อโรมา',
    price: 3250,
    rating: 4.9,
    reviews: 189,
    badge: 'LUXURY',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=700&auto=format&fit=crop',
    description: 'น้ำหอมระดับลักชัวรี กลิ่นกุหลาบกำมะหยี่ผสมผสานโน้ตไม้หอมอย่างลงตัว ให้ความรู้สึกหรูหรา และติดทนนานตลอดวัน',
    specs: ['ขนาด 100 ml', 'ประเภท Eau De Parfum', 'ติดทน 8-12 ชั่วโมง', 'ขวดแก้วคริสตัลพรีเมียม'],
    inStock: true
  },
  {
    id: 5,
    name: 'Advanced Concentrated Essence 100ml',
    category: 'สกินแคร์ & บิวตี้',
    subCategory: 'เซรั่ม & เอสเซนส์',
    price: 2150,
    rating: 4.7,
    reviews: 245,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=700&auto=format&fit=crop',
    description: 'น้ำตบเอสเซนส์เข้มข้น เตรียมผิวให้พร้อมรับการบำรุงขั้นต่อไป กระชับรูขุมขนและปรับผิวให้เรียบเนียน',
    specs: ['ขนาด 100 ml', 'ซึมไวภายใน 5 วินาที', 'มี Galactomyces 95%'],
    inStock: true
  },

  // ไอที & แก็ดเจ็ต
  {
    id: 6,
    name: 'Acoustic Master ANC Wireless Headphones',
    category: 'ไอที & แก็ดเจ็ต',
    subCategory: 'หูฟัง & ลำโพง',
    price: 5890,
    rating: 4.9,
    reviews: 420,
    badge: 'FLAGSHIP',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=700&auto=format&fit=crop',
    description: 'หูฟังไร้สายพร้อมระบบตัดเสียงรบกวน active noise cancelling (ANC) ไดร์เวอร์ไดนามิกขนาด 40 มม. ให้มิติเสียงคมชัดสมจริง',
    specs: ['ตัดเสียงรบกวน ANC', 'แบตเตอรี่ยาวนาน 40 ชั่วโมง', 'รองรับ Bluetooth 5.3', 'มีไมค์ HD 4 ตัว'],
    inStock: true
  },
  {
    id: 7,
    name: 'Smart Watch Ultra Cellular 45mm',
    category: 'ไอที & แก็ดเจ็ต',
    subCategory: 'สมาร์ตวอทช์ & คีย์บอร์ด',
    price: 4590,
    rating: 4.8,
    reviews: 380,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=700&auto=format&fit=crop',
    description: 'นาฬิกาอัจฉริยะสำหรับคนรักสุขภาพ ติดตามการออกกำลังกาย วัดอัตราการเต้นของหัวใจ และตรวจวัดระดับออกซิเจนในเลือด',
    specs: ['หน้าจอ AMOLED 1.9 นิ้ว', 'กันน้ำระดับ 5ATM', 'แบตเตอรี่ใช้นาน 7 วัน', 'รองรับ iOS & Android'],
    inStock: true
  },
  {
    id: 8,
    name: 'Spatial Surround Portable Bluetooth Speaker',
    category: 'ไอที & แก็ดเจ็ต',
    subCategory: 'หูฟัง & ลำโพง',
    price: 2890,
    rating: 4.7,
    reviews: 195,
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=700&auto=format&fit=crop',
    description: 'ลำโพงบลูทูธพกพา พลังเสียง 360 องศา เบสแน่นลึก กันน้ำกันฝุ่นระดับ IP67 เหมาะสำหรับสายแคมป์ปิ้งและปาร์ตี้',
    specs: ['กำลังขับ 30W RMS', 'กันน้ำ IP67', 'แบตเตอรี่เล่นต่อเนื่อง 18 ชั่วโมง'],
    inStock: true
  },
  {
    id: 9,
    name: '65W GaN Fast Charger Dual USB-C',
    category: 'ไอที & แก็ดเจ็ต',
    subCategory: 'อุปกรณ์ไอที & แก็ดเจ็ต',
    price: 1190,
    rating: 4.9,
    reviews: 510,
    badge: 'ESSENTIAL',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=700&auto=format&fit=crop',
    description: 'หัวชาร์จเร็ว GaN เทคโนโลยีใหม่ล่าสุด ขนาดเล็กลง 40% ชาร์จได้ทั้ง MacBook, iPad และ iPhone พร้อมกัน',
    specs: ['จ่ายไฟสูงสุด 65W', 'เทคโนโลยี GaN III', 'พอร์ต USB-C x2 + USB-A x1'],
    inStock: true
  },

  // แฟชั่น & เครื่องแต่งกาย
  {
    id: 10,
    name: 'Italian Leather Crossbody Bag',
    category: 'แฟชั่น & เครื่องแต่งกาย',
    subCategory: 'กระเป๋า & เป้',
    price: 3890,
    rating: 4.8,
    reviews: 210,
    badge: 'PREMIUM',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=700&auto=format&fit=crop',
    description: 'กระเป๋าสะพายข้างหนังแท้นำเข้าจากอิตาลี ดีไซน์มินิมอลเหนือกาลเวลา ตัดเย็บประณีตด้วยมือทุกชิ้นงาน',
    specs: ['หนังแท้ Genuine Leather 100%', 'ขนาด 24 x 16 x 8 cm', 'ช่องใส่ของแบ่งเป็นสัดส่วน'],
    inStock: true
  },
  {
    id: 11,
    name: 'Classic Polarized Sunglasses UV400',
    category: 'แฟชั่น & เครื่องแต่งกาย',
    subCategory: 'แว่นตา & แอคเซสเซอรี',
    price: 1690,
    rating: 4.9,
    reviews: 340,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=700&auto=format&fit=crop',
    description: 'แว่นกันแดดทรงคลาสสิก เลนส์ Polarized ตัดแสงสะท้อน ปกป้องดวงตาจากรังสี UV400 ได้ 100%',
    specs: ['เลนส์ Polarized UV400', 'กรอบอลูมิเนียมน้ำหนักเบา', 'แถมกล่องและผ้าเช็ดแว่น micro-fiber'],
    inStock: true
  },
  {
    id: 12,
    name: 'Waterproof Commuter Backpack 22L',
    category: 'แฟชั่น & เครื่องแต่งกาย',
    subCategory: 'กระเป๋า & เป้',
    price: 2490,
    rating: 4.7,
    reviews: 165,
    badge: 'TRAVEL',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=700&auto=format&fit=crop',
    description: 'กระเป๋าเป้เดินทางและใส่โน้ตบุ๊ก ผ้ากันน้ำพิเศษ มีช่องใส่ Laptop ขนาด 16 นิ้ว บุซับแรงกระแทกอย่างดี',
    specs: ['ความจุ 22 ลิตร', 'เนื้อผ้า Cordura กันน้ำ', 'ใส่ Laptop ได้สูงสุด 16"'],
    inStock: true
  },
  {
    id: 13,
    name: 'Minimalist Cotton Bucket Hat',
    category: 'แฟชั่น & เครื่องแต่งกาย',
    subCategory: 'เสื้อผ้า & หมวก',
    price: 690,
    rating: 4.6,
    reviews: 98,
    badge: 'CASUAL',
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=700&auto=format&fit=crop',
    description: 'หมวกบักเก็ตผ้าคอตตอน 100% สวมใส่สบาย ระบายอากาศได้ดี เหมาะกับการแต่งตัวสตรีทสไตล์',
    specs: ['รอบหัว 56-58 cm', 'ผ้า Cotton 100%', 'ซักทำความสะอาดง่าย'],
    inStock: true
  },

  // ของแต่งบ้าน & ไลฟ์สไตล์
  {
    id: 14,
    name: 'Ceramic Pour-Over Dripper Set',
    category: 'ของแต่งบ้าน & ไลฟ์สไตล์',
    subCategory: 'กาแฟ & เครื่องครัว',
    price: 1250,
    rating: 4.9,
    reviews: 180,
    badge: 'CRAFT',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=700&auto=format&fit=crop',
    description: 'ชุดดริปกาแฟเซรามิกแฮนด์เมด เก็บความร้อนได้ดีเยี่ยม ช่วยดึงรสชาติและกลิ่นหอมของเมล็ดกาแฟออกมาได้อย่างสมบูรณ์',
    specs: ['เหยือกแก้วความจุ 600 ml', 'ดริปเปอร์เซรามิก V60', 'แถมกระดาษกรอง 50 แผ่น'],
    inStock: true
  },
  {
    id: 15,
    name: 'Nordic Solid Oak Minimalist Lamp',
    category: 'ของแต่งบ้าน & ไลฟ์สไตล์',
    subCategory: 'โคมไฟ & ของแต่งบ้าน',
    price: 1950,
    rating: 4.8,
    reviews: 142,
    badge: 'DESIGN',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=700&auto=format&fit=crop',
    description: 'โคมไฟตั้งโต๊ะสไตล์นอร์ดิกทำจากไม้โอ๊กแท้ แสงไฟวอร์มไวท์ปรับความสว่างได้ 3 ระดับ เพิ่มความอบอุ่นให้ห้องนอน',
    specs: ['ฐานไม้โอ๊กแท้', 'ไฟ LED ปรับแสงได้ 3 ระดับ', 'สายไฟหุ้มเชือกยาว 1.5 เมตร'],
    inStock: true
  },
  {
    id: 16,
    name: 'Ultrasonic Essential Oil Ambient Diffuser',
    category: 'ของแต่งบ้าน & ไลฟ์สไตล์',
    subCategory: 'เทียนหอม & อโรมา',
    price: 1490,
    rating: 4.8,
    reviews: 215,
    badge: 'RELAX',
    image: 'https://images.unsplash.com/photo-1608248597263-0007999659b0?q=80&w=700&auto=format&fit=crop',
    description: 'เครื่องพ่นไอน้ำอโรมาอัลตราโซนิก กระจายกลิ่นหอมสมุนไพรธรรมชาติ พร้อมไฟ Ambient Light เพิ่มความผ่อนคลาย',
    specs: ['ความจุความจุ 300 ml', 'ตั้งเวลาปิดอัตโนมัติ 1/3/6 ชม.', 'ไฟเปลี่ยนสีได้ 7 สี'],
    inStock: true
  },

  // เกมมิ่งเกียร์
  {
    id: 17,
    name: 'LLN367 Pro RGB Mechanical Keyboard Red Switch',
    category: 'เกมมิ่งเกียร์',
    subCategory: 'คีย์บอร์ดเกมมิ่ง',
    price: 3990,
    rating: 4.9,
    reviews: 580,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=700&auto=format&fit=crop',
    description: 'คีย์บอร์ดเกมมิ่งคัสตอม สวิตช์ Red Switch กดลื่น เสียงเงียบ ไฟ RGB ปรับแต่งได้ 16.8 ล้านสี',
    specs: ['สวิตช์ Hot-swappable', 'โครงสร้าง Gasket Mount', 'รองรับ Wireless / Bluetooth / Cable'],
    inStock: true
  },
  {
    id: 18,
    name: 'Ergonomic Ultra-Lightweight Gaming Mouse',
    category: 'เกมมิ่งเกียร์',
    subCategory: 'เมาส์ & หูฟังเกมมิ่ง',
    price: 2390,
    rating: 4.8,
    reviews: 310,
    badge: 'PRO GUILD',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=700&auto=format&fit=crop',
    description: 'เมาส์เกมมิ่งน้ำหนักเบาเพียง 55 กรัม เซ็นเซอร์ความแม่นยำสูง 26,000 DPI ตอบสนองรวดเร็วไร้ดีเลย์',
    specs: ['น้ำหนักเบาพิเศษ 55g', 'เซ็นเซอร์ 26,000 DPI', 'แบตเตอรี่ยาวนาน 80 ชม.'],
    inStock: true
  },
  {
    id: 19,
    name: '7.1 Surround Gaming Headset Pro',
    category: 'เกมมิ่งเกียร์',
    subCategory: 'เมาส์ & หูฟังเกมมิ่ง',
    price: 3290,
    rating: 4.9,
    reviews: 270,
    badge: 'STREAMER',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=700&auto=format&fit=crop',
    description: 'หูฟังเกมมิ่งระบบเสียงรอบทิศทาง 7.1 แยกเสียงฝีก้าวและทิศทางศัตรูได้อย่างแม่นยำ ไมค์ชัดตัดเสียงรบกวน',
    specs: ['ระบบเสียง 7.1 Virtual Surround', 'ฟองน้ำนุ่มหุ้มหนังระบายอากาศ', 'ไมโครโฟนตัดเสียง ENC'],
    inStock: true
  },
  {
    id: 20,
    name: 'XL Speed Control Gaming Mousepad',
    category: 'เกมมิ่งเกียร์',
    subCategory: 'อุปกรณ์เกมมิ่ง',
    price: 890,
    rating: 4.7,
    reviews: 140,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1616440342232-1563f8202535?q=80&w=700&auto=format&fit=crop',
    description: 'แผ่นรองเมาส์ขนาดใหญ่พิเศษ 900x400mm พื้นผิวผ้าทอละเอียดควบคุมเมาส์ได้อย่างแม่นยำ พร้อมเย็บขอบกันลุ่ย',
    specs: ['ขนาด 900 x 400 x 4 mm', 'ฐานยางกันลื่นธรรมชาติ', 'ผิวผ้ากึ่งสปีดกึ่งคอนโทรล'],
    inStock: true
  }
];

const FREE_SHIPPING_THRESHOLD = 1500;

// ==========================================
// 2. Main Store Component
// ==========================================
export default function SeniorProjectStore() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedSubCategory, setSelectedSubCategory] = useState('ทั้งหมดในหมวดนี้');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  
  // App States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewState, setViewState] = useState<'shop' | 'checkout' | 'success'>('shop');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'qr'
  });

  const [orderDetails, setOrderDetails] = useState<{ id: string; total: number; items: CartItem[] } | null>(null);

  // Toggle Category
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory('ทั้งหมดในหมวดนี้');
  };

  // Toggle Wishlist
  const toggleWishlist = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
      const matchSubCat = 
        selectedSubCategory === 'ทั้งหมดในหมวดนี้' || 
        selectedCategory === 'ทั้งหมด' || 
        p.subCategory === selectedSubCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSubCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews; // Default 'popular'
    });
  }, [selectedCategory, selectedSubCategory, searchQuery, sortBy]);

  // Cart Functions
  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
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

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const shippingFee = totalCartPrice >= FREE_SHIPPING_THRESHOLD || totalCartPrice === 0 ? 0 : 60;
  const finalTotalPrice = totalCartPrice + shippingFee;

  const freeShippingProgress = Math.min(100, (totalCartPrice / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalCartPrice;

  // Checkout Handler
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrderId = 'LLN367-' + Math.floor(100000 + Math.random() * 900000);
    setOrderDetails({
      id: newOrderId,
      total: finalTotalPrice,
      items: [...cart]
    });

    setCart([]);
    setViewState('success');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Banner Bar */}
      <div className="bg-slate-950 text-slate-200 text-xs sm:text-sm py-2.5 px-4 font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <span><strong>LLN367 SENIOR PROJECT SHOWCASE</strong> • สั่งซื้อส่งฟรีทันทีเมื่อช้อปครบ ฿1,500</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-slate-400 text-xs">
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400" /> รับประกันของแท้ 100%</span>
            <span className="flex items-center gap-1"><Truck size={14} className="text-amber-400" /> จัดส่งฟรีทั่วประเทศ</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <button 
            onClick={() => setViewState('shop')}
            className="text-2xl font-black tracking-tighter text-slate-950 flex items-center gap-3 group text-left"
          >
            <div className="w-11 h-11 bg-slate-950 text-amber-400 font-black flex items-center justify-center rounded-2xl shadow-lg group-hover:scale-105 transition text-xl">
              L
            </div>
            <div>
              <span className="block text-xl font-black tracking-wider leading-none">LLN367</span>
              <span className="text-[10px] font-bold text-amber-800 tracking-widest uppercase">FLAGSHIP STORE</span>
            </div>
          </button>

          {/* Search Box */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า, หมวดหมู่ หรือหมวดย่อยที่คุณต้องการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-sm bg-slate-100 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950 focus:bg-white transition shadow-inner font-medium text-slate-900 placeholder-slate-400"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2.5 rounded-2xl">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <span>รายการโปรด ({wishlist.length})</span>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-950 text-white px-5 py-3 rounded-2xl hover:bg-amber-500 hover:text-slate-950 transition shadow-md active:scale-95 flex items-center gap-3 font-bold text-sm"
            >
              <ShoppingBag size={20} />
              <span>ตะกร้าสินค้า</span>
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* VIEW 1: MAIN SHOP CATALOG                 */}
      {/* ========================================== */}
      {viewState === 'shop' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Banner Hero */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 md:p-12 shadow-xl flex flex-col justify-center border border-slate-800">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
                <Zap size={14} /> SENIOR PROJECT DESIGN 2026
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                LLN367 SELECTS.<br />
                <span className="text-amber-400 font-normal text-2xl md:text-4xl">สินค้าคุณภาพพรีเมียมครบทุกหมวดหมู่</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                ยกระดับประสบการณ์การช็อปปิ้งออนไลน์ คัดสรรสินค้าแบรนด์คุณภาพ ครอบคลุมทั้งบิวตี้ ไอที แฟชั่น และเกมมิ่งเกียร์
              </p>
            </div>
          </div>

          {/* Search Box (Mobile) */}
          <div className="block md:hidden relative">
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          </div>

          {/* Filter System: Main Categories & Subcategories */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            
            {/* 1. Main Category Tabs */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                เลือกหมวดหมู่หลัก (Category)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {Object.keys(CATEGORY_MAP).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-slate-950 text-amber-400 shadow-md scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Subcategory Filter Pills (Shown when main category is selected) */}
            {selectedCategory !== 'ทั้งหมด' && CATEGORY_MAP[selectedCategory]?.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <SlidersHorizontal size={14} /> หมวดย่อยใน "{selectedCategory}"
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {CATEGORY_MAP[selectedCategory].map((subCat) => (
                    <button
                      key={subCat}
                      onClick={() => setSelectedSubCategory(subCat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        selectedSubCategory === subCat
                          ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {subCat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Bar Info & Sort Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
              <div>
                พบสินค้าทั้งหมด <strong className="text-slate-950 font-black text-base">{filteredProducts.length}</strong> รายการ
                {selectedCategory !== 'ทั้งหมด' && <span className="text-slate-500 font-medium"> (หมวด: {selectedCategory} {selectedSubCategory !== 'ทั้งหมดในหมวดนี้' ? `➔ ${selectedSubCategory}` : ''})</span>}
              </div>

              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown size={16} className="text-slate-400" />
                  <span>จัดเรียงตาม:</span>
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-950 cursor-pointer"
                >
                  <option value="popular">ความนิยมสูงสุด (ยอดฮิต)</option>
                  <option value="rating">คะแนนรีวิวสูงสุด ★</option>
                  <option value="price-low">ราคา: ต่ำ ➔ สูง</option>
                  <option value="price-high">ราคา: สูง ➔ ต่ำ</option>
                </select>
              </div>
            </div>

          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 shadow-sm">
              <Search size={52} className="mx-auto text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800">ไม่พบสินค้าในหมวดหมู่นี้</h3>
              <p className="text-sm text-slate-500">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูสินค้า</p>
              <button 
                onClick={() => { setSelectedCategory('ทั้งหมด'); setSelectedSubCategory('ทั้งหมดในหมวดนี้'); setSearchQuery(''); }}
                className="bg-slate-950 text-white text-xs px-5 py-3 rounded-2xl font-bold"
              >
                ดูสินค้าทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isLiked = wishlist.includes(product.id);
                return (
                  <div 
                    key={product.id}
                    onClick={() => setSelectedProductDetail(product)}
                    className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square bg-slate-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      
                      {/* Badge */}
                      <span className="absolute top-3.5 left-3.5 bg-slate-950/90 backdrop-blur-md text-amber-400 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl shadow-sm border border-slate-800">
                        {product.badge}
                      </span>

                      {/* Quick Wishlist Button */}
                      <button 
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className={`absolute top-3.5 right-3.5 p-2.5 rounded-2xl backdrop-blur-md transition shadow-md ${
                          isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:text-red-500'
                        }`}
                      >
                        <Heart size={16} className={isLiked ? 'fill-white' : ''} />
                      </button>

                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-white/95 text-slate-950 text-xs font-bold px-4 py-2 rounded-2xl shadow-lg flex items-center gap-1.5">
                          <Eye size={14} /> คลิกเพื่อดูรายละเอียด
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-800 uppercase tracking-wider">
                            {product.subCategory}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition">
                          {product.name}
                        </h3>

                        {/* Star Rating & Review Count */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center text-amber-400">
                            <Star size={16} className="fill-amber-400" />
                          </div>
                          <span className="text-sm font-black text-slate-900">{product.rating}</span>
                          <span className="text-xs text-slate-500 font-medium">({product.reviews} รีวิว)</span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">ราคาพิเศษ</span>
                          <span className="text-xl font-black text-slate-950">฿{product.price.toLocaleString()}</span>
                        </div>

                        <button 
                          onClick={(e) => addToCart(product, e)}
                          className="bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 text-xs px-4 py-3 rounded-2xl flex items-center gap-1.5 font-bold transition active:scale-90 shadow-md"
                        >
                          <Plus size={16} />
                          <span>ใส่ตะกร้า</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      )}

      {/* ========================================== */}
      {/* PRODUCT DETAIL MODAL (รายละเอียดสินค้า)    */}
      {/* ========================================== */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in duration-200 my-8">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProductDetail(null)}
              className="absolute top-4 right-4 z-10 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-full transition"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Product Image */}
              <div className="relative aspect-square bg-slate-100">
                <img 
                  src={selectedProductDetail.image} 
                  alt={selectedProductDetail.name} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-slate-950 text-amber-400 text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest">
                  {selectedProductDetail.badge}
                </span>
              </div>

              {/* Detail Info */}
              <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      {selectedProductDetail.category} ➔ {selectedProductDetail.subCategory}
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-slate-950 mt-1 leading-snug">
                      {selectedProductDetail.name}
                    </h2>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl">
                    <div className="flex items-center text-amber-500">
                      <Star size={20} className="fill-amber-400" />
                    </div>
                    <div>
                      <span className="text-base font-black text-slate-950">{selectedProductDetail.rating} / 5.0</span>
                      <span className="text-xs text-slate-600 block">จากผู้ซื้อจริงทั้งหมด {selectedProductDetail.reviews} รีวิว</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">รายละเอียดสินค้า</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {selectedProductDetail.description}
                    </p>
                  </div>

                  {/* Specs / Features */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">คุณสมบัติเด่น (Specifications)</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {selectedProductDetail.specs.map((spec, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-600 font-bold" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-400 uppercase">ราคาจำหน่าย</span>
                    <span className="text-2xl font-black text-slate-950">฿{selectedProductDetail.price.toLocaleString()}</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        addToCart(selectedProductDetail);
                        setSelectedProductDetail(null);
                      }}
                      className="flex-1 bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 py-3.5 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Plus size={18} /> ใส่ตะกร้าสินค้า
                    </button>
                    <button 
                      onClick={() => toggleWishlist(selectedProductDetail.id)}
                      className={`p-3.5 rounded-2xl border transition ${
                        wishlist.includes(selectedProductDetail.id) 
                          ? 'bg-red-50 border-red-200 text-red-500' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Heart size={20} className={wishlist.includes(selectedProductDetail.id) ? 'fill-red-500' : ''} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 2: CHECKOUT PAGE                      */}
      {/* ========================================== */}
      {viewState === 'checkout' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <button 
            onClick={() => setViewState('shop')}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950 mb-6 transition"
          >
            <ArrowLeft size={18} /> ย้อนกลับไปเลือกสินค้า
          </button>

          <h2 className="text-2xl font-black text-slate-950 mb-6">เช็กเอาต์และชำระเงิน (LLN367 Studio)</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form Details */}
            <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Truck size={18} className="text-amber-800" /> 1. ข้อมูลสำหรับจัดส่งสินค้า
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-slate-800 mb-1 font-bold">ชื่อ-นามสกุล ผู้รับ *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="กรอกชื่อ-นามสกุลจริง"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-800 mb-1 font-bold">เบอร์โทรศัพท์ *</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="08X-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 mb-1 font-bold">อีเมล</label>
                      <input 
                        type="email" 
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 mb-1 font-bold">ที่อยู่สำหรับจัดส่งสินค้า *</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="บ้านเลขที่, อาคาร, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950 font-medium"
                    />
                  </div>
                </div>

                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
                  <CreditCard size={18} className="text-amber-800" /> 2. ช่องทางการชำระเงิน
                </h3>

                <div className="space-y-3 text-sm">
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${formData.paymentMethod === 'qr' ? 'border-slate-950 bg-slate-50 font-bold' : 'border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="qr" 
                      checked={formData.paymentMethod === 'qr'} 
                      onChange={() => setFormData({ ...formData, paymentMethod: 'qr' })}
                    />
                    <QrCode size={22} className="text-slate-900" />
                    <div>
                      <span className="block text-slate-950 font-bold">สแกน QR Code (PromptPay / ธนาคาร)</span>
                      <span className="text-xs text-slate-500 font-normal">ชำระสะดวกผ่าน Mobile Banking ทุกธนาคาร</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-slate-950 bg-slate-50 font-bold' : 'border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={formData.paymentMethod === 'cod'} 
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    />
                    <Banknote size={22} className="text-slate-900" />
                    <div>
                      <span className="block text-slate-950 font-bold">เก็บเงินปลายทาง (COD)</span>
                      <span className="text-xs text-slate-500 font-normal">ชำระเงินกับพนักงานขนส่งเมื่อรับสินค้า</span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  สรุปรายการสั่งซื้อ ({totalCartCount} ชิ้น)
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-slate-500">จำนวน: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-950">฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>ยอดรวมสินค้า</span>
                    <span>฿{totalCartPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ค่าจัดส่ง</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">ฟรี (ส่งฟรี)</strong> : `฿${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-xl text-slate-950 pt-3 border-t border-slate-100">
                    <span>ยอดชำระสุทธิ</span>
                    <span className="text-amber-800">฿{finalTotalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition active:scale-95 shadow-xl"
              >
                ยืนยันการสั่งซื้อสินค้า
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* VIEW 3: SUCCESS RECEIPT                    */}
      {/* ========================================== */}
      {viewState === 'success' && orderDetails && (
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-950">สั่งซื้อสินค้าสำเร็จ!</h2>
              <p className="text-sm text-slate-500">ขอบคุณสำหรับการสั่งซื้อกับ **LLN367 Studio**</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl text-left text-sm space-y-3 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">หมายเลขคำสั่งซื้อ:</span>
                <span className="font-black text-slate-950">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ชื่อผู้รับ:</span>
                <span className="font-bold text-slate-800">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">วิธีชำระเงิน:</span>
                <span className="font-bold text-slate-800 uppercase">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 font-black text-base text-slate-950">
                <span>ยอดเงินที่ชำระ:</span>
                <span className="text-amber-800">฿{orderDetails.total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setViewState('shop')}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white text-sm py-4 rounded-2xl font-bold transition"
            >
              กลับสู่หน้าหลักเพื่อเลือกซื้อสินค้าต่อ
            </button>
          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* CART DRAWER (SLIDE-OVER)                   */}
      {/* ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-950 text-amber-400 rounded-xl flex items-center justify-center font-black text-sm">
                    L
                  </div>
                  <h3 className="font-black text-slate-950 text-base">ตะกร้าสินค้า ({totalCartCount})</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="p-1.5 text-slate-400 hover:text-slate-950 rounded-xl transition"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-amber-50/90 p-4 rounded-2xl border border-amber-200/80 mt-4 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Truck size={16} className="text-amber-800" />
                    {remainingForFreeShipping <= 0 ? (
                      <span className="text-emerald-700 font-black">🎉 คุณได้รับสิทธิ์จัดส่งฟรีแล้ว!</span>
                    ) : (
                      <span>ช็อปเพิ่มอีก <strong className="text-amber-800">฿{remainingForFreeShipping.toLocaleString()}</strong> เพื่อส่งฟรี</span>
                    )}
                  </span>
                  <span className="text-amber-900 font-black">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-amber-200/60 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400 space-y-3">
                  <ShoppingBag size={52} className="mx-auto text-slate-200" />
                  <p className="font-bold text-slate-600 text-sm">ไม่มีสินค้าในตะกร้า</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-slate-950 text-white text-xs px-4 py-2.5 rounded-xl font-bold"
                  >
                    เลือกซื้อสินค้าเลย
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-slate-950 text-sm">฿{(item.price * item.quantity).toLocaleString()}</span>
                        
                        <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-600 hover:text-slate-950">
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-600 hover:text-slate-950">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>ราคารวมสินค้า:</span>
                    <span>฿{totalCartPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าจัดส่ง:</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">ฟรี</strong> : `฿${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg text-slate-950 pt-2 border-t border-slate-100">
                    <span>ยอดรวมทั้งสิ้น:</span>
                    <span className="text-amber-800">฿{finalTotalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setViewState('checkout');
                  }}
                  className="w-full bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 text-xs py-4 rounded-2xl font-black tracking-widest uppercase transition shadow-lg active:scale-95"
                >
                  ชำระเงิน (฿{finalTotalPrice.toLocaleString()})
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-20">
        <div className="border-b border-slate-800/80 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <ShieldCheck size={28} className="text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-sm">สินค้าของแท้ 100%</h4>
                <p className="text-xs text-slate-500">รับประกันคุณภาพส่งตรงจากแบรนด์</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Truck size={28} className="text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-sm">จัดส่งรวดเร็วทั่วประเทศ</h4>
                <p className="text-xs text-slate-500">ได้รับสินค้าภายใน 1-3 วันทำการ</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Lock size={28} className="text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-100 text-sm">ระบบชำระเงินปลอดภัย</h4>
                <p className="text-xs text-slate-500">รองรับ PromptPay & COD</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 LLN367 STUDIO. Senior Project Showcase. All rights reserved.</p>
          <div className="flex gap-4 text-slate-500">
            <span>เงื่อนไขการบริการ</span>
            <span>นโยบายความเป็นส่วนตัว</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
