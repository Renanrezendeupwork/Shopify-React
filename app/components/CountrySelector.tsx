import {useFetcher, useLocation, useMatches} from '@remix-run/react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';
import type {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';

import {Heading, Button, IconCheck, IconCaret} from '~/components';
import type {Localizations, Locale} from '~/lib/type';
import {CartAction} from '~/lib/type';
import {DEFAULT_LOCALE} from '~/lib/utils';

export function CountrySelector() {
  const [root] = useMatches();
  const fetcher = useFetcher();
  const closeRef = useRef<HTMLDetailsElement>(null);
  const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const countries = (fetcher.data ?? {}) as Localizations;
  const defaultLocale = countries?.['default'];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : '';

  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === 'loading') return;
    fetcher.load('/api/countries');
  }, [inView, fetcher]);
    
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const handleCountryClick = () => {
    setIsCountryOpen(!isCountryOpen);
  };

  const closeDropdown = () => {
    setIsCountryOpen(false);
  };

  return (
    <section
    ref={observerRef}
    className="grid"
    >
      <div className="relative ">
        <details
          className="border rounded border-contrast/30 dark:border-white open:round-b-none overflow-clip"
          ref={closeRef}
        >
          <summary onClick={closeDropdown} className="uppercase flex tracking-[0.15rem] items-center text-[1.1rem] cursor-pointer">
            <div className='hidden lg:flex items-center'>
              <IconCaret className='duration-0' />
              {selectedLocale.country}
            </div>

            <div className='lg:hidden'>
              {selectedLocale.label}
            </div>
          </summary>

          <div className={`${setIsCountryOpen ? 'block' : 'none'} min-w-[22rem] p-4 z-20 fixed lg:absolute bottom-0 lg:bottom-auto lg:top-full left-0 lg:left-auto lg:right-0 overflow-auto b bg-white max-h-[80vh]`}>
            {countries &&
              Object.keys(countries).map((countryPath) => {
                const countryLocale = countries[countryPath];
                const isSelected =
                  countryLocale.language === selectedLocale.language &&
                  countryLocale.country === selectedLocale.country;

                const countryUrlPath = getCountryUrlPath({
                  countryLocale,
                  defaultLocalePrefix,
                  pathWithoutLocale,
                });

                return (
                  <Country
                    key={countryPath}
                    closeDropdown={closeDropdown}
                    countryUrlPath={countryUrlPath}
                    isSelected={isSelected}
                    countryLocale={countryLocale}
                  />
                );
              })}
          </div>
   
        </details>
      </div>
    </section>
  );
}

function Country({
  closeDropdown,
  countryLocale,
  countryUrlPath,
  isSelected,
}: {
  closeDropdown: () => void;
  countryLocale: Locale;
  countryUrlPath: string;
  isSelected: boolean;
}) {
  return (
    <ChangeLocaleForm
      key={countryLocale.country}
      redirectTo={countryUrlPath}
      buyerIdentity={{
        countryCode: countryLocale.country,
      }}
    >
      <Button
        className={clsx([
          'w-full px-[0.4rem] py-2 transition uppercase flex justify-start',
          'items-center mb-2 tracking-[0.2rem] text-left cursor-pointer text-[1.1rem]',
        ])}
        type="submit"
        variant="inline"
        onClick={closeDropdown}
      >
        {countryLocale.label}
      </Button>
    </ChangeLocaleForm>
  );
}

function ChangeLocaleForm({
  children,
  buyerIdentity,
  redirectTo,
}: {
  children: React.ReactNode;
  buyerIdentity: CartBuyerIdentityInput;
  redirectTo: string;
}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="post">
      <input
        type="hidden"
        name="cartAction"
        value={CartAction.UPDATE_BUYER_IDENTITY}
      />
      <input
        type="hidden"
        name="buyerIdentity"
        value={JSON.stringify(buyerIdentity)}
      />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {children}
    </fetcher.Form>
  );
}

function getCountryUrlPath({
  countryLocale,
  defaultLocalePrefix,
  pathWithoutLocale,
}: {
  countryLocale: Locale;
  pathWithoutLocale: string;
  defaultLocalePrefix: string;
}) {
  let countryPrefixPath = '';
  const countryLocalePrefix = `${countryLocale.language}-${countryLocale.country}`;

  if (countryLocalePrefix !== defaultLocalePrefix) {
    countryPrefixPath = `/${countryLocalePrefix.toLowerCase()}`;
  }
  return `${countryPrefixPath}${pathWithoutLocale}`;
}
