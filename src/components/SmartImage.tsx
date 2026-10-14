import React, { useState, useRef, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  categoryAccent?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Editorial Feature',
  categoryAccent = '#E4B7AD',
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || '');
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryAttempted, setRetryAttempted] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync currentSrc when src prop changes
  useEffect(() => {
    setCurrentSrc(src || '');
    setHasError(false);
    setIsLoaded(false);
    setRetryAttempted(false);
  }, [src]);

  // Check if image is already loaded from cache or fast network
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (!retryAttempted && currentSrc) {
      setRetryAttempted(true);
      // Alternate between /assets/images and /src/assets/images to guarantee fallback resolution
      if (currentSrc.includes('/src/assets/images/')) {
        setCurrentSrc(currentSrc.replace('/src/assets/images/', '/assets/images/'));
        return;
      } else if (currentSrc.includes('/assets/images/')) {
        setCurrentSrc(currentSrc.replace('/assets/images/', '/src/assets/images/'));
        return;
      }
    }
    setHasError(true);
  };

  if (!currentSrc || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#F4EFEA] text-[#66564D] p-6 text-center ${className}`}
        style={{ minHeight: '180px' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-xs tracking-widest font-serif uppercase border"
          style={{ borderColor: categoryAccent, color: categoryAccent }}
        >
          EDIT
        </div>
        <p className="font-serif italic text-base text-[#2A211D] max-w-xs">{fallbackTitle}</p>
        <span className="text-[11px] tracking-wider uppercase text-[#8C7A70] mt-1">The Smart Girl Edit</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F4EFEA] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#EAE3D9]/40 animate-pulse pointer-events-none" />
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
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
