import React from 'react';
import Link from 'next/link';
import Mailref from './Mailref';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-4">
      <div className="container mx-auto flex justify-around text-center">
        <Mailref />
        <ul className="flex space-x-4">
          <li className="text-lg font-bold hover:text-gray-600 transition duration-300 ease-in-out">
            <Link href="https://github.com/razeevascx/MailRef">Github</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
