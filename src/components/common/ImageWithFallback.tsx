import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { getAssetUrl } from '../../utils/assets';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Beni Sweets Delicacy',
  className = '',
  fallbackTitle,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = src ? getAssetUrl(src) : '';

  if (!resolvedSrc || hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-[#F2EBE0] to-[#E6DBCB] flex flex-col items-center justify-center p-3 text-center ${className}`}
      >
        <div className="w-8 h-8 rounded-full bg-[#5A121F]/10 border border-[#C5A059]/40 flex items-center justify-center text-[#5A121F] mb-1">
          <Utensils className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-serif font-bold text-[#350A11] line-clamp-1">
          {fallbackTitle || alt}
        </span>
        <span className="text-[9px] text-[#9E742A] uppercase tracking-wider font-semibold">
          Beni Sweets
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
