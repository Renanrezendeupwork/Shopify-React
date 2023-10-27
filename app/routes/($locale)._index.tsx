import {useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import type {ReactNode} from 'react';

import {OneBlock, Tiles, LaBande, HeadingComponent} from '~/components';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {TwoBlock} from '~/components/twoBlock';
import FeaturedProductNM from '~/components/FeaturedProductNM';

import handler from '../api/settings';
export const headers = routeHeaders;

type Section = {
  [type: string]: (props: any) => ReactNode;
};

export async function loader({params, context}: LoaderArgs) {
  const {language, country} = context.storefront.i18n;
  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const settings = await handler(context?.env);
  const seo = seoPayload.home();

  return defer({
    settings,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

const sections: Section = {
  labande: LaBande,
  'one-block': OneBlock,
  'two-block': TwoBlock,
  'featured-products': FeaturedProductNM,
  heading: HeadingComponent,
  tiles: Tiles,
};

export default function Homepage() {
  const {settings} = useLoaderData<typeof loader>();

  const Sections = () => {
    const metaFields = settings as any;
    return metaFields?.current?.content_for_index.map(
      (item: string, index: number) => {
        const section = metaFields?.current?.sections[item];
        const Section = sections?.[section.type];
        if (!Section) return null;
        return (
          <Section key={item} type={section.type} {...section?.settings} />
        );
      },
    );
  };
  return <>{!!settings && <Sections />}</>;
}
