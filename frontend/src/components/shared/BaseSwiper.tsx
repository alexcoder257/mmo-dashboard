import type { Swiper as SwiperType } from 'swiper';

import React, { useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper } from 'swiper/react';

import IconArrowLeft from '@/assets/icons/shared/IconArrowLeft.svg';
import IconArrowRight from '@/assets/icons/shared/IconArrowRight.svg';

import { BaseButton } from './BaseButton';

import 'swiper/css';
import 'swiper/css/navigation';

interface BaseSwiperProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
  keySwiper?: string;
  onSlideChange?: (swiper: SwiperType) => void;
  onSwiper?: (swiper: SwiperType) => void;
  slidesPerGroup?: number;
  slidesPerView?: 'auto' | number;
  spaceBetween?: number;
}

export default function BaseSwiper({
  children,
  hideNavigation = false,
  keySwiper,
  onSlideChange,
  onSwiper,
  slidesPerGroup = 1,
  slidesPerView,
  spaceBetween,
}: BaseSwiperProps) {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const syncEdgeState = (s: SwiperType) => {
    setIsBeginning(s.isBeginning || s.isLocked);
    setIsEnd(s.isEnd || s.isLocked);
  };

  return (
    <div className="relative">
      {!hideNavigation && (
        <>
          <BaseButton
            aria-label="Previous"
            className={`${keySwiper}-prev !absolute !left-0 !top-1/2 !-translate-y-1/2 !z-10 !bg-white !rounded-full !shadow !w-[45px] !p-0 ${
              isBeginning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isBeginning}
            onClick={() => swiper?.slidePrev()}
            size="large"
          >
            <IconArrowLeft color="#000" />
          </BaseButton>

          <BaseButton
            aria-label="Next"
            className={`${keySwiper}-next !absolute !right-0 !top-1/2 !-translate-y-1/2 !z-10 !bg-white !rounded-full !shadow !w-[45px] !p-0 ${
              isEnd ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isEnd}
            onClick={() => swiper?.slideNext()}
            size="large"
          >
            <IconArrowRight color="#000" />
          </BaseButton>
        </>
      )}

      <Swiper
        loop={false}
        modules={[Navigation]}
        navigation={false}
        observeParents
        observer
        onResize={syncEdgeState}
        onSlideChange={(swiper) => {
          syncEdgeState(swiper);
          onSlideChange?.(swiper);
        }}
        onSwiper={(swiper) => {
          setSwiper(swiper);
          syncEdgeState(swiper);
          onSwiper?.(swiper);
        }}
        onUpdate={syncEdgeState}
        slidesPerGroup={slidesPerGroup}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        watchOverflow
      >
        {children}
      </Swiper>
    </div>
  );
}
