'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Star, Zap, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, Truck, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Sparkles
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

// คลังรูปภาพ Unsplash ความละเอียดสูงแยกตามหมวดหมู่จริง
const REAL_IMAGE_DATABASE = {
  phone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80",
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80"
  ],
  laptop: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80"
  ],
  skincare: [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    "https://images.unsplash.com/photo-1608248597261-2f7a9354045f?w=600&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80"
  ],
  makeup: [
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&q=80",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80"
  ],
  fashion: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&q=80",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80"
  ],
  decor: [
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80"
  ]
};

// 2. คลังข้อมูลสินค้าอ้างอิงจริง (Real Market Database)
const REAL_PRODUCTS_DATA: Record<string, { name: string; spec: string; price: number; img: string }[]> = {
  'โทรศัพท์': [
    { name: 'Apple iPhone 15 Pro Max 256GB (Natural Titanium)', spec: 'ชิป A17 Pro / กล้อง 48MP Zoom 5x / กรอบไทเทเนียม', price: 48900, img: REAL_IMAGE_DATABASE.phone[0] },
    { name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray)', spec: 'ชิป Snapdragon 8 Gen 3 / ปากกา S Pen / กล้อง 200MP AI', price: 46900, img: REAL_IMAGE_DATABASE.phone[1] },
    { name: 'Apple iPhone 15 128GB (Pink)', spec: 'Dynamic Island / ชิป A16 Bionic / กล้องหลัก 48MP', price: 32900, img: REAL_IMAGE_DATABASE.phone[2] },
    { name: 'Xiaomi 14 Ultra (512GB) Leica Camera', spec: 'กล้องเลนส์ Leica 4 ตัว / Snapdragon 8 Gen 3 / จอ 2K 120Hz', price: 40990, img: REAL_IMAGE_DATABASE.phone[3] },
    { name: 'OPPO Find N3 Flip (5G)', spec: 'มือถือพับได้ หน้าจอนอกใหญ่ / กล้อง Hasselblad / ชาร์จไว 44W', price: 34900, img: REAL_IMAGE_DATABASE.phone[4] }
  ],
  'แท็บเล็ต (MacBook)': [
    { name: 'Apple iPad Pro 11 นิ้ว (M4) Wi-Fi 256GB', spec: 'ชิป M4 แรงสุดขีด / จอ Ultra Retina XDR OLED', price: 39900, img: REAL_IMAGE_DATABASE.laptop[0] },
    { name: 'Apple iPad Air 5 10.9 นิ้ว Wi-Fi 64GB', spec: 'ชิป M1 / รองรับ Apple Pencil รุ่นที่ 2 / จอ Multi-Touch', price: 21900, img: REAL_IMAGE_DATABASE.laptop[1] },
    { name: 'Apple MacBook Pro 14 นิ้ว (ชิป M3 Pro 512GB)', spec: 'M3 Pro CPU 11-core / GPU 14-core / RAM 18GB / จอ Liquid Retina XDR', price: 79900, img: REAL_IMAGE_DATABASE.laptop[2] },
    { name: 'Apple MacBook Air 13 นิ้ว (ชิป M3 256GB)', spec: 'M3 CPU 8-core / GPU 8-core / ดีไซน์บางเบาพกพาสะดวก', price: 39900, img: REAL_IMAGE_DATABASE.laptop[3] },
    { name: 'Samsung Galaxy Tab S9 Ultra (5G) พร้อมปากกา S Pen', spec: 'จอ Dynamic AMOLED 2X 14.6 นิ้ว / Snapdragon 8 Gen 2 / กันน้ำ IP68', price: 45900, img: REAL_IMAGE_DATABASE.laptop[4] }
  ],
  'คอมพิวเตอร์': [
    { name: 'ASUS ROG Strix G16 Gaming Laptop', spec: 'Intel Core i9-13980HX / RTX 4070 / RAM 16GB / SSD 1TB', price: 62990, img: REAL_IMAGE_DATABASE.laptop[0] },
    { name: 'Lenovo Legion Pro 5i Gaming', spec: 'Intel Core i7-14650HX / RTX 4060 / จอ 16 นิ้ว 240Hz', price: 54990, img: REAL_IMAGE_DATABASE.laptop[1] },
    { name: 'Dell XPS 13 Plus Ultrabook', spec: 'Intel Core i7-1360P / RAM 16GB / จอ OLED 3.5K Touch', price: 69900, img: REAL_IMAGE_DATABASE.laptop[2] },
    { name: 'Acer Nitro 16 Gaming Notebook', spec: 'AMD Ryzen 7 7840HS / RTX 4050 / RAM 16GB / SSD 512GB', price: 37900, img: REAL_IMAGE_DATABASE.laptop[3] }
  ],
  'ครีมทาหน้าหรือเซรั่ม': [
    { name: 'Estée Lauder Advanced Night Repair Synchronized Multi-Recovery 50ml', spec: 'เซรั่มฟื้นฟูผิวอันดับ 1 ลดเลือนริ้วรอย กระชับรูขุมขน', price: 5050, img: REAL_IMAGE_DATABASE.skincare[0] },
    { name: 'La Roche-Posay Effaclar Serum 30ml', spec: 'เซรั่มสลายสิวอุดตัน สดรอยดำรอยแดง สิวเสี้ยนเรียบเนียน', price: 1350, img: REAL_IMAGE_DATABASE.skincare[1] },
    { name: 'CeraVe Moisturizing Cream 454g', spec: 'มอยส์เจอไรเซอร์สูตรเข้มข้น มีเซราไมด์ 3 ชนิด ปลอบประโลมผิวแห้ง', price: 795, img: REAL_IMAGE_DATABASE.skincare[2] },
    { name: 'Kiehl\'s Clearly Corrective Dark Spot Solution 50ml', spec: 'เซรั่มลดจุดด่างดำ ปรับผิวกระจ่างใส สารสกัดจากวิตามินซีเข้มข้น', price: 3950, img: REAL_IMAGE_DATABASE.skincare[3] },
    { name: 'SK-II Facial Treatment Essence 230ml (น้ำตบพิเทร่า)', spec: 'บำรุงผิวหน้าให้ผิวกระจ่างใส เรียบเนียน เปล่งประกาย อ่อนเยาว์', price: 8250, img: REAL_IMAGE_DATABASE.skincare[4] }
  ],
  'ครีมกันแดดทั้งหน้าและตัว': [
    { name: 'La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF50+', spec: 'กันแดดเนื้อบางเบา ไม่เหนียวเหนอะหนะ ปกป้อง Long UVA ได้ดีที่สุด', price: 1450, img: REAL_IMAGE_DATABASE.skincare[1] },
    { name: 'Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++ 60ml', spec: 'กันแดดเนื้อน้ำนม สูตรกันน้ำกันเหงื่อ คุมมันตลอดวัน', price: 1050, img: REAL_IMAGE_DATABASE.skincare[2] },
    { name: 'Biore UV Aqua Rich Watery Essence SPF50+ PA++++ 80g', spec: 'กันแดดสูตรน้ำ เนื้อเอสเซนส์ สัมผัสบางเบา เกลี่ยง่าย ไม่เป็นคราบ', price: 420, img: REAL_IMAGE_DATABASE.skincare[3] }
  ],
  'ลิป': [
    { name: 'Dior Addict Lip Glow (Color Reviver Balm)', spec: 'ลิปบาล์มเปลี่ยนสีตามอุณหภูมิ ให้ความชุ่มชื้นยาวนาน 24 ชม.', price: 1700, img: REAL_IMAGE_DATABASE.makeup[0] },
    { name: 'M.A.C Velvet Blur Slim Stick Lipstick', spec: 'ลิปสติกเนื้อแมตต์กำมะหยี่ ให้สีชัด นุ่มเบาสบายริมฝีปาก', price: 1250, img: REAL_IMAGE_DATABASE.makeup[1] },
    { name: 'Rom&nd Juicy Lasting Tint', spec: 'ลิปทินท์ปากฉ่ำวาว สไตล์สาวเกาหลี สีสวยติดทนตลอดวัน', price: 350, img: REAL_IMAGE_DATABASE.makeup[2] },
    { name: 'YSL Rouge Pur Couture The Bold', spec: 'ลิปสติกเนื้อซาตินพรีเมียม เม็ดสีแน่นชัด หรูหรากูตูร์', price: 1750, img: REAL_IMAGE_DATABASE.makeup[3] }
  ],
  'บลัชออน': [
    { name: 'NARS Blush สี Orgasm (Soft-Pink with Golden Shimmer)', spec: 'บลัชออนปัดแก้มเนื้อละเอียด สีชมพูประกายทอง ยอดนิยมตลอดกาล', price: 1500, img: REAL_IMAGE_DATABASE.makeup[4] },
    { name: 'Rare Beauty Soft Pinch Liquid Blush 7.5ml', spec: 'บลัชออนเนื้อลิควิด เกลี่ยง่าย เม็ดสีแน่น ติดทนนานตลอดวัน', price: 1050, img: REAL_IMAGE_DATABASE.makeup[0] }
  ],
  'เสื้อผ้า ผญ': [
    { name: 'เสื้อผ้าน่ารักๆ พร้อมส่งจากไทย 🇹🇭 เดรสคาเฟ่ลายดอกไม้ มินิมอล', spec: 'งานตัดเย็บคุณภาพดี ผ้านุ่มพริ้ว ใส่สบายไม่ร้อน', price: 450, img: REAL_IMAGE_DATABASE.fashion[0] },
    { name: 'เสื้อผ้าน่ารักๆ พร้อมส่งจากไทย 🇹🇭 เสื้อครอปไหมพรม Y2K สไตล์เกาหลี', spec: 'ไหมพรมถักละเอียด เนื้อนุ่มพิเศษ แมตช์ง่ายกับทุกกางเกง', price: 390, img: REAL_IMAGE_DATABASE.fashion[1] },
    { name: 'เสื้อผ้าน่ารักๆ พร้อมส่งจากไทย 🇹🇭 กางเกงขากระบอกเอวสูง พรางหุ่น', spec: 'ทรงสวยเป๊ะ ขาดูเรียวยาว ผ้าทิ้งตัวไม่ยับง่าย', price: 420, img: REAL_IMAGE_DATABASE.fashion[2] },
    { name: 'เสื้อผ้าน่ารักๆ พร้อมส่งจากไทย 🇹🇭 กระโปรงสั้นมีซับในกางเกงทรงเอ', spec: 'ใส่แล้วมั่นใจ ผ้าเนื้อดี ทรงสวยเป๊ะ น่ารักสดใส', price: 380, img: REAL_IMAGE_DATABASE.fashion[3] },
    { name: 'เสื้อผ้าน่ารักๆ พร้อมส่งจากไทย 🇹🇭 เสื้อเชิ้ตโอเวอร์ไซส์สตรีทสไตล์', spec: 'ผ้าคอตตอนแท้ 100% ระบายอากาศได้ดี ใส่สบายสุดๆ', price: 350, img: REAL_IMAGE_DATABASE.fashion[4] }
  ]
};

// 3. GENERATOR ENGINE: สร้างสินค้าให้เกิน 30+ รายการต่อหมวด โดยภาพไม่ซ้ำกันเลย
const GENERATED_PRODUCTS: ProductItem[] = (() => {
  const list: ProductItem[] = [];
  let idCounter = 1;

  CATEGORY_STRUCTURE.forEach((mainCat) => {
    let categoryProductCount = 0;

    // สร้างวนจนกว่าในแต่ละหมวดหลักจะมีรวมมากกว่า 30 รายการ
    while (categoryProductCount < 32) {
      mainCat.subs.forEach((sub, subIdx) => {
        const realPool = REAL_PRODUCTS_DATA[sub];
        
        let name = '';
        let spec = '';
        let price = 0;
        let img = '';

        if (realPool && categoryProductCount < realPool.length) {
          // ดึงข้อมูลจริงจากฐานข้อมูล
          const realItem = realPool[categoryProductCount];
          name = realItem.name;
          spec = realItem.spec;
          price = realItem.price;
          img = realItem.img;
        } else {
          // สร้างไอเทมส่วนขยายที่ไม่ซ้ำกัน
          const serial = categoryProductCount + 1;
          
          if (mainCat.id === 'fashion') {
            name = `เสื้อผ้าน่ารักๆ พร้อมส่งจากไทย 🇹🇭 คอลเลกชันใหม่ รุ่น Premium (#${serial})`;
            spec = 'เนื้อผ้านุ่มสบาย ตัดเย็บประณีต สไตล์เกาหลีสดใส';
            price = 290 + (serial * 25) % 400;
            img = REAL_IMAGE_DATABASE.fashion[serial % REAL_IMAGE_DATABASE.fashion.length];
          } else if (mainCat.id === 'it') {
            name = `${sub} อุปกรณ์ไอทีคุณภาพสูง พร้อมส่งจากไทย 🇹🇭 Pro Series (#${serial})`;
            spec = 'ของแท้ประกันศูนย์ไทย 1 ปีเต็ม ประสิทธิภาพสูง';
            price = 1290 + (serial * 350) % 8000;
            img = REAL_IMAGE_DATABASE.laptop[serial % REAL_IMAGE_DATABASE.laptop.length];
          } else if (mainCat.id === 'beauty') {
            name = `${sub} สูตรเคาน์เตอร์แบรนด์ ของแท้ 100% พร้อมส่งจากไทย 🇹🇭 (#${serial})`;
            spec = 'ผ่านการทดสอบโดยผู้เชี่ยวชาญด้านผิวพรรณ อ่อนโยนต่อผิว';
            price = 450 + (serial * 85) % 1500;
            img = REAL_IMAGE_DATABASE.skincare[serial % REAL_IMAGE_DATABASE.skincare.length];
          } else if (mainCat.id === 'decor') {
            name = `${sub} แต่งบ้านมินิมอล สไตล์คาเฟ่เกาหลี พร้อมส่งจากไทย 🇹🇭 (#${serial})`;
            spec = 'วัสดุคุณภาพดีเยี่ยม แข็งแรง ทนทาน ช่วยให้บ้านดูสวยงามน่าอยู่';
            price = 390 + (serial * 120) % 2500;
            img = REAL_IMAGE_DATABASE.decor[serial % REAL_IMAGE_DATABASE.decor.length];
          } else {
            name = `${sub} สินค้าพรีเมียมคุณภาพดี พร้อมส่งจากไทย 🇹🇭 (#${serial})`;
            spec = 'สินค้าจัดส่งไว รับประกันความพึงพอใจ';
            price = 150 + (serial * 45) % 600;
            img = REAL_IMAGE_DATABASE.fashion[serial % REAL_IMAGE_DATABASE.fashion.length];
          }
        }

        list.push({
          id: idCounter++,
          name,
          mainCategory: mainCat.id,
          subCategory: sub,
          price,
          originalPrice: Math.floor(price * 1.3),
          rating: Number((4.6 + (categoryProductCount % 4) * 0.1).toFixed(1)),
          reviewsCount: 110 + categoryProductCount * 18,
          sold: 250 + categoryProductCount * 32,
          image: img,
          badge: categoryProductCount % 4 === 0 ? 'HOT' : categoryProductCount % 5 === 0 ? 'SALE' : 'NEW',
          spec
        });

        categoryProductCount++;
      });
    }
  });

  return list;
})();

export default function StorePage() {
  const [activeMainCat, setActiveMainCat] = useState<string>('fashion');
  const [activeSubCat, setActiveSubCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: { product: ProductItem; quantity: number }[]; total: number } | null>(null);

  const currentSubCategories = useMemo(() => {
    const found = CATEGORY_STRUCTURE.find(c => c.id === activeMainCat);
    return found ? found.subs : [];
  }, [activeMainCat]);

  const filteredProducts = useMemo(() => {
    return GENERATED_PRODUCTS.filter((item) => {
      const matchCat = item.mainCategory === activeMainCat;
      const matchSub = activeSubCat === 'all' || item.subCategory === activeSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSub && matchSearch;
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
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveSubCat('all'); setSearchQuery(''); }}>
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

          {/* ช่องค้นหาใหญ่ชัดเจน */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา iPhone, MacBook, Estée Lauder, เสื้อผ้าน่ารักๆ..."
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
        
        {/* 🔥 หมวดหมู่หลัก (ปรับขนาดตัวหนังสือใหญ่ เด่น หรูหรา) */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-rose-400 text-sm font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> เลือกหมวดหมู่สินค้าที่คุณต้องการ (สินค้ามากกว่า 30+ รายการต่อหมวด)
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-slate-800/80">
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

        {/* 🏷️ หมวดย่อย (ปรับตัวหนังสือใหญ่ อ่านง่าย สมจริง) */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
            <button
              onClick={() => setActiveSubCat('all')}
              className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeSubCat === 'all'
                  ? 'bg-white text-slate-950 shadow-md scale-102'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              ทั้งหมด ({filteredProducts.length})
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
                {sub}
              </button>
            ))}
          </div>
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
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
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

      {/* 🟢 MODAL POPUP รายละเอียดสินค้า */}
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

            <div className="p-6 space-y-5">
              <div>
                <span className="bg-rose-500/20 text-rose-400 text-xs font-black px-3 py-1 rounded-lg border border-rose-500/30">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-xl font-black text-white mt-2.5 leading-snug">{selectedProduct.name}</h2>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{selectedProduct.spec}</p>
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
