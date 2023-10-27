import {Image} from '@shopify/hydrogen';

export function Headline({...props}: {[key: string]: any}) {
  const {} = props;
  return (
    <div className="text-center lg:py-[100px]">
      <h3 className="m-0 inline">Headline for this section</h3>
    </div>
  );
}
