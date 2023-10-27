import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure, Transition} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import OutsideClickHandler from "react-outside-click-handler";
import type {LayoutQuery} from 'storefrontapi.generated';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
  LogoFooter,
  Underline,
  FooterSection,
} from '~/components';
import type {ChildEnhancedMenuItem} from '~/lib/utils';
import {type EnhancedMenu, useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';

type LayoutProps = {
  children: React.ReactNode;
  layout: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    headerSecondaryMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
    connect?: EnhancedMenu | null;
  };
};

export function Layout({children, layout}: LayoutProps) {
  const {headerMenu, headerSecondaryMenu, footerMenu, connect} = layout;

  const hasFooterMenu = !!footerMenu || !!connect;

  const newLocal = 'mainContent';
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && (
          <Header
            title={layout.shop.name}
            menu={headerMenu}
            menuSecondary={headerSecondaryMenu}
          />
        )}

        <main role="main" id={newLocal} className="flex-grow lg:pt-[60px]">
          {children}
        </main>
      </div>

      {hasFooterMenu && <Footer menu={[footerMenu, connect]} />}
    </>
  );
}

function Header({
  title,
  menu,
  menuSecondary,
}: {
  title: string;
  menu?: EnhancedMenu;
  menuSecondary?: EnhancedMenu;
}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const [searchOpen, setSearchOpen] = useState(false);

  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        menuSecondary={menuSecondary}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold leading-none text-center"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  menuSecondary,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  menuSecondary?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  const {y} = useWindowScroll();
  const [showSearch, setShowSearch] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  return (
    <header
      role="banner"
      className={`${isHome ? '' : ''} ${
        !isHome && y > 50 && ' shadow-lightHeader'
      } fixed transition duration-300 bg-white z-40 top-0 w-full leading-none gap-8 px-12`}
    >
      <div className="items-center justify-between py-3 lg:flex">
        <div className="flex gap-12 lg:w-1/3">
          <nav className="flex gap-8">
            {/* Top level menu items */}
            {(menu?.items || []).map((item) => (
              <Link
                key={item.id}
                to={item.to}
                target={item.target}
                prefetch="intent"
                className={({isActive}) =>
                  isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
                }
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex justify-center lg:w-1/3">
          <Link className="font-bold" to="/" prefetch="intent">
            {title}
          </Link>
        </div>

        <div className="flex items-center justify-end gap-1 lg:w-1/3">
          <CountrySelector />

          <OutsideClickHandler onOutsideClick={()=>{console.log('outside');setShowSearch(false)}}>
            <SearchTrigger className="flex" showSearch={showSearch} setShowSearch={setShowSearch}/>
            <div className={"absolute left-0 justify-center w-full bg-white top-full lg:p-3" + (showSearch?"":" hidden")} >
              <Form
                method="get"
                action={params.locale ? `/${params.locale}/search` : '/search'}
                className="flex items-center gap-2"
              >
                <Input
                  className={
                    isHome
                      ? 'focus:border-contrast/20 dark:focus:border-primary/20 border-color-black'
                      : 'focus:border-primary/20'
                  }
                  type="search"
                  variant="minisearch"
                  placeholder="Search"
                  name="q"
                />
                <button
                  type="submit"
                  className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
                >
                  <IconSearch />
                </button>
              </Form>
            </div>
          </OutsideClickHandler>

          <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />


          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </div>

      <div className="items-center justify-center gap-5 py-3 lg:flex">
        {(menuSecondary?.items || []).map((item) => (
          <Link
            key={item.id}
            to={item.to}
            target={item.target}
            prefetch="intent"
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            {item.title}
          </Link>
        ))}
      </div>
    </header>
  );
}

function SearchTrigger({className,showSearch, setShowSearch}: {className?: string,showSearch:Boolean, setShowSearch: any}) {
  return <button className={className} onClick={()=>{
      setShowSearch(!showSearch);
  }}><IconSearch/></button>;
}

function AccountLink({className}: {className?: string}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}: {menu?: EnhancedMenu[]}) {
  const isHome = useIsHomePath();
  return (
    <FooterSection
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className="footer"
    >
      <div
        className={`grid items-center lg:items-start grid-flow-row w-full lg-max:grid-cols-1 grid-cols-3 overflow-hidden footer-upper py-[3rem] px-[1.5rem] lg:py-[2rem] lg:px-[3rem]`}
      >
        <div className="lg-max:flex lg-max:flex-col lg-max:items-center lg-max:justify-center footer-col footer-email-wrap lg-max:order-3 lg-max:pt-[3rem] lg-max:mt-[3rem] lg-max:border-t-black lg-max:border-t">
          <FooterNewsletter />
        </div>
        <div className="flex justify-center lg-max:flex-col lg-max:items-center footer-col footer-logo-wrap lg-max:order-1">
          <Link to="/">
            <LogoFooter />
          </Link>
        </div>
        <div className="flex justify-between lg-max:flex-col lg-max:items-center lg-max:justify-center footer-col footer-menu-list lg-max:order-2 lg-max:mt-[3rem]">
          {menu?.map((m) => (
            <FooterMenu menu={m} key={m.id} />
          ))}
        </div>
      </div>

      <div
        className={`bg-black text-white self-end px-[3rem] md:col-span-2 footer-lower}`}
      >
        <span className="footer-copyright text-[0.9rem]">
          &copy; {new Date().getFullYear()} La Ligne LLC
        </span>
      </div>
    </FooterSection>
  );
}

function FooterNewsletter(params: any) {
  return (
    <div className="newsletter max-w-[29rem]">
      <h4 className="newsletter-title text-[2.6rem] leading-normal mb-[1.5rem]">
        Add text here
      </h4>
      <form className="relative footer-signup-form">
        <div className="newsletter-form-main">
          <input
            className="border-none text-[1rem] p-0 bg-transparent h-[3rem] w-[100%] tracking-[.02rem] focus:outline-none focus:shadow-transparent placeholder:uppercase"
            type="email"
            name="email"
            placeholder="Email Address"
            aria-label="Email Address"
          />
        </div>
        <div className="newsletter-form-underline">
          <Underline />
        </div>
        <div className="form_actions absolute top-0 right-[-3rem]">
          <button
            type="submit"
            className="newsletter-form-btn w-[2.7rem] h-[3rem] p-0 flex bg-transparent border-none
            items-center justify-center before:content-[''] before:w-[100%] before:h-[1px] before:bg-black
            after:content-[''] after:border-l-8 after:border-l-black after:border-t-4 after:border-t-transparent
            after:border-b-4 after:border-b-transparent"
            aria-label="Sign up"
          ></button>
        </div>
      </form>
    </div>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      <a
        href={item.to}
        target={item.target}
        rel="noopener noreferrer"
        className="mb-[0.25rem] list-none text-[1.2rem] font-['AtlasGrotesk-Light'] leading-[22.88px]"
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      to={item.to}
      target={item.target}
      prefetch="intent"
      className="mb-[0.25rem] list-none text-[1.2rem] font-['AtlasGrotesk-Light'] leading-[22.88px]"
    >
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  const styles = {
    section:
      'flex flex-col footer-menu-content mt-[0.5rem] mb-[1.5rem] list-none lg-max:text-center',
    nav: 'grid gap-2 pb-6',
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 979);
    };

    handleResize(); // Check initial screen size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <section className="text-center lg:text-left footer-menu-item text-[1.2rem] font-['AtlasGrotesk-Light']">
        {isMobile ? (
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button>
                  <Heading
                    className="font-['AtlasGrotesk-Light'] uppercase footer-menu-title inline-block mb-[1.5rem] text-[1rem] text-black font-normal lg-max:text-[1.2rem]"
                    size="lead"
                    as="h5"
                  >
                    {menu?.title}
                  </Heading>
                </Disclosure.Button>
                {menu ? (
                  <div
                    className={`${
                      open ? `h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="fadeIn opacity-0"
                      enterTo="fadeIn opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="fadeIn opacity-100"
                      leaveTo="fadeIn  opacity-0"
                    >
                      <Disclosure.Panel static>
                        <nav className={styles.section}>
                          {menu.items.map((item: ChildEnhancedMenuItem) => (
                            <FooterLink key={item.id} item={item} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        ) : (
          <>
            <Heading
              className="font-['AtlasGrotesk-Light'] uppercase footer-menu-title inline-block mb-[1.5rem] text-[1rem] text-black font-normal"
              size="lead"
              as="h5"
            >
              {menu?.title}
            </Heading>
            {menu ? (
              <nav className={styles.section}>
                {menu.items.map((item: ChildEnhancedMenuItem) => (
                  <FooterLink key={item.id} item={item} />
                ))}
              </nav>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
