import type {SyntheticEvent} from 'react';
import {useMemo, useState} from 'react';
import {Menu} from '@headlessui/react';
import type {Location} from '@remix-run/react';

import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import {useDebounce} from 'react-use';
import {Disclosure} from '@headlessui/react';
import type {
  FilterType,
  Filter,
  Collection,
} from '@shopify/hydrogen/storefront-api-types';

import {Drawer, Heading, IconCaret, IconXMark, Text, useDrawer} from '~/components';


export type AppliedFilter = {
  label: string;
  urlParam: {
    key: string;
    value: string;
  };
};

export type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured';

type Props = {
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
  children: React.ReactNode;
  collections?: Array<{handle: string; title: string}>;
};

export function SortFilter({
  filters,
  appliedFilters = [],
  children,
  collections = [],
}: Props) {
  
  const {
    isOpen: isFilterOpen,
    openDrawer: openFilter,
    closeDrawer: closeFilter,
  } = useDrawer();

  return (
    <>
      <div className="flex items-center gap-8 md:gap-16 justify-end w-full mb-10">
        <FilterMenu 
          collections={collections}
          filters={filters}
          appliedFilters={appliedFilters}
        />

        <FiltersDrawer  
          collections={collections}
          filters={filters}
          appliedFilters={appliedFilters}
          isOpen={isFilterOpen} onClose={closeFilter}
        />

        <button onClick={openFilter} className="flex items-center lg:hidden">
          <span className="px-2 text-fine">
            <span>Filter</span>
          </span>
          <IconCaret className='duration-0' direction={ isFilterOpen? 'up': 'down'} />
        </button>

        <SortMenu />

      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}

export function FiltersDrawer({
  filters = [],
  appliedFilters = [],
  collections = [],
  isOpen,
  onClose
}: Omit<Props, 'children'>) {
  const [params] = useSearchParams();
  const location = useLocation();

  const filterMarkup = (filter: Filter, option: Filter['values'][0]) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const min =
          params.has('minPrice') && !isNaN(Number(params.get('minPrice')))
            ? Number(params.get('minPrice'))
            : undefined;

        const max =
          params.has('maxPrice') && !isNaN(Number(params.get('maxPrice')))
            ? Number(params.get('maxPrice'))
            : undefined;

        return <PriceRangeFilter min={min} max={max} />;

      default:
        const to = getFilterLink(
          filter,
          option.input as string,
          params,
          location,
        );
          
        const filterActive = appliedFilters?.find((filter) => filter.label === option.label)
        
        const [isChecked, setIsChecked] = useState(filterActive !== undefined);
        const handleChange = () => {

          if (isChecked) {
            const toApplied = getAppliedFilterLink(filterActive, params, location)
            // navigate(`${toApplied}`);
          } else {
            // navigate(`${to}`);
          }

          setIsChecked(!isChecked);
        };
      
        return (
          <div className='flex items-center pb-[0.8rem]'>
            <input
              type="checkbox"
              id={option.id}
              checked={isChecked}
              onChange={handleChange}
              className="w-[1.2rem] h-[1.2rem] relative
              focus-visible:outline-0 focus:outline-none checked:focus:outline-none
              checked:focus:bg-transparent checked:hover:bg-transparent checked:bg-transparent 
              border-1 checked:border-black 
              checked:focus:border-black checked:hover:border-black 
              input-filter appearance-none 
              checked:bg-none" 
            />

            <label htmlFor={option.id} className="ml-2 uppercase whitespace-nowrap">
              {option.label}
            </label>
          </div>
        );
    }
  };

  const collectionsMarkup = collections.map((collection) => {
    return (
      <li key={collection.handle} className="pb-4">
        <Link
          to={`/collections/${collection.handle}`}
          className="focus:underline hover:underline"
          key={collection.handle}
          prefetch="intent"
        >
          {collection.title}
        </Link>
      </li>
    );
  });

  return (
    <>
      <Drawer open={isOpen} onClose={onClose} openFrom="right" heading="Filter">
        <nav className="p-8">
          {appliedFilters.length > 0 ? (
            <div className="pb-8">
              <AppliedFilters filters={appliedFilters} />
            </div>
          ) : null}

          <div className="divide-y">
            {filters.map(
              (filter: Filter) =>
                filter.values.length > 1 && (
                  <Disclosure
                    as="div"
                    key={filter.id}
                    className="w-full border-none"
                  >
                    {({open}) => (
                      <>
                        <Disclosure.Button className="flex items-center w-full pb-4">
                          <Text className="uppercase mt-1" size="lead">
                            {filter.label}
                          </Text>
                          <IconCaret direction={open ? 'up' : 'down'} />
                        </Disclosure.Button>
                        <Disclosure.Panel key={filter.id}>
                          <ul key={filter.id} className="py-2">
                            {filter.values?.map((option) => {
                              return (
                                <li key={option.id} className="pb-4">
                                  {filterMarkup(filter, option)}
                                </li>
                              );
                            })}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ),
            )}
          </div>
        </nav>

        <div className="flex items-center gap-[1.2rem] px-8 mt-auto mb-8">
          <button onClick={onClose} className="text-[1.2rem] w-[15rem] bg-black text-white h-[3.5rem]">
            Apply
          </button>

          <Link
            className="border border-black text-[1.2rem] w-[15rem] h-[3.5rem] flex items-center justify-center"
            prefetch="intent"
            to={''}
          >
            Clear All
          </Link>
        </div>
      </Drawer>
    </>
  );
}

function AppliedFilters({filters = []}: {filters: AppliedFilter[]}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      <Heading as="h4" size="lead" className="pb-4">
        Applied filters
      </Heading>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter: AppliedFilter) => {
          return (
            <Link
              to={getAppliedFilterLink(filter, params, location)}
              className="flex px-2 border rounded-full gap"
              key={`${filter.label}-${filter?.urlParam}`}
            >
              <span className="flex-grow">{filter.label}</span>
              <span>
                <IconXMark />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function getAppliedFilterLink(
  filter: AppliedFilter,
  params: URLSearchParams,
  location: Location,
) {
  const paramsClone = new URLSearchParams(params);
  if (filter?.urlParam.key === 'variantOption') {
    const variantOptions = paramsClone.getAll('variantOption');
    const filteredVariantOptions = variantOptions.filter(
      (options) => !options.includes(filter.urlParam.value),
    );
    paramsClone.delete(filter.urlParam.key);
    for (const filteredVariantOption of filteredVariantOptions) {
      paramsClone.append(filter.urlParam.key, filteredVariantOption);
    }
  } else {
    paramsClone.delete(filter.urlParam.key);
  }
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

function getFilterLink(
  filter: Filter,
  rawInput: string | Record<string, any>,
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(filter.type, rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({max, min}: {max?: number; min?: number}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min ? String(min) : '');
  const [maxPrice, setMaxPrice] = useState(max ? String(max) : '');

  useDebounce(
    () => {
      if (
        (minPrice === '' || minPrice === String(min)) &&
        (maxPrice === '' || maxPrice === String(max))
      )
        return;

      const price: {min?: string; max?: string} = {};
      if (minPrice !== '') price.min = minPrice;
      if (maxPrice !== '') price.max = maxPrice;

      const newParams = filterInputToParams('PRICE_RANGE', {price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event: SyntheticEvent) => {
    const newMaxPrice = (event.target as HTMLInputElement).value;
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const newMinPrice = (event.target as HTMLInputElement).value;
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-4">
        <span>from</span>
        <input
          name="maxPrice"
          className="text-black"
          type="text"
          defaultValue={min}
          placeholder={'$'}
          onChange={onChangeMin}
        />
      </label>
      <label>
        <span>to</span>
        <input
          name="minPrice"
          className="text-black"
          type="number"
          defaultValue={max}
          placeholder={'$'}
          onChange={onChangeMax}
        />
      </label>
    </div>
  );
}

function filterInputToParams(
  type: FilterType,
  rawInput: string | Record<string, any>,
  params: URLSearchParams,
) {
  const input = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;
  switch (type) {
    case 'PRICE_RANGE':
      if (input.price.min) params.set('minPrice', input.price.min);
      if (input.price.max) params.set('maxPrice', input.price.max);
      break;
    case 'LIST':
      Object.entries(input).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        } else if (typeof value === 'boolean') {
          params.set(key, value.toString());
        } else {
          const {name, value: val} = value as {name: string; value: string};
          const allVariants = params.getAll(`variantOption`);
          const newVariant = `${name}:${val}`;
          if (!allVariants.includes(newVariant)) {
            params.append('variantOption', newVariant);
          }
        }
      });
      break;
  }

  return params;
}

export default function SortMenu() {
  const items: {label: string; key: SortParam}[] = [
    {
      label: 'Date, new to old',
      key: 'newest',
    },
    {
      label: 'Price, low to high',
      key: 'price-low-high',
    },
    {
      label: 'Price, high to low',
      key: 'price-high-low',
    },
    {
      label: 'Best Selling',
      key: 'best-selling',
    },
  ];

  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem = items.find((item) => item.key === params.get('sort'));

  return (
    <Menu as="div" className="relative">
       {({ open }) => (
        <>
          <Menu.Button className="flex items-center">
            <span className="px-2 text-fine">
              <span>Sort by:</span>
            </span>
            <IconCaret className='duration-0' direction={ open? 'up': 'down'} />
          </Menu.Button>

          <Menu.Items
            as="nav"
            className="absolute w-[20rem] z-40 top-[4.7rem] right-0 flex flex-col p-6 border border-grey bg-white"
          >
            {items.map((item) => (
              <Menu.Item key={item.label}>
                {() => (
                  <Link
                    className={`block text-fine pb-4 last-of-type:pb-0 whitespace-nowrap ${
                      activeItem?.key === item.key ? 'font-bold' : 'font-normal'
                    }`}
                    to={getSortLink(item.key, params, location)}
                  >
                    {item.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </>
       )}
    </Menu>
  );
}

export function FilterMenu({
    filters = [],
    appliedFilters = [],
    collections = [],
  }: Omit<Props, 'children'>) {
    const [params] = useSearchParams();
    const location = useLocation();

    const navigate = useNavigate();

    const filterMarkup = (filter: Filter, option: Filter['values'][0]) => {
      switch (filter.type) {
        case 'PRICE_RANGE':
          const min =
            params.has('minPrice') && !isNaN(Number(params.get('minPrice')))
              ? Number(params.get('minPrice'))
              : undefined;
  
          const max =
            params.has('maxPrice') && !isNaN(Number(params.get('maxPrice')))
              ? Number(params.get('maxPrice'))
              : undefined;
  
          return <PriceRangeFilter min={min} max={max} />;
  
        default:
          const to = getFilterLink(
            filter,
            option.input as string,
            params,
            location,
          );
            
          const filterActive = appliedFilters?.find((filter) => filter.label === option.label)
          
          const [isChecked, setIsChecked] = useState(filterActive !== undefined);
          const handleChange = () => {

            if (isChecked) {
              const toApplied = getAppliedFilterLink(filterActive, params, location)
              // navigate(`${toApplied}`);
            } else {
              // navigate(`${to}`);
            }

            setIsChecked(!isChecked);
          };
        
          return (
            <div className='flex items-center pb-[0.8rem]'>
              <input
                type="checkbox"
                id={option.id}
                checked={isChecked}
                onChange={handleChange}
                className="w-[1.2rem] h-[1.2rem] relative shadow-none focus:shadow-none
                focus-visible:outline-0 focus:outline-none checked:focus:outline-none
                checked:focus:bg-transparent checked:hover:bg-transparent checked:bg-transparent 
                border-1 checked:border-black 
                checked:focus:border-black checked:hover:border-black 
                input-filter appearance-none 
                checked:bg-none" 
              />

              <label htmlFor={option.id} className="ml-2 uppercase whitespace-nowrap">
                {option.label}
              </label>
            </div>
          );
      }
    };
  
    return (
      <Menu as="div" className="relative hidden lg:block">
        {({ open, close }) => (
          <>
          <Menu.Button className="flex items-center">
            <span className="px-2 text-fine">
              <span>Filter</span>
            </span>
            <IconCaret className='duration-0' direction={ open? 'up': 'down'} />
          </Menu.Button>

          <Menu.Items
            as="nav"
            className="absolute top-[4.7rem] min-w-[20rem] z-30 right-0 flex flex-col p-6 border border-grey bg-white"
          >
            <div className='flex'>
              {filters.map(
                  (filter) =>
                    filter.values.length > 1 && (
                      <div key={filter.id} className="w-full pr-6">
                          <Text className='uppercase whitespace-nowrap block mb-4'>{filter.label}</Text>
                          <ul key={filter.id} className="py-2 max-h-[40rem] overflow-y-auto overflow-x-hidden pr-8">
                            {filter.values?.map((option) => {
                              return (
                                <li key={option.id} className="pb-4">
                                  {filterMarkup(filter, option)}
                                </li>
                              );
                            })}
                          </ul>
                      </div>
                    ),
                )}

            </div>

            <div className='flex items-center gap-[1.2rem]'>
              <button onClick={close} className='text-[1.2rem] w-[15rem] bg-black text-white h-[3.5rem]'>
                Apply
              </button>

              <Link
                className="border border-black text-[1.2rem] w-[15rem] h-[3.5rem] flex items-center justify-center"
                prefetch="intent"
                to={''}
              >
                Clear All
              </Link>
            </div>
          </Menu.Items>
          </>
        )}
      </Menu>
    );
}