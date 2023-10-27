import type {HomepageFeaturedProductsQuery} from 'storefrontapi.generated';
import {ProductCard, Section} from '~/components';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = HomepageFeaturedProductsQuery & {
  title?: string;
  count?: number;
};

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 3,
  ...props
}: ProductSwimlaneProps) {

  const limitedProducts = products.nodes.slice(0, count);
  
  return (
    <section className='w-full p-4 pt-8 lg:pt-0 lg:pb-24 lg:pt-10 border-none product-recommendation px-[0.5rem]' {...props}>
      <div className="section-header my-[2rem] lg:max-w-[70%] ">
        <h3 className="font-heading">{title}</h3>
        <p>Here are some more items we think you'll love</p>
      </div>
      <div className="lg:gap-x-6 grid-cols-2 lg:grid-cols-3 grid md:pb-8 md:px-8 lg:px-12">
        {limitedProducts.map((product, i) => (
          <ProductCard
            product={product}
            key={product.id}
            className="snap-start mx-[0.5rem]"
          />
        ))}
      </div>
    </section>
  );
}
