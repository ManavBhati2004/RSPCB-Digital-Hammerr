import React from 'react';

import slider1 from '../../assets/slider/slider1.jpeg';
import slider2 from '../../assets/slider/slider2.jpeg';
import slider3 from '../../assets/slider/slider3.jpeg';
import slider4 from '../../assets/slider/slider4.jpeg';
import slider5 from '../../assets/slider/slider5.jpeg';
import slider6 from '../../assets/slider/slider6.jpeg';
import slider7 from '../../assets/slider/slider7.jpeg';

export interface SliderImage {
  src: string;
  alt: string;
  caption?: string;
}

export const defaultSliderImages: SliderImage[] = [
  { src: slider1, alt: 'Rajasthan environmental initiative',  caption: 'Greener Rajasthan' },
  { src: slider2, alt: 'Renewable energy infrastructure',     caption: 'Clean Energy' },
  { src: slider3, alt: 'Plantation drive in Rajasthan',       caption: 'Plantation Drive' },
  { src: slider4, alt: 'Sustainable transport initiative',    caption: 'Green Transit' },
  { src: slider5, alt: 'State-wide eco initiative',           caption: 'Eco Initiatives' },
  { src: slider6, alt: 'Cleaner city in Rajasthan',           caption: 'Cleaner Cities' },
  { src: slider7, alt: 'Rajasthan natural heritage',          caption: 'Natural Heritage' },
];

interface Props {
  images?: SliderImage[];
  speed?: number;
}

export const InfiniteImageSlider: React.FC<Props> = ({
  images = defaultSliderImages,
  speed = 40,
}) => {
  const tiles = [...images, ...images];

  return (
    <section
      aria-label="Image gallery of Rajasthan environmental initiatives"
      className="relative w-full overflow-hidden py-3 sm:py-4"
    >
      <span className="sr-only">Auto-scrolling image gallery. Hover to pause.</span>

      <div className="relative group">
        {/* Left + right gradient fade overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 z-10 bg-gradient-to-r from-[#E4DFB5]/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 z-10 bg-gradient-to-l from-[#E4DFB5]/90 to-transparent" />

        <div
          className="flex w-max gap-3 sm:gap-5 md:gap-6 animate-marquee"
          style={{ animationDuration: `${speed}s` }}
        >
          {tiles.map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[140px] h-[90px] sm:w-[200px] sm:h-[130px] md:w-[260px] md:h-[160px] rounded-2xl overflow-hidden shadow-lg bg-[#FFFDF1]"
              style={{ border: '1px solid rgba(6, 64, 43, 0.12)' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-[#06402B]/75 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfiniteImageSlider;
