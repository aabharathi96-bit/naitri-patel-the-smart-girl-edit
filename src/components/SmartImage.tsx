import React, { useState, useRef, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  categoryAccent?: string;
}

const normalizeSrc = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
};

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Editorial Feature',
  categoryAccent = '#E4B7AD',
  loading = 'eager',
  decoding = 'async',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(() => normalizeSrc(src));
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync currentSrc when src prop changes
  useEffect(() => {
    setCurrentSrc(normalizeSrc(src));
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Check if image is already loaded from cache or fast network
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    // If the image fails, fall back to our primary editorial lifestyle photograph
    const editorialFallback = '/assets/images/smart_girl_hero_cover_1791477860935.jpg';
    if (currentSrc !== editorialFallback) {
      setCurrentSrc(editorialFallback);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#F4EFEA] text-[#66564D] p-6 text-center ${className}`}
        style={{ minHeight: '140px' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-2 text-xs tracking-widest font-serif uppercase border"
          style={{ borderColor: categoryAccent, color: categoryAccent }}
        >
          EDIT
        </div>
        <p className="font-serif italic text-sm text-[#2A211D] max-w-xs">{fallbackTitle}</p>
        <span className="text-[10px] tracking-wider uppercase text-[#8C7A70] mt-1">The Smart Girl Edit</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F4EFEA] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#EAE3D9]/30 animate-pulse pointer-events-none" />
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt || fallbackTitle}
        loading={loading}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        style={{ imageRendering: 'auto' }}
        className="w-full h-full object-cover transition-opacity duration-300 block opacity-100"
        {...props}
      />
    </div>
  );
};

