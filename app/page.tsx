'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Star, Zap, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, Truck, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck
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

// 1. หมวดหมู่หลักและหมวดย่อย
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

// คลังภาพ Unsplash Unique ID สำหรับแต่ละรายการสินค้า (ไม่ซ้ำรูปกัน)
const UNIQUE_PRODUCT_DATABASE: Record<string, { name: string; img: string; spec: string; price: number }[]> = {
  'เสื้อผ้า ผญ': [
    { name: 'เดรสยาวสายเดี่ยวผ้าซาติน Premium เกาหลี', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', spec: 'ผ้าซาตินนิ่มเงา ใส่สบาย ทรงสวยเข้ารูป', price: 590 },
    { name: 'เสื้อครอปไหมพรมแขนยาว สไตล์ Minimal Y2K', img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80', spec: 'ไหมพรมผ้านุ่มพิเศษ ถักละเอียด ไม่นึกรำคาญ', price: 390 },
    { name: 'กระโปรงพลีทสั้นเอวสูง ลุคสาวชิค', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', spec: 'ทรงสวยเป๊ะ มีซับในกันโป๊อย่างดี', price: 450 },
    { name: 'เสื้อเบลเซอร์ทำงานทรง Oversize เรียบหรู', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', spec: 'เนื้อผ้าโพลีเอสเตอร์เกรดเอ ซับในทั้งตัว', price: 890 },
    { name: 'กางเกงขายาวทรงเอวสูง ขากระบอกใหญ่', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', spec: 'พรางหุ่นใส่แล้วขาเรียวยาว ผ้าไม่ยับง่าย', price: 490 }
  ],
  'เสื้อผ้าผู้ชาย': [
    { name: 'เสื้อยืด Streetwear Cotton 100% ลายกราฟิก', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', spec: 'ผ้า Comb 32 นุ่มสบาย ระบายอากาศได้ดีเยี่ยม', price: 350 },
    { name: 'เสื้อฮู้ดดี้แขนยาว Oversize สไตล์สตรีท', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80', spec: 'ผ้าสำลีเนื้อนุ่ม อุ่นกำลังดี ซับเหงื่อได้ดี', price: 690 },
    { name: 'เสื้อเชิ้ตแขนยาว ผ้าคอตตอนมัสลิน ทรงสลิม', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', spec: 'ตัดเย็บประณีต เหมาะสำหรับใส่ทำงานหรือเที่ยว', price: 550 },
    { name: 'กางเกงยีนส์ผู้ชาย ทรงขากระบอกเล็ก ริมแดง', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', spec: 'ผ้ายีนส์ยืดนิดหน่อย ฟักสวย ใส่สบายตลอดวัน', price: 790 },
    { name: 'เสื้อแจ็คเก็ตกันลม สไตล์บอมเบอร์', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', spec: 'ผ้าร่มกันหยดน้ำ ซิปสแตนเลสแข็งแรง', price: 950 }
  ],
  'เสื้อผ้าเด็ก': [
    { name: 'ชุดเซตเสื้อกางเกงเด็ก ผ้าฝ้ายออร์แกนิก 100%', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', spec: 'นุ่มอ่อนโยน ไม่ระคายเคืองต่อผิวเด็ก', price: 290 },
    { name: 'ชุดนอนเด็กพิมพ์ลายการ์ตูนน่ารัก แขนยาว', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80', spec: 'ผ้ายืด Cotton ยืดหยุ่นได้ดี ใส่นอนสบาย', price: 250 },
    { name: 'เสื้อยืดเด็กเล็ก ผ้าระบายอากาศได้ดี', img: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80', spec: 'แห้งไว ซักง่าย สีไม่ตก', price: 180 }
  ],
  'รองเท้า': [
    { name: 'รองเท้าผ้าใบ Sneaker Classic White Edition', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80', spec: 'พื้นยางนุ่ม ซับพอร์ตเท้าใส่เดินได้ทั้งวัน', price: 1290 },
    { name: 'รองเท้าวิ่งสปอร์ต น้ำหนักเบาพิเศษ กันกระแทก', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', spec: 'พื้นโฟม EVA ช่วยลดแรงกระแทกขณะวิ่ง', price: 1590 },
    { name: 'รองเท้าส้นสูงหนังแก้ว เรียบหรูสไตล์เกาหลี', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80', spec: 'สูง 2.5 นิ้ว เดินง่าย ไม่เจ็บเท้า', price: 890 },
    { name: 'รองเท้าแตะยาง EVA นุ่มเด้งสุขภาพ', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80', spec: 'กันลื่น ยืดหยุ่น ล้างทำความสะอาดง่าย', price: 290 }
  ],
  'กระเป๋า': [
    { name: 'กระเป๋าสะพายข้างหนัง PU พรีเมียม อะไหล่ทอง', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', spec: 'จุของได้เยอะ ทรงแข็งสวยงาม ไม่เสียทรง', price: 790 },
    { name: 'กระเป๋าถือทรง Tote Bag ใบใหญ่ ใส่โน้ตบุ๊กได้', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80', spec: 'ผ้าแคนวาสหนาพิเศษ ทนทานต่อการใช้งาน', price: 490 },
    { name: 'กระเป๋าเป้เดินทางกันน้ำ ช่องเก็บของเยอะ', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', spec: 'มีช่อง USB ชาร์จแบต และช่องใส่ Laptop 15.6"', price: 1190 }
  ],
  'อุปกรณ์อื่นๆ (กำไล/สร้อย/แหวน)': [
    { name: 'สร้อยคอเงินแท้ 925 จี้เพชรสวิส มินิมอล', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80', spec: 'เงินแท้ไม่ลอกไม่ดำ สดใสแวววาว', price: 490 },
    { name: 'กำไลข้อมือสายสแตนเลส สไตล์ลักชัวรี', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', spec: 'สแตนเลสแท้ 316L ไม่แพ้ ไม่ใส่น้ำหอมกัด', price: 390 },
    { name: 'แหวนเงินแท้ ปรับขนาดได้ ดีไซน์คลื่น', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80', spec: 'ใส่ได้ทุกขนาดนิ้ว สวยหรูดูดี', price: 320 }
  ],
  'โทรศัพท์': [
    { name: 'iPhone 15 Pro Max 256GB Natural Titanium', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', spec: 'ชิป A17 Pro กล้องซูม 5x ตัวเครื่องไทเทเนียม', price: 44900 },
    { name: 'Samsung Galaxy S24 Ultra 5G AI Camera', img: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80', spec: 'ปากกา S-Pen ในตัว ชิป Snapdragon 8 Gen 3', price: 42900 },
    { name: 'Xiaomi 14 Ultra กล้อง Leica 1 นิ้ว', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80', spec: 'ชาร์จไว 90W หน้าจอ AMOLED 120Hz', price: 34900 }
  ],
  'แท็บเล็ต (MacBook)': [
    { name: 'Apple MacBook Air M2 13.6 นิ้ว 256GB', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', spec: 'ชิป M2 แบตเตอรี่ใช้งานยาวนาน 18 ชั่วโมง', price: 34900 },
    { name: 'iPad Pro 11 นิ้ว M4 ชิปประมวลผล Ultra', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', spec: 'จอ Ultra Retina XDR บางเบาที่สุด', price: 39900 },
    { name: 'MacBook Pro 16 นิ้ว M3 Max RAM 36GB', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80', spec: 'ขีดสุดสายงานตัดต่อ VFX และ 3D Render', price: 89900 }
  ],
  'คอมพิวเตอร์': [
    { name: 'Desktop Workstation Intel i9 14900K', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80', spec: 'สำหรับสายตัดต่อ กราฟิก และจำลองโมเดล', price: 55900 },
    { name: 'Mini PC Ryzen 7 7840HS ขนาดพกพา', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80', spec: 'ประหยัดพื้นที่ รองรับต่อ 3 จอพร้อมกัน', price: 18900 }
  ],
  'ไมค์เล่นเกม': [
    { name: 'HyperX QuadCast S RGB USB Condenser Mic', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', spec: 'มีไฟ RGB ปรับแต่งได้ เสียงคมชัด มี Pop Filter', price: 4590 },
    { name: 'Shure MV7+ Podcast Studio Microphone', img: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80', spec: 'ไมโครโฟนตัดเสียงรบกวนระดับมืออาชีพ', price: 9900 }
  ],
  'หูฟังเล่นเกม': [
    { name: 'SteelSeries Arctis Nova Pro Wireless', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', spec: 'ระบบเสียง Hi-Res Spatial 360 ตัดเสียง ANC', price: 12900 },
    { name: 'Razer BlackShark V2 Pro Gaming Headset', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80', spec: 'ไมค์เสียงใส ไร้ดีเลย์ น้ำหนักเบา', price: 5990 }
  ],
  'คีย์บอร์ดเล่นเกม': [
    { name: 'Custom Mechanical Keyboard 75% Wireless RGB', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', spec: 'Hot-swappable ลูปสวิตช์แล้ว เสียงนุ่มละมุน', price: 3890 },
    { name: 'Logitech G PRO X TKL Gaming Keyboard', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', spec: 'สวิตช์ตอบสนองไวสำหรับนักแข่ง Esports', price: 5490 }
  ],
  'จอคอม': [
    { name: 'LG UltraGear 27 นิ้ว OLED 240Hz Gaming', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80', spec: 'ตอบสนอง 0.03ms ภาพสวยระดับ OLED True Black', price: 28900 },
    { name: 'Dell UltraSharp 32 นิ้ว 4K USB-C Hub', img: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=600&q=80', spec: 'สีตรง 98% DCI-P3 สำหรับช่างภาพและตัดต่อ', price: 23500 }
  ],
  'CPU': [
    { name: 'Intel Core i9-14900K 24-Cores 32-Threads', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80', spec: 'ความเร็วสูงสุด 6.0 GHz ถอดรหัสเร็วสุดยอด', price: 21900 },
    { name: 'AMD Ryzen 7 7800X3D Gaming Processor', img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80', spec: 'CPU ที่ดีที่สุดสำหรับการเล่นเกม ชิป 3D V-Cache', price: 14900 }
  ],
  'RAM': [
    { name: 'G.SKILL Trident Z5 RGB DDR5 32GB (16GBx2)', img: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80', spec: 'Bus 6400MHz ชิปคัดเกรดพรีเมียม', price: 5290 }
  ],
  'คอมประกอบ': [
    { name: 'Set คอมประกอบ RTX 4080 Super + i7 14700K', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80', spec: 'เคสกระจกตู้ปลา ชุดน้ำปิด 3 ตอน ไฟ RGB หรูหรา', price: 79900 },
    { name: 'Set คอมประกอบสายสตรีมเมอร์ RTX 4060 Ti', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', spec: 'เล่นเกม 1080p/1440p ปรับสุดได้ทุกเกม', price: 32900 }
  ],
  'บลัชออน': [
    { name: 'NARS Liquid Blush สี Orgasm ชิมเมอร์ทอง', img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80', spec: 'เนื้อลิควิดเกลี่ยง่าย ผิวดูชุ่มฉ่ำสุขภาพดี', price: 1400 },
    { name: 'Rare Beauty Soft Pinch Liquid Blush', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', spec: 'พิกเมนต์แน่น แตะนิดเดียวติดทนตลอดวัน', price: 1050 }
  ],
  'ลิป': [
    { name: 'Dior Addict Lip Glow ลิปบาล์มเปลี่ยนสี', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80', spec: 'ให้ความชุ่มชื้นยาวนาน ปรับสีตามอุณหภูมิปาก', price: 1650 },
    { name: 'YSL Rouge Pur Couture Velvet Lipstick', img: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600&q=80', spec: 'เนื้อแมตต์กำมะหยี่ นุ่มเบา ไม่ตกร่อง', price: 1750 }
  ],
  'รองพื้น': [
    { name: 'ESTĒE LAUDER Double Wear Stay-in-Place', img: 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&q=80', spec: 'ปกปิดขั้นสุด คุมมันนาน 24 ชั่วโมง กันน้ำกันเหงื่อ', price: 2450 }
  ],
  'คอนซีลเลอร์': [
    { name: 'Tarte Shape Tape Contour Concealer', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', spec: 'ปกปิดรอยสิวและรอยดำใต้ตาได้อย่างสมบูรณ์แบบ', price: 1150 }
  ],
  'ครีมทาหน้าหรือเซรั่ม': [
    { name: 'Advanced Night Repair Serum 50ml', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', spec: 'ลดเลือนริ้วรอย ฟื้นฟูผิวให้กระจ่างใสยามค่ำคืน', price: 4800 },
    { name: 'Kiehl\'s Clearly Corrective Dark Spot Solution', img: 'https://images.unsplash.com/photo-1608248597261-833250005a76?w=600&q=80', spec: 'ลดจุดด่างดำ ปรับสีผิวให้สม่ำเสมอ', price: 3550 }
  ],
  'ครีมทาผิว': [
    { name: 'Vaseline Gluta-Hya Serum Burst Lotion', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80', spec: 'โลชั่นเนื้อเซรั่ม แตกตัวเป็นน้ำ ผิวกระจ่างใส', price: 299 }
  ],
  'ครีมกันแดดทั้งหน้าและตัว': [
    { name: 'Anessa Perfect UV Sunscreen Skincare Milk', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80', spec: 'SPF50+ PA++++ กันน้ำกันเหงื่อ คุมมันเลิศ', price: 950 }
  ],
  'มาม่า': [
    { name: 'Samyang บะหมี่เกาหลีเผ็ด x2 สูตรแห้ง', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', spec: 'เส้นเหนียวนุ่ม รสชาติเผ็ดสะใจสไตล์เกาหลี (เซต 5 ซอง)', price: 185 },
    { name: 'Nissin Tonkotsu Ramen ซุปกระดูกหมูเข้มข้น', img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80', spec: 'ราเมนสไตล์ญี่ปุ่นแท้ๆ น้ำซุปกลมกล่อม', price: 160 }
  ],
  'ขนมที่สามารถส่งพัสดุได้': [
    { name: 'Shiroi Koibito คุกกี้ไวท์ช็อกโกแลตฮอกไกโด', img: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&q=80', spec: 'ขนมนำเข้าจากญี่ปุ่น หอมเนยสด นุ่มละมุนลิ้น', price: 450 },
    { name: 'คุกกี้ช็อกโกแลตชิป โฮมเมดเนยสดแท้ 100%', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80', spec: 'ช็อกโกแลตเข้มข้น กรอบนอกนุ่มใน', price: 220 }
  ],
  'อาหารบรรจุภัณฑ์': [
    { name: 'แกงกะหรี่ญี่ปุ่นสำเร็จรูป พร้อมทานเนื้อวัว A5', img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80', spec: 'อุ่นร้อนเพียง 3 นาที อร่อยเหมือนกินที่ร้าน', price: 290 }
  ],
  'ของเล่นรวม': [
    { name: 'Pop Mart Crybaby Molly Art Toy กล่องสุ่มแท้', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80', spec: 'ของแท้ลิขสิทธิ์ ลุ้นตัวซีเคร็ท', price: 420 },
    { name: 'LEGO Architecture ชุดตัวต่อเมืองจำลอง', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80', spec: 'ช่วยเสริมสร้างสมาธิและทักษะการสร้างสรรค์', price: 2190 }
  ],
  'โต๊ะคอม': [
    { name: 'โต๊ะคอม Ergonomic ปรับระดับไฟฟ้า Memory Height', img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80', spec: 'ปรับขึ้นลงได้นุ่มนวล ท็อปไม้แท้ ทนทาน', price: 8900 },
    { name: 'โต๊ะเกมมิ่ง RGB ขอบไฟรอบทิศทาง พร้อมขาแขวนหูฟัง', img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&q=80', spec: 'หน้าโต๊ะลายคาร์บอนไฟเบอร์ กันน้ำกันรอย', price: 3490 }
  ],
  'กระจก': [
    { name: 'กระจกแต่งตัวตั้งพื้นทรงโค้ง มินิมอล มีไฟ LED', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80', spec: 'ปรับระดับแสงไฟได้ 3 สี ภาพไม่หลอกตา', price: 1890 }
  ],
  'ไฟ LED': [
    { name: 'ไฟเส้น LED RGBIC สั่งงานผ่านแอป/Siri ยาว 5 เมตร', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80', spec: 'ซิงค์ไฟตามจังหวะเพลงได้ ติดตั้งง่าย', price: 790 }
  ],
  'ตุ๊กตา/พรม/ของแต่งห้อง': [
    { name: 'พรมแต่งห้องนุ่มพิเศษ สไตล์นอร์ดิก ซักเครื่องได้', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80', spec: 'ขนหนานุ่ม ไม่หลุดร่วง มีปุ่มกันลื่นใต้พรม', price: 590 }
  ]
};

// 2. Data Factory สร้างสินค้าให้มีหมวดย่อยละ 30+ ตัวเลือก โดยรูปและชื่อสัมพันธ์กัน
const GENERATED_PRODUCTS: ProductItem[] = (() => {
  const list: ProductItem[] = [];
  let idCounter = 1;

  CATEGORY_STRUCTURE.forEach((cat) => {
    cat.subs.forEach((sub) => {
      const dbItems = UNIQUE_PRODUCT_DATABASE[sub] || [
        { name: `${sub} พรีเมียมรุ่นพิเศษ`, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', spec: 'สินค้าคุณภาพสูง รับประกันศูนย์', price: 990 }
      ];

      // สร้างตัวเลือก 30 ชิ้นต่อหมวดย่อย
      for (let i = 1; i <= 30; i++) {
        const itemTemplate = dbItems[(i - 1) % dbItems.length];
        // เปลี่ยนพารามิเตอร์รูปภาพเล็กน้อยเพื่อให้ URL ต่างกัน หรือใช้รูปหลากหลาย
        const finalImage = `${itemTemplate.img}&item=${i}`;

        list.push({
          id: idCounter++,
          name: i === 1 ? itemTemplate.name : `${itemTemplate.name} (Series #${i})`,
          mainCategory: cat.id,
          subCategory: sub,
          price: Math.floor(itemTemplate.price + (i > 1 ? (i * 15) : 0)),
          originalPrice: Math.floor((itemTemplate.price + (i > 1 ? (i * 15) : 0)) * 1.3),
          rating: Number((4.4 + (i % 6) * 0.1).toFixed(1)),
          reviewsCount: 110 + i * 18,
          sold: 230 + i * 25,
          image: finalImage,
          badge: i % 4 === 0 ? 'HOT' : i % 5 === 0 ? 'SALE' : i % 8 === 0 ? 'NEW' : undefined,
          spec: itemTemplate.spec
        });
      }
    });
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

  // ฟังก์ชันจัดการตะกร้า: เพิ่ม / ลด / ลบ
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

  // 🟢 หน้าสรุปการสั่งซื้อสำเร็จ (Order Complete Screen)
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">สั่งซื้อสินค้าสำเร็จ!</h1>
            
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-2.5 rounded-2xl text-base font-bold shadow-sm">
              <Truck className="w-6 h-6 animate-bounce" />
              <span>พนักงานกำลังจัดส่งพัสดุของคุณ 🚚</span>
            </div>
          </div>

          {/* รายการสินค้าที่สั่งซื้อ */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3 max-h-80 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-rose-400" /> สรุปรายการสินค้าที่ชำระแล้ว
            </h3>
            {completedOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-4 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{product.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">จำนวน: <span className="text-rose-400 font-bold">{quantity}</span> ชิ้น (฿{product.price.toLocaleString()} / ชิ้น)</p>
                  </div>
                </div>
                <span className="font-black text-indigo-400 text-base shrink-0">฿{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2 py-2 border-t border-slate-800">
            <span className="text-slate-300 text-base font-bold">ราคารวมที่ชำระทั้งหมด:</span>
            <span className="text-3xl font-black text-emerald-400">฿{completedOrder.total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setCompletedOrder(null)}
            className="w-full bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-base py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <ArrowLeft className="w-5 h-5" /> ย้อนกลับไปหน้าก่อนหน้านี้
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative overflow-x-hidden">
      
      {/* 🟢 NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveSubCat('all'); setSearchQuery(''); }}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-rose-500/30">
              L
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-rose-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                Lalana367
              </span>
              <span className="text-[10px] font-bold text-slate-400 block tracking-widest -mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> OFFICIAL STORE
              </span>
            </div>
          </div>

          {/* ช่องค้นหา */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า เสื้อยืด, iPhone, จอคอม, ลิป Dior, โต๊ะคอม..."
              className="w-full bg-slate-800/90 text-slate-100 pl-12 pr-10 py-3 rounded-2xl text-sm font-medium border border-slate-700/80 focus:border-rose-500 focus:outline-none transition-all placeholder:text-slate-500"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="w-10"></div>
        </div>
      </header>

      {/* 🟢 MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* หมวดหมู่หลัก */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-slate-800/80 mb-5">
          {CATEGORY_STRUCTURE.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveMainCat(cat.id); setActiveSubCat('all'); }}
              className={`px-6 py-3 rounded-2xl text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                activeMainCat === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* หมวดย่อย */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none mb-8">
          <button
            onClick={() => setActiveSubCat('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSubCat === 'all'
                ? 'bg-white text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            ย่อยทั้งหมด ({filteredProducts.length})
          </button>
          {currentSubCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCat(sub)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeSubCat === sub
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {sub} (30)
            </button>
          ))}
        </div>

        {/* ตารางสินค้า */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                />

                <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
                  <span className="bg-slate-950/80 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                    {product.subCategory}
                  </span>
                  {product.badge && (
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg text-white flex items-center gap-0.5 shadow-md ${
                      product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      <Zap className="w-3 h-3 fill-current" /> {product.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-100 text-sm line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1.5 font-normal">
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
                      <span className="text-rose-400 font-black text-base block">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-xs line-through block -mt-0.5">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="bg-rose-600 hover:bg-rose-500 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-90 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🔴 ตะกร้าสินค้า Floating Bar ขวาสุด เลือนราง + ลูกศร <- แตะไรแล้วเด้งออก */}
      <div 
        className={`fixed top-1/3 right-0 z-50 flex items-center transition-all duration-300 ${
          isCartOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
        onMouseEnter={() => setIsCartOpen(true)}
      >
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-slate-900/60 backdrop-blur-md border-l border-y border-rose-500/40 text-slate-200 p-3.5 rounded-l-2xl shadow-2xl flex items-center gap-2 hover:bg-slate-800/90 transition-all cursor-pointer group"
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

      {/* 🟢 SIDEBAR ตะกร้าสินค้า (เพิ่ม/ลด/ลบ/ชำระเงิน) */}
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
              <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-rose-400" /> ตะกร้าสินค้า Lalana367 ({totalCartCount})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* รายการในตะกร้า */}
            <div className="mt-5 space-y-3.5 overflow-y-auto max-h-[62vh] pr-1">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 py-24 text-sm space-y-3">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="font-medium">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                    <img src={product.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-100 truncate">{product.name}</h4>
                      <span className="text-rose-400 font-black text-sm block mt-0.5">฿{(product.price * quantity).toLocaleString()}</span>
                    </div>

                    {/* ปุ่ม บวกลบจำนวน และ ลบสินค้า */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-black text-slate-200">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
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

          {/* สรุปราคา + ปุ่มชำระเงิน */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-base font-bold">
              <span className="text-slate-300">ราคารวมทั้งหมด:</span>
              <span className="text-2xl font-black text-rose-400">฿{totalCartPrice.toLocaleString()}</span>
            </div>
            
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <ShieldCheck className="w-5 h-5" /> ชำระเงิน
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 MODAL รายละเอียดสินค้า */}
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
                <span className="bg-rose-500/20 text-rose-400 text-xs font-extrabold px-3 py-1 rounded-lg border border-rose-500/30">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-xl font-black text-white mt-2.5 leading-snug">{selectedProduct.name}</h2>
                <p className="text-sm text-slate-400 mt-1">{selectedProduct.spec}</p>
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
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingCart className="w-5 h-5" /> ใส่ตะกร้าสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
