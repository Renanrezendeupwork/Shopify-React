import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {flattenConnection, Image} from '@shopify/hydrogen';
import {useState, useRef} from 'react';

import {
  Grid,
  Section,
  Link,
  Heading,
  Text,
  IconListView,
  IconClose,
  UnderlineLight,
} from '~/components';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import type {ArticleFragment} from 'storefrontapi.generated';

import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';

import EditorialModule_mark_01 from "~/images/EditorialModule_mark_01.png";
import EditorialModule_mark_02 from "~/images/EditorialModule_mark_02.png";
import EditorialModule_mark_03 from "~/images/EditorialModule_mark_03.png";
import EditorialModule_mark_04 from "~/images/EditorialModule_mark_04.png";
import EditorialModule_mark_05 from "~/images/EditorialModule_mark_05.png";

const BLOG_HANDLE = 'Journal';

export const headers = routeHeaders;
export const loader = async ({request, context: {storefront}}: LoaderArgs) => {
  const {language, country} = storefront.i18n;
  const {shop, blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      pageBy: PAGINATION_SIZE,
      language,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  const articles = flattenConnection(blog.articles).map((article) => {
    const {publishedAt} = article!;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt!)),
    };
  });

  const seo = seoPayload.blog({blog, url: request.url});

  return json({articles, seo, shop});
};

export default function Journals() {
  const {shop, articles} = useLoaderData<typeof loader>();

  const blogDescription =
    'They styled it. We shot it. Meet the women who make La Ligne their own.';
  const blogImage = {
    url: 'https://lalignenyc.com/cdn/shop/files/Teresa_La_Ligne_La_Bande_SEPT_2019_SET_2_5576_FINAL_BW_web_4d276bd2-7f13-44f8-8045-5cd96d0a5938_2048x2048.jpg?v=1613178229',
  };
  return (
    <>
      <BlogHeader
        heading={BLOG_HANDLE}
        text={blogDescription}
        image={blogImage}
      />
      <InlineContent />
      <FeaturedArticles articles={articles} />
      <ArticleList articles={articles} shop={shop} />
    </>
  );
}

function InlineContent(params: type) {
  return (
    <div className="relative">
      <div className="py-14 lg:py-16">
        <Text
          as="h4"
          className="uppercase mx-auto text-center my-4 lg:my-6 font-medium text-[1.1rem] tracking-[0.15rem]"
        >
          NEXT IN LINE
        </Text>
        
      </div>
      <div className="w-[8rem] z-[-1] left-0 bottom-4 absolute">
        <img src={EditorialModule_mark_01} />
      </div>
      <div className="w-[8rem] z-[-1] absolute right-0 top-[11rem]">
        <img src={EditorialModule_mark_02} />
      </div>
      <div className="w-[8rem] z-[-1] left-0 bottom-[7rem] absolute line3">
        <img src={EditorialModule_mark_03} />
      </div>
      <div className="w-[10rem] z-[-1] lg:w-[12rem] absolute -right-[20px] lg:right-[10rem] top-0 lg:top-4">
        <img src={EditorialModule_mark_04} />
      </div>
      <div className="w-[7rem] z-[-1] absolute right-8 top-8 lg:block hidden">
        <img src={EditorialModule_mark_05} />
      </div>
    </div>
  );
}

function FeaturedArticles({articles}) {
  const blogHandle = BLOG_HANDLE.toLowerCase();
  return (
    <div className="px-10 lg:px-16 mb-6 lg:mb-16">
      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: 'lg:hidden w-4 h-4 inline-block mx-2 rounded-full bullet-pagination'
        }}
        modules={[Pagination]}
        breakpoints={{
          980: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        {articles.slice(0, 3).map((article, i) => (
          <SwiperSlide key={i}>
            <Link to={`/${blogHandle}/${article.handle}`} className="relative">
              {article.image && (
                <div className="card-image">
                  <Image
                    alt={article.image.altText || article.title}
                    className=" h-[120vw] lg:h-[100vh] object-cover transition-[opacity_.2s_ease-in-out] hover:opacity-[0.9]"
                    data={article.image}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              )}
              <div className="absolute right-0 bottom-2 text-right m-8">
                <h3 className="mt-0 mb-4 font-heading text-[4rem] text-white">
                  {article.title}
                </h3>
                <Text
                  as="span"
                  className="uppercase text-[1.1rem] text-white tracking-[0.2rem] relative w-fit block ml-auto"
                >
                  View profile
                  <UnderlineLight />
                </Text>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function ArticleMenu({articles}) {
  // Sort articles by title
  const sortedArticles = articles.sort((a, b) => a.title.localeCompare(b.title));

  // Create columns
  const columnCount = 3;
  const columnSize = Math.ceil(sortedArticles.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    sortedArticles.slice(i * columnSize, (i + 1) * columnSize)
  );
  
  return (
    <div className="max-w-[85%] mx-auto pt-12 animate-fade-up animate-once animate-duration-500 animate-ease-in">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1">
          {column.map((article, articleIndex) => (
            <Link
              key={i}
              className="block text-left"
              to={`/${BLOG_HANDLE.toLowerCase()}/${article.handle}`}
            >
              <h2 className="mb-4 mt-0 text-[1.4rem] font-heading lg:text-[1.9rem]">
                {article.title}
              </h2>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

function ArticleList({shop, articles}) {
  const logo = shop.brand.logo?.image.url;
  const logoMobile = shop.brand.squareLogo?.image.url;
  const title = shop.title;

  let firstLettersArr = [];

  articles.map((article) => {
    let title = article.title;
    firstLettersArr.push(title.charAt(0));
  });

  let firstLettersUiq = [...new Set(firstLettersArr)];

  const sectionRefs = useRef({});
  const letterBarHeightRef = useRef({});

  const scrollToSection = (letter) => {
    const sectionId = `section-${letter}`;
    const sectionRef = sectionRefs.current[letter];

    const letterBarHeight = letterBarHeightRef.current.offsetHeight;
    const headerheight = 120;
    if (sectionRef) {
      const scrollPosition =
        sectionRef.offsetTop - headerheight - letterBarHeight;
      window.scrollTo({top: scrollPosition, behavior: 'smooth'});
    }
  };

  const [isArticleMenuOpen, setIsArticleMenuOpen] = useState(false);

  const handleArticleMenuClick = () => {
    setIsArticleMenuOpen(true);
  };

  const closeArticleMenu = () => {
    setIsArticleMenuOpen(false);
  };

  return (
    <>
      <div className="sticky w-full block text-center lg:flex justify-center items-center duration-300 top-[5.4rem] lg:top-[11.5rem] z-50 bg-white border-t border-b border-[#e5e5e5] mb-12">
        <div
          ref={letterBarHeightRef}
          className="py-6 inline-flex items-center gap-4 flex-wrap"
        >
          {firstLettersUiq.map((letter, i) => (
            <div
              key={i}
              onClick={() => scrollToSection(letter)}
              className="cursor-pointer uppercase font-heading"
            >
              {letter}
            </div>
          ))}
        </div>

        <button
          className="border-t border-[#e5e5e5] lg:border-t-0 justify-center w-full lg:w-auto flex items-center lg:absolute lg:right-6 p-6"
          onClick={handleArticleMenuClick}
        >
          <IconListView />
          View as List
        </button>

        {isArticleMenuOpen && (
          <div className="fixed overflow-auto w-full bg-white left-0 top-0 z-50 h-full animate-fade animate-ease-in animate-duration-200">
            <Link className="my-[1.2rem] block" to="/">
              {logo ? (
                <Image
                  className={`mx-auto ${logoMobile ? 'hidden lg:block' : null}`}
                  width={115}
                  height={39}
                  data={{url: logo}}
                  alt={title}
                />
              ) : null}
              {logoMobile ? (
                <Image
                  className="block mx-auto lg:hidden"
                  width={115}
                  height={39}
                  data={{url: logoMobile}}
                  alt={title}
                />
              ) : (
                {title}
              )}
            </Link>

            <button
              onClick={closeArticleMenu}
              className="absolute right-10 -translate-y-2/4 top-10"
            >
              <IconClose />
            </button>

            <ArticleMenu articles={articles} />
          </div>
        )}
      </div>

      <Section>
        {firstLettersUiq.map((letter, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[letter] = el)}
            id={`section-${letter}`}
            className="lg:flex first-of-type:mt-0 mt-12 lg:mt-14"
          >
            <Text
              as="p"
              className="mb-12 leading-9 font-heading uppercase lg:w-32 text-[3.2rem]"
            >
              {letter}
            </Text>

            <div className="grid w-full gap-x-8 gap-y-14 grid-cols-2 lg:grid-cols-5">
              {articles
                .sort((a, b) => a.title.localeCompare(b.title))
                .filter((article) => article.title.charAt(0) === letter)
                .map((article, i) => (
                  <div key={i}>
                    <ArticleCard
                      blogHandle={BLOG_HANDLE.toLowerCase()}
                      article={article}
                      key={article.id}
                      loading={getImageLoadingPriority(i, 2)}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}

function BlogHeader({heading, text, image}: {heading?: string; text?: string}) {
  return (
    <div className="relative">
      <div className="card-image -translate-x-[60%] w-[250%] lg:w-[100%]">
        {image && (
          <Image
            data={image}
            className="object-cover lg:max-w-[100%]"
            sizes="100vw"
          />
        )}
      </div>

      <div className="lg:absolute lg:left-[8.5%] lg:top-1/2 lg:-translate-y-1/2 lg:text-white z-10">
        {heading && (
          <Heading
            as="h1"
            width="wide"
            className="text-[2.5rem] mt-12 lg:mt-0 w-full text-center lg:text-left lg:text-[3.2rem] font-heading inline-block text-black lg:text-white"
          >
            {heading}
          </Heading>
        )}

        {text && (
          <Text as="p" className='hidden lg:block'>
            {text}
          </Text>
        )}
      </div>
    </div>
  );
}

function ArticleCard({
  blogHandle,
  article,
  loading,
}: {
  blogHandle: string;
  article: ArticleFragment;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <Link to={`/${blogHandle}/${article.handle}`}>
      {article.image && (
        <div className="card-image aspect-[245/277]">
          <Image
            alt={article.image.altText || article.title}
            className="object-cover w-full"
            data={article.image}
            aspectRatio="245/277"
            loading={loading}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      )}
      <h4 className="mt-4 text-[1.4rem] font-heading lg:text-[1.9rem]">
        {article.title}
      </h4>
    </Link>
  );
}

const BLOGS_QUERY = `#graphql
query Blog(
  $language: LanguageCode
  $blogHandle: String!
  $pageBy: Int!
  $cursor: String
) @inContext(language: $language) {
  blog(handle: $blogHandle) {
    title
    seo {
      title
      description
    }
    articles(first: $pageBy, after: $cursor) {
      edges {
        node {
          ...Article
        }
      }
    }
  }
  shop {
    id
    name
    brand {
      logo {
        image {
          url
        }
      }
      squareLogo {
        image {
          url
        }
      }
    }
  }
}

fragment Article on Article {
  author: authorV2 {
    name
  }
  contentHtml
  handle
  id
  image {
    id
    altText
    url
    width
    height
  }
  publishedAt
  title
}
`;
