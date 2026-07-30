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
  reviewCount: number;
  soldCount: number;
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
  { id: 'all', name: '🔥 ทั้งหมด', subs: [] },
  { 
    id: 'it', 
    name: '📱 อุปกรณ์ไอที', 
    subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'] 
  },
  { 
    id: 'beauty', 
    name: '💄 สกินแคร์ & บิวตี้', 
    subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง', 'เครื่องสำอาง & ลิปสติก', 'บำรุงผิวกาย & น้ำหอม'] 
  },
  { 
    id: 'fashion', 
    name: '👕 แฟชั่น & เครื่องแต่งกาย', 
    subs: ['ทั้งหมด', 'เสื้อยืด & เสื้อครอป', 'กางเกง & ยีนส์', 'แจ็กเก็ต & ฮู้ดดี้', 'กระเป๋า & รองเท้า'] 
  },
  { 
    id: 'home', 
    name: '🏠 ของแต่งบ้าน & ไลฟ์สไตล์', 
    subs: ['ทั้งหมด', 'โคมไฟ & ไฟแต่งห้อง', 'เครื่องหอม & อโรม่า', 'เฟอร์นิเจอร์ & ชั้นวาง', 'เครื่องครัว & แก้วน้ำ'] 
  },
  { 
    id: 'gaming', 
    name: '🎮 เกมมิ่งเกียร์', 
    subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'] 
  },
  { 
    id: 'sports', 
    name: '⚽ สปอร์ต & เอาต์ดอร์', 
    subs: ['ทั้งหมด', 'อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'] 
  }
];

const LOCATIONS = ['กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'เชียงใหม่', 'ชลบุรี', 'ปทุมธานี', 'ภูเก็ต'];
const BADGES = ['367 VIP', 'MALL', 'BEST SELLER', 'HOT DEAL', 'ส่งฟรี', 'ลด 50%', 'ถูกชัวร์'];

// --- DIVERSE & UNIQUE UNSPLASH HIGH-RES IMAGE POOL PER SUBCATEGORY ---
const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'โทรศัพท์มือถือ': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505',
    'https://images.unsplash.com/photo-1533228876829-65c94e7b5025',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b7682',
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37',
    'https://images.unsplash.com/photo-1567581935884-3349723552ca'
  ],
  'คอมพิวเตอร์': [
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea'
  ],
  'โน๊ตบุ๊ค': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'
  ],
  'แท็บเล็ต & ไอแพด': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764',
    'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    'https://images.unsplash.com/photo-1569770218135-bea267ed7e84'
  ],
  'แก็ดเจ็ต & อุปกรณ์เสริม': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1622445268465-84288046d581',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90',
    'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
  ],
  'เซรั่ม & มอยส์เจอไรเซอร์': [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
    'https://images.unsplash.com/photo-1608248597261-833244722510',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b',
    'https://images.unsplash.com/photo-1512290900673-700200827233',
    'https://images.unsplash.com/photo-1617897903246-719242758050',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03'
  ],
  'กันแดด & คลีนซิ่ง': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03',
    'https://images.unsplash.com/photo-1617897903246-719242758050',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881',
    'https://images.unsplash.com/photo-1608248597261-833244722510'
  ],
  'เครื่องสำอาง & ลิปสติก': [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
    'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e'
  ],
  'บำรุงผิวกาย & น้ำหอม': [
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75',
    'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f'
  ],
  'เสื้อยืด & เสื้อครอป': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0'
  ],
  'กางเกง & ยีนส์': [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b'
  ],
  'แจ็กเก็ต & ฮู้ดดี้': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    'https://images.unsplash.com/photo-1544441893-675973e31985',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477'
  ],
  'กระเป๋า & รองเท้า': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3'
  ],
  'โคมไฟ & ไฟแต่งห้อง': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5',
    'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9'
  ],
  'เครื่องหอม & อโรม่า': [
    'https://images.unsplash.com/photo-1603006905003-be475563bc59',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108',
    'https://images.unsplash.com/photo-1615397349754-cfa2066a298e'
  ],
  'เฟอร์นิเจอร์ & ชั้นวาง': [
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
  ],
  'เครื่องครัว & แก้วน้ำ': [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7'
  ],
  'เมาส์ & คีย์บอร์ด': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    'https://images.unsplash.com/photo-1626218174358-7769486c4b79'
  ],
  'หูฟัง & ไมโครโฟน': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944',
    'https://images.unsplash.com/photo-1520170350707-b2da59518561'
  ],
  'จอมอนิเตอร์ & โต๊ะเก้าอี้': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5',
    'https://images.unsplash.com/photo-1585792180666-f7347c490ee2'
  ],
  'อุปกรณ์ออกกำลังกาย': [
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'
  ],
  'แคมปิ้ง & เต็นท์': [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7'
  ],
  'รองเท้า & เสื้อผ้ากีฬา': [
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a'
  ]
};

// --- GUARANTEED UNIQUE NON-REPEATING IMAGE GENERATOR ---
const getUniqueProductImage = (subCat: string, productIndex: number, id: number): string => {
  const pool = CATEGORY_IMAGE_POOLS[subCat];
  if (pool && pool.length > 0) {
    const baseImg = pool[productIndex % pool.length];
    return `${baseImg}?w=600&auto=format&fit=crop&q=80`;
  }
  return `https://picsum.photos/seed/product_${id}/600/600`;
};

// --- REALISTIC 360 PRODUCTS GENERATOR ---
const generate350Products = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  const templates: Record<string, Record<string, string[]>> = {
    it: {
      'โทรศัพท์มือถือ': ['iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'Xiaomi 14 Ultra', 'OPPO Find X7 Pro', 'Vivo X100 Pro', 'Google Pixel 8 Pro', 'OnePlus 12', 'ROG Phone 8 Pro'],
      'คอมพิวเตอร์': ['PC เกมมิ่ง Core i7 RTX 4070', 'คอมประกอบ Ryzen 7 RTX 4060Ti', 'Mini PC Workstation Pro', 'PC สำนักงาน Ultra SSD 512GB'],
      'โน๊ตบุ๊ค': ['MacBook Pro M3 Max 16 นิ้ว', 'MacBook Air M3 13 นิ้ว', 'ASUS ROG Zephyrus G16', 'Lenovo Legion Pro 5', 'Dell XPS 15 OLED', 'Acer Predator Helios'],
      'แท็บเล็ต & ไอแพด': ['iPad Pro 11 นิ้ว M4', 'iPad Air 6 M2', 'Samsung Galaxy Tab S9 Ultra', 'Xiaomi Pad 6 Max', 'iPad Mini 6 Cellular'],
      'แก็ดเจ็ต & อุปกรณ์เสริม': ['USB-C HUB 7-in-1 Aluminum', 'แท่นวางไอแพดปรับระดับได้', 'สายชาร์จ Fast Charge 100W', 'พาวเวอร์แบงค์ 30000mAh Magsafe', 'หูฟังไร้สาย ANC Bluetooth 5.4']
    },
    beauty: {
      'เซรั่ม & มอยส์เจอไรเซอร์': ['Aura Hyaluron Intense Serum 50ml', 'Vitamin C Booster Glow Drop', 'Retinol Night Repair Cream', 'Centella Soothing Barrier Gel'],
      'กันแดด & คลีนซิ่ง': ['Sunscreen Light Watery Essence SPF50+', 'Cleansing Oil Deep Cleanse 200ml', 'Micellar Water Sensitive Skin', 'Physical Sunscreen Stick Matte'],
      'เครื่องสำอาง & ลิปสติก': ['Velvet Matte Longlasting Lipstick', 'Cushion Glowing Skin SPF50 PA++++', 'Eyeliner Water-Proof Black', 'Blush On Shimmer Peach Soft'],
      'บำรุงผิวกาย & น้ำหอม': ['Perfume Body Lotion Rose Scent', 'Eau De Parfum Luxury Unisex 50ml', 'Body Scrub Organic Coffee Blend', 'Hand Cream Sheabutter Extra Moisture']
    },
    fashion: {
      'เสื้อยืด & เสื้อครอป': ['Oversized Streetwear Premium Cotton Tee', 'Minimalist Crop Top Ribbed', 'Vintage Graphic Washed T-Shirt', 'Polo Shirt Slim Fit Smart Casual'],
      'กางเกง & ยีนส์': ['Straight Leg Vintage Denim Jeans', 'Cargo Tactical Pants Multi-Pocket', 'Chino Trousers Slim Fit', 'Casual Shorts Organic Cotton'],
      'แจ็กเก็ต & ฮู้ดดี้': ['Zip-Up Fleece Hoodie Heavyweight', 'Denim Jacket Vintage Classic Blue', 'Bomber Jacket Streetwear Style', 'Windbreaker Waterproof Sport Outdoor'],
      'กระเป๋า & รองเท้า': ['Leather Crossbody Minimal Bag', 'Canvas Tote Bag Large Capacity', 'White Leather Sneaker Classic', 'Carbon Plate Running Shoes Ultra Light']
    },
    home: {
      'โคมไฟ & ไฟแต่งห้อง': ['Minimalist Desk Lamp Touch Dimmer', 'RGB Sunset Projection Atmosphere Lamp', 'Nordic Floor Lamp Warm Light', 'Smart LED Strip Light WiFi App Control'],
      'เครื่องหอม & อโรม่า': ['Aroma Soy Wax Candle Lavender 200g', 'Essential Oil Diffuser Ultrasonic', 'Reed Diffuser Luxury Hotel Scent'],
      'เฟอร์นิเจอร์ & ชั้นวาง': ['Ergonomic Monitor Stand Solid Wood', 'Foldable Storage Box Clear Front 55L', 'Nordic Round Coffee Table', 'Minimal Bookshelf 4-Tier White'],
      'เครื่องครัว & แก้วน้ำ': ['Stainless Tumbler Vacuum 900ml', 'Non-Stick Frying Pan Granite 28cm', 'Electric Glass Kettle Fast Boil', 'French Coffee Press Stainless Filter']
    },
    gaming: {
      'เมาส์ & คีย์บอร์ด': ['RGB Mechanical Keyboard Wireless Tri-Mode', 'Ultra-Lightweight Gaming Mouse 8K Hz', 'Custom Keycaps PBT Double Shot Set'],
      'หูฟัง & ไมโครโฟน': ['7.1 Surround Gaming Headset Wireless', 'USB Condenser Streaming Microphone', 'Wireless Gaming Earbuds Low Latency 40ms'],
      'จอมอนิเตอร์ & โต๊ะเก้าอี้': ['Gaming Monitor 27" 240Hz IPS 1ms', 'Ergonomic Gaming Chair PU Leather', 'Electric Height Adjustable Desk 140cm']
    },
    sports: {
      'อุปกรณ์ออกกำลังกาย': ['Resistance Bands 5-Level Set latex', 'Adjustable Dumbbell 24kg Quick Select', 'Yoga Mat NBR 10mm Anti-Slip Eco'],
      'แคมปิ้ง & เต็นท์': ['Automatic Tent 4-Person Waterproof', 'Camping Chair Foldable Ultra Compact', 'Portable Gas Stove Outdoor Brass'],
      'รองเท้า & เสื้อผ้ากีฬา': ['Marathon Carbon Shoes Pro', 'Quick-Dry Sport T-Shirt Breathable', 'Gym Training Shorts with Phone Pocket']
    }
  };

  const mainCatKeys = Object.keys(templates);

  for (let i = 0; i < 360; i++) {
    const mainCat = mainCatKeys[i % mainCatKeys.length];
    const subCatMap = templates[mainCat];
    const subCatKeys = Object.keys(subCatMap);
    const subCat = subCatKeys[i % subCatKeys.length];
    const nameList = subCatMap[subCat];
    const baseName = nameList[i % nameList.length];

    const modelVariant = `(รุ่นปี 2026 / Edition ${(i % 5) + 1})`;
    const fullTitle = `${baseName} ${modelVariant}`;

    let basePrice = 220 + ((i * 173) % 34000);
    if (mainCat === 'it' || mainCat === 'gaming') basePrice += 2800;

    const discountRatio = 1.20 + ((i % 5) * 0.07);
    const originalPrice = Math.round(basePrice * discountRatio);

    const rating = Number((4.7 + ((i % 4) * 0.1)).toFixed(1));
    const reviewCount = (i * 43 + 95) % 1800 + 20;
    const soldCount = (i * 47 + 150) % 9800 + 200;

    // Distinct Image URL assigned index-wise
    const uniqueImg = getUniqueProductImage(subCat, i, idCounter);

    products.push({
      id: idCounter,
      name: fullTitle,
      mainCategory: mainCat,
      subCategory: subCat,
      price: basePrice,
      originalPrice: originalPrice,
      rating: rating,
      reviewCount: reviewCount,
      soldCount: soldCount,
      badge: BADGES[i % BADGES.length],
      location: LOCATIONS[i % LOCATIONS.length],
      image: uniqueImg
    });

    idCounter++;
  }

  return products;
};

const ALL_PRODUCTS = generate350Products();

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular'); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Cart & Coupon States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'promptpay'
  });

  // Get Subcategories
  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs : [];
  }, [selectedMainCat]);

  // Filter & Sort Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = ALL_PRODUCTS.filter(item => {
      const matchMain = selectedMainCat === 'all' || item.mainCategory === selectedMainCat;
      const matchSub = selectedSubCat === 'ทั้งหมด' || item.subCategory === selectedSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMain && matchSub && matchSearch;
    });

    if (sortBy === 'sales') {
      result.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedMainCat, selectedSubCat, searchQuery, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  const handleMainCatChange = (catId: string) => {
    setSelectedMainCat(catId);
    setSelectedSubCat('ทั้งหมด');
    setCurrentPage(1);
  };

  const handleSubCatChange = (subCat: string) => {
    setSelectedSubCat(subCat);
    setCurrentPage(1);
  };

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

  // Coupon
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === '367VIP') {
      setAppliedDiscount(200);
      setCouponMessage({ text: 'ใช้ส่วนลด 367VIP (-฿200) สำเร็จ!', isError: false });
    } else if (couponCode.toUpperCase() === 'FREE50') {
      setAppliedDiscount(50);
      setCouponMessage({ text: 'ใช้ส่วนลด (-฿50) สำเร็จ!', isError: false });
    } else {
      setAppliedDiscount(0);
      setCouponMessage({ text: 'โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุ', isError: true });
    }
  };

  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotalCartPrice = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const finalCartPrice = Math.max(0, subtotalCartPrice - appliedDiscount);

  // Submit Order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedOrderId(`367-TH-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 selection:bg-indigo-500 selection:text-white">
      
      {/* 🔮 Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-slate-200 text-sm py-2.5 px-4 font-medium border-b border-indigo-800/40 shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider shadow-sm shadow-indigo-500/50">
              367 OFFICIAL
            </span>
            <span className="text-xs sm:text-sm font-medium">⚡ สินค้าภาพตรงปก | ใช้โค้ดส่วนลด <strong className="text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">367VIP</strong> ลดทันที ฿200</span>
          </div>
          <span className="hidden md:inline text-xs sm:text-sm text-indigo-300/80 font-mono">การันตีของแท้ 100% | จัดส่งฟรีทั่วประเทศ</span>
        </div>
      </div>

      {/* 🚀 Header Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-indigo-950/30">
        <div className="max-w-7xl mx-auto px-4 h-22 flex items-center justify-between gap-4 py-3">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleMainCatChange('all')}
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-500/40 group-hover:scale-105 transition-transform">
              367
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white block leading-none">
                367 <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">STORE</span>
              </span>
              <span className="text-xs bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-bold px-2 py-0.5 rounded mt-1 inline-block tracking-widest uppercase">
                PREMIUM E-COMMERCE
              </span>
            </div>
          </div>

          {/* Search Box - Large Font */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าจาก 360+ รายการ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-24 py-3 text-sm sm:text-base bg-slate-900 border border-slate-700/80 rounded-2xl focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all placeholder:text-slate-500 font-medium text-slate-100"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 rounded-xl transition text-xs sm:text-sm shadow-md shadow-indigo-600/30">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-indigo-300 font-bold px-4 py-3 rounded-2xl transition shadow-lg shadow-black/40 text-sm sm:text-base"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline font-bold">ตะกร้า</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-slate-950 shadow-lg">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* 🏷️ Main & Sub Categories Navigation */}
      <nav className="bg-slate-900/95 border-b border-slate-800 py-3.5 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleMainCatChange(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategories */}
          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto mt-3 pt-2.5 border-t border-slate-800/60">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider whitespace-nowrap mr-1">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubCatChange(sub)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedSubCat === sub
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-500 font-bold shadow-md shadow-indigo-950/80'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* 🎨 HERO PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-indigo-800/50 shadow-2xl p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-widest">
              <span>🔥 367 MEGA GRAND SALE 2026</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              ช้อปสินค้าตรงปก <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">ลดสูงสุด 70%</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              สินค้าคุณภาพมาตรฐานระดับพรีเมียมกว่า 360+ รายการ พร้อมโปรส่งฟรีและโค้ดลดเพิ่ม
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              <div className="bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <span>🎫 ใช้โค้ด: <strong>367VIP</strong></span>
                <span className="text-slate-400 font-normal">(ลดเพิ่ม ฿200)</span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-indigo-300 flex items-center gap-1">
                <span>🚚 จัดส่งฟรีทุกออเดอร์</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-center w-full md:w-auto min-w-[240px] shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">สิทธิพิเศษสำหรับวันนี้</p>
            <p className="text-2xl font-black text-emerald-400 font-mono">แจกส่วนลด ฿200</p>
            <p className="text-xs text-slate-400 mt-1">กดรับโค้ดไปใส่ที่หน้าชำระเงินได้ทันที</p>
            <button 
              onClick={() => {
                setCouponCode('367VIP');
                setIsCartOpen(true);
              }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-600/40 transition active:scale-95"
            >
              รับโค้ดส่วนลด 367VIP &gt;
            </button>
          </div>
        </div>
      </section>

      {/* 🛍️ Main Product Grid Section */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Header Filter Info */}
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              {selectedSubCat !== 'ทั้งหมด' && <span className="text-indigo-400 font-medium text-xl"> &gt; {selectedSubCat}</span>}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              พบสินค้าตรงปกทั้งสิ้น <span className="font-bold text-emerald-400 font-mono text-base">{filteredAndSortedProducts.length}</span> รายการ
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">จัดเรียง:</span>
            {[
              { id: 'popular', label: 'ยอดนิยม' },
              { id: 'sales', label: 'ขายดีสุด' },
              { id: 'price-asc', label: 'ราคาต่ำ-สูง' },
              { id: 'price-desc', label: 'ราคาสูง-ต่ำ' },
              { id: 'rating', label: 'คะแนนสูงสุด' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setSortBy(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  sortBy === btn.id
                    ? 'bg-indigo-500 text-slate-950 font-black shadow-md shadow-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-2xl border border-slate-800/90 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-950/60 hover:border-indigo-500/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image Container */}
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      {product.badge && (
                        <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md shadow-md tracking-wider uppercase">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-950 border border-indigo-800/60 px-2.5 py-0.5 rounded-full inline-block">
                        {product.subCategory}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        #367-{product.id}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-100 line-clamp-2 h-11 leading-snug group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-slate-300 font-medium">
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        <span>★</span>
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal text-xs">
                          ({product.reviewCount.toLocaleString()} รีวิว)
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">ขายแล้ว {product.soldCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="p-3.5 sm:p-4 pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60">
                    <span className="text-xs text-slate-400 flex items-center gap-0.5 truncate max-w-[100px]">
                      📍 {product.location}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-1.5 text-xs sm:text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span>ใส่ตะกร้า</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800 my-8">
            <p className="text-xl font-bold text-slate-300">ไม่พบสินค้าที่คุณกำลังค้นหา</p>
            <button
              onClick={() => handleMainCatChange('all')}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
            >
              ดูสินค้าทั้งหมดในร้าน
            </button>
          </div>
        )}

        {/* 📖 Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 sm:gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition"
            >
              &lt; ย้อนกลับ
            </button>

            <div className="flex gap-1.5 overflow-x-auto max-w-[220px] sm:max-w-none py-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 font-black'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition"
            >
              ถัดไป &gt;
            </button>
          </div>
        )}

      </main>

      {/* 🛒 Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
            
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 text-white">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black">ตะกร้าสินค้า (367 Official)</span>
                <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate">{item.product.name}</h4>
                      <p className="text-base font-black text-emerald-400 font-mono mt-0.5">฿{item.product.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 bg-slate-800 border border-slate-700 rounded text-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs px-1 text-slate-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 bg-slate-800 border border-slate-700 rounded text-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 text-slate-500 font-medium text-base">
                  ไม่มีสินค้าในตะกร้า
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block mb-1">โค้ดส่วนลด (ลองใช้: 367VIP)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ใส่โค้ดส่วนลด..."
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono font-bold uppercase text-slate-100"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-lg hover:bg-indigo-500 transition shadow-sm"
                    >
                      ใช้โค้ด
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-xs font-bold mt-1.5 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>ยอดรวมสินค้า:</span>
                    <span>฿{subtotalCartPrice.toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>ส่วนลดคูปอง:</span>
                      <span>-฿{appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>ค่าจัดส่ง:</span>
                    <span className="text-emerald-400 font-bold">ฟรี (฿0)</span>
                  </div>
                  <div className="flex justify-between items-center text-base sm:text-lg font-black pt-2 border-t border-slate-800 text-white">
                    <span>ยอดชำระสุทธิ:</span>
                    <span className="text-2xl text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-base rounded-xl shadow-lg shadow-indigo-600/40 transition"
                >
                  ชำระเงินทันที &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📄 Checkout Modal & Receipt */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative border border-slate-800 text-slate-100">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xl"
            >
              ✕
            </button>

            {orderSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">สั่งซื้อสินค้าสำเร็จ!</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">หมายเลขคำสั่งซื้อ: <span className="font-bold text-emerald-400 font-mono">{generatedOrderId}</span></p>
                
                <div className="mt-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>ผู้รับ:</span>
                    <span className="font-bold text-slate-200">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>เบอร์โทร:</span>
                    <span className="font-bold text-slate-200">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>วิธีชำระเงิน:</span>
                    <span className="font-bold text-indigo-400 uppercase">{formData.payment}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                    <span>ยอดชำระสำเร็จ:</span>
                    <span className="font-black text-emerald-400 text-base font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-5">ระบบกำลังเตรียมจัดส่งสินค้า ขอบคุณที่อุดหนุน 367 Store ครับ</p>
                
                <button
                  onClick={() => {
                    setCart([]);
                    setAppliedDiscount(0);
                    setCouponCode('');
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="mt-5 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition border border-slate-700"
                >
                  กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-white border-b border-slate-800 pb-3">สั่งซื้อสินค้า (367 Official Store)</h3>

                <div className="max-h-28 overflow-y-auto space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm">
                  {cart.map((c) => (
                    <div key={c.product.id} className="flex justify-between font-medium">
                      <span className="truncate max-w-[240px] text-slate-300">{c.product.name} x {c.quantity}</span>
                      <span className="font-bold text-emerald-400 font-mono">฿{(c.product.price * c.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล ผู้รับ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081-234-5678"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ที่อยู่จัดส่ง *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">วิธีการชำระเงิน</label>
                    <select
                      value={formData.payment}
                      onChange={e => setFormData({ ...formData, payment: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-bold focus:outline-none focus:border-indigo-500 text-slate-100"
                    >
                      <option value="promptpay">พร้อมเพย์ / โอนเงิน (PromptPay)</option>
                      <option value="cod">เก็บเงินปลายทาง (COD)</option>
                      <option value="card">บัตรเครดิต / บัตรเดบิต</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500">ยอดชำระสุทธิ</p>
                    <p className="text-2xl font-black text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-indigo-600/30 transition"
                  >
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
