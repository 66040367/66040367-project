'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Star, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, ShoppingBag, ShieldCheck, Sparkles, Filter, Gift
} from 'lucide-react';

export interface ProductItem {
  id: number;
  name: string;
  mainCategory: 'fashion' | 'it' | 'beauty' | 'home';
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

const CATEGORIES = [
  { id: 'all', name: 'สินค้าทั้งหมด' },
  { id: 'it', name: 'อุปกรณ์ไอที & เกมมิ่ง' },
  { id: 'fashion', name: 'เสื้อผ้า & แฟชั่น' },
  { id: 'beauty', name: 'เครื่องสำอาง & บำรุงผิว' },
  { id: 'home', name: 'ของแต่งบ้าน & ไลฟ์สไตล์' },
];

// 📦 คลังสินค้าจำลอง 44 รายการ (รูปตรงปก คัดสรรภาพ HD ทุกชิ้น)
const PRODUCTS_DATA: ProductItem[] = [
  // ================= 1. ไอที & เกมมิ่ง (11 รายการ) =================
  {
    id: 101,
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    mainCategory: 'it',
    subCategory: 'สมาร์ทโฟน',
    price: 48900,
    originalPrice: 52900,
    rating: 4.9,
    reviewsCount: 1280,
    sold: 3420,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'ชิป A17 Pro ตัวเรือนไทเทเนียม น้ำหนักเบา กล้องซูม Optical 5 เท่า'
  },
  {
    id: 102,
    name: 'MacBook Air M3 15" - Space Grey 16GB / 512GB',
    mainCategory: 'it',
    subCategory: 'แล็ปท็อป',
    price: 54900,
    originalPrice: 58900,
    rating: 4.9,
    reviewsCount: 840,
    sold: 1950,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'หน้าจอ Liquid Retina 15.3 นิ้ว บางเบาพิเศษ แบตเตอรี่ใช้งานยาวนาน 18 ชั่วโมง'
  },
  {
    id: 103,
    name: 'Sony WH-1000XM5 Noise Canceling Headphones',
    mainCategory: 'it',
    subCategory: 'หูฟัง',
    price: 13900,
    originalPrice: 15900,
    rating: 4.8,
    reviewsCount: 620,
    sold: 1200,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    badge: 'SALE',
    spec: 'ระบบตัดเสียงรบกวนขั้นสูง เสียงคมชัดระดับ Hi-Res Audio'
  },
  {
    id: 104,
    name: 'Minimalist Mechanical Wireless Keyboard',
    mainCategory: 'it',
    subCategory: 'อุปกรณ์เสริม',
    price: 3890,
    originalPrice: 4500,
    rating: 4.7,
    reviewsCount: 410,
    sold: 890,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    spec: 'คีย์บอร์ดไร้สายสวิตช์นุ่ม เสียงเงียบ ดีไซน์มินิมอลสบายตา'
  },
  {
    id: 105,
    name: 'UltraWide 34" Curved Gaming Monitor 144Hz',
    mainCategory: 'it',
    subCategory: 'จอมอนิเตอร์',
    price: 18900,
    originalPrice: 21900,
    rating: 4.9,
    reviewsCount: 310,
    sold: 650,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'จอโค้งระดับ 2K IPS สีตรงเป๊ะ ตอบสนองรวดเร็วเพื่อความบันเทิง'
  },
  {
    id: 106,
    name: 'PlayStation 5 Slim Console - Disc Edition',
    mainCategory: 'it',
    subCategory: 'เครื่องเล่นเกม',
    price: 18690,
    originalPrice: 19900,
    rating: 4.9,
    reviewsCount: 2150,
    sold: 4300,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'สัมผัสประสบการณ์เกมระดับ 4K SSD ความเร็วสูงพิเศษ'
  },
  {
    id: 107,
    name: 'Apple Watch Series 9 GPS 45mm Aluminum Case',
    mainCategory: 'it',
    subCategory: 'สมาร์ทวอทช์',
    price: 15900,
    originalPrice: 17900,
    rating: 4.8,
    reviewsCount: 540,
    sold: 1420,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    spec: 'ตรวจจับสุขภาพ ติดตามกิจกรรมประจำวัน หน้าจอ Bright Retina Display'
  },
  {
    id: 108,
    name: 'iPad Air 11" M2 128GB Wi-Fi - Starlight',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต',
    price: 23900,
    originalPrice: 25900,
    rating: 4.9,
    reviewsCount: 780,
    sold: 2100,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'ทรงพลังด้วยชิป M2 รองรับ Apple Pencil Pro น้ำหนักเบาพกพาสะดวก'
  },
  {
    id: 109,
    name: 'Ergonomic Wireless Mouse - Space Grey',
    mainCategory: 'it',
    subCategory: 'อุปกรณ์เสริม',
    price: 3290,
    originalPrice: 3900,
    rating: 4.7,
    reviewsCount: 890,
    sold: 3200,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    spec: 'เมาส์เพื่อสุขภาพ จับสบายมือ ลดอาการปวดข้อมือจากการทำงาน'
  },
  {
    id: 110,
    name: 'Premium Wireless Speaker - Wood Grain Finish',
    mainCategory: 'it',
    subCategory: 'เครื่องเสียง',
    price: 8500,
    originalPrice: 9900,
    rating: 4.8,
    reviewsCount: 230,
    sold: 510,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    badge: 'SALE',
    spec: 'ลำโพงบลูทูธตกแต่งบ้าน เสียงเบสนุ่มลึก ดีไซน์สไตล์วินเทจ'
  },
  {
    id: 111,
    name: 'Professional DSLR Camera 24.2MP + Lens Kit',
    mainCategory: 'it',
    subCategory: 'กล้องถ่ายภาพ',
    price: 32900,
    originalPrice: 36900,
    rating: 4.9,
    reviewsCount: 190,
    sold: 420,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    spec: 'กล้องถ่ายภาพคมชัดระดับมืออาชีพ รองรับถ่ายวิดีโอ 4K'
  },

  // ================= 2. เสื้อผ้า & แฟชั่น (11 รายการ) =================
  {
    id: 201,
    name: 'Korean Style Silk Blouse - Beige Soft Collection',
    mainCategory: 'fashion',
    subCategory: 'เสื้อผ้าผู้หญิง',
    price: 1290,
    originalPrice: 1890,
    rating: 4.8,
    reviewsCount: 530,
    sold: 2100,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'เสื้อเชิ้ตผ้าไหมพรีเมียม สไตล์เกาหลี นุ่มสบาย ระบายอากาศดี'
  },
  {
    id: 202,
    name: 'Minimalist Pastel Summer Dress',
    mainCategory: 'fashion',
    subCategory: 'เสื้อผ้าผู้หญิง',
    price: 1590,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 310,
    sold: 940,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'ชุดเดรสสไตล์มินิมอล โทนสีพาสเทล ตัดเย็บประณีต ผ้าเนื้อนุ่ม'
  },
  {
    id: 203,
    name: 'Classic Urban Oversized Hoodie',
    mainCategory: 'fashion',
    subCategory: 'เสื้อผ้าผู้ชาย',
    price: 1890,
    originalPrice: 2400,
    rating: 4.7,
    reviewsCount: 780,
    sold: 3100,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    spec: 'เสื้อฮู้ดดี้ทรงโอเวอร์ไซส์ ผ้าคอตตอนเกรดพรีเมียม สไตล์สตรีท'
  },
  {
    id: 204,
    name: 'Vintage Denim Jacket - Light Blue Wash',
    mainCategory: 'fashion',
    subCategory: 'เสื้อแจ็คเก็ต',
    price: 2290,
    originalPrice: 2900,
    rating: 4.8,
    reviewsCount: 420,
    sold: 1150,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    badge: 'SALE',
    spec: 'เสื้อแจ็คเก็ตยีนส์สไตล์วินเทจ ผ้าฟอกสีสวย แมตช์ง่ายทุกชุด'
  },
  {
    id: 205,
    name: 'White Premium Sneakers - Unisex Design',
    mainCategory: 'fashion',
    subCategory: 'รองเท้า',
    price: 3490,
    originalPrice: 4200,
    rating: 4.9,
    reviewsCount: 1420,
    sold: 5200,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'รองเท้าสนีกเกอร์สีขาวหนังแท้ ใส่สบาย ไม่กัดเท้า น้ำหนักเบา'
  },
  {
    id: 206,
    name: 'Leather Crossbody Bag - Espresso Brown',
    mainCategory: 'fashion',
    subCategory: 'กระเป๋า',
    price: 2890,
    originalPrice: 3500,
    rating: 4.8,
    reviewsCount: 610,
    sold: 1800,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    spec: 'กระเป๋าสะพายข้างหนังแท้ ช่องเก็บของเยอะ ดีไซน์เรียบหรู'
  },
  {
    id: 207,
    name: 'Casual Cotton Linen Shirts - White & Beige',
    mainCategory: 'fashion',
    subCategory: 'เสื้อผ้าผู้ชาย',
    price: 990,
    originalPrice: 1400,
    rating: 4.6,
    reviewsCount: 390,
    sold: 1200,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    spec: 'เสื้อเชิ้ตผ้าฝ้ายผสมลินิน ใส่สบาย ไม่ร้อน เหมาะกับสภาพอากาศไทย'
  },
  {
    id: 208,
    name: 'Luxury Round Polarized Sunglasses',
    mainCategory: 'fashion',
    subCategory: 'เครื่องประดับ',
    price: 1850,
    originalPrice: 2500,
    rating: 4.7,
    reviewsCount: 280,
    sold: 750,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    spec: 'แว่นตากันแดดเลนส์ตัดแสง UV400 กรอบน้ำหนักเบา ปกป้องสายตา'
  },
  {
    id: 209,
    name: 'Wool Blend Tailored Blazer - Charcoal Grey',
    mainCategory: 'fashion',
    subCategory: 'เสื้อสูท',
    price: 3900,
    originalPrice: 4800,
    rating: 4.9,
    reviewsCount: 150,
    sold: 380,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'เสื้อเบลเซอร์ทรงสมาร์ทแคชชวล สวมใส่ได้ทั้งทำงานและเที่ยว'
  },
  {
    id: 210,
    name: 'Minimalist Minimal Gold Watch',
    mainCategory: 'fashion',
    subCategory: 'นาฬิกา',
    price: 4500,
    originalPrice: 5800,
    rating: 4.8,
    reviewsCount: 410,
    sold: 980,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    spec: 'นาฬิกาข้อมือสายสแตนเลสโทนสีทอง มินิมอล เพิ่มความหรูหรา'
  },
  {
    id: 211,
    name: 'Casual Streetwear Bucket Hat',
    mainCategory: 'fashion',
    subCategory: 'เครื่องประดับ',
    price: 590,
    originalPrice: 890,
    rating: 4.6,
    reviewsCount: 210,
    sold: 890,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
    spec: 'หมวกทรงบักเก็ตผ้าคอตตอน แมตช์ง่าย เพิ่มลุคสตรีทชิค'
  },

  // ================= 3. เครื่องสำอาง & บำรุงผิว (11 รายการ) =================
  {
    id: 301,
    name: 'Advanced Hydration Facial Serum 50ml',
    mainCategory: 'beauty',
    subCategory: 'เซรั่มบำรุงผิว',
    price: 2450,
    originalPrice: 3100,
    rating: 4.9,
    reviewsCount: 1560,
    sold: 4500,
    image: 'https://images.unsplash.com/photo-1608248597261-83324467975b?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'เซรั่มฟื้นฟูผิวเข้มข้น เติมความชุ่มชื้น ลดเลือนริ้วรอย'
  },
  {
    id: 302,
    name: 'Velvet Matte Lipstick - Rose Pink Edition',
    mainCategory: 'beauty',
    subCategory: 'ลิปสติก',
    price: 890,
    originalPrice: 1200,
    rating: 4.8,
    reviewsCount: 920,
    sold: 2800,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    spec: 'ลิปสติกเนื้อแมตต์กำมะหยี่ ติดทนนานตลอดวัน ปากไม่แห้งตึง'
  },
  {
    id: 303,
    name: 'Organic Botanical Facial Cleanser Cream',
    mainCategory: 'beauty',
    subCategory: 'ทำความสะอาดผิว',
    price: 1150,
    originalPrice: 1500,
    rating: 4.7,
    reviewsCount: 430,
    sold: 1400,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    spec: 'คลีนซิ่งทำความสะอาดผิวสูตรอ่อนโยน ออร์แกนิคสำหรับผิวแพ้ง่าย'
  },
  {
    id: 304,
    name: 'Luxury French Eau De Parfum 100ml',
    mainCategory: 'beauty',
    subCategory: 'น้ำหอม',
    price: 4800,
    originalPrice: 5600,
    rating: 4.9,
    reviewsCount: 710,
    sold: 1950,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'น้ำหอมกลิ่นดอกไม้และไม้หอมธรรมชาติ ติดทนนานกว่า 12 ชั่วโมง'
  },
  {
    id: 305,
    name: 'Rejuvenating Night Cream & Anti-Aging Gel',
    mainCategory: 'beauty',
    subCategory: 'ครีมบำรุงผิว',
    price: 2900,
    originalPrice: 3600,
    rating: 4.8,
    reviewsCount: 380,
    sold: 1100,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'ไนท์ครีมบำรุงล้ำลึกยามค่ำคืน เผยผิวกระจ่างใสสุขภาพดี'
  },
  {
    id: 306,
    name: 'Sunscreen Gel Cream SPF50+ PA++++',
    mainCategory: 'beauty',
    subCategory: 'กันแดด',
    price: 790,
    originalPrice: 990,
    rating: 4.9,
    reviewsCount: 2300,
    sold: 8900,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    badge: 'SALE',
    spec: 'ครีมกันแดดเนื้อเจลบางเบา ซึมไว ไม่คราบ คุมมันยาวนาน'
  },
  {
    id: 307,
    name: 'Professional Makeup Brush Set (12 Pcs)',
    mainCategory: 'beauty',
    subCategory: 'อุปกรณ์แต่งหน้า',
    price: 1450,
    originalPrice: 1950,
    rating: 4.7,
    reviewsCount: 510,
    sold: 1300,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    spec: 'ชุดแปรงแต่งหน้าขนนุ่มเกรดพรีเมียม ไม่บาดผิว ครบทุกการใช้งาน'
  },
  {
    id: 308,
    name: 'Nourishing Hair Care Essential Oil',
    mainCategory: 'beauty',
    subCategory: 'บำรุงผม',
    price: 950,
    originalPrice: 1300,
    rating: 4.8,
    reviewsCount: 620,
    sold: 2400,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop&q=80',
    spec: 'ออยล์บำรุงผมผมนุ่มเงางาม ลดผมชี้ฟูและปกป้องจากความร้อน'
  },
  {
    id: 309,
    name: 'Soothing Lavender Body Lotion 300ml',
    mainCategory: 'beauty',
    subCategory: 'ผิวกาย',
    price: 690,
    originalPrice: 890,
    rating: 4.8,
    reviewsCount: 410,
    sold: 1500,
    image: 'https://images.unsplash.com/photo-1556228722-d1191e488179?w=600&auto=format&fit=crop&q=80',
    spec: 'โลชั่นบำรุงผิวกายกลิ่นลาเวนเดอร์ ช่วยผ่อนคลายความเครียด'
  },
  {
    id: 310,
    name: 'Hydrating Sheet Mask Pack (10 Sheets)',
    mainCategory: 'beauty',
    subCategory: 'มาส์กหน้า',
    price: 590,
    originalPrice: 890,
    rating: 4.9,
    reviewsCount: 1800,
    sold: 6700,
    image: 'https://images.unsplash.com/photo-1512290900676-26c2a52595b8?w=600&auto=format&fit=crop&q=80',
    spec: 'แผ่นมาส์กหน้าเข้มข้น เติมน้ำให้ผิวเร่งด่วนใน 15 นาที'
  },
  {
    id: 311,
    name: 'Aroma Therapy Scented Body Wash',
    mainCategory: 'beauty',
    subCategory: 'ผิวกาย',
    price: 750,
    originalPrice: 950,
    rating: 4.7,
    reviewsCount: 320,
    sold: 980,
    image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&auto=format&fit=crop&q=80',
    spec: 'ครีมอาบน้ำสูตรอโรมา ผิวนุ่มชุ่มชื้น กลิ่นหอมผ่อนคลายเหมือนทำสปา'
  },

  // ================= 4. ของแต่งบ้าน & ไลฟ์สไตล์ (11 รายการ) =================
  {
    id: 401,
    name: 'Warm LED Ambient Desk Lamp & Plant Setup',
    mainCategory: 'home',
    subCategory: 'ของแต่งห้อง',
    price: 1790,
    originalPrice: 2300,
    rating: 4.8,
    reviewsCount: 340,
    sold: 810,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'โคมไฟแต่งห้องอบอุ่น ปรับระดับแสงได้ ช่วยสร้างบรรยากาศผ่อนคลาย'
  },
  {
    id: 402,
    name: 'Aroma Essential Oil Diffuser & Humidifier',
    mainCategory: 'home',
    subCategory: 'อโรมา',
    price: 1290,
    originalPrice: 1690,
    rating: 4.9,
    reviewsCount: 890,
    sold: 3400,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80',
    spec: 'เครื่องพ่นไอน้ำอโรมา เพิ่มความชุ่มชื้น ช่วยให้หลับสบายยิ่งขึ้น'
  },
  {
    id: 403,
    name: 'Minimalist Ceramic Coffee Cup & Saucer',
    mainCategory: 'home',
    subCategory: 'แก้ว & เครื่องครัว',
    price: 490,
    originalPrice: 690,
    rating: 4.7,
    reviewsCount: 420,
    sold: 1900,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    spec: 'แก้วกาแฟเซรามิกมินิมอล ทำด้วยมือ งานประณีต สบายตา'
  },
  {
    id: 404,
    name: 'Nordic Wooden Lounge Chair - Natural Oak',
    mainCategory: 'home',
    subCategory: 'เฟอร์นิเจอร์',
    price: 6500,
    originalPrice: 7900,
    rating: 4.9,
    reviewsCount: 180,
    sold: 320,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'เก้าอี้พักผ่อนสไตล์นอร์ดิก ไม้แท้ นั่งสบายรองรับแผ่นหลัง'
  },
  {
    id: 405,
    name: 'Organic Soy Wax Candle - Vanilla Scent',
    mainCategory: 'home',
    subCategory: 'อโรมา',
    price: 650,
    originalPrice: 850,
    rating: 4.8,
    reviewsCount: 650,
    sold: 2100,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    badge: 'SALE',
    spec: 'เทียนหอมไขถั่วเหลืองธรรมชาติ ไม่เป็นพิษ ช่วยสร้างสมาธิ'
  },
  {
    id: 406,
    name: 'Soft Throw Blanket - Cream Neutral Tone',
    mainCategory: 'home',
    subCategory: 'ของแต่งห้อง',
    price: 990,
    originalPrice: 1390,
    rating: 4.8,
    reviewsCount: 310,
    sold: 940,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
    spec: 'ผ้าห่มคลุมโซฟานุ่มพิเศษ ให้ความอบอุ่น แต่งห้องสไตล์มินิมอล'
  },
  {
    id: 407,
    name: 'Indoor Green Monster Plant in Ceramic Pot',
    mainCategory: 'home',
    subCategory: 'ต้นไม้ตกแต่ง',
    price: 890,
    originalPrice: 1200,
    rating: 4.7,
    reviewsCount: 220,
    sold: 780,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
    spec: 'ต้นไม้ประดับห้อง ฟอกอากาศ เพิ่มพื้นที่สีเขียวสบายตา'
  },
  {
    id: 408,
    name: 'Minimalist Wall Clock - Silent Movement',
    mainCategory: 'home',
    subCategory: 'ของแต่งห้อง',
    price: 850,
    originalPrice: 1100,
    rating: 4.6,
    reviewsCount: 190,
    sold: 620,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80',
    spec: 'นาฬิกาแขวนผนังดีไซน์เรียบ ไร้เสียงเดินรบกวน เหมาะกับห้องนอน'
  },
  {
    id: 409,
    name: 'Luxury Velvet Cushion Pillows (Set of 2)',
    mainCategory: 'home',
    subCategory: 'ของแต่งห้อง',
    price: 790,
    originalPrice: 1090,
    rating: 4.8,
    reviewsCount: 280,
    sold: 890,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80',
    spec: 'หมอนอิงผ้ากำมะหยี่นุ่มแน่น เพิ่มความหรูหราให้โซฟาของคุณ'
  },
  {
    id: 410,
    name: 'French Press Glass Coffee Maker 800ml',
    mainCategory: 'home',
    subCategory: 'แก้ว & เครื่องครัว',
    price: 890,
    originalPrice: 1200,
    rating: 4.9,
    reviewsCount: 510,
    sold: 1650,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    spec: 'กาชงกาแฟเฟรนช์เพรส แก้วทนความร้อน ดื่มด่ำรสชาติกาแฟสด'
  },
  {
    id: 411,
    name: 'Modern Wooden Bedside Table Lamp',
    mainCategory: 'home',
    subCategory: 'เฟอร์นิเจอร์',
    price: 2400,
    originalPrice: 2900,
    rating: 4.8,
    reviewsCount: 140,
    sold: 410,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    spec: 'โต๊ะข้างเตียงไม้แท้ขนาดเล็กกะทัดรัด แข็งแรงทนทาน'
  }
];

export default function StorePage() {
  const [activeMainCat, setActiveMainCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: { product: ProductItem; quantity: number }[]; total: number } | null>(null);

  // กรองรายการสินค้า
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((item) => {
      const matchMain = activeMainCat === 'all' || item.mainCategory === activeMainCat;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        item.spec.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q);

      return matchMain && matchSearch;
    });
  }, [activeMainCat, searchQuery]);

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

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">สั่งซื้อสินค้าเรียบร้อยแล้ว</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              ขอให้คุณมีความสุขกับการจำลองช้อปปิ้งเพื่อความเพลิดเพลิน <br className="hidden sm:inline" />
              รายการทั้งหมดนี้จัดส่งจำลองฟรี <strong className="text-emerald-600">โดยไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 max-h-60 overflow-y-auto">
            {completedOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{product.name}</h4>
                  <p className="text-xs text-slate-500">จำนวน: {quantity} ชิ้น</p>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">฿0 <span className="text-xs text-slate-400 font-normal line-through">(฿{(product.price * quantity).toLocaleString()})</span></span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2 py-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium">มูลค่าสินค้ารวมที่คุณได้รับ:</span>
            <span className="text-2xl font-black text-emerald-600">฿{completedOrder.total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setCompletedOrder(null)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> เลือกซื้อสินค้าชิ้นอื่นต่อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* BANNER แจ้งเตือนจุดประสงค์เว็บ */}
      <div className="bg-slate-900 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span><strong>Lalana367 Free Shopping:</strong> จำลองการสั่งซื้อสินค้าฟรี 100% เพื่อความเพลิดเพลินและลดความเครียด</span>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveMainCat('all'); setSearchQuery(''); }}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-md">
              L
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block">
                Lalana367
              </span>
              <span className="text-[10px] font-bold text-slate-400 block -mt-1 tracking-wider uppercase">
                Premium Store Simulation
              </span>
            </div>
          </div>

          {/* ค้นหา */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า เช่น iPhone, ชุดเดรส, โคมไฟ, เซรั่ม..."
              className="w-full bg-slate-100 text-slate-800 pl-10 pr-8 py-2.5 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:border-slate-400 transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ตะกร้าสินค้า */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 transition-all cursor-pointer relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">ตะกร้าสินค้า</span>
            {totalCartCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* HERO BANNER */}
        <div className="relative mb-10 rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-lg">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              <Gift className="w-3.5 h-3.5" /> เลือกช้อปฟรีทุกรายการ
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              เติมเต็มความสุข เลือกสิ่งที่อยากได้โดยไม่ต้องกังวล
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              จำลองประสบการณ์การช้อปปิ้งออนไลน์เสมือนจริง เลือกสินค้าที่คุณอยากได้ หยิบใส่ตะกร้าและกดสั่งซื้อเพื่อผ่อนคลายความเครียดได้เลย
            </p>
          </div>
        </div>

        {/* 🏷️ หมวดหมู่สินค้า */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" /> เลือกหมวดหมู่สินค้า
            </div>
            <span className="text-xs text-slate-400 font-medium">
              พบ {filteredProducts.length} รายการ
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveMainCat(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeMainCat === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🛍️ GRID สินค้า (44 รายการ) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700 text-lg">ไม่พบสินค้าที่คุณค้นหา</h3>
            <p className="text-slate-400 text-sm">ลองค้นหาด้วยคำอื่น หรือเลือกดูสินค้าทั้งหมด</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {product.badge && (
                    <span className={`absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-md text-white shadow-sm ${
                      product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                      {product.subCategory}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-slate-700">{product.rating}</span>
                      <span className="text-slate-400">({product.reviewsCount})</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-900 font-extrabold text-base sm:text-lg block">
                          ฿{product.price.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-xs line-through block -mt-1">
                          ฿{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => addToCart(product, e)}
                        className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* SIDEBAR ตะกร้าสินค้า */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" /> ตะกร้าสินค้าของคุณ ({totalCartCount})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 overflow-y-auto max-h-[65vh] pr-1">
              {cart.length === 0 ? (
                <div className="text-center text-slate-400 py-20 text-sm space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                  <p>ยังไม่มีสินค้าในตะกร้า</p>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img src={product.image} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{product.name}</h4>
                      <span className="text-slate-900 font-extrabold text-sm block mt-0.5">฿{(product.price * quantity).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                        <button onClick={() => updateQuantity(product.id, -1)} className="p-0.5 text-slate-500 hover:text-slate-800 cursor-pointer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, 1)} className="p-0.5 text-slate-500 hover:text-slate-800 cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(product.id)} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-600">มูลค่าสินค้ารวม:</span>
              <span className="text-xl font-black text-slate-900">฿{totalCartPrice.toLocaleString()}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-base py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" /> สั่งซื้อเลย (ไม่มีค่าใช้จ่าย)
            </button>
          </div>
        </div>
      </div>

      {/* POPUP รายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-800 z-10 cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-square w-full bg-slate-100 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{selectedProduct.spec}</p>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-100">
                <div>
                  <span className="text-slate-400 text-[11px] font-semibold block">ราคาประเมิน</span>
                  <div className="text-2xl font-black text-slate-900">฿{selectedProduct.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {selectedProduct.rating}
                  </div>
                  <span className="text-xs text-slate-400">ขายแล้ว {selectedProduct.sold} ชิ้น</span>
                </div>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" /> หยิบใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
