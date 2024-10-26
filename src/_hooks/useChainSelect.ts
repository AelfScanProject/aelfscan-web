import { useAppDispatch } from '@_store';
import { setDefaultChain } from '@_store/features/chainIdSlice';
import { MenuItem } from '@_types';
import { DEFAULT_CHAIN } from '@_utils/contant';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export default function useChainSelect(headerMenuList: MenuItem[], setCurrent) {
  const menus = useMemo(() => {
    return headerMenuList.reduce((pre, cur) => {
      if (cur.children.length) {
        pre.push(...cur.children);
      } else {
        pre.push(cur);
      }
      return pre;
    }, [] as MenuItem[]);
  }, [headerMenuList]);

  const dispatch = useAppDispatch();

  const pathname = usePathname();

  const router = useRouter();

  const onSelectHandler = useCallback(
    (value: string) => {
      dispatch(setDefaultChain(value));
      const segments = pathname.split('/');
      const current = segments.length > 2 ? `/${segments[2]}` : '';

      if (menus.find((item) => item.path === current)) {
        router.push(`/${value}${current}`);
        setCurrent(current);
      } else {
        if (value === DEFAULT_CHAIN) {
          router.push('/');
        } else {
          router.push(`/${value}`);
        }
        setCurrent('/');
      }
    },
    [dispatch, menus, pathname, router, setCurrent],
  );

  return onSelectHandler;
}
