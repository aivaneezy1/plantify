import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  
  return (
    <div className='text-white p-4 flex justify-between items-center shadow-md cursor-pointer'>
     <Link href="/">
      <div>Logo</div>
     </Link>
      <button className='bg-purple-500 text-white py-2 px-8 rounded-full hover:bg-purple-600 transition duration-300'>
        Login
      </button>
    </div>
  );
}

export default Navbar;
