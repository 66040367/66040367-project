'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Plus, Trash2 } from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: 'หูฟังบลูทูธ ไร้สาย เสียงดี เบสแน่น',
    price: 399,
    rating: 4.8,
    sold: 1200,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    id: 2,
    name: 'นาฬิกา Smart Watch เพื่อสุขภาพ วัดอัตราการเต้นหัวใจ',
    price: 890,
    rating: 4.9,
    sold: 850,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  },
  {
    id: 3,
    name: 'กระเป๋าเป้เดินทาง กันน้ำ ช่องเก็บของเยอะ',
    price: 450,
    rating: 4.7,
    sold: 2300,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
  },
  {
    id: 4,
    name: 'รองเท้าผ้าใบสไตล์สปอร์ต ใส่สบาย ระบายอากาศดี',
    price: 690,
    rating: 4.6,
    sold: 540,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-orange-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-wider">ShopeeClone</h1>
          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="ค้นหาสินค้า โค้ดส่วนลด..."
              className="w-full py-2 px-4 pr-10 rounded-sm text-black focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>
          <div className="relative cursor-pointer">
            <ShoppingCart className="w-8 h-8" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-yellow-400 text-orange-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-orange-500 pb-2">
            สินค้าแนะนำประจำวัน
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden flex flex-col justify-between"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-yellow-500 text-xs">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 ml-2">ขายแล้ว {product.sold} ชิ้น</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-orange-600 font-bold text-lg">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm transition"
                    >
                      <Plus className="w-4 h-4" /> เพิ่มลงตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-white p-4 rounded-lg shadow h-fit sticky top-20">
          <h2 className="text-lg font-bold border-b pb-2 mb-4 text-gray-800">
            ตะกร้าสินค้าของคุณ
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">ไม่มีสินค้าในตะกร้า</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm border-b pb-2"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-gray-500">
                      ฿{item.price} x {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-gray-800 text-base mb-4">
                  <span>ราคารวมทั้งหมด:</span>
                  <span className="text-orange-600">฿{totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => alert('ทำรายการสั่งซื้อสำเร็จ! (ระบบจำลองสำหรับโครงงาน)')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition"
                >
                  สั่งซื้อสินค้า
                </button>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}