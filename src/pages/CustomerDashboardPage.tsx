import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  Package,
  MapPin,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Plus,
  Trash2,
  Phone,
  Mail,
  Crown
} from 'lucide-react';

export const CustomerDashboardPage: React.FC = () => {
  const {
    currentUser,
    orders,
    logoutUser,
    setCurrentPage,
    addSavedAddress,
    removeSavedAddress,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-800">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-neutral-950">
            Customer Portal
          </h2>
          <p className="text-xs text-neutral-600">
            Please log in or create an account to view your past orders and saved shipping addresses.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('auth')}
          className="w-full py-3 bg-neutral-950 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
        >
          Login / Register
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(
    (o) => o.customerId === currentUser.uid || o.customerEmail === currentUser.email
  );

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.pincode) return;
    await addSavedAddress(newAddress);
    setShowAddressModal(false);
    setNewAddress({ name: '', mobile: '', address: '', city: '', state: '', pincode: '' });
    showToast('New shipping address saved!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Card */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl border border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-amber-400 font-bold font-serif text-xl">
              {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'P'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                VERIFIED CUSTOMER
              </span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold">
              {currentUser.fullName}
            </h1>
            <p className="text-xs text-neutral-400 font-mono">
              {currentUser.email} • {currentUser.mobile}
            </p>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'orders' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          My Orders ({userOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'addresses' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Saved Addresses
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-4">
              <Package className="w-12 h-12 text-neutral-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-neutral-900">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Explore our signature collection of pure attars, French perfumes, and wedding specials.
              </p>
              <button
                onClick={() => setCurrentPage('shop')}
                className="px-6 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-neutral-100 pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-neutral-900 text-sm">
                        Order #{ord.orderId}
                      </span>
                      <span className="text-neutral-400 text-[11px] block">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ord.status}
                      </span>
                      <span className="font-serif text-base font-bold text-neutral-950">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-12 object-cover rounded-lg bg-neutral-100 shrink-0"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-neutral-900 block">{it.name}</span>
                          <span className="text-neutral-500 text-[11px]">
                            {it.volume} • Qty: {it.quantity}
                          </span>
                        </div>
                        <span className="font-mono font-semibold text-neutral-900">
                          ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address & Tracking info */}
                  {ord.trackingNumber && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900">
                        <Truck className="w-4 h-4 text-amber-700" />
                        <span>Courier: <strong>{ord.courierCompany || 'Bluedart'}</strong> Tracking: <strong>{ord.trackingNumber}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Saved Addresses</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.savedAddresses?.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-2 relative shadow-2xs"
              >
                <button
                  onClick={() => removeSavedAddress(addr.id)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="font-bold text-xs text-neutral-900 block">{addr.name}</span>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs font-mono text-neutral-500">Phone: {addr.mobile}</p>
              </div>
            ))}
          </div>

          {/* Modal for adding address */}
          {showAddressModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <h4 className="font-serif text-lg font-bold text-neutral-900">Add Shipping Address</h4>
                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Contact Mobile Number"
                    value={newAddress.mobile}
                    onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street Address / Flat / Landmark"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl p-2.5"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl p-2.5"
                  />

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-neutral-950 text-white rounded-xl font-bold uppercase tracking-wider"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
