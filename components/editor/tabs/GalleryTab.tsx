'use client';

import React, { useState, useRef, useCallback } from 'react';
import { WeddingProject, WeddingDetails } from '@/types/wedding';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  CheckSquare,
  Square,
  X,
  Layers,
  ArrowUpToLine,
  Info,
} from 'lucide-react';
import { CURATED_WEDDING_IMAGES } from '@/lib/mockData';
import { uploadWeddingImage } from '@/services/storageService';
import { useToast } from '@/contexts/ToastContext';
import { PhotoLightbox } from '@/components/templates/common/PhotoLightbox';
import { cn } from '@/lib/utils';

interface TabProps {
  wedding: WeddingProject;
  onChangeDetails: (details: Partial<WeddingDetails>) => void;
}

export function GalleryTab({ wedding, onChangeDetails }: TabProps) {
  const { details } = wedding;
  const gallery = details.galleryImages || [];
  const { success, error: toastError, info } = useToast();

  // Uploading states
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Management states
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  // 1. Hero / Primary Photo Upload
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const res = await uploadWeddingImage(wedding.id, file, 'hero');
      onChangeDetails({ heroImage: res.url, coverImage: res.url });
      success('Hero Photo Updated', 'Primary couple portrait saved.');
    } catch (err: any) {
      toastError('Upload Failed', err?.message || 'Failed to upload hero image.');
    } finally {
      setUploadingHero(false);
      if (e.target) e.target.value = '';
    }
  };

  // 2. Batch Upload Processing for Multiple Files
  const processMultipleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    // Filter valid images
    const validFiles: File[] = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        toastError('Invalid File Type', `${f.name} is not an image.`);
        continue;
      }
      if (f.size > 8 * 1024 * 1024) {
        toastError('File Too Large', `${f.name} exceeds the 8MB limit.`);
        continue;
      }
      validFiles.push(f);
    }

    if (validFiles.length === 0) return;

    setUploadingGallery(true);
    setUploadProgress({ current: 0, total: validFiles.length });

    const newUrls: string[] = [];
    let successCount = 0;

    for (let i = 0; i < validFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: validFiles.length });
      try {
        const res = await uploadWeddingImage(wedding.id, validFiles[i], 'gallery');
        newUrls.push(res.url);
        successCount++;
      } catch (err: any) {
        toastError('Upload Error', `Failed to upload ${validFiles[i].name}: ${err?.message || 'Unknown error'}`);
      }
    }

    if (newUrls.length > 0) {
      onChangeDetails({
        galleryImages: [...gallery, ...newUrls],
      });
      success(
        'Photos Added to Gallery',
        `Successfully uploaded ${successCount} ${successCount === 1 ? 'photo' : 'photos'}.`
      );
    }

    setUploadingGallery(false);
    setUploadProgress(null);
  };

  const handleGalleryFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processMultipleFiles(e.target.files);
      e.target.value = '';
    }
  };

  // 3. Drag & Drop Handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      await processMultipleFiles(e.dataTransfer.files);
    }
  }, [gallery, wedding.id]);

  // 4. Single Add via Public URL
  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      toastError('Invalid URL', 'Please enter a valid HTTP or HTTPS image URL.');
      return;
    }

    onChangeDetails({
      galleryImages: [...gallery, trimmed],
    });
    setNewImageUrl('');
    success('Photo Added', 'Image URL added to gallery.');
  };

  // 5. Individual Removal
  const handleRemoveGalleryImage = (index: number) => {
    const updated = gallery.filter((_, idx) => idx !== index);
    onChangeDetails({ galleryImages: updated });
    setSelectedIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
    info('Photo Removed', 'Photo removed from gallery.');
  };

  // 6. Selection & Batch Management
  const toggleSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const selectAll = () => {
    setSelectedIndices(gallery.map((_, idx) => idx));
  };

  const deselectAll = () => {
    setSelectedIndices([]);
  };

  const handleDeleteSelected = () => {
    if (selectedIndices.length === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIndices.length} selected ${
        selectedIndices.length === 1 ? 'photo' : 'photos'
      }?`
    );
    if (!confirmDelete) return;

    const updated = gallery.filter((_, idx) => !selectedIndices.includes(idx));
    onChangeDetails({ galleryImages: updated });
    success('Photos Deleted', `Removed ${selectedIndices.length} photos.`);
    setSelectedIndices([]);
  };

  const handleClearAll = () => {
    if (gallery.length === 0) return;
    const confirmClear = window.confirm('Are you sure you want to remove all photos from your gallery?');
    if (!confirmClear) return;

    onChangeDetails({ galleryImages: [] });
    setSelectedIndices([]);
    info('Gallery Cleared', 'All gallery photos have been removed.');
  };

  // 7. Reordering Controls
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= gallery.length) return;
    const updated = [...gallery];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    onChangeDetails({ galleryImages: updated });

    // Update selected indices mapping
    setSelectedIndices((prev) =>
      prev.map((i) => {
        if (i === fromIndex) return toIndex;
        if (fromIndex < toIndex && i > fromIndex && i <= toIndex) return i - 1;
        if (fromIndex > toIndex && i >= toIndex && i < fromIndex) return i + 1;
        return i;
      })
    );
  };

  // 8. Set as Hero / Primary Portrait
  const handleSetAsHero = (url: string) => {
    onChangeDetails({ heroImage: url, coverImage: url });
    success('Primary Photo Set', 'This photo is now your main wedding hero portrait.');
  };

  // 9. Presets Selection
  const handleSelectPreset = (url: string) => {
    onChangeDetails({
      galleryImages: [...gallery, url],
    });
    success('Preset Added', 'Added curated wedding photo to your gallery.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
        <div>
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <span>Photos & Media Gallery</span>
            <Badge variant="rose" size="sm">
              {gallery.length} {gallery.length === 1 ? 'Photo' : 'Photos'}
            </Badge>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload multiple photos, organize the sequence, and set your primary couple portrait.
          </p>
        </div>
        {gallery.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLightboxIndex(0)}
            leftIcon={<Eye className="w-3.5 h-3.5 text-stone-600" />}
            className="self-start sm:self-auto text-xs"
          >
            Preview Lightbox
          </Button>
        )}
      </div>

      {/* Primary Portrait / Hero Photo Section */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Primary Portrait / Hero Cover
          </h4>
          <span className="text-[11px] text-stone-500 font-medium">Displayed in top hero section</span>
        </div>

        {details.heroImage && (
          <div className="relative aspect-16/9 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={details.heroImage} alt="Hero Portrait" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              Active Cover Photo
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="file"
            ref={heroInputRef}
            onChange={handleHeroUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => heroInputRef.current?.click()}
            isLoading={uploadingHero}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Change Hero Photo
          </Button>

          <Input
            value={details.heroImage || ''}
            onChange={(e) => onChangeDetails({ heroImage: e.target.value, coverImage: e.target.value })}
            placeholder="Or paste an image URL..."
            className="text-xs flex-1"
          />
        </div>
      </div>

      {/* Multi-Photo Drag & Drop Upload Zone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-stone-900">Upload Gallery Photos</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              className="text-xs"
            >
              {showPresets ? 'Hide Presets' : 'Curated Presets'}
            </Button>
          </div>
        </div>

        {/* Drag and Drop Box */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => galleryInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 select-none',
            isDragging
              ? 'border-rose-500 bg-rose-50/60 scale-[1.01] shadow-md'
              : 'border-stone-300 hover:border-rose-400 bg-stone-50/40 hover:bg-rose-50/20'
          )}
        >
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleGalleryFileInput}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center transition-colors',
                isDragging ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'
              )}
            >
              <Upload className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-800">
                {isDragging ? 'Drop multiple photos now!' : 'Drag & drop multiple photos here, or click to browse'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Select multiple files at once • JPG, PNG, WEBP up to 8MB each
              </p>
            </div>
          </div>
        </div>

        {/* Live Upload Progress Indicator */}
        {uploadingGallery && uploadProgress && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-800">
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 animate-bounce" />
                Uploading photo {uploadProgress.current} of {uploadProgress.total}...
              </span>
              <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-rose-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.round((uploadProgress.current / uploadProgress.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Add single photo via URL */}
        <div className="flex gap-2 pt-1">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddImageUrl()}
            placeholder="Or paste an image URL (https://...)..."
            className="text-xs flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddImageUrl}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs shrink-0"
          >
            Add URL
          </Button>
        </div>
      </div>

      {/* Curated Presets Drawer */}
      {showPresets && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Curated High-Res Wedding Presets (Click to Add)
            </span>
            <button
              onClick={() => setShowPresets(false)}
              className="text-amber-700 hover:text-amber-900 text-xs p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CURATED_WEDDING_IMAGES.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectPreset(preset.url)}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group border border-amber-200/80 hover:ring-2 hover:ring-amber-500 shadow-2xs transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.url}
                  alt={preset.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-2 text-center text-white transition-opacity">
                  <Plus className="w-5 h-5 text-amber-300 mb-1" />
                  <span className="text-[11px] font-bold leading-tight line-clamp-2">{preset.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Gallery Management Section */}
      <div className="space-y-4 pt-2">
        {/* Batch Operations Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-stone-100/80 border border-stone-200">
          <div className="flex items-center gap-2 text-xs">
            {gallery.length > 0 && (
              <button
                type="button"
                onClick={selectedIndices.length === gallery.length ? deselectAll : selectAll}
                className="inline-flex items-center gap-1.5 font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
              >
                {selectedIndices.length === gallery.length ? (
                  <CheckSquare className="w-4 h-4 text-rose-600" />
                ) : (
                  <Square className="w-4 h-4 text-stone-400" />
                )}
                <span>
                  {selectedIndices.length === gallery.length ? 'Deselect All' : 'Select All'}
                </span>
              </button>
            )}

            {selectedIndices.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-semibold">
                {selectedIndices.length} Selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {selectedIndices.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteSelected}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="text-xs py-1 h-8"
              >
                Delete Selected ({selectedIndices.length})
              </Button>
            )}

            {gallery.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-stone-500 hover:text-red-600 text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        {gallery.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-stone-200 text-center bg-stone-50/50">
            <ImageIcon className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h5 className="text-sm font-semibold text-stone-700">No photos in gallery yet</h5>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Drag and drop photos above, select files from your computer, or choose preset images to start your gallery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gallery.map((url, idx) => {
              const isHero = details.heroImage === url;
              const isSelected = selectedIndices.includes(idx);

              return (
                <div
                  key={`${url}-${idx}`}
                  className={cn(
                    'group relative aspect-square rounded-2xl overflow-hidden border bg-stone-100 shadow-2xs transition-all duration-200',
                    isSelected
                      ? 'ring-2 ring-rose-500 border-rose-500'
                      : 'border-stone-200 hover:border-stone-400'
                  )}
                >
                  {/* Photo Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Top Overlay Bar */}
                  <div className="absolute top-0 inset-x-0 p-2 flex items-center justify-between bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(idx);
                      }}
                      className="p-1 rounded-md bg-black/40 hover:bg-black/60 text-white transition cursor-pointer"
                      title={isSelected ? 'Deselect photo' : 'Select photo'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Square className="w-4 h-4 text-white/80" />
                      )}
                    </button>

                    {/* Hero Badge or Set as Hero Button */}
                    <div className="flex items-center gap-1">
                      {isHero ? (
                        <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 fill-stone-950" />
                          Hero
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetAsHero(url)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-black/40 hover:bg-amber-500 hover:text-stone-950 text-white transition cursor-pointer"
                          title="Set as Hero / Cover photo"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-black/40 hover:bg-red-600 text-white transition cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Bar: Index and Reordering Controls */}
                  <div className="absolute bottom-0 inset-x-0 p-2 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10">
                    {/* Position Label */}
                    <span className="text-[10px] font-mono font-semibold text-white/90 bg-black/40 px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Move to Start */}
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 0)}
                          className="p-1 rounded bg-black/50 hover:bg-white/30 text-white transition cursor-pointer"
                          title="Move to first position"
                        >
                          <ArrowUpToLine className="w-3 h-3 -rotate-90" />
                        </button>
                      )}

                      {/* Move Left */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveImage(idx, idx - 1)}
                        className={cn(
                          'p-1 rounded bg-black/50 text-white transition',
                          idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/30 cursor-pointer'
                        )}
                        title="Move left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Right */}
                      <button
                        type="button"
                        disabled={idx === gallery.length - 1}
                        onClick={() => moveImage(idx, idx + 1)}
                        className={cn(
                          'p-1 rounded bg-black/50 text-white transition',
                          idx === gallery.length - 1
                            ? 'opacity-30 cursor-not-allowed'
                            : 'hover:bg-white/30 cursor-pointer'
                        )}
                        title="Move right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Lightbox Preview */}
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="p-1 rounded bg-black/50 hover:bg-white/30 text-white transition cursor-pointer"
                        title="View Full Size"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Viewer */}
      {lightboxIndex !== null && gallery.length > 0 && (
        <PhotoLightbox
          images={gallery}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onSelectIndex={(idx) => setLightboxIndex(idx)}
        />
      )}
    </div>
  );
}
