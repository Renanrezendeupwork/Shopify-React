import type {MediaFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState, useRef, useEffect} from 'react';
// import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {Pagination} from 'swiper/modules';
import SwiperCore from 'swiper';

SwiperCore.use([Pagination]);

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGalleryThumbs({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  if (!media.length) {
    return null;
  }

  const mainImageContainerRef = useRef<HTMLDivElement>(null);
  
  const [isActive, setIsActiveThumb] = useState('');
  return (
    <>
      <div className="md:top-nav md:-translate-y-nav md:pt-nav hiddenScroll md:overflow-y-scroll product-thumbs sticky">
        {media.map((med, i) => {
          const isFirst = i === 0;
          const isFourth = i === 3;

          const image =
            med.__typename === 'MediaImage'
              ? {...med.image, altText: med.alt || 'Product image'}
              : null;

          const style = [
            'md:col-span-1',
            'cursor-pointer snap-center thumb-item bg-white dark:bg-contrast/10 w-mobileGallery md:w-full mb-[0.8rem]',
          ].join(' ');

          const handleThumbnailClick = (m: MediaFragment, index: number) => {
            setIsActiveThumb(m.id);
            
            if (mainImageContainerRef.current) {
              const mainImages =
                mainImageContainerRef.current.querySelectorAll(
                  '.product-image',
                );
              if (mainImages && mainImages.length > index) {
                const targetImage = mainImages[index];
                targetImage.scrollIntoView({behavior: 'smooth'});
              }
            }
          };
          return (
            <div
              onClick={(e) => handleThumbnailClick(med, i)}
              key={med.id || image?.id}
              className={isActive === med.id ? `thumb-active ${style}`: `${style}`}
            >
              {image && (
                <Image
                  loading={i === 0 ? 'eager' : 'lazy'}
                  data={image}
                  aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                  sizes={
                    isFirst || isFourth
                      ? '(min-width: 48em) 60vw, 90vw'
                      : '(min-width: 48em) 30vw, 90vw'
                  }
                  className="object-cover w-full h-full fadeIn"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="w-full md:top-nav product-gallery">
        <div ref={mainImageContainerRef} className="hidden lg:block">
          {media.map((med, i) => {
            const isFirst = i === 0;
            const isFourth = i === 3;
            const image =
              med.__typename === 'MediaImage'
                ? {...med.image, altText: med.alt || 'Product image'}
                : null;

            const style = [
              'md:col-span-1',
              'card-image product-image dark:bg-contrast/10 lg:mb-12 mx-auto',
            ].join(' ');

            return (
              <div key={med.id || image?.id} className={style}>
                {image && (
                  <Image
                    loading={i === 0 ? 'eager' : 'lazy'}
                    data={image}
                    aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                    sizes={
                      isFirst || isFourth
                        ? '(min-width: 48em) 60vw, 90vw'
                        : '(min-width: 48em) 30vw, 90vw'
                    }
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="lg:hidden">
          <Swiper
            slidesPerView={1}
            loop={true}
            init={false}
            pagination={{clickable: true}}
            breakpoints={{
              979: {
                slidesPerView: 1,
                allowTouchMove: false,
                keyboard: false,
                mousewheel: false,
              },
            }}
          >
            {media.map((med, i) => {
              const isFirst = i === 0;
              const isFourth = i === 3;
              const image =
                med.__typename === 'MediaImage'
                  ? {...med.image, altText: med.alt || 'Product image'}
                  : null;

              const style = [
                'md:col-span-1',
                'card-image dark:bg-contrast/10 w-full w-mobileGallery',
              ].join(' ');

              return (
                <SwiperSlide key={med.id || image?.id} className={style}>
                  {image && (
                    <Image
                      loading={i === 0 ? 'eager' : 'lazy'}
                      data={image}
                      aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                      sizes={
                        isFirst || isFourth
                          ? '(min-width: 48em) 60vw, 90vw'
                          : '(min-width: 48em) 30vw, 90vw'
                      }
                      className="object-cover"
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
}
