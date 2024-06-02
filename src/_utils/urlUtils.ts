import { store } from '@_store';
import { Chain } from 'global';
import { SYMBOL } from './contant';

export function getPathnameFirstSlash(pathname: string) {
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const firstSlash = pathname.slice(0, secondSlashIndex + 1);
  return firstSlash;
}
export default function addressFormat(address: string, chainId?: string, prefix?: string) {
  const defaultChainId = store.getState().getChainId.defaultChain;
  if (!address) return '';
  return `${prefix || SYMBOL}_${address}_${chainId || defaultChainId}`;
}

export const hiddenAddress = (str: string, frontLen = 4, endLen = 4) => {
  return `${str.substring(0, frontLen)}...${str.substring(str.length - endLen)}`;
};

export const getChainByPath = (path: string) => {
  const url = new URL(path);
  const searchParams = url.searchParams;
  const chainId = searchParams.get('chainId');
  return chainId as unknown as Chain;
};

export function isURL(text: string): boolean {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(text);
}

export function updateQueryParams(params: { [K in string]: any }) {
  const url = new URL(window.location.href);
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      url.searchParams.set(key, params[key]);
    }
  }
  console.log(window, url.toString(), 'windowsdfsad');
  window.history.replaceState(null, '', url.toString());
}
