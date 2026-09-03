import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

const SAMPLE_PHOTOS = [
  { label: 'Lake Cabin', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Beach Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Loft', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Forest Retreat', url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80' },
];

export default function AddHomeModal({ isOpen, onClose, onAddHome, isSubmitting }) {
  const [formData, setFormData] = useState({
    houseName: '',
    pricePerNight: '',
    location: '',
    rating: '4.8',
    photoUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    description: ''
  });

  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.houseName.trim() || !formData.pricePerNight || !formData.location.trim()) {
      setFormError('Please fill in House Name, Price per Night, and Location.');
      return;
    }

    setFormError('');
    onAddHome(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Add a Home</h2>
            <p className="text-rose-100 text-xs mt-0.5">List your property on Airbnb</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {formError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form Body (Preserving fields from views/addhome.ejs) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          
          {/* House Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">House Name *</label>
            <input
              type="text"
              name="houseName"
              value={formData.houseName}
              onChange={handleChange}
              placeholder="Enter the name of your house (e.g. Sunset Villa)"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price per Night */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price per Night (₹) *</label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                placeholder="Enter the price per night"
                required
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-sm"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Rating</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Enter the rating (e.g. 4.8)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-sm"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter the location of your house (e.g. Lakeview, Manali)"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-sm"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="Enter the photo URL"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-sm"
            />

            {/* Quick sample photo selection */}
            <div className="mt-2">
              <span className="text-xs text-gray-500 flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Or pick a sample photo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PHOTOS.map(sample => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, photoUrl: sample.url }))}
                    className="text-xs px-2.5 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 rounded-md transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {formData.photoUrl && (
              <div className="mt-3 relative h-36 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={formData.photoUrl}
                  alt="Listing preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">Preview</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Tell guests what makes your place special..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-sm"
            />
          </div>

          {/* Submit Button (Preserved styling from views/addhome.ejs) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Add Home</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
