import {Image} from '@shopify/hydrogen';

import {parseImgUrl} from '../helpers';

const TwoBlock = ({...props}) => {
  const {
    gap_between,
    reverse_mobile,
    overlay_background,
    overlay_background_opacity,
    two_block_1_image,
    two_block_1_video,
    two_block_1_headline,
    two_block_1_button,
    two_block_1_link,
    two_block_1_d_headline,
    two_block_1_d_text,
    two_block_1_align,
    two_block_1_valign,
    two_block_1_color,
    two_block_1_size,
    two_block_1_m_headline,
    two_block_1_m_text,
    two_block_1_m_align,
    two_block_1_m_valign,
    two_block_1_m_color,
    two_block_2_image, // Include two_block_2_image here
    two_block_2_image_mobile,
    two_block_2_video,
    two_block_2_headline,
    two_block_2_button,
    two_block_2_link,
    two_block_2_d_headline,
    two_block_2_d_text,
    two_block_2_align,
    two_block_2_valign,
    two_block_2_color,
    two_block_2_size,
    two_block_2_m_headline,
    two_block_2_m_text,
    two_block_2_m_align,
    two_block_2_m_valign,
    two_block_2_m_color,
  } = props;

  type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

  type GapValue = string | number;
  const containerStyle = {
    flexDirection: (reverse_mobile ? 'row-reverse' : 'row') as FlexDirection,
    gap: (gap_between ? '20px' : '0') as GapValue,
  };

  const overlayStyle = {
    backgroundColor: overlay_background,
    opacity: overlay_background_opacity,
  };

  const imageStyle = {
    backgroundImage: `url(${two_block_1_image})`,
    textAlign: two_block_1_align,
    alignSelf: two_block_1_valign,
  };

  const imageStyleMobile = {
    backgroundImage: `url(${two_block_2_image_mobile})`,
    textAlign: two_block_2_align,
    alignSelf: two_block_2_valign,
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center w-full lg:flex-row">
        {two_block_1_link && (
          <a
            href={two_block_1_link}
            className="bg-zinc-200 block-one bg-cover bg-center mb-[1.5rem] flex relative h-full w-full lg:mb-0 lg:w-[50%]"
            style={{
              ...imageStyle,
              color: two_block_1_color,
              flex: two_block_1_size,
            }}
          >
            <div className="absolute self-center w-full p-8 m-0 text-left text-white lg:self-end">
              {two_block_1_d_headline && (
                <h1 className="text-white text-[4rem] mx-0 mb-[1rem] tracking-[.02rem]">
                  {two_block_1_headline}
                </h1>
              )}
              {two_block_1_d_text && (
                <p className="text-white text-[1.1rem] leading-[1.5] uppercase tracking-[.2rem] inline-block">
                  {two_block_1_button}
                </p>
              )}
            </div>
            {two_block_1_video && (
              <video controls>
                <source src={two_block_1_video} />
                <track kind="captions" srcLang="en" label="English Captions" />
              </video>
            )}
            {two_block_1_image && (
              <Image src={two_block_1_image} alt="Block One Image" />
            )}
          </a>
        )}
        {two_block_2_link && (
          <a
            href={two_block_2_link}
            className="bg-orange-100 block-two bg-cover bg-center mb-[1.5rem] flex relative min-h-[100vh] h-full w-full lg:mb-0 lg:w-[50%]"
            style={{
              ...imageStyleMobile,
              color: two_block_2_color,
              flex: two_block_2_size,
            }}
          >
            <div className="absolute self-center w-full p-8 m-0 text-left text-white">
              {two_block_2_d_headline && (
                <h1 className="text-white text-[4rem] mx-0 mb-[1rem] tracking-[.02rem]">
                  {two_block_2_headline}
                </h1>
              )}
              {two_block_2_d_text && (
                <p className="text-white text-[1.1rem] leading-[1.5] uppercase tracking-[.2rem] inline-block">
                  {two_block_2_button}
                </p>
              )}
            </div>
            {two_block_2_video && (
              <video controls>
                <source src={two_block_2_video} />
                <track kind="captions" srcLang="en" label="English Captions" />
              </video>
            )}
            {two_block_2_image && (
              <Image data={two_block_2_image} alt="Block Two Image" />
            )}
          </a>
        )}
        {two_block_1_m_headline && (
          <h1
            className="hidden mobile-headline"
            style={{
              textAlign: two_block_1_m_align,
              alignSelf: two_block_1_m_valign,
              color: two_block_1_m_color,
            }}
          >
            {two_block_1_headline}
          </h1>
        )}
        {two_block_1_m_text && (
          <p
            className="hidden mobile-text"
            style={{
              textAlign: two_block_1_m_align,
              alignSelf: two_block_1_m_valign,
              color: two_block_1_m_color,
            }}
          >
            {two_block_1_button}
          </p>
        )}
        {two_block_2_m_headline && (
          <h1
            className="hidden mobile-headline"
            style={{
              textAlign: two_block_2_m_align,
              alignSelf: two_block_2_m_valign,
              color: two_block_2_m_color,
            }}
          >
            {two_block_2_headline}
          </h1>
        )}
        {two_block_2_m_text && (
          <p
            className="hidden mobile-text"
            style={{
              textAlign: two_block_2_m_align,
              alignSelf: two_block_2_m_valign,
              color: two_block_2_m_color,
            }}
          >
            {two_block_2_button}
          </p>
        )}
        <div className="overlay" style={overlayStyle}></div>
      </div>
    </div>
  );
};

export {TwoBlock};
