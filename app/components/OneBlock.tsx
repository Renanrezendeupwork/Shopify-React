export const OneBlock = ({...props}) => {
  const {
    image,
    video,
    headline,
    button,
    link,
    d_headline,
    d_text,
    align,
    valign,
    color,
    m_headline,
    m_text,
    m_align,
    m_valign,
    m_color,
  } = props;

  const imageContainerStyle = {
    textAlign: align,
    alignSelf: valign,
  };

  const overlayStyle = {
    backgroundColor: color,
  };

  const buttonStyle = {
    color: m_color,
    textAlign: m_align,
    alignSelf: m_valign,
  };

  return (
    <div className="overflow-hidden lg:h-[100vh]">
      {link && (
        <a href={link} className="relative flex h-full text-black" style={imageContainerStyle}>
          {video ? (
            <video controls>
              <source src={video} />
              <track kind="captions" srcLang="en" label="English Captions" />
            </video>
          ) : (
            <img src={image} alt="" className="w-full h-full object-cover absolute block object-top top-0 left-0" />
          )}
          
          <div className="text-black m-[2rem] relative w-full self-center text-left" style={overlayStyle}>
            {d_headline && <h1 className="text-black mb-[1rem] text-[4rem] tracking-[.02rem]">{headline}</h1>}
            {d_text && <p className="text-[1.1rem] leading-[1.5] uppercase tracking-[.2rem] inline-block">{button}</p>}
          </div>
        </a>
      )}
    </div>
  );
};
