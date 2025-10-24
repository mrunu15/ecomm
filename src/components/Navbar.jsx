import { Fragment, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from "../assets/logo.png"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Menu,
} from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { FaBars, FaTimes, FaUserPlus, FaArrowRight } from 'react-icons/fa';

// Constants
const NAVIGATION = {
  categories: [
    {
      id: 'herbs',
      name: 'Shop By Category',
      featured: [
        {
          name: 'New Arrivals',
          href: '/products',
          imageSrc: 'https://www.superkicks.in/cdn/shop/files/3_71b51ccc-bfe7-4a3c-b334-238b94e4c148.jpg',
          imageAlt: 'free',
        },
        {
          name: 'Best Sellers',
          href: '/products',
          imageSrc: 'https://www.superkicks.in/cdn/shop/files/2_57f0f7c4-f598-4b63-9e37-3a1f5ab97808.jpg',
          imageAlt: 'free',
        },
      ],
      sections: [
        {
          id: 'shoes',
          name: 'All Nike Products',
          items: [{ name: 'Nike Shoes', href: '/products?category=shoes' }],
        },
        {
          id: 'shoes',
          name: 'All Sport Shoes Porducts',
          items: [{ name: 'Sports Shoes', href: '/products?category=shoes' }],
        },
        {
          id: 'shoes',
          name: 'Top Rated Picks',
          items: [{ name: 'Trending Shoes', href: '/products?category=shoes' }],
        },
        {
          id: 't shirt',
          name: 'All T-shirt Products',
          items: [{ name: 'T Shirts', href: '/products?category=tshirt' }],
        },
        {
          id: 'watches',
          name: 'All Products',
          items: [{ name: 'Watches', href: '/products?category=watch' }],
        },
        {
          id: 'lowers',
          name: 'All Lowers Products',
          items: [
            { name: 'Lowers', href: '/products?category=lower' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ],
};


function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/products`);
    }
    setSearchQuery('');
    setMobileSearchOpen(false);
  };



  const Logo = () => (
    <Link to="/" className="ml-4 flex lg:ml-0">

      <span className="flex items-center">
        <img
          src={logo}
          alt="logo"
          className="h-6 mt-2 ml-[-10px] lg:ml-0 w-auto sm:h-6 md:h-8 lg:h-8 xl:h-8"
        />
      </span>


    </Link>
  );

  const MobileMenuButton = () => (
    <button
      type="button"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
    >
      <span className="sr-only">Open menu</span>
      {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
    </button>
  );

  const MobileMenu = () => (
    <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-40 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
      />
      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <div className="flex px-4 pt-5 pb-2 justify-end">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Close menu</span>
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <TabGroup className="mt-2">
            <div className="border-b border-gray-200">
              <TabList className="-mb-px flex space-x-8 px-4">
                {NAVIGATION.categories.map((category) => (
                  <Tab
                    key={category.name}
                    className="flex-1 border-b-2 border-none px-1 py-4 text-md font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                  >
                    {category.name}
                  </Tab>
                ))}
              </TabList>
            </div>
            <TabPanels as={Fragment}>
              {NAVIGATION.categories.map((category) => (
                <TabPanel
                  key={category.name}
                  className="space-y-4 px-4 pt-12 pb-8"
                >
                  <div className="grid grid-cols-2 gap-x-4">
                    {category.featured.map((item) => (
                      <div key={item.name} className="group relative text-sm">
                        <img
                          alt={item.imageAlt}
                          src={item.imageSrc}
                          className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                        />
                        <Link
                          to={item.href}
                          className="mt-6 block font-medium text-gray-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <p aria-hidden="true" className="mt-1">
                          Shop now
                        </p>
                      </div>
                    ))}
                  </div>
                  {category.sections.map((section) => (
                    <div key={section.name}>
                      <p className="font-medium text-gray-900">
                        {section.name}
                      </p>
                      <ul className="mt-2 flex flex-col">
                        {section.items.map((item) => (
                          <li key={item.name} className="flow-root">
                            <Link
                              to={item.href}
                              className="flex items-center justify-between p-2 text-gray-500 group hover:text-[#bef264] transition duration-200"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="flex items-center">
                                {item.name}
                                <FaArrowRight className="ml-4 text-md transform transition-transform duration-200 group-hover:translate-x-1" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>


                    </div>
                  ))}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            {NAVIGATION.pages.map((page) => (
              <div key={page.name} className="flow-root">
                <Link
                  to={page.href}
                  className="-m-2 block p-2 font-medium text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {page.name}
                </Link>
              </div>
            ))}
          </div>

          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            {!isAuthenticated && (
              <div className="flow-root">
                <Link
                  to="/register"
                  className="-m-2 block p-2 font-medium text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );

  const DesktopNavigation = () => (
    <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
      <div className="flex h-full space-x-8">
        {NAVIGATION.categories.map((category) => (
          <Popover key={category.name} className="flex">
            <div className="relative flex">
              <PopoverButton className="group relative flex items-center justify-center text-[14px] font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
                {category.name}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                />
              </PopoverButton>
            </div>
            <PopoverPanel
              transition
              className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0"
            >
              <div className="absolute inset-0 top-1/2 bg-white shadow-sm" />
              <div className="relative bg-white">
                <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                    <div className="col-start-2 grid grid-cols-2 gap-x-8">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-base sm:text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <Link to={item.href} className="mt-6 block font-medium text-gray-900">
                            {item.name}
                          </Link>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                      {category.sections.map((section) => (
                        <div key={section.name}>
                          <p className="font-medium text-gray-900">
                            {section.name}
                          </p>
                          <ul className="mt-2">
                            {section.items.map((item) => (
                              <li
                                key={item.name}
                                className="flex items-center justify-between group hover:text-[#bef264] transition duration-200"
                              >
                                <Link
                                  to={item.href}
                                  className="flex items-center justify-between w-full"
                                >
                                  <span className="flex items-center">
                                    {item.name}
                                    <FaArrowRight className="ml-4 transform transition-transform duration-200 group-hover:translate-x-1" />
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>

                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
        ))}
        {NAVIGATION.pages.map((page) => {
          const location = useLocation();
          const isActive = location.pathname === page.href;

          return (
            <Link
              key={page.name}
              to={page.href}
              className={`relative flex items-center text-[14px] font-medium text-gray-700 hover:text-gray-800
        before:absolute before:left-0 before:bottom-5 before:h-[2px] before:bg-[#bef264] before:transition-all before:duration-300
        ${isActive ? "before:w-full" : "before:w-0 hover:before:w-full"}`}
            >
              {page.name}
            </Link>
          );
        })}
      </div>
    </PopoverGroup>
  );

  const AuthLinks = () => (
    <div className="hidden lg:flex lg:items-center lg:space-x-6">
      {!isAuthenticated ? (
        <Link
          to="/login"
          className="text-md font-medium text-gray-700 hover:text-gray-800 flex items-center"
        >
          <FaUserPlus className="mr-2" /> Login / Register
        </Link>
      ) : (
        <Menu as="div" className="relative ml-4">

        </Menu>
      )}
    </div>
  );

  const DesktopSearch = () => (
    <div className="hidden lg:flex lg:ml-6">
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <div className="relative w-48"

        >
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder=""
            className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-2 pb-1
         focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
          />
          <label
            htmlFor="search"
            className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
               peer-placeholder-shown:top-2 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
               peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900
               peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
          >
            Search. . .
          </label>
        </div>


        <button
          type="submit"
          className="text-white rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <MagnifyingGlassIcon className="h-7 w-7 text-black font-bold" />
        </button>
      </form>
    </div>
  );

  const MobileSearchButton = () => (
    <div className="flex lg:hidden ml-4">
      <button
        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        className="p-2 text-gray-400 hover:text-gray-500"
      >
        {mobileSearchOpen ? (
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );

  const CartIcon = () => (
    <div className="ml-4 relative lg:ml-6">
      <Link to="/cart" className="group -m-2 p-2 relative inline-flex">
        <ShoppingBagIcon
          aria-hidden="true"
          className="h-7 w-7 text-gray-400 group-hover:text-gray-500"
        />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold w-5 h-5">
            {cartItems.length}
          </span>
        )}
      </Link>
    </div>
  );

  const MobileAuthButton = () => (
    <div className="flex lg:hidden ml-4">
      {!isAuthenticated && (
        <Link to="/register" className="p-2 text-gray-400 hover:text-gray-500">
          <FaUserPlus className="h-6 w-6" />
        </Link>
      )}
    </div>
  );

  const MobileSearch = () => (
    mobileSearchOpen && (
      <div className="lg:hidden py-2 px-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            className="absolute right-3 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    )
  );

  return (
    <div className="bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        {/* <DeliveryBanner /> */}

        <nav aria-label="Top" className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <MobileMenuButton />
              <Logo />
              <DesktopNavigation />

              <div className="ml-auto flex items-center">
                <AuthLinks />
                <DesktopSearch />
                <MobileSearchButton />
                <CartIcon />
                <MobileAuthButton />
              </div>
            </div>
          </div>

          <MobileSearch />
        </nav>
      </header>

      <MobileMenu />
    </div>
  );
}

export default Navbar;
