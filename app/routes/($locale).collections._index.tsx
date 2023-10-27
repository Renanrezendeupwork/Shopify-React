import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {Image, Pagination, getPaginationVariables} from '@shopify/hydrogen';

import {
  Grid,
  Heading,
  PageHeader,
  Section,
  Link,
  Button,
  Text,
} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const PAGINATION_SIZE = 100;

export const headers = routeHeaders;

export const loader = async ({request, context: {storefront}}: LoaderArgs) => {
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json({collections, seo});
};

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <>
      <Section>
        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <Grid
                items={nodes.length === 3 ? 3 : 2}
                data-test="collection-grid"
              >
                {nodes.map((collection, i) => (
                  <>
                    {collection.handle !== 'frontpage' && (
                      <CollectionCard
                        collection={collection as Collection}
                        key={collection.id}
                        loading={getImageLoadingPriority(i, 2)}
                      />
                    )}
                  </>
                ))}
              </Grid>
            </>
          )}
        </Pagination>
      </Section>
    </>
  );
}

function CollectionCard({
  collection,
  loading,
}: {
  collection: Collection;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <>
      {collection?.image && (
        <Link
          to={`/collections/${collection.handle}`}
          className="relative mb-8"
        >
          <div className="card-image bg-primary/5 aspect-auto">
            <Image
              data={collection.image}
              sizes="(max-width: 32em) 100vw, 45vw"
              loading={loading}
            />
          </div>

          <div className="px-8 pt-[2.4rem] pb-8 lg:absolute lg:left-[8.5%] lg:top-1/2 text-center lg:text-left text-black lg:text-white	lg:-translate-y-1/2">
            <Heading
              as="h3"
              size="title"
              className="text-[2.5rem] mb-8 lg:text-[3.2rem]"
            >
              {collection.title}
            </Heading>

            <Text
              format
              width="narrow"
              as="p"
              size="copy"
              className={`inline-block mt-2 mb-4 ${
                collection.description == '' ? 'hidden' : ''
              }`}
            >
              {collection.description}
            </Text>

            <div className="relative">
              <Text
                format
                width="narrow"
                as="span"
                className="text-[1.2rem] lg:text-[1.1rem] inline-block mt-4 uppercase tracking-[0.15rem]"
              >
                See the full story
              </Text>
              <svg
                viewBox="0 0 115.186 2.548"
                className="m-auto lg:ml-0 w-[16rem] lg:w-[15rem]"
              >
                <path
                  className="fill-[#000] stroke-[#000] lg:fill-[#FFFFFF] lg:stroke-[#FFFFFF]"
                  d="M115.057,0.61A1.8,1.8,0,0,0,114.4.39c-1.238-.069-2.477-0.116-3.715-0.163-0.354-.013-0.708,0-1.063,0V0.265c-1.181,0-2.362-.006-3.543,0a9.545,9.545,0,0,0-1.059.071c-1.406.167-2.807,0.367-4.215,0.512-1,.1-2,0.136-3,0.2-0.764.052-1.53,0.089-2.292,0.172q-1.848.2-3.69,0.454a19.952,19.952,0,0,1-3.178.113c-2.362-.049-4.721-0.159-7.082-0.222a10.854,10.854,0,0,1-2.109-.212A18.3,18.3,0,0,0,74.166.992c-1.3.089-2.59,0.188-3.886,0.272A4.471,4.471,0,0,1,69.4,1.252c-2.057-.27-4.126-0.211-6.191-0.283-1.3-.045-2.595-0.134-3.892-0.184C58.253,0.744,57.19.722,56.128,0.709a26.243,26.243,0,0,1-4.94-.321,14.418,14.418,0,0,0-3.356-.16c-0.767.026-1.535,0.021-2.3,0.024-2.361.013-4.722,0.034-7.084,0.027a18.044,18.044,0,0,1-2.47-.142A13.222,13.222,0,0,0,33.5.013c-0.531.024-1.063,0.043-1.594,0.027A8.713,8.713,0,0,0,30.157.2c-1.1.189-2.222,0.3-3.338,0.406C25,0.782,23.171.921,21.347,1.077c-0.353.03-.7,0.072-1.057,0.109a2.623,2.623,0,0,1-.7.064,22.252,22.252,0,0,0-3.89-.128c-2.539-.007-5.078.015-7.616,0.088-1.353.039-2.709,0.162-4.053,0.336A8.645,8.645,0,0,1,.868,1.469a1.641,1.641,0,0,0-.688.036A0.361,0.361,0,0,0,0,1.776a0.333,0.333,0,0,0,.122.282,3.4,3.4,0,0,0,.823.3,5.321,5.321,0,0,0,1.233.109A31.373,31.373,0,0,0,6.767,2.2a7.1,7.1,0,0,1,1.587-.111c1.89,0.046,3.777-.036,5.665-0.073,1.712-.034,3.423-0.028,5.135-0.04a21.116,21.116,0,0,0,3-.137,13.571,13.571,0,0,1,1.592-.075,14.145,14.145,0,0,0,3.168-.3A2.281,2.281,0,0,1,27.444,1.4C29.332,1.353,31.2,1.063,33.1,1.085c1.533,0.018,3.068-.038,4.6-0.032a18.169,18.169,0,0,1,2.47.162,9.675,9.675,0,0,0,2.292.015,12.764,12.764,0,0,1,2.824.016,5.224,5.224,0,0,0,1.585.008,14.4,14.4,0,0,1,4.238-.041c2.178,0.225,4.356.291,6.539,0.369,2.241,0.08,4.48.227,6.72,0.345,0.354,0.018.708,0.053,1.061,0.055,2.244,0.011,4.489.024,6.732,0.013,0.707,0,1.415-.061,2.12-0.117a13.454,13.454,0,0,1,4.229.145c0.515,0.122,1.053.151,1.573,0.259a6.024,6.024,0,0,0,1.762.1,36.685,36.685,0,0,1,6.017.106,25.25,25.25,0,0,0,4.947-.158c1.758-.21,3.52-0.341,5.288-0.453a19.988,19.988,0,0,0,3.868-.39,3.3,3.3,0,0,1,.7-0.094c2.359-.1,4.706-0.4,7.074-0.37,1.479,0.016,2.949.134,4.419,0.271a1.171,1.171,0,0,0,.854-0.115A0.441,0.441,0,0,0,115.185.9,0.356,0.356,0,0,0,115.057.61"
                ></path>
              </svg>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          id
          url
          width
          height
          altText
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
