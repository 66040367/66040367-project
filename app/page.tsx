'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Plus, Trash2, X, CheckCircle2, Truck, ArrowLeft, Filter, Eye } from 'lucide-react';

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

// ชุดรูปภาพแยกตามหมวดหมู่อย่างแม่นยำ ไม่มั่วแน่นอน
const CATEGORY_IMAGES: Record<string, string[]> = {
  clothing: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80'
  ],
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'
  ],
  bags_acc: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80'
  ]
};

const GENERATE_PRODUCTS = (): Product[] => {
  const categories = [
    {
      main: 'clothing',
      subs: [
        { name: 'เสื้อผ้าผู้หญิง', keywords: 'เสื้อผ้า เสื้อผญ เสื้อผู้หญิง เดรส ชุดผู้หญิง' },
        { name: 'เสื้อผ้าผู้ชาย', keywords: 'เสื้อผ้า เสื้อผช เสื้อผู้ชาย กางเกง เสื้อเชิ้ต' },
        { name: 'เสื้อผ้าเด็ก', keywords: 'เสื้อผ้า ชุดเด็ก เสื้อเด็ก เสื้อผ้าเด็ก' },
      ],
    },
    {
      main: 'shoes',
      subs: [
        { name: 'รองเท้าแฟชั่นผู้หญิง', keywords: 'รองเท้า รองเท้าผญ รองเท้าผู้หญิง ส้นสูง คัทชู' },
        { name: 'รองเท้าผู้ชาย', keywords: 'รองเท้า รองเท้าผช รองเท้าผู้ชาย รองเท้าหนัง' },
        { name: 'รองเท้าสปอร์ต & ผ้าใบ', keywords: 'รองเท้า ผ้าใบ รองเท้ากีฬา Sneaker รองเท้าวิ่ง' },
      ],
    },
    {
      main: 'electronics',
      subs: [
        { name: 'หูฟัง & ลำโพง', keywords: 'ไอที หูฟัง ลำโพง บลูทูธ Headphone' },
        { name: 'สมาร์ตวอทช์', keywords: 'ไอที นาฬิกา Smartwatch สมาร์ตวอทช์' },
        { name: 'อุปกรณ์คอมฯ & ไอที', keywords: 'ไอที คีย์บอร์ด เมาส์ สายชาร์จ Gadget' },
      ],
    },
    {
      main: 'bags_acc',
      subs: [
        { name: 'กระเป๋าแฟชั่น', keywords: 'กระเป๋า กระเป๋าผญ กระเป๋าผู้หญิง กระเป๋าถือ' },
        { name: 'กระเป๋าเดินทาง & เป้', keywords: 'กระเป๋า เป้ กระเป๋าเดินทาง กระเป๋าสะพาย' },
        { name: 'เครื่องประดับ & แว่นตา', keywords: 'เครื่องประดับ แว่นตา สร้อย แหวน ต่างหู' },
      ],
    },
    {
      main: 'beauty',
      subs: [
        { name: 'เครื่องสำอาง & เวชสำอาง', keywords: 'ความงาม เครื่องสำอาง ลิปสติก แป้งแต่งหน้า' },
        { name: 'น้ำหอม', keywords: 'ความงาม น้ำหอม น้ำหอมผญ น้ำหอมผช' },
        { name: 'ผลิตภัณฑ์ดูแลผิว', keywords: 'ความงาม สกินแคร์ ครีมบำรุง เซรั่ม' },
      ],
    },
  ];

  let list: Product[] = [];
  let idCounter = 1;

  categories.forEach((cat) => {
    const imgList = CATEGORY_IMAGES[cat.main];
    cat.subs.forEach((sub) => {
      for (let i = 1; i <= 50; i++) {
        const star5 = Math.floor(Math.random() * 200) + 50;
        const star4 = Math.floor(Math.random() * 40) + 10;
        const star3 = Math.floor(Math.random() * 10);
        const star2 = Math.floor(Math.random() * 5);
        const star1 = Math.floor(Math.random() * 2);

        const img1 = imgList[(i - 1) % imgList.length];
        const img2 = imgList[(i) % imgList.length];
        const img3 = imgList[(i + 1) % imgList.length];

        list.push({
          id: idCounter,
          name: `${sub.name} LALANA Premium Quality (รุ่น ${i})`,
          price: Math.floor(Math.random() * 2300) + 290,
          rating: Number((Math.random() * (5.0 - 4.3) + 4.3).toFixed(1)),
          sold: star5 + star4 + star3 + star2 + star1 + Math.floor(Math.random() * 500),
          category: cat.main,
          subCategory: sub.name,
          images: [img1, img2, img3],
          description: `สินค้าคุณภาพสูง ${sub.name} ดีไซน์พรีเมียมจากคอลเลกชัน LALANA367 ตัดเย็บและผลิตด้วยวัสดุเกรดพรีเมียม ให้ความคงทนและดีไซน์ทันสมัย เหมาะสำหรับทุกโอกาสการใช้งาน`,
          reviews: { star5, star4, star3, star2, star1 },
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
  
  // State สำหรับดูรายละเอียดสินค้า (Modal)
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

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ระบบค้นหาอัจฉริยะ (ถ้ามีการค้นหา ให้ค้นหาจากสินค้าทั้งหมดโดยไม่ติดกั้นหมวด)
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
      {/* Header สไตล์มินิมอล หรูหรา */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => { setSearchTerm(''); setSelectedMainCategory('all'); setSelectedSubCategory('all'); }}
          >
            <div className="bg-indigo-600 text-white font-black px-3 py-1 rounded-lg text-lg tracking-wider shadow-md group-hover:bg-indigo-700 transition">
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

          <div className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer transition">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* สั่งซื้อสำเร็จ */}
      {isCheckoutSuccess && completedOrder ? (
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">สั่งซื้อสินค้าสำเร็จแล้ว!</h2>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-3 text-indigo-600">
              <Truck className="w-5 h-5 animate-bounce" />
              <span className="font-semibold text-sm">สถานะ: สินค้ากำลังเตรียมจัดส่ง 🚚</span>
            </div>

            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-700 text-sm">สรุปรายการสินค้า:</h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="font-semibold text-xs text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-slate-500">จำนวน: {item.quantity} ชิ้น</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-indigo-600">฿{(item.price * item.quantity).toLocaleString()}</span>
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-100"
            >
              <ArrowLeft className="w-4 h-4" /> กลับไปเลือกซื้อสินค้าต่อ
            </button>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* แถบเลือกหมวดหมู่หลัก */}
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

          {/* แถบเลือกหมวดย่อย */}
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

          {/* ตารางแสดงสินค้า + ตะกร้า */}
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
                  <p className="text-slate-500 text-sm">ไม่พบสินค้าที่คุณกำลังค้นหา ลองพิมพ์คำค้นหาอื่นดูนะครับ</p>
                </div>
              )}
            </section>

            {/* Sidebar ตะกร้าสินค้า */}
            <aside className="bg-white border border-slate-200 p-5 rounded-3xl h-fit sticky top-20 space-y-4 shadow-sm">
              <h2 className="text-base font-bold border-b border-slate-100 pb-3 text-slate-800 flex items-center justify-between">
                <span>ตะกร้าสินค้า</span>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">{cart.length}</span>
              </h2>

              {cart.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">ไม่มีสินค้าในตะกร้า</p>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5">
                        <div className="flex-1 pr-2">
                          <p className="font-semibold text-slate-700 truncate">{item.name}</p>
                          <p className="text-slate-400 text-[11px]">฿{item.price.toLocaleString()} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between font-bold text-slate-800 text-sm">
                      <span>ราคารวม:</span>
                      <span className="text-indigo-600">฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-md shadow-indigo-100"
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

      {/* ----------------- MODAL รายละเอียดสินค้า & รีวิวดาว ----------------- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* รูปภาพหลักและรูปภาพเพิ่มเติม */}
              <div className="space-y-3">
                <div className="h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={selectedProduct.images[activeImageIndex]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-16 flex-1 rounded-xl overflow-hidden border-2 transition ${
                        activeImageIndex === idx ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ข้อมูลรายละเอียด */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-lg">
                    {selectedProduct.subCategory}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-2 text-amber-500 text-xs">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-slate-800 ml-1">{selectedProduct.rating}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">ขายแล้ว {selectedProduct.sold.toLocaleString()} ชิ้น</span>
                  </div>
                  <p className="text-2xl font-black text-indigo-600 pt-2">฿{selectedProduct.price.toLocaleString()}</p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold text-slate-700 mb-1">รายละเอียดสินค้า:</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-xs transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> เพิ่มลงตะกร้าสินค้า
                </button>
              </div>
            </div>

            {/* ส่วนแสดงคะแนนและรีวิวสไตล์ Shopee */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">คะแนนและรีวิวจากผู้ซื้อ</h3>
              <div className="bg-slate-50 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="text-center sm:border-r border-slate-200 pr-2">
                  <p className="text-3xl font-black text-slate-900">{selectedProduct.rating}</p>
                  <div className="flex justify-center text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">จากทั้งหมด {selectedProduct.sold} รีวิว</p>
                </div>

                <div className="sm:col-span-2 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium">5 ดาว</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="w-12 text-right text-slate-400">{selectedProduct.reviews.star5} คน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium">4 ดาว</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    <span className="w-12 text-right text-slate-400">{selectedProduct.reviews.star4} คน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium">3 ดาว</span>
                    <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '3%' }}></div>
                    </div>
                    <span className="w-12 text-right text-slate-400">{selectedProduct.reviews.star3} คน</span>
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
