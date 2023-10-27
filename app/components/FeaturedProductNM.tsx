function FeaturedProductNM({...props}) {
  const {title, thecollection, button_label, button_link} = props;

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md w-[200px] ">
      <div
        className="h-48 bg-cover bg-center"
        style={{backgroundImage: `url(${thecollection})`}}
      />
      <div className=" bottom-0 left-0 right-0 bg-white bg h-48 bg-opacity-70 text-white p-4">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {thecollection && (
          <p className="text-white mb-4">Collection: {thecollection}</p>
        )}
        <a
          href={button_link}
          className="bg-black text-white py-2 px-4 rounded-lg text-sm font-semibold"
        >
          {button_label}
        </a>
      </div>
    </div>
  );
}

export default FeaturedProductNM;
