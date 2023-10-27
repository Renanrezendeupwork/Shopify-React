import {json, type LoaderArgs, type LinksFunction} from '@shopify/remix-oxygen'
import type {Page as PageType} from '@shopify/hydrogen/storefront-api-types'
import {useLoaderData} from '@remix-run/react'
import invariant from 'tiny-invariant'

import {Heading, Section} from '~/components'
import {routeHeaders} from '~/data/cache'
import {seoPayload} from '~/lib/seo.server'
import styles from '../styles/page.css'

export const headers = routeHeaders

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export async function loader ({request, params, context}: LoaderArgs) {
  invariant(params.pageHandle, 'Missing page handle')

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.pageHandle,
      language: context.storefront.i18n.language,
    },
  })

  if (!page) {
    throw new Response(null, {status: 404})
  }

  const seo = seoPayload.page({page, url: request.url})

  return json({page, seo})
}

export default function Page () {
  const {page} = useLoaderData<typeof loader>()
  return (
    <>
      <Section className='template-page lg:max-w-[70%] px-[1.5rem]'>
        <Heading as='h1' className='page-title my-[2rem] lg:my-[7.5rem]'>
          {page.title}
        </Heading>
        <div
          dangerouslySetInnerHTML={{__html: page.body}}
          className='page-content'
        />
      </Section>
    </>
  )
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`
