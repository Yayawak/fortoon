import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Home Link */}
        <Link href="/" className="text-white font-semibold text-lg">
          Home
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/profile" className="text-white hover:text-gray-300">
            Profile
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="text-white hover:text-gray-300">
            Contact
          </Link>
        </div>

        {/* Profile Icon */}
        <Link href="/profile/settings" className="text-white">
          {/* Uncomment and add an actual image source */}
          {/* <img src="/profile-icon.svg" alt="Profile" className="h-6 w-6 inline-block" /> */}
          Settings
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
