'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

const HomePage: FC = () => {
  const pathname = usePathname().slice(1);
  console.log(pathname, 'pathname');
  const Plugin = dynamic(
    () => {
      return import(`@_plugins/${pathname}/index`);
    },
    { ssr: false },
  );
  return (
    <div>
      <Plugin />
    </div>
  );
};

export default HomePage;
