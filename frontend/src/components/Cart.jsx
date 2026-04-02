"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  CheckCircle2,
  X 
} from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { id } = useParams();

  // Payment State
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [cardError, setCardError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCheckout = () => setIsCheckoutOpen(!isCheckoutOpen);

  const confirmpayemnt = async () => {
    const cardRegex = /^[0-9]{16}$/;
    if (paymentMethod === "card" && !cardRegex.test(cardNumber)) {
      setCardError(true);
      return;
    }
    setCardError(false);
    setIsSubmitting(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
    const delivery_address = user?.address || "N/A";
    const contact_number = user?.phone || "00000000";
    const subtotal = getCartTotal();
    const delivery_fee = 2.99;
    const total = subtotal + delivery_fee;
    const order_number = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    try {
      const orderRes = await axios.post("http://localhost:8000/api/orders", {
        user_id,
        rider_id: null,
        order_number,
        status: "pending",
        delivery_address,
        restaurant_id: id,
        contact_number,
        subtotal,
        delivery_fee,
        total,
        payment_method: paymentMethod === "card" ? "credit_card" : "cash",
        payment_status: paymentMethod === "card" ? "paid" : "pending",
      });

      const order_id = orderRes.data.id;

      await Promise.all(
        cartItems.map((item) =>
          axios.post("http://localhost:8000/api/order-items", {
            order_id,
            menu_id: parseInt(item.id),
            quantity: item.quantity,
            price: item.price * item.quantity,
          })
        )
      );

      alert(`✅ Order Placed! No: ${order_number}`);
      setShowPaymentForm(false);
      clearCart();
    } catch (error) {
      console.error("Order failed:", error);
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sticky top-24 text-center border border-slate-100">
        <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Cart is Empty</h3>
        <p className="text-slate-400 text-sm mt-1 font-medium">Add some delicious items to get started!</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isCheckoutOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[998] lg:hidden transition-opacity"
          onClick={toggleCheckout}
        />
      )}

      <div className={`
        fixed bottom-0 left-0 right-0 z-[999] bg-white rounded-t-[2.5rem] shadow-2xl transition-transform duration-500 ease-in-out border-t border-slate-100
        lg:sticky lg:top-24 lg:translate-y-0 lg:rounded-[2.5rem] lg:border lg:z-10 lg:max-h-[calc(100vh-120px)]
        ${isCheckoutOpen ? 'translate-y-0' : 'translate-y-[calc(100%-70px)] lg:translate-y-0'}
      `}>
        
        {/* Header */}
        <div 
          className="p-6 border-b border-slate-50 flex justify-between items-center cursor-pointer lg:cursor-default"
          onClick={() => window.innerWidth < 1024 && toggleCheckout()}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShoppingBag className="text-white" size={18} />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Order</h3>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg lg:hidden">
            {isCheckoutOpen ? "Close" : `View - $${(getCartTotal() + 2.99).toFixed(2)}`}
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="p-6 overflow-y-auto max-h-[60vh] lg:max-h-[calc(100vh-450px)] custom-scrollbar">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div className="flex gap-4 group" key={`${item.id}-${item.size}`}>
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.size}</p>
                  <p className="text-sm font-black text-blue-600 mt-1">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg transition-colors shadow-sm"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg transition-colors shadow-sm"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="p-6 bg-slate-50/50 rounded-b-[2.5rem] border-t border-slate-100 space-y-4">
          <div className="space-y-2 text-sm font-bold text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-900">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-slate-900">$2.99</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span className="text-blue-600">${(getCartTotal() + 2.99).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={clearCart}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors border border-slate-200 rounded-2xl hover:border-rose-100"
            >
              Clear
            </button>
            <button 
              onClick={() => setShowPaymentForm(true)}
              className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              Checkout
            </button>
          </div>
        </div>

        {/* Modal-style Payment Overlay */}
        {showPaymentForm && (
          <div className="absolute inset-0 bg-white z-[20] rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300 flex flex-col">
            <button onClick={() => setShowPaymentForm(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
            
            <h4 className="text-xl font-black text-slate-900 tracking-tight mb-8">Payment Details</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "cash" ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
              >
                <Banknote size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Cash</span>
              </button>
              <button 
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === "card" ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
              >
                <CreditCard size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-2 mb-8 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCardNumber(value);
                    setCardError(value.length !== 16 && value.length > 0);
                  }}
                  maxLength={16}
                  className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 ${cardError ? 'border-rose-500 focus:ring-rose-500/10' : 'border-slate-100 focus:border-blue-600 focus:ring-blue-600/10'}`}
                />
              </div>
            )}

            <button 
              onClick={confirmpayemnt}
              disabled={isSubmitting}
              className="mt-auto w-full py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={16} /> Confirm Order
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;