'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Star, Zap, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, Truck, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Sparkles, Filter
} from 'lucide-react';

export interface ProductItem {
  id: number;
  name: string;
  mainCategory: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  sold: number;
  image: string;
  badge?: 'HOT' | 'SALE' | 'NEW';
  spec: string;
  keywords: string[];
}

// 1. โครงสร้างหมวดหมู่หลักและหมวดย่อย
const CATEGORY_STRUCTURE = [
  {
    id: 'fashion',
    name: '👗 เสื้อผ้าแฟชั่น',
    subs: ['เสื้อผ้า ผญ', 'เสื้อผ้าผู้ชาย', 'เสื้อผ้าเด็ก', 'รองเท้า', 'กระเป๋า', 'อุปกรณ์อื่นๆ (กำไล/สร้อย/แหวน)']
  },
  {
    id: 'it',
    name: '💻 อุปกรณ์ไอที & เกมมิ่ง',
    subs: ['โทรศัพท์', 'แท็บเล็ต (MacBook)', 'คอมพิวเตอร์', 'ไมค์เล่นเกม', 'หูฟังเล่นเกม', 'คีย์บอร์ดเล่นเกม', 'จอคอม', 'CPU', 'RAM', 'คอมประกอบ']
  },
  {
    id: 'beauty',
    name: '💄 เครื่องสำอาง & บำรุงผิว',
    subs: ['บลัชออน', 'ลิป', 'รองพื้น', 'คอนซีลเลอร์', 'ครีมทาหน้าหรือเซรั่ม', 'ครีมทาผิว', 'ครีมกันแดดทั้งหน้าและตัว']
  },
  {
    id: 'food',
    name: '🍱 อาหาร & ขนม',
    subs: ['มาม่า', 'ขนมที่สามารถส่งพัสดุได้', 'อาหารบรรจุภัณฑ์']
  },
  {
    id: 'toys',
    name: '🧸 ของเล่น & กล่องสุ่ม',
    subs: ['ของเล่นรวม']
  },
  {
    id: 'decor',
    name: '🏠 ของตกแต่งบ้าน & ห้องนอน',
    subs: ['โต๊ะคอม', 'กระจก', 'ไฟ LED', 'ตุ๊กตา/พรม/ของแต่งห้อง']
  }
];

// คีย์เวิร์ดสำหรับสุ่มภาพ Unsplash ให้ตรงกับแต่ละหมวดย่อย
const SUB_CAT_IMAGE_KEYWORDS: Record<string, string> = {
  'เสื้อผ้า ผญ': 'women-clothing,fashion-dress,korean-style',
  'เสื้อผ้าผู้ชาย': 'menswear,streetwear,mens-fashion',
  'เสื้อผ้าเด็ก': 'kids-clothing,baby-fashion',
  'รองเท้า': 'sneakers,shoes,running-shoes',
  'กระเป๋า': 'handbag,backpack,leather-bag',
  'อุปกรณ์อื่นๆ (กำไล/สร้อย/แหวน)': 'jewelry,necklace,ring,accessories',
  'โทรศัพท์': 'smartphone,iphone,samsung-galaxy',
  'แท็บเล็ต (MacBook)': 'ipad,macbook,tablet,laptop',
  'คอมพิวเตอร์': 'gaming-pc,desktop-computer,setup',
  'ไมค์เล่นเกม': 'microphone,gaming-mic,studio-mic',
  'หูฟังเล่นเกม': 'gaming-headset,headphones',
  'คีย์บอร์ดเล่นเกม': 'mechanical-keyboard,gaming-keyboard',
  'จอคอม': 'gaming-monitor,computer-screen',
  'CPU': 'cpu-processor,computer-hardware',
  'RAM': 'ram-memory,computer-components',
  'คอมประกอบ': 'custom-pc-build,pc-case-rgb',
  'บลัชออน': 'blush-makeup,cosmetics',
  'ลิป': 'lipstick,lip-gloss,makeup',
  'รองพื้น': 'foundation-makeup,bb-cream',
  'คอนซีลเลอร์': 'concealer-makeup,beauty-products',
  'ครีมทาหน้าหรือเซรั่ม': 'skincare-serum,face-cream,face-oil',
  'ครีมทาผิว': 'body-lotion,moisturizer-skin',
  'ครีมกันแดดทั้งหน้าและตัว': 'sunscreen,sunblock-lotion',
  'มาม่า': 'ramen-noodle,instant-noodles',
  'ขนมที่สามารถส่งพัสดุได้': 'snacks,cookies,japanese-sweets',
  'อาหารบรรจุภัณฑ์': 'packaged-food,canned-food',
  'ของเล่นรวม': 'blind-box,figure-toy,plush-toy',
  'โต๊ะคอม': 'desk-setup,minimal-desk,gaming-desk',
  'กระจก': 'mirror-decor,aesthetic-mirror',
  'ไฟ LED': 'led-lights,rgb-lights,neon-light',
  'ตุ๊กตา/พรม/ของแต่งห้อง': 'rug-decor,plushie,room-decoration'
};

// 2. GENERATOR ENGINE: สร้างสินค้ามากกว่า 50+ รายการ "ต่อทุกหมวดย่อย" พร้อมภาพไม่ซ้ำ และคำอธิบายยาว
const GENERATED_PRODUCTS: ProductItem[] = (() => {
  const list: ProductItem[] = [];
  let idCounter = 1;

  CATEGORY_STRUCTURE.forEach((mainCat) => {
    mainCat.subs.forEach((subCat) => {
      // สร้าง 52 รายการต่อ 1 หมวดย่อย
      for (let i = 1; i <= 52; i++) {
        let name = '';
        let spec = '';
        let price = 0;
        let keywords: string[] = [mainCat.name, subCat, 'พร้อมส่ง', 'แท้100%'];

        // สร้างรูปภาพจาก Unsplash Source สุ่มตาม ID เพื่อความไม่ซ้ำกัน
        const imgKeyword = SUB_CAT_IMAGE_KEYWORDS[subCat] || 'product';
        const image = `https://images.unsplash.com/photo-${1500000000000 + (idCounter * 13579) % 900000000}?w=600&q=80&fit=crop`;
        
        // --- 1. หมวดแฟชั่น ---
        if (mainCat.id === 'fashion') {
          if (subCat === 'เสื้อผ้า ผญ') {
            name = `เสื้อผ้าน่ารักๆ พร้อมส่งจากไทย 🇹🇭 เดรส/เสื้อครอป สไตล์เกาหลี มินิมอล รุ่น Pro-Slim (#${i})`;
            spec = `ตัดเย็บด้วยผ้าฝ้ายพรีเมียม ผ้านุ่มระบายอากาศดีมาก ไม่ร้อน ไม่บาง ทรงสวยเป๊ะ พรางหุ่นได้ดีเยี่ยม เหมาะกับใส่ไปคาเฟ่ เที่ยวทะเล หรือใส่ทำงานในชีวิตประจำวัน สามารถซักเครื่องได้ผ้าไม่หดตัว สีไม่ตก มั่นใจคุณภาพ 100%`;
            price = 290 + (i * 20) % 650;
            keywords.push('เกาหลี', 'ชุดเดรส', 'เสื้อครอป', 'เสื้อน่ารัก', 'คาเฟ่', 'พรางหุ่น');
          } else if (subCat === 'รองเท้า') {
            name = `รองเท้าผ้าใบ/ส้นสูง สวมใส่สบาย พื้นนุ่มซับแรงกระแทก รุ่น Air-Comfort (#${i})`;
            spec = `ดีไซน์สตรีทแฟชั่นยอดนิยม ผลิตจากหนัง PU และผ้าตาข่ายระบายอากาศได้ดีเยี่ยม พื้นยางพาราแท้กันลื่น น้ำหนักเบาใส่เดินได้ทั้งวันโดยไม่เจ็บเท้า ส้นสูงกำลังดี ช่วยเสริมบุคลิกและสัดส่วนให้ดูเพรียวสวยงาม`;
            price = 490 + (i * 45) % 1500;
            keywords.push('รองเท้าผ้าใบ', 'ส้นสูง', 'พื้นนุ่ม', 'ไม่เจ็บเท้า', 'กันลื่น');
          } else {
            name = `${subCat} สินค้าแฟชั่นอินเทรนด์ สไตล์เกาหลี พร้อมส่งจากไทย 🇹🇭 (#${i})`;
            spec = `วัสดุเกรดพรีเมียม ผ่านการคัดสรรคุณภาพอย่างพิถีพิถัน ดีไซน์ทันสมัยแมตช์เข้าได้กับทุกชุด ลุคมินิมอล เรียบหรูดูแพง ทนทานต่อการใช้งาน ทรงสวยตรงปกตรงตามรูปภาพ 100%`;
            price = 190 + (i * 30) % 900;
            keywords.push('มินิมอล', 'สตรีท', 'เรียบหรู');
          }
        } 
        // --- 2. หมวดไอที ---
        else if (mainCat.id === 'it') {
          if (subCat === 'โทรศัพท์') {
            const brands = ['Apple iPhone 15 Pro', 'Samsung Galaxy S24 Ultra', 'Xiaomi 14 Pro', 'OPPO Find N3', 'Vivo X100 Pro'];
            const selectedBrand = brands[i % brands.length];
            name = `${selectedBrand} 5G (ความจุ ${128 * ((i % 3) + 1)}GB) ประกันศูนย์ไทย 1 ปี (#${i})`;
            spec = `มาพร้อมชิปประมวลผลทรงพลังระดับท็อป รองรับความเร็ว 5G จอแสดงผล AMOLED 120Hz ลื่นไหลสบายตา กล้องถ่ายภาพความละเอียดสูง 108MP+ พร้อมระบบ AI ช่วยแต่งภาพให้สวยงามถ่ายหน้าชัดหลังเบลอสมบูรณ์แบบ แบตเตอรี่อึดทนทาน ชาร์จไว 67W`;
            price = 18900 + (i * 850) % 35000;
            keywords.push('5G', 'กล้องสวย', 'ชิปแรง', 'จอ120Hz', 'ชาร์จไว', 'ประกันศูนย์');
          } else if (subCat === 'แท็บเล็ต (MacBook)') {
            name = `Apple MacBook / iPad Pro M3/M4 Series หน้าจอ Retina XDR (#${i})`;
            spec = `ประสิทธิภาพการประมวลผลขั้นสูงด้วยชิป M-Series ล่าสุด รองรับงานกราฟิก 3D ตัดต่อวิดีโอ 4K และการทำงานมัลติทาสก์ได้อย่างลื่นไหล จอภาพ Retina แสดงสีสันสดใสเที่ยงตรง บอดี้อลูมิเนียมเกรดอวกาศ น้ำหนักเบาพกพาสะดวก แบตเตอรี่ใช้งานยาวนานสูงสุด 18 ชั่วโมง`;
            price = 23900 + (i * 1200) % 55000;
            keywords.push('ชิปM3', 'ชิปM4', 'ตัดต่อวิดีโอ', 'พกพาง่าย', 'แบตอึด', 'Apple');
          } else if (subCat === 'คอมพิวเตอร์') {
            name = `โน้ตบุ๊กเกมมิ่ง/ทำงานระดับไฮเอนด์ Intel Core i9 / RTX 4070 (#${i})`;
            spec = `สเปกเทพสำหรับการเล่นเกมระดับ AAA และงานเรนเดอร์ขนาดยักษ์ การ์ดจอ NVIDIA GeForce RTX 40 Series รองรับ Ray Tracing จอภาพ IPS 240Hz ตอบสนองรวดเร็ว ระบบระบายความร้อนพัดลมคู่แบบพิเศษ คีย์บอร์ด RGB ปรับแต่งไฟได้ตามต้องการ`;
            price = 29900 + (i * 1500) % 60000;
            keywords.push('i9', 'RTX4070', 'เล่นเกม', '240Hz', 'Notebook', 'Gaming');
          } else {
            name = `${subCat} อุปกรณ์ไอทีฮาร์ดแวร์เกมมิ่ง Pro Performance (#${i})`;
            spec = `อุปกรณ์สเปกเกมมิ่งเกียร์เกรดโปรนักกีฬา E-Sports เลือกใช้ ตอบสนองแม่นยำไร้ดีเลย์ วัสดุแข็งแรงทนทาน เชื่อมต่อได้ทั้งแบบสายและไร้สาย Bluetooth 5.3 / 2.4GHz ประกันศูนย์ไทยเสียเปลี่ยนตัวใหม่ทันที`;
            price = 890 + (i * 250) % 5000;
            keywords.push('Gaming', 'E-Sports', 'ไร้สาย', 'RGB', 'ประกันศูนย์');
          }
        } 
        // --- 3. หมวดเครื่องสำอาง & สกินแคร์ ---
        else if (mainCat.id === 'beauty') {
          if (subCat === 'ครีมทาหน้าหรือเซรั่ม') {
            name = `เซรั่มเข้มข้นบำรุงผิวหน้า Estée / La Roche / Kiehl's สูตรฟื้นฟูผิวเร่งด่วน (#${i})`;
            spec = `สูตรนวัตกรรมใหม่บำรุงล้ำลึกถึงชั้นเซลล์ผิว ช่วยลดเลือนริ้วรอย จุดด่างดำ และรอยแดงจากสิว ปรับผิวหน้าให้สว่างกระจ่างใส ฉ่ำวาวอิ่มน้ำแบบสาวเกาหลี รูขุมขนแลดูกระชับขึ้นภายใน 7 วัน อ่อนโยนต่อผิวแพ้ง่าย ไม่มีส่วนผสมของแอลกอฮอล์และพาราเบน`;
            price = 890 + (i * 120) % 4500;
            keywords.push('เซรั่ม', 'หน้าฉ่ำ', 'ลดสิว', 'ผิวแพ้ง่าย', 'กระจ่างใส', 'ลดริ้วรอย');
          } else if (subCat === 'ลิป') {
            name = `ลิปบาล์มเปลี่ยนสี / ลิปแมตต์ฉ่ำวาว ติดทนนาน 24 ชั่วโมง Dior & Rom&nd Style (#${i})`;
            spec = `ลิปสติกเนื้อสัมผัสเนียนนุ่ม สบายริมฝีปาก ไม่แห้งตึง ไม่ตกตระกูล เม็ดสีแน่นชัดกลบสีปากเดิมได้มิด พร้อมสารบำรุงจากวิตามินอีและออยล์ธรรมชาติ ให้ริมฝีปากเนียนนุ่มชุ่มชื้นอวบอิ่มตลอดวัน กันน้ำ กันเหงื่อ ไม่ติดแมสก์`;
            price = 350 + (i * 40) % 1500;
            keywords.push('ลิปแมตต์', 'ลิปทินท์', 'ติดทน', 'ไม่ติดแมสก์', 'ปากชุ่มชื้น');
          } else {
            name = `${subCat} เคาน์เตอร์แบรนด์แท้ 100% ปกปิดเนียนกริบ ปรับผิวสวยสดใส (#${i})`;
            spec = `เนื้อสัมผัสบางเบา ควบคุมความมันยาวนานตลอด 12 ชั่วโมง ไม่เป็นคราบระหว่างวัน พร้อมปกป้องผิวจากแสงแดดด้วย SPF50+ PA++++ ช่วยให้เมคอัพติดทนนาน สดใสเปล่งประกายอย่างเป็นธรรมชาติ`;
            price = 450 + (i * 60) % 2000;
            keywords.push('คุมมัน', 'กันแดด', 'ปกปิดดี', 'บางเบา');
          }
        } 
        // --- 4. หมวดอื่นๆ ---
        else {
          name = `${subCat} สินค้าคุณภาพพรีเมียม นำเข้าพร้อมส่งจากไทย 🇹🇭 (#${i})`;
          spec = `ผลิตจากวัสดุคุณภาพดีเยี่ยม ปลอดภัยไร้สารตกค้าง ผ่านการรับรองมาตรฐานสากล ออกแบบมาให้ใช้งานง่าย สะดวกสบาย ตอบโจทย์ไลฟ์สไตล์ยุคใหม่ คุ้มค่าคุ้มราคา จัดส่งรวดเร็วทันใจ ห่อกันกระแทกอย่างดี`;
          price = 120 + (i * 35) % 1200;
          keywords.push('พรีเมียม', 'จัดส่งไว', 'ของแท้');
        }

        list.push({
          id: idCounter++,
          name,
          mainCategory: mainCat.id,
          subCategory: subCat,
          price,
          originalPrice: Math.floor(price * 1.35),
          rating: Number((4.6 + (i % 4) * 0.1).toFixed(1)),
          reviewsCount: 80 + i * 14,
          sold: 150 + i * 28,
          image,
          badge: i % 5 === 0 ? 'HOT' : i % 7 === 0 ? 'SALE' : 'NEW',
          spec,
          keywords
        });
      }
    });
  });

  return list;
})();

export default function StorePage() {
  const [activeMainCat, setActiveMainCat] = useState<string>('all'); // 'all' = หน้าแรกสินค้าคละ
  const [activeSubCat, setActiveSubCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: { product: ProductItem; quantity: number }[]; total: number } | null>(null);

  // ดึงหมวดย่อยตามหมวดหลักที่เลือก
  const currentSubCategories = useMemo(() => {
    if (activeMainCat === 'all') return [];
    const found = CATEGORY_STRUCTURE.find(c => c.id === activeMainCat);
    return found ? found.subs : [];
  }, [activeMainCat]);

  // ระบบกรองสินค้า (หน้าแรกคละสินค้า / กรองตามหมวด / ค้นหาคีย์เวิร์ดอย่างฉลาด)
  const filteredProducts = useMemo(() => {
    return GENERATED_PRODUCTS.filter((item) => {
      // 1. กรองตามหมวดหลัก (ถ้าเป็น 'all' คือแสดงทุกหมวดคละกัน)
      const matchMain = activeMainCat === 'all' || item.mainCategory === activeMainCat;
      
      // 2. กรองตามหมวดย่อย
      const matchSub = activeSubCat === 'all' || item.subCategory === activeSubCat;
      
      // 3. กรองตามคำค้นหา (ค้นหาจาก ชื่อ, สเปก, หมวดย่อย, คีย์เวิร์ด)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        item.spec.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q));

      return matchMain && matchSub && matchSearch;
    });
  }, [activeMainCat, activeSubCat, searchQuery]);

  const addToCart = (product: ProductItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const exist = prev.find((i) => i.product.id === product.id);
      if (exist) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setCompletedOrder({ items: [...cart], total });
    setCart([]);
    setIsCartOpen(false);
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartPrice = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // 🟢 หน้าสรุปการสั่งซื้อสำเร็จ
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">สั่งซื้อสินค้าสำเร็จ!</h1>
            
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-2xl text-lg font-extrabold shadow-sm">
              <Truck className="w-6 h-6 animate-bounce" />
              <span>พนักงานกำลังจัดส่งพัสดุของคุณ 🚚</span>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3 max-h-80 overflow-y-auto">
            <h3 className="text-base font-extrabold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-400" /> สรุปรายการสินค้าที่ชำระแล้ว
            </h3>
            {completedOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-4 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-base text-white truncate">{product.name}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">จำนวน: <span className="text-rose-400 font-bold">{quantity}</span> ชิ้น (฿{product.price.toLocaleString()} / ชิ้น)</p>
                  </div>
                </div>
                <span className="font-black text-indigo-400 text-lg shrink-0">฿{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2 py-2 border-t border-slate-800">
            <span className="text-slate-200 text-lg font-bold">ราคารวมที่ชำระทั้งหมด:</span>
            <span className="text-3xl font-black text-emerald-400">฿{completedOrder.total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setCompletedOrder(null)}
            className="w-full bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ArrowLeft className="w-6 h-6" /> ย้อนกลับไปหน้าสั่งซื้อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative overflow-x-hidden">
      
      {/* 🟢 HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveMainCat('all'); setActiveSubCat('all'); setSearchQuery(''); }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rose-500/30">
              L
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 via-rose-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                Lalana367
              </span>
              <span className="text-xs font-bold text-slate-400 block tracking-widest -mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> OFFICIAL STORE
              </span>
            </div>
          </div>

          {/* ช่องค้นหา Smart Keywords */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา iPhone, M3, หน้าฉ่ำ, สไตล์เกาหลี, เสื้อครอป, RTX 4070..."
              className="w-full bg-slate-800/90 text-slate-100 pl-12 pr-10 py-3.5 rounded-2xl text-base font-semibold border border-slate-700/80 focus:border-rose-500 focus:outline-none transition-all placeholder:text-slate-500 shadow-inner"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="w-10"></div>
        </div>
      </header>

      {/* 🟢 MAIN STORE SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* 🔥 หมวดหมู่หลัก (มีตัวเลือก "✨ สินค้าทั้งหมด (คละหมวด)") */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-rose-400 text-sm font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> เลือกหมวดหมู่สินค้า (มีตัวเลือกสินค้า 50+ รายการต่อหมวดย่อย)
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-slate-800/80">
            <button
              onClick={() => { setActiveMainCat('all'); setActiveSubCat('all'); }}
              className={`px-7 py-3.5 rounded-2xl text-base sm:text-lg font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                activeMainCat === 'all'
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white shadow-lg scale-105 border border-amber-400/40'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              ✨ สินค้าทั้งหมด (คละหมวด)
            </button>

            {CATEGORY_STRUCTURE.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveMainCat(cat.id); setActiveSubCat('all'); }}
                className={`px-7 py-3.5 rounded-2xl text-base sm:text-lg font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                  activeMainCat === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 via-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 scale-105 border border-rose-400/40'
                    : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🏷️ หมวดย่อย (จะโชว์เมื่อเลือกหมวดหลัก) */}
        {currentSubCategories.length > 0 && (
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
              <button
                onClick={() => setActiveSubCat('all')}
                className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  activeSubCat === 'all'
                    ? 'bg-white text-slate-950 shadow-md scale-102'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                ทั้งหมดในหมวดนี้
              </button>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCat(sub)}
                  className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeSubCat === sub
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-102 border border-rose-400'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {sub} (50+)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* หัวข้อบอกสถานะหน้าสินค้าปัจจุบัน */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-rose-400" />
            {activeMainCat === 'all' ? 'สินค้าแนะนำคละหมวดหมู่ทั้งหมด' : CATEGORY_STRUCTURE.find(c => c.id === activeMainCat)?.name}
            {activeSubCat !== 'all' && <span className="text-rose-400"> › {activeSubCat}</span>}
          </h2>
          <span className="text-sm font-bold text-slate-400">พบ {filteredProducts.length.toLocaleString()} รายการ</span>
        </div>

        {/* 🛍️ GRID ตารางสินค้า */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-slate-900 border border-slate-800/90 rounded-3xl overflow-hidden hover:border-rose-500/60 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
                  <span className="bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                    {product.subCategory}
                  </span>
                  {product.badge && (
                    <span className={`text-xs font-black px-2 py-1 rounded-lg text-white flex items-center gap-0.5 shadow-md ${
                      product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      <Zap className="w-3 h-3 fill-current" /> {product.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-black text-slate-100 text-base line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>
                  {/* รายละเอียดสเปกยาว อ่านง่าย */}
                  <p className="text-xs text-slate-400 line-clamp-3 mt-1.5 font-normal leading-relaxed">
                    {product.spec}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-3">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-slate-200">{product.rating}</span>
                    <span className="text-slate-500">({product.reviewsCount})</span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                    <div>
                      <span className="text-rose-400 font-black text-lg block">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-xs line-through block -mt-1">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="bg-rose-600 hover:bg-rose-500 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-90 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🔴 ตะกร้าสินค้า Floating Bar ขวาสุด */}
      <div 
        className={`fixed top-1/3 right-0 z-50 flex items-center transition-all duration-300 ${
          isCartOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
        onMouseEnter={() => setIsCartOpen(true)}
      >
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-slate-900/80 backdrop-blur-md border-l border-y border-rose-500/50 text-slate-200 p-4 rounded-l-2xl shadow-2xl flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <ChevronLeft className="w-6 h-6 text-rose-400 group-hover:-translate-x-1 transition-transform animate-pulse" />
          <div className="relative">
            <ShoppingCart className="w-7 h-7 text-slate-100" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                {totalCartCount}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* 🟢 SIDEBAR ตะกร้าสินค้า */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`bg-slate-900/95 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-black text-xl text-white flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-rose-400" /> ตะกร้าสินค้า Lalana367 ({totalCartCount})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 overflow-y-auto max-h-[62vh] pr-1">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 py-24 text-base space-y-3">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="font-bold">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                    <img src={product.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-100 truncate">{product.name}</h4>
                      <span className="text-rose-400 font-black text-base block mt-0.5">฿{(product.price * quantity).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 text-sm font-black text-slate-200">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-slate-300">ราคารวมทั้งหมด:</span>
              <span className="text-2xl font-black text-rose-400">฿{totalCartPrice.toLocaleString()}</span>
            </div>
            
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <ShieldCheck className="w-6 h-6" /> ชำระเงิน
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 MODAL POPUP รายละเอียดสินค้าอย่างละเอียด */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-800">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-white z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-square w-full bg-slate-950 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-5 max-h-[45vh] overflow-y-auto">
              <div>
                <span className="bg-rose-500/20 text-rose-400 text-xs font-black px-3 py-1 rounded-lg border border-rose-500/30">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-xl font-black text-white mt-2.5 leading-snug">{selectedProduct.name}</h2>
                
                {/* คำอธิบายยาวอย่างละเอียด */}
                <div className="mt-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">รายละเอียดและคุณสมบัติสินค้า</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">{selectedProduct.spec}</p>
                </div>
              </div>

              {/* Tag คำค้นหา */}
              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.keywords.map((kw) => (
                  <span key={kw} className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md font-medium">
                    #{kw}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between py-3.5 border-y border-slate-800">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">ราคาพิเศษ Lalana367</span>
                  <div className="text-3xl font-black text-rose-400">฿{selectedProduct.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-400 text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" /> {selectedProduct.rating} / 5.0
                  </div>
                  <span className="text-xs text-slate-400">ยอดขายแล้ว {selectedProduct.sold} ชิ้น</span>
                </div>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingCart className="w-6 h-6" /> ใส่ตะกร้าสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
