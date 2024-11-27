import { store } from '@_store';
import { Chain } from 'global';
import { MULTI_CHAIN, SYMBOL } from './contant';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';

export function getPathnameFirstSlash(pathname: string) {
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const firstSlash = pathname.slice(0, secondSlashIndex + 1);
  return firstSlash;
}
export default function addressFormat(address: string, chainId?: string, prefix?: string) {
  const defaultChainId = store.getState().getChainId.defaultChain;
  if (!address) return '';
  if (chainId === MULTI_CHAIN) {
    return address;
  }
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
  window.history.replaceState(null, '', url.toString());
}

export const exportToCSV = (list: Array<any>, title: string, fieldAliasMap: { [key: string]: any }) => {
  const metrics = Object.keys(fieldAliasMap || {});
  const columns = ['Date(UTC)', 'UnixTimeStamp'].concat(
    metrics.map((field) => (fieldAliasMap && fieldAliasMap[field]) || field),
  );
  const rows = list.map((item) => {
    return [
      item.dateMonth ? item.dateMonth : dayjs(item.date).format('M/D/YYYY'),
      item.dateMonth ? item.dateMonth : `'${String(item.date)}`,
      ...metrics.map((key) => item[key]),
    ];
  });
  const csv = Papa.unparse({ fields: columns, data: rows });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, title);
};
