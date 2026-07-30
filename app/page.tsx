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

const LOCATIONS = ['กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'เชียงใหม่', 'ชลบุรี', 'ปทุมธานี', 'ภูเก็ต'];
const BADGES = ['367 VIP', 'MALL', 'BEST', 'HOT', 'ส่งฟรี', 'ลด 50%', 'ถูกชัวร์'];

// --- REALISTIC 350+ PRODUCTS GENERATOR ---
const generate350Products = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  const templates: Record<string, Record<string, string[]>> = {
    it: {
      'โทรศัพท์มือถือ': ['iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'Xiaomi 14 Ultra', 'OPPO Find X7', 'Vivo X100 Pro', 'Realme GT5', 'Google Pixel 8 Pro', 'OnePlus 12', 'ROG Phone 8'],
      'คอมพิวเตอร์': ['PC เกมมิ่ง Core i7 RTX 4070', 'คอมประกอบ Ryzen 7 RTX 4060Ti', 'Mini PC Workstation', 'PC สำนักงาน Core i5 SSD 512GB'],
      'โน๊ตบุ๊ค': ['MacBook Pro M3 Max 16 นิ้ว', 'MacBook Air M3 13 นิ้ว', 'ASUS ROG Zephyrus G16', 'Lenovo Legion Pro 5', 'Dell XPS 15 OLED', 'Acer Predator Helios'],
      'แท็บเล็ต & ไอแพด': ['iPad Pro 11 นิ้ว M4', 'iPad Air 6 M2', 'Samsung Galaxy Tab S9 Ultra', 'Xiaomi Pad 6 Max', 'iPad Mini 6'],
      'แก็ดเจ็ต & อุปกรณ์เสริม': ['USB-C HUB 7-in-1', 'แท่นวางไอแพดอะลูมิเนียม', 'สายชาร์จ Fast Charge 100W', 'พาวเวอร์แบงค์ 30000mAh Magsafe', 'หูฟังบลูทูธ ANC']
    },
    beauty: {
      'เซรั่ม & มอยส์เจอไรเซอร์': ['Aura Hyaluron Serum 50ml', 'Vitamin C Booster Drop', 'Retinol Night Repair Cream', 'Centella Soothing Gel'],
      'กันแดด & คลีนซิ่ง': ['Sunscreen Light Essence SPF50+', 'Cleansing Oil Deep Cleanse', 'Micellar Water Sensitive', 'Physical Sunscreen Stick'],
      'เครื่องสำอาง & ลิปสติก': ['Velvet Matte Lipstick', 'Cushion Glowing Skin SPF50', 'Eyeliner Water-Proof', 'Blush On Shimmer'],
      'บำรุงผิวกาย & น้ำหอม': ['Perfume Body Lotion Rose Scent', 'Eau De Parfum Luxury 50ml', 'Body Scrub Coffee Organic', 'Hand Cream Sheabutter']
    },
    fashion: {
      'เสื้อยืด & เสื้อครอป': ['Oversized Streetwear T-Shirt', 'Minimalist Cotton Crop Top', 'Vintage Graphic Tee', 'Polo Shirt Slim Fit'],
      'กางเกง & ยีนส์': ['Straight Leg Denim Jeans', 'Cargo Pants Tactical', 'Chino Trousers Slim', 'Shorts Casual Cotton'],
      'แจ็กเก็ต & ฮู้ดดี้': ['Zip-Up Hoodie Fleece', 'Denim Jacket Vintage Blue', 'Bomber Jacket Street Style', 'Windbreaker Sport'],
      'กระเป๋า & รองเท้า': ['Leather Crossbody Bag', 'Canvas Tote Bag Large', 'White Sneaker Classic', 'Running Shoes Lightweight']
    },
    home: {
      'โคมไฟ & ไฟแต่งห้อง': ['Minimalist Desk Lamp Touch', 'RGB Sunset Projection Lamp', 'Nordic Floor Lamp Warm', 'LED Strip Smart WiFi'],
      'เครื่องหอม & อโรม่า': ['Aroma Soy Wax Candle 200g', 'Essential Oil Diffuser Ultrasonic', 'Reed Diffuser Luxury Hotel'],
      'เฟอร์นิเจอร์ & ชั้นวาง': ['Ergonomic Monitor Stand Wood', 'Foldable Storage Box 55L', 'Nordic Coffee Table', 'Bookshelf 4-Tier'],
      'เครื่องครัว & แก้วน้ำ': ['Stainless Tumbler 900ml', 'Non-Stick Frying Pan 28cm', 'Electric Kettle Fast Boil', 'Coffee Press French']
    },
    gaming: {
      'เมาส์ & คีย์บอร์ด': ['RGB Mechanical Keyboard Wireless', 'Ultra-Lightweight Gaming Mouse 8K', 'Custom Keycaps PBT Set'],
      'หูฟัง & ไมโครโฟน': ['7.1 Surround Gaming Headset', 'USB Condenser Streaming Mic', 'Wireless Gaming Earbuds Low Latency'],
      'จอมอนิเตอร์ & โต๊ะเก้าอี้': ['Gaming Monitor 27" 240Hz IPS', 'Ergonomic Gaming Chair PU Leather', 'Electric Standing Desk 140cm']
    },
    sports: {
      'อุปกรณ์ออกกำลังกาย': ['Resistance Bands 5-Level Set', 'Adjustable Dumbbell 24kg', 'Yoga Mat NBR 10mm Anti-Slip'],
      'แคมปิ้ง & เต็นท์': ['Automatic Tent 4-Person Waterproof', 'Camping Chair Foldable Compact', 'Portable Gas Stove Outdoor'],
      'รองเท้า & เสื้อผ้ากีฬา': ['Marathon Running Shoes Carbon Plate', 'Quick-Dry Sport T-Shirt', 'Gym Shorts with Pocket']
    }
  };

  const mainCatKeys = Object.keys(templates);

  // Generate around 360 products deterministically
  for (let i = 0; i < 360; i++) {
    const mainCat = mainCatKeys[i % mainCatKeys.length];
    const subCatMap = templates[mainCat];
    const subCatKeys = Object.keys(subCatMap);
    const subCat = subCatKeys[i % subCatKeys.length];
    const nameList = subCatMap[subCat];
    const baseName = nameList[i % nameList.length];

    const modelVariant = `(รุ่นปี 2026 / Ver. ${(i % 5) + 1})`;
    const fullTitle = `${baseName} ${modelVariant} - ประกันศูนย์แท้ 100%`;

    // Dynamic price calculation
    let basePrice = 150 + ((i * 137) % 35000);
    if (mainCat === 'it' || mainCat === 'gaming') basePrice += 2000;

    const discountRatio = 1.15 + ((i % 4) * 0.1);
    const originalPrice = Math.round(basePrice * discountRatio);

    // Seed-based photo URL from Picsum (Guarantees 350+ 100% UNIQUE high-quality images)
    const imageUrl = `https://picsum.photos/seed/367store-${idCounter}/500/500`;

    products.push({
      id: idCounter,
      name: fullTitle,
      mainCategory: mainCat,
      subCategory: subCat,
      price: basePrice,
      originalPrice: originalPrice,
      rating: Number((4.5 + ((i % 6) * 0.1)).toFixed(1)),
      soldCount: (i * 23 + 45) % 8500 + 120,
      badge: BADGES[i % BADGES.length],
      location: LOCATIONS[i % LOCATIONS.length],
      image: imageUrl
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
  const [sortBy, setSortBy] = useState<string>('popular'); // popular, sales, price-asc, price-desc, rating
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

    // Sorting
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

  // Handle Category Change Reset Page
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

  // Coupon Application
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === '367VIP') {
      setAppliedDiscount(200);
      setCouponMessage({ text: 'ใช้ส่วนลด 367VIP (-฿200) สำเร็จ!', isError: false });
    } else if (couponCode.toUpperCase() === 'FREE50') {
      setAppliedDiscount(50);
      setCouponMessage({ text: 'ใช้โค้ดส่วนลด (-฿50) สำเร็จ!', isError: false });
    } else {
      setAppliedDiscount(0);
      setCouponMessage({ text: 'โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุ', isError: true });
    }
  };

  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotalCartPrice = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const finalCartPrice = Math.max(0, subtotalCartPrice - appliedDiscount);

  // Submit Order Function
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedOrderId(`367-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderSuccess(true);
    setTimeout(() => {
      setCart([]);
      setAppliedDiscount(0);
      setCouponCode('');
      setOrderSuccess(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-24">
      
      {/* 🔮 Top Announcement Bar - Midnight Cyber */}
      <div className="bg-slate-900 text-slate-200 text-xs sm:text-sm py-2 px-4 font-medium border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shadow">
              367 OFFICIAL
            </span>
            <span>⚡ สินค้าพร้อมส่งกว่า 350+ รายการ | โค้ดส่วนลดพิเศษ <strong className="text-emerald-400 font-mono">367VIP</strong> ลดทันที ฿200</span>
          </div>
          <span className="hidden md:inline text-xs text-slate-400">การันตีของแท้ 100% | จัดส่งไวใน 24 ชม.</span>
        </div>
      </div>

      {/* 🚀 Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Cyber Indigo Logo "367 STORE" */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleMainCatChange('all')}
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              367
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                367 <span className="text-indigo-600">STORE</span>
              </span>
              <span className="text-[10px] bg-slate-900 text-emerald-400 font-bold px-2 py-0.5 rounded mt-1 inline-block tracking-widest uppercase">
                350+ CATALOG
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าจาก 350+ รายการ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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

          {/* Cart Drawer Trigger */}
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
                onClick={() => handleMainCatChange(cat.id)}
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

          {/* Subcategories */}
          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto mt-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-indigo-400 uppercase whitespace-nowrap mr-1">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubCatChange(sub)}
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

      {/* 🛍️ Main Product Grid Section */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Sorting & Filter Header Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              {selectedSubCat !== 'ทั้งหมด' && <span className="text-indigo-600"> &gt; {selectedSubCat}</span>}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              แสดงสินค้า {paginatedProducts.length} จากทั้งหมด <span className="font-bold text-indigo-600">{filteredAndSortedProducts.length}</span> รายการ
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  sortBy === btn.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image with Unique Seed */}
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.badge && (
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm tracking-wider">
                          {product.badge}
                        </span>
                      )}
                      <span className="bg-slate-900 text-indigo-300 text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        #367-{product.id}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
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
                      <span>ขายแล้ว {product.soldCount.toLocaleString()} ชิ้น</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Button */}
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
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-xl shadow transition-all active:scale-95 flex items-center gap-1 text-xs px-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span className="hidden sm:inline">ใส่ตะกร้า</span>
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
              onClick={() => handleMainCatChange('all')}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
            >
              ดูสินค้าทั้งหมดในร้าน
            </button>
          </div>
        )}

        {/* 📖 Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              &lt; ย้อนกลับ
            </button>

            <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              ถัดไป &gt;
            </button>
          </div>
        )}

      </main>

      {/* 🛒 High-End Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            
            {/* Header */}
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

            {/* Cart Product List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-white border"
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

            {/* Coupon & Total Price Summary */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                {/* Coupon Code Input */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block mb-1">โค้ดส่วนลด (ลองใช้: 367VIP)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ใส่โค้ดส่วนลด..."
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 font-mono font-bold uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition"
                    >
                      ใช้โค้ด
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[11px] font-bold mt-1.5 ${couponMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Receipt Breakdown */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>ยอดรวมสินค้า:</span>
                    <span>฿{subtotalCartPrice.toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>ส่วนลดคูปอง:</span>
                      <span>-฿{appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>ค่าจัดส่ง:</span>
                    <span className="text-emerald-600 font-bold">ฟรี (฿0)</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-black pt-2 border-t border-slate-100">
                    <span>ยอดชำระสุทธิ:</span>
                    <span className="text-xl text-indigo-600">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-xl shadow-lg transition"
                >
                  ชำระเงิน &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📄 Checkout Modal & Order Confirmation */}
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
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900">สั่งซื้อสินค้าสำเร็จ!</h3>
                <p className="text-slate-500 text-sm mt-1">หมายเลขคำสั่งซื้อ: <span className="font-bold text-indigo-600 font-mono">{generatedOrderId}</span></p>
                
                {/* QR Code Placeholder for PromptPay */}
                {formData.payment === 'promptpay' && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
                    <p className="text-xs font-bold text-slate-600 mb-2">สแกน QR Code เพื่อชำระเงิน (จำลอง)</p>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=367STORE-PAYMENT-${finalCartPrice}`}
                      alt="PromptPay QR Code"
                      className="w-32 h-32 mx-auto rounded-lg border bg-white p-1"
                    />
                  </div>
                )}

                <p className="text-xs text-slate-400 mt-4">ขอบคุณที่วางใจอุดหนุนร้าน 367 Store ครับ</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 border-b pb-3">สั่งซื้อสินค้า (367 Official Store)</h3>

                {/* Item List Summary */}
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
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
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
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
                    <p className="text-xl font-black text-indigo-600">฿{finalCartPrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-md transition"
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
