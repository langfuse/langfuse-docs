import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// Image Zoom Modal Component
const ImageZoomModal = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] bg-white rounded-lg shadow-2xl">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close zoom"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const Frame = ({
  children,
  className,
  border = false,
  fullWidth = false,
  transparent = false,
}: {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  fullWidth?: boolean;
  transparent?: boolean;
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target.tagName === 'IMG') {
        // Only handle clicks on desktop (screens wider than 500px)
        if (window.innerWidth <= 500) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        const src = target.src;
        const alt = target.alt || 'Image';
        if (src) {
          setZoomedImage({ src, alt });
        }
      }
    };

    const updateImageCursors = () => {
      const images = frame.querySelectorAll('img');
      images.forEach(img => {
        if (window.innerWidth > 500) {
          img.style.cursor = 'pointer';
          img.style.transition = 'opacity 0.2s ease';
        } else {
          img.style.cursor = 'default';
          img.style.transition = 'none';
        }
      });
    };

    // Add click event listener to the frame
    frame.addEventListener('click', handleImageClick);

    // Initial cursor setup
    updateImageCursors();

    // Add resize listener to update cursors when screen size changes
    window.addEventListener('resize', updateImageCursors);

    return () => {
      frame.removeEventListener('click', handleImageClick);
      window.removeEventListener('resize', updateImageCursors);
    };
  }, []);

  return (
    <>
      <div
        ref={frameRef}
        className={cn(
          "my-4",
          border &&
            "p-3 pb-1 bg-gradient-to-tr from-blue-300/50 via-green-200/50 to-yellow-300/50 inline-block rounded",
          className
        )}
      >
        <div
          className={cn(
            "inline-block rounded overflow-hidden bg-primary/5 max-w-2xl [&>*]:mt-0",
            fullWidth && "max-w-full",
            transparent && "bg-transparent",
            border
          )}
        >
          {children}
        </div>
      </div>
      
      {zoomedImage && (
        <ImageZoomModal
          src={zoomedImage.src}
          alt={zoomedImage.alt}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </>
  );
};
