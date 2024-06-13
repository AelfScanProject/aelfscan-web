'use client';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { FC, useMemo } from 'react';

const HomePage: FC = () => {
  const pathname = usePathname().slice(1);
  console.log(pathname, 'pathname');
  const Plugin = useMemo(() => {
    return dynamic(
      () => {
        return import(`@_plugins/${pathname}/index`);
      },
      { ssr: false },
    );
  }, [pathname]);
  return (
    <div>
      <Plugin />
    </div>
  );
};

export default HomePage;
