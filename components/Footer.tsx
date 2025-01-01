import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black bottom-1 text-white py-4">
      <div className="container mx-auto flex justify-around text-center">
        <h1 className="text-2xl font-bold mb-4">
          Mail <span className="text-blue-500">Ref</span>
        </h1>
        <ul className="flex  space-x-4">
          <li className="text-lg hover:text-blue-500 transition duration-300 ease-in-out">
            <Link href="https://github.com/razeevascx/MailRef">Github</Link>
          </li>
          <li className="text-lg hover:text-blue-500 transition duration-300 ease-in-out">
            <Link href="/">Home</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
