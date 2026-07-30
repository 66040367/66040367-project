'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Trash2, Plus, Minus, X, CheckCircle2, 
  CreditCard, Truck, ArrowLeft, Star, Sparkles, QrCode, 
  Banknote, Tag, ShieldCheck, Zap, Heart, ArrowUpDown, 
  RefreshCw, Headphones, Lock
} from 'lucide-react';

// ==========================================
// 1. Interfaces & Comprehensive Mock Data
// ==========================================
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string;
  image: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const CATEGORIES = [
  'ทั้งหมด', 
  'สกินแคร์ & บิวตี้', 
  'ไอที & แก็ดเจ็ต', 
  'แฟชั่น & เครื่องแต่งกาย', 
  'ของแต่งบ้าน & ไลฟ์สไตล์', 
  'เกมมิ่งเกียร์',
  'น้ำหอม & อโรมา'
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LLN367 Advanced Botanical Repair Serum 50ml',
    category: 'สกินแคร์ & บิวตี้',
    price: 1890,
    rating: 4.9,
    reviews: 342,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 2,
    name: 'Acoustic Master Pro Wireless Headphones',
    category: 'ไอที & แก็ดเจ็ต',
    price: 5490,
    rating: 4.9,
    reviews: 218,
    badge: 'FLAGSHIP',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 3,
    name: 'Minimalist Italian Leather Shoulder Bag',
    category: 'แฟชั่น & เครื่องแต่งกาย',
    price: 3890,
    rating: 4.8,
    reviews: 124,
    badge: 'LIMITED',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 4,
    name: 'Handcrafted Ceramic Coffee Dripper Set',
    category: 'ของแต่งบ้าน & ไลฟ์สไตล์',
    price: 1150,
    rating: 4.7,
    reviews: 89,
    badge: 'CRAFT',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 5,
    name: 'Ultra-Fast Response Mechanical Keyboard RGB',
    category: 'เกมมิ่งเกียร์',
    price: 4290,
    rating: 4.9,
    reviews: 412,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 6,
    name: 'Velvet Rose & Oud Eau De Parfum 100ml',
    category: 'น้ำหอม & อโรมา',
    price: 2950,
    rating: 4.9,
    reviews: 156,
    badge: 'LUXURY',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 7,
    name: 'Gentle Deep Cleansing Facial Foam 150ml',
    category: 'สกินแคร์ & บิวตี้',
    price: 790,
    rating: 4.8,
    reviews: 510,
    badge: 'ESSENTIAL',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 8,
    name: 'Smart Health & Fitness Tracker Watch Ultra',
    category: 'ไอที & แก็ดเจ็ต',
    price: 3990,
    rating: 4.7,
    reviews: 198,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 9,
    name: 'Vintage Polarized UV400 Protection Sunglasses',
    category: 'แฟชั่น & เครื่องแต่งกาย',
    price: 1690,
    rating: 4.9,
    reviews: 275,
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 10,
    name: 'Ultrasonic Essential Oil Ambient Diffuser',
    category: 'ของแต่งบ้าน & ไลฟ์สไตล์',
    price: 1490,
    rating: 4.8,
    reviews: 162,
    badge: 'RELAX',
    image: 'https://images.unsplash.com/photo-1608248597263-0007999659b0?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 11,
    name: 'Ergonomic Lightweight Wireless Gaming Mouse',
    category: 'เกมมิ่งเกียร์',
    price: 2590,
    rating: 4.8,
    reviews: 320,
    badge: 'PRO GUILD',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 12,
    name: 'Organic Lavender & Vanilla Scented Candle',
    category: 'น้ำหอม & อโรมา',
    price: 690,
    rating: 4.7,
    reviews: 94,
    badge: 'ORGANIC',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 13,
    name: 'Hydrating Mineral Sunscreen SPF50+ PA++++',
    category: 'สกินแคร์ & บิวตี้',
    price: 890,
    rating: 4.9,
    reviews: 430,
    badge: 'MUST HAVE',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 14,
    name: 'Portable Hi-Fi Bluetooth Speaker 360 Sound',
    category: 'ไอที & แก็ดเจ็ต',
    price: 2890,
    rating: 4.8,
    reviews: 187,
    badge: 'DEEP BASS',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 15,
    name: 'Waterproof Urban Commuter Backpack 20L',
    category: 'แฟชั่น & เครื่องแต่งกาย',
    price: 2450,
    rating: 4.7,
    reviews: 115,
    badge: 'TRAVEL',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 16,
    name: 'Nordic Solid Oak Table Lamp Soft Light',
    category: 'ของแต่งบ้าน & ไลฟ์สไตล์',
    price: 1850,
    rating: 4.8,
    reviews: 78,
    badge: 'WARM',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 17,
    name: 'Spatial Audio Surround Gaming Headset',
    category: 'เกมมิ่งเกียร์',
    price: 3690,
    rating: 4.9,
    reviews: 260,
    badge: '7.1 SURROUND',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 18,
    name: 'Citrus & Basil Luxury Reed Diffuser 200ml',
    category: 'น้ำหอม & อโรมา',
    price: 1290,
    rating: 4.8,
    reviews: 110,
    badge: 'FRESH',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=600&auto=format&fit=crop',
    inStock: true
  }
];

const FREE_SHIPPING_THRESHOLD = 1500;

// ==========================================
// 2. Main Component
// ==========================================
export default function StoreApp() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewState, setViewState] = useState<'shop' | 'checkout' | 'success'>('shop');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'qr'
  });

  const [orderDetails, setOrderDetails] = useState<{ id: string; total: number; items: CartItem[] } | null>(null);

  // Toggle Wishlist
  const toggleWishlist = (id: number) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  // Cart Functions
  const addToCart = (product: Product) => {
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

  // Handle Coupon Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'LLN367') {
      setDiscountAmount(200);
      setCouponMessage({ text: 'ใช้โค้ดสำเร็จ! รับส่วนลด ฿200', isError: false });
    } else {
      setCouponMessage({ text: 'โค้ดส่วนลดไม่ถูกต้อง (ลองใช้: LLN367)', isError: true });
    }
  };

  const shippingFee = totalCartPrice >= FREE_SHIPPING_THRESHOLD || totalCartPrice === 0 ? 0 : 60;
  const finalTotalPrice = Math.max(0, totalCartPrice - discountAmount + shippingFee);

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
    setDiscountAmount(0);
    setCouponCode('');
    setViewState('success');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* Announcement Bar */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-medium tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
            <span>LLN367 GRAND OPENING • โค้ดส่วนลด ฿200: <strong className="text-amber-400 underline">LLN367</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <span>ส่งฟรีเมื่อช้อปครบ ฿1,500</span>
            <span>•</span>
            <span>รับประกันของแท้ 100%</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <button 
            onClick={() => setViewState('shop')}
            className="text-2xl font-black tracking-tighter text-slate-950 flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-slate-950 text-amber-400 font-black flex items-center justify-center rounded-2xl shadow-md group-hover:scale-105 transition">
              L
            </div>
            <div className="text-left leading-none">
              <span className="block text-lg font-black tracking-widest">LLN367</span>
              <span className="text-[9px] font-bold text-amber-700 tracking-widest uppercase">STORE STUDIO</span>
            </div>
          </button>

          {/* Search Box */}
          <div className="flex-1 max-w-lg relative hidden md:block">
            <input 
              type="text" 
              placeholder="ค้นหาตามชื่อสินค้า, หมวดหมู่ หรือแบรนด์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 text-xs bg-slate-100/80 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950 focus:bg-white transition shadow-inner font-medium"
            />
            <Search className="absolute left-4 top-3 text-slate-400" size={16} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-2">
              <Heart size={16} className="text-slate-400" />
              <span>รายการโปรด ({wishlist.length})</span>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-950 text-white px-4 py-2.5 rounded-2xl hover:bg-amber-600 hover:text-slate-950 transition shadow-lg active:scale-95 flex items-center gap-2.5 font-bold text-xs"
            >
              <ShoppingBag size={18} />
              <span>ตะกร้า</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* Editorial Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-8 md:p-14 shadow-2xl flex flex-col justify-center border border-slate-800">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs px-3.5 py-1 rounded-full font-semibold">
                <Zap size={13} /> PROJECT DISPLAY 2026
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-slate-100">
                LLN367 SELECTS.<br />
                <span className="text-amber-400 font-light text-2xl md:text-4xl">คอลเลกชันระดับมาสเตอร์พีซ</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-light leading-relaxed max-w-lg">
                คัดสรรสินค้าคุณภาพสูง ครอบคลุมไลฟ์สไตล์ สกินแคร์ อุปกรณ์ไอที และแฟชั่น ออกแบบมาเพื่อยกระดับชีวิตประจำวันอย่างสมบูรณ์แบบ
              </p>
            </div>
          </div>

          {/* Search Mobile */}
          <div className="block md:hidden relative">
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl"
            />
            <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
          </div>

          {/* Filter & Sort Bar */}
          <div className="space-y-4 border-b border-slate-200/80 pb-6">
            
            {/* Category Pills */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-slate-950 text-amber-400 shadow-md scale-105'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 ml-auto">
                <ArrowUpDown size={14} className="text-slate-400" />
                <span>จัดเรียงตาม:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-slate-950 text-xs font-semibold cursor-pointer"
                >
                  <option value="popular">ความนิยม (ยอดฮิต)</option>
                  <option value="rating">คะแนนรีวิวสูงสุด</option>
                  <option value="price-low">ราคา: ต่ำ ➔ สูง</option>
                  <option value="price-high">ราคา: สูง ➔ ต่ำ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <span>แสดงผลสินค้าทั้งหมด <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> รายการ</span>
              {(selectedCategory !== 'ทั้งหมด' || searchQuery !== '') && (
                <button 
                  onClick={() => { setSelectedCategory('ทั้งหมด'); setSearchQuery(''); }}
                  className="text-amber-800 underline font-bold flex items-center gap-1"
                >
                  <RefreshCw size={12} /> รีเซ็ตตัวกรอง
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 shadow-sm">
              <Search size={48} className="mx-auto text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">ไม่พบสินค้าที่คุณต้องการ</h3>
              <p className="text-xs text-slate-500">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดใหม่อีกครั้ง</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isLiked = wishlist.includes(product.id);
                return (
                  <div 
                    key={product.id}
                    className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square bg-slate-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      
                      {/* Badge */}
                      <span className="absolute top-3.5 left-3.5 bg-slate-950/85 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm border border-slate-800">
                        {product.badge}
                      </span>

                      {/* Wishlist Button */}
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition shadow-md ${
                          isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-600 hover:text-red-500'
                        }`}
                      >
                        <Heart size={14} className={isLiked ? 'fill-white' : ''} />
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <div className="flex items-center text-amber-400">
                            <Star size={13} className="fill-amber-400" />
                          </div>
                          <span className="text-xs font-black text-slate-900">{product.rating}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({product.reviews} รีวิว)</span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ราคาพิเศษ</span>
                          <span className="text-lg font-black text-slate-950">฿{product.price.toLocaleString()}</span>
                        </div>

                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 font-bold transition active:scale-90 shadow-md"
                        >
                          <Plus size={15} />
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
      {/* VIEW 2: CHECKOUT PAGE                      */}
      {/* ========================================== */}
      {viewState === 'checkout' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <button 
            onClick={() => setViewState('shop')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 mb-6 transition"
          >
            <ArrowLeft size={16} /> ย้อนกลับไปเลือกสินค้า
          </button>

          <h2 className="text-2xl font-black text-slate-950 mb-6">เช็กเอาต์และชำระเงิน (LLN367 Studio)</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form Details */}
            <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Truck size={16} className="text-amber-800" /> 1. ที่อยู่จัดส่งสินค้า
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-800 mb-1 font-bold">ชื่อ-นามสกุล ผู้รับ</label>
                    <input 
                      required
                      type="text" 
                      placeholder="กรอกชื่อ-นามสกุลจริง"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-800 mb-1 font-bold">เบอร์โทรศัพท์</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="08X-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-800 mb-1 font-bold">อีเมล (เพื่อรับใบเสร็จ)</label>
                      <input 
                        type="email" 
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-800 mb-1 font-bold">ที่อยู่สำหรับจัดส่ง</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="บ้านเลขที่, อาคาร, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-3 pt-4 flex items-center gap-2">
                  <CreditCard size={16} className="text-amber-800" /> 2. วิธีการชำระเงิน
                </h3>

                <div className="space-y-2.5 text-xs">
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${formData.paymentMethod === 'qr' ? 'border-slate-950 bg-slate-50 font-bold' : 'border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="qr" 
                      checked={formData.paymentMethod === 'qr'} 
                      onChange={() => setFormData({ ...formData, paymentMethod: 'qr' })}
                    />
                    <QrCode size={20} className="text-slate-900" />
                    <div>
                      <span className="block text-slate-950">สแกน QR Code (PromptPay)</span>
                      <span className="text-[10px] text-slate-400 font-normal">ชำระผ่านแอปพลิเคชันธนาคาร ไร้ค่าธรรมเนียม</span>
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
                    <Banknote size={20} className="text-slate-900" />
                    <div>
                      <span className="block text-slate-950">เก็บเงินปลายทาง (COD)</span>
                      <span className="text-[10px] text-slate-400 font-normal">จ่ายเงินกับพนักงานขนส่งเมื่อได้รับสินค้า</span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Order Summary Panel */}
            <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  สรุปคำสั่งซื้อ
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-11 h-11 object-cover rounded-xl border border-slate-100" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-slate-400">x{item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-950">฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>ราคารวมสินค้า</span>
                    <span>฿{totalCartPrice.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>ส่วนลดโปรโมชัน</span>
                      <span>-฿{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>ค่าจัดส่ง</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">ฟรี (ส่งฟรี)</strong> : `฿${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg text-slate-950 pt-3 border-t border-slate-100">
                    <span>ยอดชำระสุทธิ</span>
                    <span className="text-amber-800">฿{finalTotalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition active:scale-95 shadow-xl"
              >
                ยืนยันการสั่งซื้อ
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
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-950">ทำรายการสำเร็จ!</h2>
              <p className="text-xs text-slate-500">ขอบคุณสำหรับการสั่งซื้อสินค้ากับ **LLN367 Studio**</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl text-left text-xs space-y-3 border border-slate-100">
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
              <div className="flex justify-between border-t border-slate-200 pt-2.5 font-black text-sm text-slate-950">
                <span>ยอดเงินที่ชำระ:</span>
                <span className="text-amber-800">฿{orderDetails.total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setViewState('shop')}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white text-xs py-3.5 rounded-2xl font-bold transition"
            >
              กลับไปหน้าแรกเพื่อเลือกซื้อสินค้าต่อ
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
            
            {/* Drawer Header */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-950 text-amber-400 rounded-xl flex items-center justify-center font-black text-xs">
                    L
                  </div>
                  <h3 className="font-black text-slate-950 text-sm">ตะกร้าสินค้า ({totalCartCount})</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="p-1 text-slate-400 hover:text-slate-950 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress */}
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60 mt-4 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Truck size={14} className="text-amber-800" />
                    {remainingForFreeShipping <= 0 ? (
                      <span className="text-emerald-700 font-black">🎉 ยินดีด้วย! คุณได้รับสิทธิ์ส่งฟรี</span>
                    ) : (
                      <span>ซื้อเพิ่มอีก <strong className="text-amber-800">฿{remainingForFreeShipping.toLocaleString()}</strong> เพื่อส่งฟรี</span>
                    )}
                  </span>
                  <span className="text-amber-900 font-black">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs space-y-3">
                  <ShoppingBag size={48} className="mx-auto text-slate-200" />
                  <p className="font-bold text-slate-600">ตะกร้าสินค้ายังว่างอยู่</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-slate-950 text-white text-[11px] px-4 py-2.5 rounded-xl font-bold"
                  >
                    ไปเลือกดูสินค้า
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-slate-200" />
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-slate-950">฿{(item.price * item.quantity).toLocaleString()}</span>
                        
                        <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-600 hover:text-slate-950">
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-600 hover:text-slate-950">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Coupon & Total */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                
                {/* Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="กรอกโค้ดส่วนลด (LLN367)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-950 uppercase font-mono font-bold"
                    />
                    <Tag size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                  <button 
                    type="submit"
                    className="bg-slate-950 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-bold transition"
                  >
                    ใช้โค้ด
                  </button>
                </form>

                {couponMessage && (
                  <p className={`text-[10px] font-bold ${couponMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                    {couponMessage.text}
                  </p>
                )}

                {/* Summary Rows */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex justify-between">
                    <span>ราคาสินค้ารวม:</span>
                    <span>฿{totalCartPrice.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>ส่วนลดโปรโมชัน:</span>
                      <span>-฿{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>ค่าจัดส่ง:</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">ฟรี</strong> : `฿${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-base text-slate-950 pt-2 border-t border-slate-100">
                    <span>ยอดรวมสุทธิ:</span>
                    <span className="text-amber-800">฿{finalTotalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setViewState('checkout');
                  }}
                  className="w-full bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 text-xs py-3.5 rounded-2xl font-black tracking-widest uppercase transition shadow-lg active:scale-95"
                >
                  ไปหน้าชำระเงิน (฿{finalTotalPrice.toLocaleString()})
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PRO FOOTER (SENIOR PROJECT FEATURE)       */}
      {/* ========================================== */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-20">
        
        {/* Trust Badges */}
        <div className="border-b border-slate-800/80 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <ShieldCheck size={28} className="text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-100">สินค้าของแท้ 100%</h4>
                <p className="text-[11px] text-slate-500">รับประกันคุณภาพส่งตรงจากแบรนด์</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Truck size={28} className="text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-100">จัดส่งรวดเร็วทั่วประเทศ</h4>
                <p className="text-[11px] text-slate-500">ได้รับสินค้าภายใน 1-3 วันทำการ</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Lock size={28} className="text-amber-400" />
              <div>
                <h4 className="font-bold text-slate-100">ระบบชำระเงินปลอดภัย</h4>
                <p className="text-[11px] text-slate-500">รองรับ PromptPay & COD</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
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
