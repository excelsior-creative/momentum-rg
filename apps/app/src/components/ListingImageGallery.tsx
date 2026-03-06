"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, MapPin, X } from "lucide-react";

type ListingImageGalleryProps = {
  images: string[];
  title: string;
};

export function ListingImageGallery({ images, title }: ListingImageGalleryProps) {
  const [failedImageIndexes, setFailedImageIndexes] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const availableImages = images
    .map((url, index) => ({ url, index }))
    .filter(({ index }) => !failedImageIndexes.includes(index));

  const selectedImage = availableImages[selectedIndex] ?? availableImages[0];

  const handleImageError = (index: number) => {
    setFailedImageIndexes((current) => {
      if (current.includes(index)) return current;
      return [...current, index];
    });
  };

  const showPreviousImage = () => {
    if (availableImages.length <= 1) return;

    setSelectedIndex((current) =>
      current === 0 ? availableImages.length - 1 : current - 1,
    );
  };

  const showNextImage = () => {
    if (availableImages.length <= 1) return;

    setSelectedIndex((current) =>
      current === availableImages.length - 1 ? 0 : current + 1,
    );
  };

  useEffect(() => {
    if (selectedIndex < availableImages.length) return;
    setSelectedIndex(0);
  }, [availableImages.length, selectedIndex]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, availableImages.length]);

  if (availableImages.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden bg-gold/5 aspect-[16/9] flex flex-col items-center justify-center text-muted-foreground border border-border">
        <MapPin className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm">Photos not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsLightboxOpen(true)}
        className="group relative block w-full rounded-2xl overflow-hidden bg-gold/5 aspect-[16/9] text-left"
        aria-label={`Open photo gallery for ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedImage.url}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onError={() => handleImageError(selectedImage.index)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Photo Gallery
            </p>
            <p className="mt-1 text-sm font-medium">
              {selectedIndex + 1} of {availableImages.length}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Expand className="h-4 w-4" />
            View all photos
          </span>
        </div>
      </button>

      {availableImages.length > 1 && (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Browse all {availableImages.length} photos
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={showPreviousImage}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:border-gold hover:text-gold"
                aria-label="Show previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:border-gold hover:text-gold"
                aria-label="Show next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {availableImages.map(({ url, index }, imageIndex) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(imageIndex)}
                className={`relative shrink-0 w-28 sm:w-32 rounded-xl overflow-hidden aspect-[4/3] border transition-all ${
                  imageIndex === selectedIndex
                    ? "border-gold ring-2 ring-gold/20"
                    : "border-border hover:border-gold/40"
                }`}
                aria-label={`Show photo ${imageIndex + 1}`}
                aria-pressed={imageIndex === selectedIndex}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${title} - photo ${imageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 md:p-6">
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-4 flex items-center justify-between gap-4 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  Photo Gallery
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {selectedIndex + 1} of {availableImages.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15"
                aria-label="Close photo gallery"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              {availableImages.length > 1 && (
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:bg-black/60"
                  aria-label="Show previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.url}
                  alt={`${title} - photo ${selectedIndex + 1}`}
                  className="max-h-full max-w-full object-contain"
                  onError={() => handleImageError(selectedImage.index)}
                />
              </div>

              {availableImages.length > 1 && (
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:bg-black/60"
                  aria-label="Show next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {availableImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {availableImages.map(({ url, index }, imageIndex) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedIndex(imageIndex)}
                    className={`relative shrink-0 w-24 rounded-xl overflow-hidden aspect-[4/3] border transition-all ${
                      imageIndex === selectedIndex
                        ? "border-gold ring-2 ring-gold/20"
                        : "border-white/10 hover:border-white/40"
                    }`}
                    aria-label={`Jump to photo ${imageIndex + 1}`}
                    aria-pressed={imageIndex === selectedIndex}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${title} - photo ${imageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
