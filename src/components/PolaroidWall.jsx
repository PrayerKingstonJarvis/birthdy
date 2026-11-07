import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Heart, Sparkles, X } from 'lucide-react';
import { playSound } from '../audio/soundEffects';

export default function PolaroidWall({ defaultPolaroids }) {
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem('gitu_polaroid_photos');
      return saved ? JSON.parse(saved) : defaultPolaroids;
    } catch {
      return defaultPolaroids;
    }
  });

  const [activePhoto, setActivePhoto] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newSubtext, setNewSubtext] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gitu_polaroid_photos', JSON.stringify(photos));
    } catch (e) {
      console.warn("Storage full or error:", e);
    }
  }, [photos]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newImageUrl) {
      alert("Please upload a photo or enter an image URL!");
      return;
    }

    playSound('confetti');
    const newEntry = {
      id: Date.now(),
      caption: newCaption || "A Precious Moment with Gitu ✨",
      subtext: newSubtext || "Forever stamped in our hearts.",
      image: newImageUrl,
      rotation: `${(Math.random() * 6 - 3).toFixed(1)}deg`
    };

    setPhotos(prev => [newEntry, ...prev]);
    setShowAddModal(false);
    setNewCaption('');
    setNewSubtext('');
    setNewImageUrl('');
  };

  const handleDeletePhoto = (id, e) => {
    e.stopPropagation();
    playSound('coin');
    if (confirm("Delete this polaroid?")) {
      setPhotos(prev => prev.filter(p => p.id !== id));
      if (activePhoto?.id === id) setActivePhoto(null);
    }
  };

  const handleResetPhotos = () => {
    playSound('coin');
    if (confirm("Reset to default carnival photos?")) {
      setPhotos(defaultPolaroids);
      localStorage.removeItem('gitu_polaroid_photos');
    }
  };

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>Fairy-Lit Memory Gallery</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-bold text-slate-100">
          The Polaroid Memory Wall
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Snapshots of joy, laughter, and timeless adventures celebrating 25 radiant years of Gitika.
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              playSound('coin');
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Real Photo of Gitu</span>
          </button>

          <button
            onClick={handleResetPhotos}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Polaroid Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => {
              playSound('cardFlip');
              setActivePhoto(photo);
            }}
            className="group relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20"
            style={{ transform: `rotate(${photo.rotation || '0deg'})` }}
          >
            {/* Washi Tape Graphic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-rose-200/50 backdrop-blur-sm shadow-sm rotate-2 z-10 border-l-2 border-r-2 border-dashed border-rose-300/60" />

            {/* White Polaroid Card */}
            <div className="bg-white p-3.5 pb-5 rounded-md shadow-xl border border-slate-200/80 flex flex-col justify-between">
              {/* Photo Image */}
              <div className="w-full aspect-[4/5] bg-slate-100 rounded-sm overflow-hidden relative">
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <button
                  onClick={(e) => handleDeletePhoto(photo.id, e)}
                  title="Remove Polaroid"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/70 text-slate-300 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Caption */}
              <div className="mt-3 text-center">
                <h4 className="font-handwritten text-xl font-bold text-slate-800 leading-tight">
                  {photo.caption}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-serif-title italic">
                  {photo.subtext}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="max-w-lg w-full bg-white p-4 sm:p-6 rounded-2xl shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden shadow-inner bg-slate-100">
              <img
                src={activePhoto.image}
                alt={activePhoto.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="font-handwritten text-3xl font-bold text-slate-900">
                {activePhoto.caption}
              </h3>
              <p className="font-serif-title italic text-sm text-slate-600 mt-1">
                {activePhoto.subtext}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-amber-300">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-serif-title text-xl font-bold">
                Add Polaroid for Gitu
              </h3>
            </div>

            <form onSubmit={handleAddPhoto} className="flex flex-col gap-4">
              {/* File Upload */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Choose Image File from your Device:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600 cursor-pointer"
                />
              </div>

              {/* Or URL input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Or Paste an Image URL:
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* Preview */}
              {newImageUrl && (
                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-slate-700">
                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Caption:
                </label>
                <input
                  type="text"
                  placeholder="e.g. That Sunset in the Hills 🌅"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* Subtext */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Short Love Note / Memory:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Laughing until our ribs hurt."
                  value={newSubtext}
                  onChange={(e) => setNewSubtext(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-rose-400"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Pin Polaroid to Wall ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
