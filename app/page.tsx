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
  soldCount: number;
  badge?: string;
  location: string;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// --- MAIN CATEGORIES CONFIGURATION ---
const MAIN_CATEGORIES = [
  { id: 'all', name: '🔥 ทั้งหมด', subs: [] },
  { 
    id: 'it', 
    name: '📱 อุปกรณ์ไอที', 
    subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'] 
  },
  { 
    id: 'gaming', 
    name: '🎮 เกมมิ่งเกียร์', 
    subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'] 
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
    id: 'sports', 
    name: '⚽ สปอร์ต & เอาต์ดอร์', 
    subs: ['ทั้งหมด', 'อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'] 
  }
];

// --- PRODUCT CATALOG WITH EXACT MATCHING NAME & URL (1:1 SPECIFIED) ---
const PRODUCT_CATALOG: Product[] = [
  // --- IT: โทรศัพท์มือถือ ---
  {
    id: 1,
    name: 'Xiaomi 14 Ultra 5G Leica Lens',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 40990,
    originalPrice: 51190,
    rating: 4.8,
    soldCount: 350,
    badge: '367 VIP',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max 256GB',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 48800,
    originalPrice: 61000,
    rating: 4.9,
    soldCount: 1250,
    badge: 'HOT DEAL',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80'
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 43800,
    originalPrice: 54700,
    rating: 4.7,
    soldCount: 3170,
    badge: 'MALL',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80'
  },
  {
    id: 4,
    name: 'Google Pixel 8 Pro',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 32900,
    originalPrice: 41000,
    rating: 4.9,
    soldCount: 890,
    badge: '367 VIP',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80'
  },

  // --- IT: แท็บเล็ต & ไอแพด ---
  {
    id: 5,
    name: 'iPad Pro 11 นิ้ว ชิป M4',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 39900,
    originalPrice: 49900,
    rating: 4.9,
    soldCount: 9656,
    badge: 'MALL',
    location: 'ภูเก็ต',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80'
  },
  {
    id: 6,
    name: 'Samsung Galaxy Tab S9 Ultra',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 38940,
    originalPrice: 48675,
    rating: 4.7,
    soldCount: 5426,
    badge: 'ส่งฟรี',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80'
  },

  // --- IT: แก็ดเจ็ต & อุปกรณ์เสริม ---
  {
    id: 7,
    name: 'แท่นวางไอแพดปรับระดับได้ Aluminum Holder',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 490,
    originalPrice: 613,
    rating: 4.7,
    soldCount: 7118,
    badge: 'ส่งฟรี',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80'
  },
  {
    id: 8,
    name: 'พาวเวอร์แบงค์ 30000mAh Fast Charge',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 1370,
    originalPrice: 1712,
    rating: 4.9,
    soldCount: 5708,
    badge: 'BEST SELLER',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&q=80'
  },
  {
    id: 9,
    name: 'สายชาร์จ Fast Charge 100W Braided Cable',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 390,
    originalPrice: 488,
    rating: 4.7,
    soldCount: 9938,
    badge: 'MALL',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80'
  },
  {
    id: 10,
    name: 'USB-C HUB 7-in-1 Aluminum Adapter',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 790,
    originalPrice: 988,
    rating: 4.9,
    soldCount: 2686,
    badge: 'ลด 50%',
    location: 'ปทุมธานี',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80'
  },

  // --- IT: คอมพิวเตอร์ & โน๊ตบุ๊ค ---
  {
    id: 11,
    name: 'PC เกมมิ่ง Intel Core i7 RTX 4070',
    mainCategory: 'it',
    subCategory: 'คอมพิวเตอร์',
    price: 42500,
    originalPrice: 53125,
    rating: 4.8,
    soldCount: 1420,
    badge: 'HOT DEAL',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&q=80'
  },
  {
    id: 12,
    name: 'Mini PC Workstation Ultra',
    mainCategory: 'it',
    subCategory: 'คอมพิวเตอร์',
    price: 18450,
    originalPrice: 23000,
    rating: 4.9,
    soldCount: 820,
    badge: '367 VIP',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80'
  },
  {
    id: 13,
    name: 'MacBook Pro M3 Max 16 นิ้ว',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 89900,
    originalPrice: 112375,
    rating: 4.9,
    soldCount: 2100,
    badge: 'MALL',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80'
  },
  {
    id: 14,
    name: 'ASUS ROG Zephyrus Gaming Laptop',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 65900,
    originalPrice: 82375,
    rating: 4.8,
    soldCount: 1750,
    badge: 'BEST SELLER',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80'
  },

  // --- GAMING GEAR ---
  {
    id: 15,
    name: 'Mechanical Gaming Keyboard RGB',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 2490,
    originalPrice: 3110,
    rating: 4.8,
    soldCount: 4200,
    badge: 'HOT DEAL',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'
  },
  {
    id: 16,
    name: 'Ultra-Lightweight Gaming Mouse',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 1890,
    originalPrice: 2360,
    rating: 4.7,
    soldCount: 3800,
    badge: 'ส่งฟรี',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80'
  },
  {
    id: 17,
    name: 'หูฟังเกมมิ่ง 7.1 Surround Wireless Headset',
    mainCategory: 'gaming',
    subCategory: 'หูฟัง & ไมโครโฟน',
    price: 2490,
    originalPrice: 3110,
    rating: 4.9,
    soldCount: 2900,
    badge: '367 VIP',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
  },
  {
    id: 18,
    name: 'USB Condenser Streaming Microphone Pro',
    mainCategory: 'gaming',
    subCategory: 'หูฟัง & ไมโครโฟน',
    price: 1590,
    originalPrice: 1980,
    rating: 4.8,
    soldCount: 1650,
    badge: 'MALL',
    location: 'ปทุมธานี',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'
  },
  {
    id: 19,
    name: 'Gaming Monitor 27" 240Hz IPS 1ms',
    mainCategory: 'gaming',
    subCategory: 'จอมอนิเตอร์ & โต๊ะเก้าอี้',
    price: 7900,
    originalPrice: 9875,
    rating: 4.9,
    soldCount: 1120,
    badge: 'BEST SELLER',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80'
  },

  // --- BEAUTY ---
  {
    id: 20,
    name: 'Aura Hyaluron Intense Serum 50ml',
    mainCategory: 'beauty',
    subCategory: 'เซรั่ม & มอยส์เจอไรเซอร์',
    price: 490,
    originalPrice: 610,
    rating: 4.9,
    soldCount: 8400,
    badge: 'BEST SELLER',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80'
  },
  {
    id: 21,
    name: 'Sunscreen Light Watery Essence SPF50+',
    mainCategory: 'beauty',
    subCategory: 'กันแดด & คลีนซิ่ง',
    price: 350,
    originalPrice: 440,
    rating: 4.8,
    soldCount: 6200,
    badge: 'ส่งฟรี',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'
  },
  {
    id: 22,
    name: 'Velvet Matte Longlasting Lipstick',
    mainCategory: 'beauty',
    subCategory: 'เครื่องสำอาง & ลิปสติก',
    price: 290,
    originalPrice: 360,
    rating: 4.7,
    soldCount: 5100,
    badge: 'ลด 50%',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80'
  },
  {
    id: 23,
    name: 'Eau De Parfum Luxury Unisex 50ml',
    mainCategory: 'beauty',
    subCategory: 'บำรุงผิวกาย & น้ำหอม',
    price: 1290,
    originalPrice: 1610,
    rating: 4.9,
    soldCount: 2300,
    badge: '367 VIP',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80'
  },

  // --- FASHION ---
  {
    id: 24,
    name: 'Oversized Streetwear Premium Cotton Tee',
    mainCategory: 'fashion',
    subCategory: 'เสื้อยืด & เสื้อครอป',
    price: 350,
    originalPrice: 440,
    rating: 4.8,
    soldCount: 4300,
    badge: '367 VIP',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80'
  },
  {
    id: 25,
    name: 'Straight Leg Vintage Denim Jeans',
    mainCategory: 'fashion',
    subCategory: 'กางเกง & ยีนส์',
    price: 890,
    originalPrice: 1110,
    rating: 4.7,
    soldCount: 2800,
    badge: 'HOT DEAL',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80'
  },
  {
    id: 26,
    name: 'Zip-Up Fleece Hoodie Heavyweight',
    mainCategory: 'fashion',
    subCategory: 'แจ็กเก็ต & ฮู้ดดี้',
    price: 790,
    originalPrice: 980,
    rating: 4.8,
    soldCount: 1950,
    badge: 'ส่งฟรี',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'
  },
  {
    id: 27,
    name: 'White Leather Sneaker Classic Style',
    mainCategory: 'fashion',
    subCategory: 'กระเป๋า & รองเท้า',
    price: 1890,
    originalPrice: 2360,
    rating: 4.9,
    soldCount: 3900,
    badge: 'MALL',
    location: 'ภูเก็ต',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
  },

  // --- HOME ---
  {
    id: 28,
    name: 'Minimalist Desk Lamp Touch Dimmer',
    mainCategory: 'home',
    subCategory: 'โคมไฟ & ไฟแต่งห้อง',
    price: 450,
    originalPrice: 560,
    rating: 4.8,
    soldCount: 2100,
    badge: 'ส่งฟรี',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'
  },
  {
    id: 29,
    name: 'Aroma Soy Wax Candle Lavender 200g',
    mainCategory: 'home',
    subCategory: 'เครื่องหอม & อโรม่า',
    price: 320,
    originalPrice: 400,
    rating: 4.9,
    soldCount: 1800,
    badge: 'BEST SELLER',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80'
  },
  {
    id: 30,
    name: 'Ergonomic Monitor Stand Solid Wood',
    mainCategory: 'home',
    subCategory: 'เฟอร์นิเจอร์ & ชั้นวาง',
    price: 690,
    originalPrice: 860,
    rating: 4.7,
    soldCount: 1450,
    badge: '367 VIP',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80'
  },
  {
    id: 31,
    name: 'Stainless Tumbler Vacuum Keep Cold 900ml',
    mainCategory: 'home',
    subCategory: 'เครื่องครัว & แก้วน้ำ',
    price: 390,
    originalPrice: 480,
    rating: 4.8,
    soldCount: 3100,
    badge: 'HOT DEAL',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'
  },

  // --- SPORTS ---
  {
    id: 32,
    name: 'Adjustable Dumbbell 24kg Quick Select',
    mainCategory: 'sports',
    subCategory: 'อุปกรณ์ออกกำลังกาย',
    price: 3200,
    originalPrice: 4000,
    rating: 4.9,
    soldCount: 1200,
    badge: 'MALL',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80'
  },
  {
    id: 33,
    name: 'Yoga Mat NBR 10mm Anti-Slip Eco',
    mainCategory: 'sports',
    subCategory: 'อุปกรณ์ออกกำลังกาย',
    price: 450,
    originalPrice: 560,
    rating: 4.7,
    soldCount: 2900,
    badge: 'ส่งฟรี',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80'
  },
  {
    id: 34,
    name: 'Automatic Tent 4-Person Waterproof',
    mainCategory: 'sports',
    subCategory: 'แคมปิ้ง & เต็นท์',
    price: 1890,
    originalPrice: 2360,
    rating: 4.8,
    soldCount: 880,
    badge: 'BEST SELLER',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80'
  },
  {
    id: 35,
    name: 'Marathon Carbon Plate Running Shoes',
    mainCategory: 'sports',
    subCategory: 'รองเท้า & เสื้อผ้ากีฬา',
    price: 2900,
    originalPrice: 3625,
    rating: 4.8,
    soldCount: 2400,
    badge: 'HOT DEAL',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80'
  }
];

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
    payment: 'promptpay' // 'promptpay' | 'card' | 'bank' | 'cod'
  });

  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs : [];
  }, [selectedMainCat]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = PRODUCT_CATALOG.filter(item => {
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

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedOrderId(`367-TH-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-slate-200 text-sm py-2.5 px-4 font-medium border-b border-indigo-800/40 shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider shadow-sm shadow-indigo-500/50">
              367 OFFICIAL
            </span>
            <span className="text-xs sm:text-sm font-medium">⚡ ใช้โค้ด <strong className="text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">367VIP</strong> ลดทันที ฿200</span>
          </div>
          <span className="hidden md:inline text-xs sm:text-sm text-indigo-300/80 font-mono">การันตีสินค้าคุณภาพ | ชำระเงินได้หลายช่องทาง</span>
        </div>
      </div>

      {/* Header Navbar */}
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

          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าจากรายการทั้งหมด..."
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

          {/* Cart Trigger Button */}
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

      {/* Main & Sub Categories Navigation */}
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

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-indigo-800/50 shadow-2xl p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative z-10 space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-widest">
              <span>🔥 367 MEGA GRAND SALE 2026</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              ช้อปสินค้าราคาพิเศษ <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">ลดสูงสุด 70%</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              สินค้าคุณภาพ การันตีจัดส่งไว พร้อมบริการเก็บเงินปลายทาง
            </p>
          </div>

          <div className="relative z-10 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-center w-full md:w-auto min-w-[240px] shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">สิทธิพิเศษวันนี้</p>
            <p className="text-2xl font-black text-emerald-400 font-mono">แจกส่วนลด ฿200</p>
            <button 
              onClick={() => {
                setCouponCode('367VIP');
                setIsCartOpen(true);
              }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white font-black text-sm rounded-xl shadow-lg transition"
            >
              รับโค้ดส่วนลด 367VIP &gt;
            </button>
          </div>
        </div>
      </section>

      {/* Product Section Header */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              {selectedSubCat !== 'ทั้งหมด' && <span className="text-indigo-400 font-medium text-xl"> &gt; {selectedSubCat}</span>}
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">จัดเรียง:</span>
            {[
              { id: 'popular', label: 'ยอดนิยม' },
              { id: 'sales', label: 'ขายดีสุด' },
              { id: 'price-asc', label: 'ราคาต่ำ-สูง' },
              { id: 'price-desc', label: 'ราคาสูง-ต่ำ' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setSortBy(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
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

        {/* Product Cards Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-2xl border border-slate-800/90 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-950/60 hover:border-indigo-500/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      {product.badge && (
                        <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md shadow-md uppercase">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-950 border border-indigo-800/60 px-2.5 py-0.5 rounded-full">
                        {product.subCategory}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        #367-{product.id}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-100 line-clamp-2 h-11 leading-snug group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-slate-300 font-medium">
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">ขายแล้ว {product.soldCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

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
                    <span className="text-xs text-slate-400 truncate max-w-[100px]">
                      📍 {product.location}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3.5 rounded-xl transition shadow-md flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <span>ใส่ตะกร้า</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800 my-8">
            <p className="text-xl font-bold text-slate-300">ไม่พบสินค้าที่คุณค้นหา</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 sm:gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 disabled:opacity-30"
            >
              &lt; ย้อนกลับ
            </button>
            <span className="text-sm font-bold text-slate-400 px-3">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 disabled:opacity-30"
            >
              ถัดไป &gt;
            </button>
          </div>
        )}

      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <span className="text-lg font-black text-white">ตะกร้าสินค้า ({totalCartItems})</span>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white font-bold text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate">{item.product.name}</h4>
                    <p className="text-base font-black text-emerald-400 font-mono">฿{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
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
                  <span className="text-xs font-bold text-slate-300 block mb-1">โค้ดส่วนลด (ลองใช้: 367VIP)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white uppercase font-mono font-bold"
                    />
                    <button onClick={handleApplyCoupon} className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg">ใช้โค้ด</button>
                  </div>
                  {couponMessage && <p className={`text-xs font-bold mt-1 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>{couponMessage.text}</p>}
                </div>

                <div className="flex justify-between items-center text-lg font-black text-white pt-2 border-t border-slate-800">
                  <span>ยอดชำระสุทธิ:</span>
                  <span className="text-2xl text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                </div>

                <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg">
                  ชำระเงินทันที &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal & Order Success Screen */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 relative border border-slate-800 text-slate-100 my-8 shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 text-xl font-bold hover:text-white">✕</button>

            {orderSuccess ? (
              /* --- ORDER SUCCESS VIEW (WITH TRUCK EMOJI & ITEM DETAILS) --- */
              <div className="py-2 text-slate-100 space-y-5">
                
                {/* Header Status */}
                <div className="text-center space-y-2">
                  <div className="text-6xl mb-2 animate-bounce">🚚</div>
                  <h3 className="text-2xl font-black text-emerald-400">สั่งซื้อสำเร็จ!</h3>
                  <p className="text-sm font-bold text-slate-200">
                    พนักงานกำลังจัดส่งพัสดุของคุณ
                  </p>
                  <div className="inline-block bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-indigo-300 font-mono mt-2">
                    หมายเลขสั่งซื้อ: <strong className="text-white font-bold">{generatedOrderId}</strong>
                  </div>
                </div>

                {/* Purchased Items List Breakdown */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    📦 รายละเอียดสินค้าที่สั่งซื้อ ({totalCartItems} ชิ้น)
                  </p>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center gap-3 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-10 h-10 object-cover rounded-md border border-slate-800 shrink-0" 
                          />
                          <div className="truncate">
                            <p className="font-bold text-slate-200 truncate">{item.product.name}</p>
                            <p className="text-slate-400 font-medium">จำนวน: {item.quantity} ชิ้น</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                          ฿{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment Summary */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ผู้รับสินค้า:</span>
                    <span className="text-slate-200 font-bold">{formData.name} ({formData.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ที่อยู่จัดส่ง:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[200px]">{formData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ช่องทางการชำระ:</span>
                    <span className="text-indigo-300 font-bold">
                      {formData.payment === 'promptpay' && '📱 สแกนจ่าย / พร้อมเพย์'}
                      {formData.payment === 'card' && '💳 บัตรเครดิต / เดบิต'}
                      {formData.payment === 'bank' && '🏦 โอนผ่านบัญชีธนาคาร'}
                      {formData.payment === 'cod' && '🚚 เก็บเงินปลายทาง (COD)'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-slate-300">ยอดชำระเงินสุทธิ:</span>
                    <span className="text-emerald-400 font-mono font-black text-base">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Return Button */}
                <button
                  onClick={() => {
                    setCart([]);
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl transition shadow-lg shadow-indigo-600/30"
                >
                  ตกลง / กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              /* --- FORM CHECKOUT VIEW --- */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span>🛍️</span> ชำระเงิน & จัดส่ง
                </h3>

                {/* Form Fields */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล *</label>
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
                    <label className="font-bold text-slate-300 block mb-1">ที่อยู่จัดส่ง *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Options (Without QR Image) */}
                <div className="pt-2">
                  <label className="font-bold text-slate-200 block mb-2 text-xs sm:text-sm">เลือกช่องทางการชำระเงิน *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label 
                      onClick={() => setFormData({ ...formData, payment: 'promptpay' })}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        formData.payment === 'promptpay'
                          ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>📱</span>
                        <span>สแกนจ่าย / พร้อมเพย์</span>
                      </div>
                      <input type="radio" name="payment" checked={formData.payment === 'promptpay'} readOnly className="accent-indigo-500" />
                    </label>

                    <label 
                      onClick={() => setFormData({ ...formData, payment: 'card' })}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        formData.payment === 'card'
                          ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>💳</span>
                        <span>บัตรเครดิต / เดบิต</span>
                      </div>
                      <input type="radio" name="payment" checked={formData.payment === 'card'} readOnly className="accent-indigo-500" />
                    </label>

                    <label 
                      onClick={() => setFormData({ ...formData, payment: 'bank' })}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        formData.payment === 'bank'
                          ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>🏦</span>
                        <span>โอนผ่านบัญชีธนาคาร</span>
                      </div>
                      <input type="radio" name="payment" checked={formData.payment === 'bank'} readOnly className="accent-indigo-500" />
                    </label>

                    <label 
                      onClick={() => setFormData({ ...formData, payment: 'cod' })}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                        formData.payment === 'cod'
                          ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>🚚</span>
                        <span>เก็บเงินปลายทาง (COD)</span>
                      </div>
                      <input type="radio" name="payment" checked={formData.payment === 'cod'} readOnly className="accent-indigo-500" />
                    </label>
                  </div>

                  <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                    {formData.payment === 'promptpay' && (
                      <div>
                        <p className="font-bold text-indigo-400 mb-0.5">ชำระผ่าน PromptPay / Mobile Banking</p>
                        <p className="text-slate-400">เลขพร้อมเพย์: <strong className="text-white font-mono">0836700000</strong> (บริษัท 367 สโตร์ จำกัด)</p>
                      </div>
                    )}
                    {formData.payment === 'card' && (
                      <div>
                        <p className="font-bold text-indigo-400 mb-0.5">ชำระผ่าน บัตรเครดิต / เดบิต</p>
                        <p className="text-slate-400">รองรับ Visa, Mastercard, JCB (ไม่มีค่าธรรมเนียม)</p>
                      </div>
                    )}
                    {formData.payment === 'bank' && (
                      <div>
                        <p className="font-bold text-indigo-400 mb-0.5">โอนผ่านบัญชีธนาคาร</p>
                        <p className="text-slate-400">กสิกรไทย (KBank): <strong className="text-white font-mono">367-1-00367-9</strong></p>
                      </div>
                    )}
                    {formData.payment === 'cod' && (
                      <div>
                        <p className="font-bold text-emerald-400 mb-0.5">บริการเก็บเงินปลายทาง</p>
                        <p className="text-slate-400">ชำระเงินกับพนักงานขนส่งเมื่อได้รับสินค้าหน้าบ้าน</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 block">ยอดชำระสุทธิ</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                  <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg transition">
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
