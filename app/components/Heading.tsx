type Props = {
  text: string;
  type: string;
};

export const HeadingComponent = ({type, ...props}: Props) => {
  return (
    <section className="justify-center relative flex text-center px-[3rem] py-[3.5rem] lg:min-h-[6.4rem] lg:pt-[5rem] lg:px-[20%] lg:pb-[7rem]">
      <h2 className="text-center font-normal mt-[3.7rem] mb-[1rem] tracking-[.02rem] text-[calc(4.3rem*0.5875)] leading-[calc(4.3rem*0.75)] lg:leading-[4.6rem] lg:mb-[1.5rem] lg:text-[3.2rem]">
        {props?.text || 'No text here '}
      </h2>
      <div className="line line1 absolute w-[8rem] left-[-5px] bottom-[-1rem] lg:left-[0] lg:bottom-[1rem] lg:opacity-1 z-[-1]">
        <img
          src="//lalignenyc.com/cdn/shop/t/188/assets/EditorialModule_mark_01.png?v=160288331501263910991674499754"
          alt=""
        />
      </div>
      <div className="line line2 absolute w-[8rem] right-0 top-[11rem] lg:opacity-1 z-[-1] hidden lg:block">
        <img
          src="//lalignenyc.com/cdn/shop/t/188/assets/EditorialModule_mark_02.png?v=169875825055282146131674499754"
          alt=""
        />
      </div>
      <div className="line line3 absolute w-[8rem] left-0 bottom-[7rem] lg:opacity-1 z-[-1]">
        <img
          src="//lalignenyc.com/cdn/shop/t/188/assets/EditorialModule_mark_03.png?v=42675742452778304351674499754"
          alt=""
        />
      </div>
      <div className="line line4 absolute w-[10rem] right-[-20px] lg:w-[12rem] lg:top-[1rem] lg:right-[10rem] lg:opacity-1 z-[-1]">
        <img
          src="//lalignenyc.com/cdn/shop/t/188/assets/EditorialModule_mark_04.png?v=91464416974628594221674499753"
          alt=""
        />
      </div>
      <div className="line line5 absolute w-[7rem] right-[2rem] top-[2rem] lg:opacity-1 z-[-1] hidden lg:block">
        <img
          src="//lalignenyc.com/cdn/shop/t/188/assets/EditorialModule_mark_05.png?v=67904396247386600381674499754"
          alt=""
        />
      </div>
    </section>
  );
};
