export const Tiles = ({...props}) => {
  const renderTile = (tileNumber: number, className: string) => {
    const tileImage = props[`tile_${tileNumber}_image`];
    const tileVideo = props[`tile_${tileNumber}_video`];
    const tileHeadline = props[`tile_${tileNumber}_headline`];
    const tileButton = props[`tile_${tileNumber}_button`];
    const tileLink = props[`tile_${tileNumber}_link`];
    const tileDHeadline = props[`tile_${tileNumber}_d_headline`];
    const tileDText = props[`tile_${tileNumber}_d_text`];
    const tileAlign = props[`tile_${tileNumber}_align`];
    const tileValign = props[`tile_${tileNumber}_valign`];
    const tileColor = props[`tile_${tileNumber}_color`];
    const tileMHeadline = props[`tile_${tileNumber}_m_headline`];
    const tileMText = props[`tile_${tileNumber}_m_text`];
    const tileMAlign = props[`tile_${tileNumber}_m_align`];
    const tileMValign = props[`tile_${tileNumber}_m_valign`];
    const tileMColor = props[`tile_${tileNumber}_m_color`];

    const imageStyle = {
      backgroundImage: `url(${tileImage})`,
      textAlign: tileAlign,
      alignSelf: tileValign,
    };

    const tileStyle = {
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      position: 'relative',
    };

    const overlayStyle = {
      backgroundColor: tileColor,
      padding: '16px',
    };

    const headlineStyle = {
      color: '#fff',
      fontSize: '4rem',
      margin: '0 0 1rem',
      letterSpacing: '0.02rem'
    };

    const buttonStyle = {
      fontSize: '16px',
      color: tileMColor,
      bottom: '20px',
      left: '20px',
      textAlign: tileMAlign,
      alignSelf: tileMValign,
    };

    return (
        <a key={`tile_${tileNumber}`} className={className}
          href={tileLink}
        >
          <div className="absolute top-0 left-0 w-full h-full block object-cover object-top" style={{...imageStyle}}>
            {tileVideo && (
              <video controls>
                <source src={tileVideo} />
                <track kind="captions" srcLang="en" label="English Captions" />
              </video>
            )}
          </div>
          <div style={overlayStyle}>
            {tileDHeadline && <h1 style={headlineStyle}>{tileHeadline}</h1>}
            {tileDText && <p className="text-white text-[1.1rem] leading-[1.5] uppercase tracking-[.2rem] inline-block">{tileButton}</p>}
          </div>
          {/* {tileMHeadline && (
          <h1 style={{...headlineStyle, ...buttonStyle}}>{tileHeadline}</h1>
        )}
        {tileMText && <p style={buttonStyle}>{tileButton}</p>} */}
        </a>
    );
  };

  return (
    <div className="grid gap-[1.5rem] lg:gap-[2rem] lg:grid-rows-[repeat(10,5.3vw)] lg:grid-cols-[repeat(3,1fr)]">
      {renderTile(
        1,
        'bg-orange-50 overflow-hidden relative flex h-[65vh] lg:h-full lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-7',
      )}
      {renderTile(
        2,
        'bg-orange-100 overflow-hidden relative flex h-[65vh] lg:h-full lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-6',
      )}
      {renderTile(
        3,
        'bg-orange-200 overflow-hidden relative flex h-[65vh] lg:h-full lg:col-start-1 lg:col-end-2 lg:row-start-7 lg:row-end-11',
      )}
      {renderTile(
        4,
        'bg-orange-50 overflow-hidden relative flex h-[65vh] lg:h-full lg:col-start-2 lg:col-end-3 lg:row-start-6 lg:row-end-11',
      )}
      {renderTile(
        5,
        'bg-orange-200 overflow-hidden relative flex h-[65vh] lg:h-full lg:col-start-3 lg:col-end-4 lg:row-start-6 lg:row-end-11',
      )}
    </div>
  );
};
