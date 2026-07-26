'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Plus, Minus, Trash2, X, CheckCircle2, Truck, Eye, Filter } from 'lucide-react';

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
  rating: number;
  sold: number;
  category: string;
  subCategory: string;
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

// 🎯 คลังรูปภาพแยกเฉพาะ 15 หมวดย่อยแบบเป๊ะๆ ไม่วนรูปมั่ว
const SPECIFIC_IMAGES: Record<string, string[]> = {
  // --- เสื้อผ้า ---
  'เสื้อผ้าผู้หญิง': [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80'
  ],
  'เสื้อผ้าผู้ชาย': [
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&q=80'
  ],
  'เสื้อผ้าเด็ก': [
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&q=80',
    'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&q=80'
  ],

  // --- รองเท้า ---
  'รองเท้าแฟชั่นผู้หญิง': [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&q=80'
  ],
  'รองเท้าผู้ชาย': [
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80',
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80'
  ],
  'รองเท้าสปอร์ต & ผ้าใบ': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'
  ],

  // --- ไอที ---
  'หูฟัง & ลำโพง': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80'
  ],
  'สมาร์ตวอทช์': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80'
  ],
  'อุปกรณ์คอมฯ & ไอที': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80'
  ],

  // --- กระเป๋า ---
  'กระเป๋าแฟชั่น': [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80'
  ],
  'กระเป๋าเดินทาง & เป้': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80'
  ],
  'เครื่องประดับ & แว่นตา': [
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80'
  ],

  // --- ความงาม ---
  'เครื่องสำอาง & เวชสำอาง': [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80'
  ],
  'น้ำหอม': [
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80'
  ],
  'ผลิตภัณฑ์ดูแลผิว': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    'https://images.unsplash.com/photo-1608248597261-833250005a76?w=600&q=80'
  ]
};

const GENERATE_PRODUCTS = (): Product[] => {
  const categories = [
    {
      main: 'clothing',
      subs: [
        { name: 'เสื้อผ้าผู้หญิง', keywords: 'เสื้อผ้า เสื้อผญ เสื้อผู้หญิง เดรส กระโปรง' },
        { name: 'เสื้อผ้าผู้ชาย', keywords: 'เสื้อผ้า เสื้อผช เสื้อผู้ชาย กางเกง เสื้อเชิ้ต สูท' },
        { name: 'เสื้อผ้าเด็ก', keywords: 'เสื้อผ้า ชุดเด็ก เสื้อเด็ก เสื้อผ้าเด็ก' },
      ],
    },
    {
      main: 'shoes',
      subs: [
        { name: 'รองเท้าแฟชั่นผู้หญิง', keywords: 'รองเท้า รองเท้าผญ ส้นสูง คัทชู' },
        { name: 'รองเท้าผู้ชาย', keywords: 'รองเท้า รองเท้าผช รองเท้าหนัง' },
        { name: 'รองเท้าสปอร์ต & ผ้าใบ', keywords: 'รองเท้า ผ้าใบ Sneaker รองเท้าวิ่ง' },
      ],
    },
    {
      main: 'electronics',
      subs: [
        { name: 'หูฟัง & ลำโพง', keywords: 'ไอที หูฟัง ลำโพง บลูทูธ Headphone' },
        { name: 'สมาร์ตวอทช์', keywords: 'ไอที นาฬิกา Smartwatch' },
        { name: 'อุปกรณ์คอมฯ & ไอที', keywords: 'ไอที คีย์บอร์ด เมาส์ สายชาร์จ Gadget' },
      ],
    },
    {
      main: 'bags_acc',
      subs: [
        { name: 'กระเป๋าแฟชั่น', keywords: 'กระเป๋า กระเป๋าผญ กระเป๋าถือ' },
        { name: 'กระเป๋าเดินทาง & เป้', keywords: 'กระเป๋า เป้ กระเป๋าเดินทาง' },
        { name: 'เครื่องประดับ & แว่นตา', keywords: 'เครื่องประดับ แว่นตา สร้อย แหวน' },
      ],
    },
    {
      main: 'beauty',
      subs: [
        { name: 'เครื่องสำอาง & เวชสำอาง', keywords: 'ความงาม เครื่องสำอาง ลิปสติก แป้ง' },
        { name: 'น้ำหอม', keywords: 'ความงาม น้ำหอม Perfume' },
        { name: 'ผลิตภัณฑ์ดูแลผิว', keywords: 'ความงาม สกินแคร์ ครีมบำรุง เซรั่ม' },
      ],
    },
  ];

  let list: Product[] = [];
  let idCounter = 1;

  categories.forEach((cat) => {
    cat.subs.forEach((sub) => {
      const imgs = SPECIFIC_IMAGES[sub.name] || [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
      ];

      for (let i = 1; i <= 50; i++) {
        const star5 = Math.floor(Math.random() * 200) + 40;
        const star4 = Math.floor(Math.random() * 30) + 5;
        const star3 = Math.floor(Math.random() * 8);

        const img1 = imgs[(i - 1) % imgs.length];
        const img2 = imgs[i % imgs.length];

        list.push({
          id: idCounter,
          name: `${sub.name} LALANA Premium Quality (รุ่น ${i})`,
          price: Math.floor(Math.random() * 2000) + 290,
          rating: Number((Math.random() * (5.0 - 4.3) + 4.3).toFixed(1)),
          sold: star5 + star4 + star3 + Math.floor(Math.random() * 300),
          category: cat.main,
          subCategory: sub.name,
          images: [img1, img2],
          description: `สินค้าแท้ 100% หมวด ${sub.name} รุ่นที่ ${i} ผลิตจากวัสดุคุณภาพเยี่ยม การตัดเย็บประณีต ออกแบบมาเพื่อการใช้งานที่คุ้มค่า คอลเลกชันใหม่ล่าสุดจาก LALANA367`,
          reviews: { star5, star4, star3, star2: 1, star1: 0 },
          searchKeywords: `${sub.name} ${sub.keywords} LALANA รุ่น ${i}`.toLowerCase(),
        });
        idCounter++;
      }
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => { setSearchTerm(''); setSelectedMainCategory('all'); setSelectedSubCategory('all'); }}
          >
            <div className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-lg tracking-wider shadow-md">
              LALANA
            </div>
            <span className="text-lg font-extrabold text-slate-800 tracking-widest">367</span>
          </div>

          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="ค้นหา เสื้อผ้า, รองเท้า, หูฟัง, กระเป๋า, สกินแคร์..."
              className="w-full py-2 pl-4 pr-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <X className="absolute right-3 top-2.5 text-slate-400 w-4 h-4 cursor-pointer hover:text-slate-600" onClick={() => setSearchTerm('')} />
            ) : (
              <Search className="absolute right-3 top-2.5 text-slate-400 w-4 h-4" />
            )}
          </div>

          <div className="relative p-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">ตะกร้า</span>
            <span className="bg-indigo-600 text-white font-black rounded-full h-5 w-5 flex items-center justify-center text-[11px]">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
        </div>
      </header>

      {/* หน้าสั่งซื้อสำเร็จ */}
      {isCheckoutSuccess && completedOrder ? (
        <main className="max-w-xl mx-auto px-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">สั่งซื้อสินค้าสำเร็จแล้ว!</h2>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-3 text-indigo-600">
              <Truck className="w-5 h-5 animate-bounce" />
              <span className="font-semibold text-sm">สถานะ: กำลังเตรียมจัดส่ง 🚚</span>
            </div>

            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-700 text-sm">สรุปรายการสินค้า:</h3>
              <div className="space-y-2">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
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
                <span>ราคารวมทั้งสิ้น:</span>
                <span className="text-indigo-600">฿{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => { setIsCheckoutSuccess(false); setCompletedOrder(null); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-100"
            >
              กลับไปเลือกซื้อสินค้าต่อ
            </button>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* หมวดหมู่หลัก */}
          <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-4">
            {[
              { key: 'all', label: '🔥 สินค้าทั้งหมด (750)' },
              { key: 'clothing', label: '👕 เสื้อผ้าแฟชั่น (150)' },
              { key: 'shoes', label: '👟 รองเท้า (150)' },
              { key: 'electronics', label: '🎧 ไอที & แกดเจ็ต (150)' },
              { key: 'bags_acc', label: '👜 กระเป๋า & แอกเซสซอรี (150)' },
              { key: 'beauty', label: '💄 ความงาม & สกินแคร์ (150)' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setSelectedMainCategory(cat.key); setSelectedSubCategory('all'); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition ${
                  selectedMainCategory === cat.key && !searchTerm
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* หมวดย่อย */}
          {selectedMainCategory !== 'all' && !searchTerm && (
            <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-2xl border border-slate-200 items-center shadow-sm">
              <span className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-indigo-600" /> หมวดย่อย:
              </span>
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSubCategory === 'all'
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                ทั้งหมด
              </button>

              {selectedMainCategory === 'clothing' && ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย', 'เสื้อผ้าเด็ก'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}>{sub} (50)</button>
              ))}
              {selectedMainCategory === 'shoes' && ['รองเท้าแฟชั่นผู้หญิง', 'รองเท้าผู้ชาย', 'รองเท้าสปอร์ต & ผ้าใบ'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}>{sub} (50)</button>
              ))}
              {selectedMainCategory === 'electronics' && ['หูฟัง & ลำโพง', 'สมาร์ตวอทช์', 'อุปกรณ์คอมฯ & ไอที'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}>{sub} (50)</button>
              ))}
              {selectedMainCategory === 'bags_acc' && ['กระเป๋าแฟชั่น', 'กระเป๋าเดินทาง & เป้', 'เครื่องประดับ & แว่นตา'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}>{sub} (50)</button>
              ))}
              {selectedMainCategory === 'beauty' && ['เครื่องสำอาง & เวชสำอาง', 'น้ำหอม', 'ผลิตภัณฑ์ดูแลผิว'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'}`}>{sub} (50)</button>
              ))}
            </div>
          )}

          {/* รายการสินค้า + ตะกร้าสินค้า */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <section className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800 border-l-4 border-indigo-600 pl-3">
                  {searchTerm ? `ผลการค้นหาสำหรับ "${searchTerm}"` : 'รายการสินค้า'}
                </h2>
                <span className="text-slate-500 text-xs">พบ {filteredProducts.length} รายการ</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => { setSelectedProduct(product); setActiveImageIndex(0); }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative overflow-hidden h-52 bg-slate-100">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                          {product.subCategory}
                        </span>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-indigo-600" /> ดูรายละเอียด
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug">{product.name}</h3>
                          <div className="flex items-center gap-1.5 mt-2 text-amber-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold text-slate-700">{product.rating}</span>
                            <span className="text-slate-400 text-[11px] ml-1">ขายแล้ว {product.sold.toLocaleString()} ชิ้น</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-indigo-600 font-extrabold text-base">฿{product.price.toLocaleString()}</span>
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition shadow-md shadow-indigo-100"
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
                  <p className="text-slate-500 text-sm">ไม่พบสินค้าที่คุณกำลังค้นหา</p>
                </div>
              )}
            </section>

            {/* 🛒 ตะกร้าสินค้าเวอร์ชันแก้ใหม่ล่าสุด (สวย คลีน ลบได้เลยแบบรูปที่ 4) */}
            <aside className="bg-white border border-slate-200 p-5 rounded-3xl h-fit sticky top-20 space-y-4 shadow-sm">
              <h2 className="text-base font-bold border-b border-slate-100 pb-3 text-slate-800 flex items-center justify-between">
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
                          
                          {/* ปุ่มเพิ่ม-ลดจำนวน */}
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

                        {/* ปุ่มลบสินค้าทันที */}
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
                      <span>ราคารวม:</span>
                      <span className="text-indigo-600 font-extrabold text-base">฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs transition shadow-md shadow-indigo-100"
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

      {/* MODAL รายละเอียดสินค้า & ดาวรีวิว */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={selectedProduct.images[activeImageIndex]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-14 flex-1 rounded-xl overflow-hidden border-2 transition ${
                        activeImageIndex === idx ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
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
                    <span className="text-slate-400 ml-1">ขายแล้ว {selectedProduct.sold.toLocaleString()} ชิ้น</span>
                  </div>
                  <p className="text-2xl font-black text-indigo-600 pt-1">฿{selectedProduct.price.toLocaleString()}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">{selectedProduct.description}</p>

                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-xs transition shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> เพิ่มลงตะกร้าสินค้า
                </button>
              </div>
            </div>

            {/* ดาวรีวิว */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <h3 className="font-bold text-slate-800 text-xs">คะแนนและรีวิวจากผู้ซื้อ</h3>
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-6">
                <div className="text-center pr-4 border-r border-slate-200">
                  <p className="text-2xl font-black text-slate-900">{selectedProduct.rating}</p>
                  <div className="flex text-amber-400 my-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
                <div className="flex-1 space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>5 ดาว</span>
                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-slate-400">{selectedProduct.reviews.star5} คน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>4 ดาว</span>
                    <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full" style={{ width: '12%' }}></div>
                    </div>
                    <span className="text-slate-400">{selectedProduct.reviews.star4} คน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
