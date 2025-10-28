import Image from 'next/image';
import Link from 'next/link';
// Temporarily disabled Clerk
// import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href="/dashboard" className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="zoom logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          Zoom
        </p>
      </Link>
      <div className="flex-between gap-5">
        {/* Temporarily disabled Clerk auth UI */}
        {/* <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn> */}
        
        {/* Mock user button */}
        <div className="flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={32}
            height={32}
            alt="user avatar"
            className="rounded-full"
          />
        </div>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
