import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {Image} from '@shopify/hydrogen';

export function LaBande({...props}) {
  const {title} = props;

  const generateSlides = () => {
    const slides = [];

    for (let i = 1; i <= 3; i++) {
      const imageKey = `labande_${i}_image`;
      const videoKey = `labande_${i}_video`;
      const headlineKey = `labande_${i}_headline`;
      const buttonKey = `labande_${i}_button`;
      const linkKey = `labande_${i}_link`;
      const dHeadlineKey = `labande_${i}_d_headline`;
      const dTextKey = `labande_${i}_d_text`;
      const alignKey = `labande_${i}_align`;
      const valignKey = `labande_${i}_valign`;
      const colorKey = `labande_${i}_color`;
      const mHeadlineKey = `labande_${i}_m_headline`;
      const mTextKey = `labande_${i}_m_text`;
      const mAlignKey = `labande_${i}_m_align`;
      const mValignKey = `labande_${i}_m_valign`;
      const mColorKey = `labande_${i}_m_color`;

      const image = props[imageKey];
      const video = props[videoKey];
      const headline = props[headlineKey];
      const button = props[buttonKey];
      const link = props[linkKey];
      const dHeadline = props[dHeadlineKey];
      const dText = props[dTextKey];
      const align = props[alignKey];
      const valign = props[valignKey];
      const color = props[colorKey];
      const mHeadline = props[mHeadlineKey];
      const mText = props[mTextKey];
      const mAlign = props[mAlignKey];
      const mValign = props[mValignKey];
      const mColor = props[mColorKey];

      slides.push(
        <SwiperSlide color={color} key={i}>
          <a href={link} className="" rel="noreferrer">
            <div style={{textAlign: align, alignSelf: valign}}>
              {image && (
                <Image
                  data={image}
                  alt=""
                  className="w-full h-[200px] object-cover"
                />
              )}
              {video && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={video}
                  className="w-full h-[200px] object-cover"
                  controls
                />
              )}
              {dHeadline && <h4>{'headline'}</h4>}
              {dText && <span>{button}</span>}
            </div>
          </a>
          {mHeadline && (
            <h4 style={{color: mColor, textAlign: mAlign, alignSelf: mValign}}>
              {headline}
            </h4>
          )}
          {mText && (
            <span
              style={{color: mColor, textAlign: mAlign, alignSelf: mValign}}
            >
              {button}
            </span>
          )}
        </SwiperSlide>,
      );
    }

    return slides;
  };

  return (
    <div className="px-[1rem] py-[2.5rem] lg:py-[5rem] lg:px-[3rem]">
      <h3 className="m-0 lg:mb-[5rem] text-center lg:text-[4.3rem] lg:leading-[calc(4.3rem+4px)] text-[calc(4.3rem*0.5875)] leading-[calc(4.3rem*0.75)]">{title}</h3>
      <Swiper
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {generateSlides()}
      </Swiper>
    </div>
  );
}
