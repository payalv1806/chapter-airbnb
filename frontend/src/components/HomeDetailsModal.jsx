import React, { useState } from 'react';
import { X, Star, MapPin, Wifi, Car, Tv, Utensils, Wind, ShieldCheck, Calendar, Check } from 'lucide-react';

export default function HomeDetailsModal({ home, onClose, onBookSuccess }) {
  const [booked, setBooked] = useState(false);
  const [nights, setNights] = useState(3);

  if (!home) return null;

  const displayName = home.houseName || home.name || 'Airbnb Home';
  const price = Number(home.pricePerNight) || 120;
  const totalPrice = price * nights;
  const serviceFee = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + serviceFee;

  const handleReserve = () => {
    setBooked(true);
    setTimeout(() => {
      if (onBookSuccess) onBookSuccess(displayName);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-72 sm:h-96 w-full bg-gray-200 overflow-hidden">
          <img
            src={home.photoUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-500 text-xs px-2.5 py-0.5 rounded-full font-semibold">Superhost Listing</span>
              <span className="flex items-center gap-1 text-xs bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {home.rating || '4.8'}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold">{displayName}</h2>
            <p className="text-sm text-gray-200 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{home.location}</span>
            </p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-h-[50vh] overflow-y-auto">
          
          {/* Left 2 Cols: Details & Amenities */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">About this home</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {home.description || `Experience relaxation and serenity at ${displayName}. Nestled in the heart of ${home.location}, this property features modern decor, scenic views, and seamless hospitality.`}
              </p>
            </div>

            {/* Host Info */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
                {(home.hostName || 'H').charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  Hosted by {home.hostName || 'Airbnb Host'}
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                </p>
                <p className="text-xs text-gray-500">Superhost • 100% Verified Airbnb Host</p>
              </div>
            </div>

            {/* What this place offers */}
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-3">Amenities included</h4>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-rose-500" /> Fast Wi-Fi (150 Mbps)
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-rose-500" /> Free on-premise parking
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-rose-500" /> Air conditioning & heater
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-rose-500" /> Fully equipped kitchen
                </div>
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-rose-500" /> 55" 4K Smart TV
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-500" /> Flexible check-in
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Booking Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-lg flex flex-col justify-between h-fit">
            <div>
              <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-2xl font-black text-rose-500">₹{price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-gray-500"> / night</span>
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold">{home.rating || '4.8'}</span>
                </div>
              </div>

              {/* Stay Length Selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Number of nights</label>
                <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                  <button
                    type="button"
                    onClick={() => setNights(Math.max(1, nights - 1))}
                    className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-gray-800">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <button
                    type="button"
                    onClick={() => setNights(nights + 1)}
                    className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>₹{price.toLocaleString('en-IN')} x {nights} nights</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Airbnb service fee</span>
                  <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-sm">
                  <span>Total before taxes</span>
                  <span className="text-rose-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Reserve Button */}
            <button
              onClick={handleReserve}
              disabled={booked}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                booked 
                  ? 'bg-green-600 text-white' 
                  : 'bg-rose-500 hover:bg-rose-600 text-white active:scale-98'
              }`}
            >
              {booked ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Reserved Successfully!</span>
                </>
              ) : (
                <span>Reserve Stay</span>
              )}
            </button>
            <p className="text-[11px] text-gray-400 text-center mt-2">You won't be charged yet</p>
          </div>

        </div>

      </div>
    </div>
  );
}
