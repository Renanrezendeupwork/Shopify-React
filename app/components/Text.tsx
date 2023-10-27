import clsx from 'clsx'
import {Image} from '@shopify/hydrogen'
import {Carousel} from 'react-responsive-carousel'

import {missingClass, formatText} from '~/lib/utils'

export function Text ({
  as: Component = 'span',
  className,
  color = 'default',
  format,
  size,
  width = 'default',
  children,
  ...props
}: {
  as?: React.ElementType
  className?: string
  color?: 'default' | 'primary' | 'subtle' | 'notice' | 'contrast'
  format?: boolean
  size?: 'lead' | 'copy' | 'fine'
  width?: 'default' | 'narrow' | 'wide'
  children: React.ReactNode
  [key: string]: any
}) {
  const colors: Record<string, string> = {
    default: 'inherit',
    primary: 'text-primary/90',
    subtle: 'text-primary/50',
    notice: 'text-notice',
    contrast: 'text-contrast/90',
  }

  const sizes: Record<string, string> = {
    lead: 'text-lead',
    copy: 'text-copy',
    fine: 'text-fine subpixel-antialiased',
  }

  const widths: Record<string, string> = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  }

  const styles = clsx(
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'text-') && colors[color],
    sizes[size],
    className,
  )

  return (
    <Component {...props} className={styles}>
      {format ? formatText(children) : children}
    </Component>
  )
}

export function Heading ({
  as: Component = 'h2',
  children,
  className = '',
  format,
  size = 'heading',
  width = 'default',
  ...props
}: {
  as?: React.ElementType
  children: React.ReactNode
  format?: boolean
  size?: 'display' | 'heading' | 'lead' | 'copy'
  width?: 'default' | 'narrow' | 'wide'
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const sizes = {
    display: 'font-bold text-display',
    heading: 'font-heading text-heading',
    lead: 'font-bold text-lead',
    copy: 'font-medium text-copy',
    title: 'font-heading',
  }

  const widths = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  }

  const styles = clsx(
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'font-') && sizes[size],
    className,
  )

  return (
    <Component {...props} className={styles}>
      {format ? formatText(children) : children}
    </Component>
  )
}

export function Section ({
  as: Component = 'section',
  children,
  className,
  divider = 'none',
  display = '',
  heading,
  padding = 'all',
  ...props
}: {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  divider?: 'none' | 'top' | 'bottom' | 'both'
  display?: 'grid' | 'flex'
  heading?: string
  padding?: 'x' | 'y' | 'swimlane' | 'all'
  [key: string]: any
}) {
  const paddings = {
    x: 'px-6 md:px-8 lg:px-12',
    y: 'py-6 md:py-8 lg:py-10',
    swimlane: 'pt-4 md:pt-8 lg:pt-12 md:pb-4 lg:pb-8',
    all: 'p-4 pt-8 lg:p-12 lg:pb-24 lg:pt-10',
  }

  const dividers = {
    none: 'border-none',
    top: 'border-t border-primary/05',
    bottom: 'border-b border-primary/05',
    both: 'border-y border-primary/05',
  }

  const displays = {
    flex: 'flex',
    grid: 'grid',
  }

  const styles = clsx(
    'w-full',
    displays[display],
    missingClass(className, '\\mp[xy]?-') && paddings[padding],
    dividers[divider],
    className,
  )

  return (
    <Component {...props} className={styles}>
      {heading && (
        <Heading size='lead' className={padding === 'y' ? paddings['x'] : ''}>
          {heading}
        </Heading>
      )}
      {children}
    </Component>
  )
}

export function PageHeader ({
  children,
  className,
  heading,
  variant = 'default',
  ...props
}: {
  children?: React.ReactNode
  className?: string
  heading?: string
  variant?: 'default' | 'blogPost' | 'allCollections'
  [key: string]: any
}) {
  const variants: Record<string, string> = {
    default: 'grid w-full gap-4 md:pt-8 lg:pt-32 justify-items-center',
    blogPost:
      'grid md:text-center w-full gap-4 p-6 py-8 md:p-8 lg:p-12 md:justify-items-center',
    allCollections:
      'flex justify-between items-baseline gap-8 p-6 md:p-8 lg:p-12',
  }

  const styles = clsx(variants[variant], className)

  return (
    <header {...props} className={styles}>
      {heading && (
        <Heading as='h1' width='narrow' size='heading' className='inline-block'>
          {heading}
        </Heading>
      )}
      {children}
    </header>
  )
}

export function CollectionHeader ({
  children,
  className,
  heading,
  image,
  variant = 'default',
  ...props
}: {
  children?: React.ReactNode
  className?: string
  heading?: string

  variant?: 'default'
  [key: string]: any
}) {
  const variants: Record<string, string> = {
    default: 'grid w-full gap-4 md:pt-8 lg:pt-0 justify-items-center',
  }

  const styles = clsx(variants[variant], className)

  return (
    <header {...props} className={styles}>
      {image && (
        <Image
          alt={heading}
          data={image}
          sizes='(min-width: 100em) 100vw, 100vw'
        />
      )}

      {heading && (
        <Heading
          as='h1'
          width='narrow'
          size='heading'
          className='inline-block pt-[4.4rem] md:pt-28'
        >
          {heading}
        </Heading>
      )}

      {children}
    </header>
  )
}

export function CollectionHeaderWithSlider ({
  children,
  className,
  heading,
  image,
  slideimages,
  variant = 'default',
  ...props
}: {
  children?: React.ReactNode
  className?: string
  heading?: string
  variant?: 'default'
  [key: string]: any
}) {
  const variants: Record<string, string> = {
    default: 'grid w-full gap-4 md:pt-8 lg:pt-0 justify-items-center',
  }

  const styles = clsx(variants[variant], className)
  return (
    <header {...props} className={styles}>
      {slideimages ? (
        <Carousel>
          {slideimages.map((ele, index) => {
            return (
              <div key={index}>
                <img src={ele} />
              </div>
            )
          })}
        </Carousel>
      ) : (
        image && (
          <Image
            alt={heading}
            data={image}
            sizes='(min-width: 100em) 100vw, 100vw'
          />
        )
      )}

      {heading && (
        <Heading
          as='h1'
          width='narrow'
          size='heading'
          className='inline-block pt-[4.4rem] md:pt-28'
        >
          {heading}
        </Heading>
      )}

      {children}
    </header>
  )
}
export function FooterSection ({
  as: Component = 'footer',
  children,
  className,
  divider = 'none',
  display = 'grid',
  heading,
  padding = 'all',
  ...props
}: {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  divider?: 'none' | 'top' | 'bottom' | 'both'
  display?: 'grid' | 'flex'
  heading?: string
  padding?: 'x' | 'y' | 'swimlane' | 'all'
  [key: string]: any
}) {
  const paddings = {
    x: '',
    y: '',
    swimlane: '',
    all: '',
  }

  const dividers = {
    none: 'border-none',
    top: 'border-t border-primary/05',
    bottom: 'border-b border-primary/05',
    both: 'border-y border-primary/05',
  }

  const displays = {
    flex: 'flex',
    grid: 'grid',
  }

  const styles = clsx(
    'w-full',
    missingClass(className, '\\mp[xy]?-') && paddings[padding],
    // dividers[divider],
    className,
  )

  return (
    <Component {...props} className={styles}>
      {heading && (
        <Heading size='lead' className={padding === 'y' ? paddings['x'] : ''}>
          {heading}
        </Heading>
      )}
      {children}
    </Component>
  )
}
