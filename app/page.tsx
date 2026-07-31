'use client';

import React, { useState, useMemo } from 'react';

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  shortDesc: string;
  fullDesc: string;
  mainCategory: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  soldCount: number;
  badge?: string;
  location: string;
  stock: number;
  warranty: string;
  images: string[];
  specs: { [key: string]: string };
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderSummary {
  orderId: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
  };
  subtotal: number;
  discount: number;
  finalTotal: number;
  date: string;
}

// --- CURATED FULL PRODUCTS WITH MULTI-IMAGES & FULL SPECS ---
const REAL_PRODUCTS: Product[] = [
  {
    id: 101,
    name: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    shortDesc: 'ชิป A17 Pro ดีไซน์ไทเทเนียมน้ำหนักเบา ปุ่ม Action พร้อมระบบกล้อง Pro 48MP Zoom 5x',
    fullDesc: 'iPhone 15 Pro Max รังสรรค์ขึ้นจากไทเทเนียมเกรดเดียวกับที่ใช้ในอุตสาหกรรมอวกาศ ทั้งแข็งแกร่งและเบา มาพร้อมชิป A17 Pro ที่ปฏิวัติวงการเกมมิ่งบนสมาร์ทโฟน ปุ่ม Action ที่ปรับแต่งได้ตามใจสั่ง และระบบกล้อง Pro ที่ซูมแบบออปติคัลได้ไกลที่สุดเท่าที่เคยมีมาใน iPhone ถึง 5 เท่า',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 48900,
    originalPrice: 52900,
    rating: 4.9,
    soldCount: 1420,
    badge: 'MALL แท้ 100%',
    location: 'กรุงเทพมหานคร',
    stock: 15,
    warranty: 'ประกันศูนย์ Apple Thailand 1 ปี',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
    ],
    specs: {
      'หน้าจอ': '6.7 นิ้ว Super Retina XDR OLED (120Hz ProMotion)',
      'ชิปประมวลผล': 'Apple A17 Pro (3nm)',
      'กล้องหลัง': 'Main 48MP + Ultra-Wide 12MP + Telephoto 12MP (5x Optical)',
      'ความจุ': '256 GB',
      'แบตเตอรี่': 'เล่นวิดีโอสูงสุด 29 ชั่วโมง',
      'ระบบชาร์จ': 'USB-C (USB 3.0 สูงสุด 10Gbps) / MagSafe ไร้สาย'
    }
  },
  {
    id: 102,
    name: 'คอมพิวเตอร์ประกอบ iHaveCPU Intel Core i7-14700K / RTX 4070 Super 12GB',
    shortDesc: 'สเปกคอมพิวเตอร์เล่นเกมแรงๆ RAM 32GB DDR5 / SSD 1TB NVMe M.2 เคสกระจกไฟ RGB สวยงาม',
    fullDesc: 'ขีดสุดแห่งคอมพิวเตอร์เล่นเกมและทำงานสร้างสรรค์ จัดสเปกอย่างลงตัวโดยทีมงาน iHaveCPU ขับเคลื่อนด้วย Intel Core i7 Gen 14 จับคู่การ์ดจอ RTX 4070 Super รองรับการเล่นเกมระดับ 2K-4K ปรับ Ultra ลื่นไหล พร้อมเคสกระจกนิรภัยไฟ RGB จัดสายเนี๊ยบสวยงาม',
    mainCategory: 'it',
    subCategory: 'คอมพิวเตอร์',
    price: 59900,
    originalPrice: 65900,
    rating: 5.0,
    soldCount: 850,
    badge: 'iHaveCPU SPEC',
    location: 'ปทุมธานี',
    stock: 8,
    warranty: 'ประกันศูนย์ไทย 3 ปีเต็ม (iHaveCPU Service Center)',
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80'
    ],
    specs: {
      'ซีพียู (CPU)': 'Intel Core i7-14700K (20 Cores / 28 Threads)',
      'การ์ดจอ (GPU)': 'NVIDIA GeForce RTX 4070 Super 12GB GDDR6X',
      'หน่วยความจำ (RAM)': '32GB (16x2) DDR5 5600MHz RGB',
      'พื้นที่จัดเก็บ (SSD)': '1TB NVMe M.2 PCIe 4.0 Read 5000MB/s',
      'ชุดระบายความร้อน': 'ชุดน้ำปิด 3 ตอน 360mm ARGB',
      'พาวเวอร์ซัพพลาย': '750W 80+ Gold Fully Modular'
    }
  },
  {
    id: 103,
    name: 'Apple iPad Air 5 (รุ่น第5代) Wi-Fi 64GB - Space Gray',
    shortDesc: 'ชิป M1 ทรงพลัง จอภาพ Liquid Retina 10.9 นิ้ว รองรับ Apple Pencil 2 และ Magic Keyboard',
    fullDesc: 'iPad Air มาพร้อมชิป M1 สุดล้ำ ประสิทธิภาพขยับขึ้นไปอีกขั้น ใช้งานสลับไปมาหลายแอปได้ลื่นไหล ตกแต่งภาพ วาดรูป และตัดต่อวิดีโอ 4K ได้สบาย กล้องหน้า 12MP มุมกว้างพิเศษพร้อมคุณสมบัติ "จัดให้อยู่ตรงกลาง" (Center Stage)',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 21900,
    originalPrice: 23900,
    rating: 4.8,
    soldCount: 3200,
    badge: 'BEST SELLER',
    location: 'กรุงเทพมหานคร',
    stock: 20,
    warranty: 'ประกันศูนย์ Apple Thailand 1 ปี',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80'
    ],
    specs: {
      'หน้าจอ': '10.9 นิ้ว Liquid Retina Display LED-backlit IPS',
      'ชิปประมวลผล': 'Apple M1 (8-core CPU / 8-core GPU)',
      'ความจุ': '64 GB',
      'กล้อง': 'หน้า 12MP Ultra-Wide / หลัง 12MP Wide',
      'อุปกรณ์เสริม': 'รองรับ Apple Pencil (รุ่นที่ 2) & Magic Keyboard'
    }
  },
  {
    id: 104,
    name: 'โน๊ตบุ๊ค ASUS ROG Strix G16 (Intel i8 / RTX 4060 / จอ 165Hz)',
    shortDesc: 'โน๊ตบุ๊คเกมมิ่งระดับท็อป ระบายความร้อนดีเยี่ยม จอแสดงผลสีตรง 100% sRGB',
    fullDesc: 'ครอบครองชัยชนะในทุกแมตช์ด้วย ROG Strix G16 ขับเคลื่อนด้วยโปรเซสเซอร์ Intel Core Gen 13 และ GPU NVIDIA GeForce RTX 4060 จอภาพ 16 นิ้ว FHD+ 165Hz ให้ภาพลื่นไหล คมชัด สีตรง 100% sRGB พร้อมระบบระบายความร้อนโลหะเหลว Liquid Metal',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 42900,
    originalPrice: 46900,
    rating: 4.9,
    soldCount: 610,
    badge: 'GAMING PRO',
    location: 'นนทบุรี',
    stock: 5,
    warranty: 'ประกันศูนย์ ASUS Thailand 2 ปี (Onsite Service)',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
    ],
    specs: {
      'หน้าจอ': '16.0 นิ้ว FHD+ (1920x1200) 165Hz IPS 100% sRGB',
      'ซีพียู': 'Intel Core i7-13650HX',
      'การ์ดจอ': 'NVIDIA GeForce RTX 4060 8GB GDDR6',
      'แรม / SSD': '16GB DDR5 4800MHz / 512GB NVMe M.2 SSD',
      'คีย์บอร์ด': 'Backlit Chiclet Keyboard 4-Zone RGB'
    }
  },
  {
    id: 105,
    name: 'PlayStation 5 (PS5) Slim Disc Edition - เครื่องศูนย์ไทย',
    shortDesc: 'เครื่องเล่นเกมคอนโซลยุคใหม่ ขนาดเพรียวบางลง พร้อมไดรฟ์อ่านแผ่น Ultra HD Blu-ray',
    fullDesc: 'สัมผัสการโหลดเกมที่รวดเร็วดุจสายฟ้าด้วย SSD ความเร็วสูงพิเศษ สัมผัสความสมจริงด้วยระบบตอบสนองต่อการสัมผัส (Haptic Feedback) ปุ่มทริกเกอร์แบบปรับเปลี่ยนน้ำหนักได้ (Adaptive Triggers) และเสียง 3D เสียงรอบทิศทาง',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 18690,
    originalPrice: 19900,
    rating: 4.9,
    soldCount: 940,
    badge: 'HOT ITEM',
    location: 'กรุงเทพมหานคร',
    stock: 12,
    warranty: 'ประกันศูนย์ Sony Thailand 1 ปี 3 เดือน',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80'
    ],
    specs: {
      'SSD Storage': '1TB NVMe High-Speed SSD',
      'กราฟิก': 'Custom AMD RDNA 2 Ray Tracing Engine',
      'ภาพวิดีโอ': 'รองรับ output 4K 120Hz และ TV 8K',
      'คอนโทรลเลอร์': 'DualSense Wireless Controller (Included)'
    }
  },

  // --- GAMING GEAR ---
  {
    id: 201,
    name: 'คีย์บอร์ด Mechanical Keychron K2 Wireless Bluetooth RGB',
    shortDesc: 'คีย์บอร์ดไร้สายเปลี่ยนสวิตช์ได้ (Hot-swappable) รองรับ Mac และ Windows แบตเตอรี่ 4000mAh',
    fullDesc: 'Keychron K2 เป็นคีย์บอร์ด Mechanical ไร้สายขนาด 75% ยอดนิยม เชื่อมต่อผ่าน Bluetooth 5.1 ได้สูงสุด 3 อุปกรณ์พร้อมกัน พิมพ์สนุก ปรับแต่งโหมดไฟ RGB ได้มากกว่า 18 รูปแบบ มาพร้อมคีย์แคปเลย์เอาต์เฉพาะสำหรับ macOS และ Windows',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 3890,
    originalPrice: 4590,
    rating: 4.9,
    soldCount: 2100,
    badge: 'POPULAR',
    location: 'กรุงเทพมหานคร',
    stock: 25,
    warranty: 'ประกันศูนย์ไทย 1 ปี',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80'
    ],
    specs: {
      'สวิตช์': 'Gateron G Pro Mechanical (Red / Blue / Brown)',
      'การเชื่อมต่อ': 'Bluetooth 5.1 / สาย Type-C',
      'การใช้งาน': 'เชื่อมต่อได้ 3 อุปกรณ์พร้อมกัน',
      'แบตเตอรี่': '4,000 mAh (ใช้งานได้สูงสุด 240 ชม.)'
    }
  },
  {
    id: 202,
    name: 'เมาส์เกมมิ่งไร้สาย Logitech G Pro X Superlight 2 (White)',
    shortDesc: 'เมาส์ไร้สายระดับโปรเพลเยอร์ น้ำหนักเบาพิเศษเพียง 60 กรัม เซนเซอร์ HERO 2 แม่นยำที่สุด',
    fullDesc: 'วิวัฒนาการขั้นต่อไปของเมาส์เกมมิ่งที่คว้าแชมป์อีสปอร์ตมาแล้วทั่วโลก น้ำหนักเบาเพียง 60 กรัม ไฮบริดสวิตช์ LIGHTFORCE ผสมผสานความเร็วของสวิตช์ออปติคัลเข้ากับฟีลลิ่งการกดแบบกลไก พร้อมเทคโนโลยีไร้สาย LIGHTSPEED ที่รวดเร็วแม่นยำ',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 5290,
    originalPrice: 5990,
    rating: 5.0,
    soldCount: 1890,
    badge: 'ESPORTS CHOICE',
    location: 'กรุงเทพมหานคร',
    stock: 14,
    warranty: 'ประกันศูนย์ Synnex / Logitech 2 ปี',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'
    ],
    specs: {
      'น้ำหนัก': 'เบาเป็นพิเศษเพียง 60 กรัม',
      'เซนเซอร์': 'HERO 2 Sensor (สูงสุด 32,000 DPI / 500 IPS)',
      'Polling Rate': 'สูงสุด 2,000Hz / 0.5ms',
      'แบตเตอรี่': 'ชาร์จ 1 ครั้งใช้งานได้ยาวนาน 95 ชั่วโมง'
    }
  },

  // --- BEAUTY & SKINCARE ---
  {
    id: 301,
    name: 'CeraVe Moisturizing Lotion ครีมบำรุงผิวหน้าและผิวกาย 473ml',
    shortDesc: 'มอยส์เจอไรเซอร์สูตรสำหรับผิวแห้งถึงแห้งมาก ผสานเซราไมด์ที่จำเป็นต่อผิว 3 ชนิด',
    fullDesc: 'โลชั่นบำรุงผิวหน้าและผิวกาย สูตรสำหรับผิวแห้งถึงแห้งมาก เนื้อบางเบา ไม่เหนียวเหนอะหนะ ช่วยเติมความชุ่มชื้นและฟื้นฟูปราการปกป้องผิวตามธรรมชาติ ด้วยเทคโนโลยี MVE ปลดปล่อยความชุ่มชื้นยาวนานตลอด 24 ชั่วโมง',
    mainCategory: 'beauty',
    subCategory: 'เซรั่ม & มอยส์เจอไรเซอร์',
    price: 690,
    originalPrice: 850,
    rating: 4.9,
    soldCount: 8900,
    badge: 'MALL แท้ 100%',
    location: 'กรุงเทพมหานคร',
    stock: 50,
    warranty: 'ของแท้ 100% มีฉลากไทย',
    images: [
      'https://images.unsplash.com/photo-1608248597379-22212a999440?w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    specs: {
      'ขนาดปริมาณ': '473 มล.',
      'เหมาะสำหรับ': 'ผิวธรรมดา ผิวแห้ง ถึงผิวแห้งมาก แพ้ง่าย',
      'สารสำคัญ': 'Ceramides 1, 3, 6-II + Hyaluronic Acid',
      'คุณสมบัติ': 'ปราศจากน้ำหอม ไม่ก่อให้เกิดการอุดตัน (Non-comedogenic)'
    }
  },

  // --- FASHION ---
  {
    id: 401,
    name: 'รองเท้าผ้าใบสนีกเกอร์ Nike Air Force 1 \'07 - White Classic',
    shortDesc: 'รองเท้าผ้าใบระดับตำนาน หนังแท้สีขาวคลีน แมตช์ได้กับทุกชุด พื้นรองเท้านุ่มใส่สบาย',
    fullDesc: 'ความเปล่งประกายดำรงอยู่ใน Nike Air Force 1 \'07 สนีกเกอร์บาสเกตบอลระดับไอคอนที่นำสิ่งที่คุณรู้จักดีที่สุดมาปรับโฉมใหม่ ไม่ว่าจะเป็นงานเย็บที่ประณีต สีสันสดใส และความหนาพอดิบพอดีที่ทำให้คุณส่องประกาย',
    mainCategory: 'fashion',
    subCategory: 'กระเป๋า & รองเท้า',
    price: 3700,
    originalPrice: 4300,
    rating: 4.9,
    soldCount: 4300,
    badge: 'CLASSIC ICON',
    location: 'กรุงเทพมหานคร',
    stock: 18,
    warranty: 'การันตีลิขสิทธิ์แท้ 100% จาก Nike Store',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80'
    ],
    specs: {
      'วัสดุภายนอก': 'หนังแท้พรีเมียม (Real Leather)',
      'เทคโนโลยีพื้น': 'รองรับกระแทกด้วยระบบ Nike Air Cushioning',
      'สไตล์': 'Low-cut ทรงข้อต่ำ เพิ่มความสบายบริเวณข้อเท้า',
      'สี': 'White / White (ขาวล้วนคลาสสิก)'
    }
  }
];

// --- MAIN CATEGORIES ---
const MAIN_CATEGORIES = [
  { id: 'all', name: '🔥 สินค้าทั้งหมด', subs: [] },
  { id: 'it', name: '📱 อุปกรณ์ไอที & คอมพิวเตอร์', subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แ็กดเจ็ต & อุปกรณ์เสริม'] },
  { id: 'gaming', name: '🎮 เกมมิ่งเกียร์', subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน'] },
  { id: 'beauty', name: '💄 สกินแคร์ & บิวตี้', subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์'] },
  { id: 'fashion', name: '👕 แฟชั่น & สตรีทแวร์', subs: ['ทั้งหมด', 'กระเป๋า & รองเท้า'] }
];

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Detail Modal State
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Cart & Modal
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderSummary | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  });

  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs : [];
  }, [selectedMainCat]);

  const filteredProducts = useMemo(() => {
    let result = REAL_PRODUCTS.filter(item => {
      const matchMain = selectedMainCat === 'all' || item.mainCategory === selectedMainCat;
      const matchSub = selectedSubCat === 'ทั้งหมด' || item.subCategory === selectedSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMain && matchSub && matchSearch;
    });

    if (sortBy === 'sales') result.sort((a, b) => b.soldCount - a.soldCount);
    else if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedMainCat, selectedSubCat, searchQuery, sortBy]);

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === '367VIP') {
      setAppliedDiscount(200);
      setCouponMessage({ text: 'ใช้ส่วนลด 367VIP (-฿200) สำเร็จ!', isError: false });
    } else {
      setAppliedDiscount(0);
      setCouponMessage({ text: 'โค้ดส่วนลดไม่ถูกต้อง', isError: true });
    }
  };

  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotalCartPrice = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const finalCartPrice = Math.max(0, subtotalCartPrice - appliedDiscount);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentLabels: Record<string, string> = {
      card: 'บัตรเครดิต / เดบิต',
      bank_transfer: 'โอนผ่านบัญชีธนาคาร',
      cod: 'เก็บเงินปลายทาง (COD)',
      truemoney: 'TrueMoney Wallet'
    };

    const newOrder: OrderSummary = {
      orderId: `367-TH-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: paymentLabels[formData.paymentMethod] || 'ชำระเงินออนไลน์'
      },
      subtotal: subtotalCartPrice,
      discount: appliedDiscount,
      finalTotal: finalCartPrice,
      date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setCompletedOrder(newOrder);
  };

  const openProductModal = (product: Product) => {
    setModalProduct(product);
    setActiveImageIdx(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-slate-200 text-xs py-2 px-4 border-b border-indigo-800/40 font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              VERIFIED STORE
            </span>
            <span>⚡ สินค้าของแท้ 100% ประกันศูนย์ไทย | โค้ดส่วนลด <strong className="text-emerald-400 font-mono bg-emerald-950 px-1.5 py-0.5 rounded">367VIP</strong> ลด ฿200</span>
          </div>
          <span className="hidden md:inline text-xs text-slate-400">คลิกที่สินค้าเพื่อดูรายละเอียดรูปถ่ายสเปกเต็มได้ทันที</span>
        </div>
      </div>

      {/* Main Header Nav */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setSelectedMainCat('all')}>
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 via-violet-500 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/20">
              367
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                367 <span className="text-indigo-400">STORE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                OFFICIAL ONLINE SHOP
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาไอโฟน, คอมพิวเตอร์ iHaveCPU, iPad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none font-medium text-slate-100 placeholder:text-slate-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline font-bold">ตะกร้าสินค้า</span>
            {totalCartItems > 0 && (
              <span className="bg-emerald-400 text-slate-950 text-[11px] font-black px-2 py-0.2 rounded-full font-mono">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Category Nav */}
      <nav className="bg-slate-900/80 border-b border-slate-800 py-3 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedMainCat(cat.id); setSelectedSubCat('ทั้งหมด'); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto mt-2.5 pt-2 border-t border-slate-800/50">
              <span className="text-[11px] font-bold text-indigo-400 uppercase whitespace-nowrap mr-1">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCat(sub)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubCat === sub
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              รายการสินค้าพร้อมส่ง
              <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                {filteredProducts.length} รายการ
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">💡 สามารถคลิกที่การ์ดสินค้าเพื่อเปิดดูรูปถ่ายหลายมุมและสเปกฉบับเต็มได้เลยครับ</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">จัดเรียง:</span>
            {[
              { id: 'popular', label: 'ยอดนิยม' },
              { id: 'sales', label: 'ขายดีที่สุด' },
              { id: 'price-asc', label: 'ราคาต่ำ - สูง' },
              { id: 'price-desc', label: 'ราคาสูง - ต่ำ' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setSortBy(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  sortBy === btn.id
                    ? 'bg-indigo-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => openProductModal(product)}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-indigo-500/80 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-square bg-slate-950 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                    📷 {product.images.length} รูป
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/40">
                      {product.subCategory}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: 367-{product.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors min-h-[40px]">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                    {product.shortDesc}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-300">
                    <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                      <span>★</span>
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">ขายแล้ว {product.soldCount.toLocaleString()} ชิ้น</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through font-mono">
                    ฿{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800">
                  <span className="text-[11px] text-indigo-400 font-bold hover:underline">
                    🔍 คลิกดูรายละเอียด
                  </span>

                  <button
                    onClick={(e) => addToCart(product, e)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3.5 rounded-xl transition shadow-md text-xs active:scale-95"
                  >
                    + ใส่ตะกร้า
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- FEATURED PRODUCT DETAIL MODAL (รายละเอียดสินค้าฉบับเต็ม + รูปภาพหลายมุม) --- */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-4xl rounded-2xl border border-slate-800 shadow-2xl relative my-8 overflow-hidden text-slate-100 flex flex-col md:flex-row">
            
            {/* Close Button */}
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 z-10 bg-slate-950/80 hover:bg-slate-800 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg border border-slate-700 transition"
            >
              ✕
            </button>

            {/* Left: Images Gallery */}
            <div className="md:w-1/2 p-6 bg-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
              <div className="space-y-4">
                {/* Main Selected Image */}
                <div className="aspect-square rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative">
                  <img
                    src={modalProduct.images[activeImageIdx]}
                    alt={modalProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {modalProduct.badge && (
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md uppercase">
                      {modalProduct.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnail Gallery Angles */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {modalProduct.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImageIdx === idx ? 'border-indigo-500 scale-95 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="มุมรูปภาพ" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-1 font-mono">
                <p>🛡️ การรับประกัน: <span className="text-slate-200">{modalProduct.warranty}</span></p>
                <p>📦 คลังสินค้า: <span className="text-emerald-400 font-bold">มีสินค้าพร้อมส่ง ({modalProduct.stock} ชิ้น)</span></p>
                <p>📍 จัดส่งจาก: <span className="text-slate-200">{modalProduct.location}</span></p>
              </div>
            </div>

            {/* Right: Full Product Details & Specs */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                    {modalProduct.subCategory}
                  </span>
                  <h2 className="text-xl font-black text-white mt-2 leading-tight">
                    {modalProduct.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-amber-400 font-bold">★ {modalProduct.rating}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">ขายแล้ว {modalProduct.soldCount.toLocaleString()} ชิ้น</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    ฿{modalProduct.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500 line-through font-mono">
                    ฿{modalProduct.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                    ประหยัด ฿{(modalProduct.originalPrice - modalProduct.price).toLocaleString()}
                  </span>
                </div>

                {/* Full Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">รายละเอียดสินค้า (Description):</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    {modalProduct.fullDesc}
                  </p>
                </div>

                {/* Full Specs Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">ข้อมูลจำเพาะทางเทคนิค (Specifications):</h4>
                  <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                    {Object.entries(modalProduct.specs).map(([key, val], i) => (
                      <div key={key} className={`flex p-2.5 ${i % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/60'}`}>
                        <span className="w-1/3 font-bold text-slate-400">{key}</span>
                        <span className="w-2/3 text-slate-200 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <button
                  onClick={() => {
                    addToCart(modalProduct);
                    setModalProduct(null);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg transition active:scale-95 text-center"
                >
                  🛒 ใส่ตะกร้าสินค้า
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <span className="text-base font-black text-white">ตะกร้าสินค้าของคุณ ({totalCartItems})</span>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 items-center">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                    <p className="text-sm font-black text-emerald-400 font-mono">฿{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 bg-slate-800 rounded text-xs font-bold">-</button>
                      <span className="text-xs font-bold text-slate-100">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 bg-slate-800 rounded text-xs font-bold">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 block mb-1">โค้ดส่วนลด (ลองพิมพ์: 367VIP)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase font-bold"
                    />
                    <button onClick={handleApplyCoupon} className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg">ใช้โค้ด</button>
                  </div>
                  {couponMessage && <p className={`text-[11px] font-bold mt-1 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>{couponMessage.text}</p>}
                </div>

                <div className="flex justify-between items-center text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>ยอดสุทธิ:</span>
                  <span className="text-xl text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg"
                >
                  ไปที่หน้าชำระเงิน &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout & Detailed Receipt Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 relative border border-slate-800 text-slate-100 my-8 shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 text-lg font-bold hover:text-white">✕</button>

            {completedOrder ? (
              <div className="py-2 text-slate-100 space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto border border-emerald-500/30">
                    ✓
                  </div>
                  <h3 className="text-xl font-black text-emerald-400">สั่งซื้อสินค้าสำเร็จ!</h3>
                  <p className="text-xs text-slate-400 font-mono">หมายเลขคำสั่งซื้อ: {completedOrder.orderId}</p>
                  <p className="text-[11px] text-slate-500">{completedOrder.date}</p>
                </div>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2.5 max-h-48 overflow-y-auto">
                  <span className="text-xs font-bold text-slate-400 block border-b border-slate-800 pb-1">รายการสินค้าที่สั่งซื้อ:</span>
                  {completedOrder.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-8 h-8 object-cover rounded" />
                        <span className="truncate text-slate-200 font-medium">{item.product.name}</span>
                      </div>
                      <div className="text-right whitespace-nowrap font-mono">
                        <span className="text-slate-400">x{item.quantity}</span>
                        <span className="ml-2 text-emerald-400 font-bold">฿{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
                  <p><span className="text-slate-400">ผู้รับ:</span> {completedOrder.customer.name} ({completedOrder.customer.phone})</p>
                  <p><span className="text-slate-400">ที่อยู่จัดส่ง:</span> {completedOrder.customer.address}</p>
                  <p><span className="text-slate-400">ชำระเงินด้วย:</span> <strong className="text-indigo-300">{completedOrder.customer.paymentMethod}</strong></p>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>รวมราคาสินค้า:</span>
                    <span>฿{completedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>ส่วนลด (367VIP):</span>
                      <span>-฿{completedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-white pt-1">
                    <span>ยอดชำระสุทธิ:</span>
                    <span className="text-emerald-400 font-mono">฿{completedOrder.finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCart([]);
                    setCompletedOrder(null);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg mt-2"
                >
                  ตกลง / กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
                  🛍️ กรอกข้อมูลจัดส่ง & ชำระเงิน
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล ผู้รับ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="เช่น 0812345678"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ที่อยู่จัดส่งสินค้า *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-bold text-slate-200 block mb-2 text-xs">ช่องทางการชำระเงิน *</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'card', icon: '💳', label: 'บัตรเครดิต / เดบิต' },
                      { id: 'bank_transfer', icon: '🏦', label: 'โอนผ่านธนาคาร' },
                      { id: 'cod', icon: '📦', label: 'เก็บเงินปลายทาง' },
                      { id: 'truemoney', icon: '📱', label: 'TrueMoney Wallet' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 font-bold transition-all ${
                          formData.paymentMethod === method.id
                            ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-base">{method.icon}</span>
                        <span className="text-[11px]">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block">ยอดชำระสุทธิ</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg">
                    ยืนยันการสั่งซื้อ
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
