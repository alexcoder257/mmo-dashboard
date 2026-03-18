import { Carousel as AntdCarousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { clsx } from 'clsx';
import React from 'react';

interface CarouselProps {
  active?: number; // Minimum active is 1
  autoplay?: boolean;
  className?: string;
  classNavigation?: string;
  color?: 'gray' | 'primary' | 'secondary';
  onChange?: (value: number) => void;
  showDots?: boolean;
  slides?: Slide[];
  style?: object;
}

interface Slide {
  className?: string;
  content: React.ReactNode;
  id: number;
}

export default function BaseCarousel({
  active = 1,
  autoplay = false,
  className,
  classNavigation,
  color = 'primary',
  onChange,
  showDots = true,
  slides = [],
  style,
}: CarouselProps) {
  const carouselRef = React.useRef<CarouselRef>(null);

  const [currentSlide, setCurrentSlide] = React.useState(
    Math.min(Math.max(active, 1), slides.length || 5),
  );

  const handleDotClick = (index: number) => {
    carouselRef.current?.goTo(index);
    setCurrentSlide(index + 1);
    onChange?.(index + 1);
  };

  const getDotClasses = (isActive: boolean) =>
    clsx('h-2 rounded-full transition-all duration-500', {
      'w-2 bg-[#FFF0F2]':
        (!isActive && color === 'primary') ||
        (!isActive && color === 'secondary'),
      'w-2 bg-neutrals_200': !isActive && color === 'gray',
      'w-6 bg-[#6E6E6E]': isActive && color === 'gray',
      'w-6 bg-primary_700': isActive && color !== 'gray',
    });

  React.useEffect(() => {
    setCurrentSlide(Math.min(Math.max(active, 1), slides.length || 5));
  }, [active, slides.length]);

  return (
    <div className={clsx('relative', className)}>
      <AntdCarousel
        afterChange={(current) => {
          setCurrentSlide(current + 1);
          onChange?.(current + 1);
        }}
        autoplay={autoplay}
        autoplaySpeed={3000}
        dots={false}
        draggable={true}
        initialSlide={currentSlide - 1}
        ref={carouselRef}
        style={style}
      >
        {slides.length > 0
          ? slides.map((slide) => (
              <div
                className={clsx(
                  'flex items-center justify-center',
                  slide.className,
                )}
                key={slide.id}
              >
                {slide.content}
              </div>
            ))
          : Array.from({ length: 5 }).map((_, index) => (
              <div
                className=" flex items-center justify-center bg-gray-200"
                key={index}
              >
                <p className="text-lg font-semibold text-gray-500">
                  {'Default Content'} {index + 1}
                </p>
              </div>
            ))}
      </AntdCarousel>
      {showDots && (
        <div className={classNavigation}>
          <div className=" flex items-center justify-center gap-2">
            {(slides.length > 0 ? slides : Array.from({ length: 5 })).map(
              (_, index) => (
                <button
                  aria-label={`Go to slide ${index + 1}`}
                  className={getDotClasses(currentSlide - 1 === index)}
                  key={index}
                  onClick={() => handleDotClick(index)}
                ></button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
