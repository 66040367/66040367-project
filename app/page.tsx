// --- REALISTIC 360 PRODUCTS GENERATOR (FIXED UNIQUE SEQUENTIAL MAPPING) ---
const generate350Products = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  // ตัวนับลำดับสินค้าแยกตามหมวดย่อย เพื่อไม่ให้เกิดปัญหารูป/ชื่อซ้ำจาก Modulo Loop
  const subCategoryCounters: Record<string, number> = {};

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
      'เมาส์ & คีย์บอร์ด': ['RGB Mechanical Keyboard Wireless Tri-Mode', 'Ultra-Lightweight Gaming Mouse 8K Hz', 'Custom Keycaps PBT Double Shot Set', 'Gaming Mousepad XXL Control Edition'],
      'หูฟัง & ไมโครโฟน': [
        '7.1 Surround Gaming Headset Wireless', 
        'USB Condenser Streaming Microphone', 
        'Wireless Gaming Earbuds Low Latency 40ms',
        'Studio Monitor Headphone Professional',
        'RGB Gaming Headset Stand with USB Hub',
        'Dynamic Podcast Microphone XLR/USB'
      ],
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
    
    // นับลำดับจริงของสินค้าในหมวดย่อยนั้นๆ
    if (subCategoryCounters[subCat] === undefined) {
      subCategoryCounters[subCat] = 0;
    } else {
      subCategoryCounters[subCat] += 1;
    }
    
    const itemIndexInSub = subCategoryCounters[subCat];
    const nameList = subCatMap[subCat];
    const baseName = nameList[itemIndexInSub % nameList.length];

    const modelVariant = `(รุ่นปี 2026 / Edition ${itemIndexInSub + 1})`;
    const fullTitle = `${baseName} ${modelVariant}`;

    let basePrice = 220 + ((i * 173) % 34000);
    if (mainCat === 'it' || mainCat === 'gaming') basePrice += 2800;

    const discountRatio = 1.20 + ((i % 5) * 0.07);
    const originalPrice = Math.round(basePrice * discountRatio);

    const rating = Number((4.7 + ((i % 4) * 0.1)).toFixed(1));
    const reviewCount = (i * 43 + 95) % 1800 + 20;
    const soldCount = (i * 47 + 150) % 9800 + 200;

    // ใช้ itemIndexInSub ดึงรูป ทำให้รูปเรียง 1, 2, 3, 4, 5, 6 ไม่ซ้ำกันแน่นอน
    const uniqueImg = getUniqueProductImage(subCat, itemIndexInSub, idCounter);

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
