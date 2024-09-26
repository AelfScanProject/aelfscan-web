/*
 * @Date: 2023-08-14 18:50:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 20:12:44
 * @Description: formatter utils
 */
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { MULTI_CHAIN, SYMBOL } from '@_utils/contant';
import { v4 as uuidv4 } from 'uuid';
import { PageTypeEnum } from '@_types';
import { TChainID } from '@_api/type';
export const formatDate = (date: number, type: string, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (typeof date === 'number') {
    if (type === 'Date Time (UTC)') {
      return dayjs.unix(date).format(format);
    }
    const localTimestampInSeconds = dayjs.unix(dayjs().unix());
    const time = dayjs.unix(date);
    const seconds = localTimestampInSeconds.diff(time, 'seconds');
    const minutes = localTimestampInSeconds.diff(time, 'minutes');
    const hours = localTimestampInSeconds.diff(time, 'hours');
    const days = localTimestampInSeconds.diff(time, 'days');

    if (minutes < 1) return `${seconds < 0 ? 0 : seconds} secs ago`;
    if (minutes < 60) return `${minutes % 60} mins ago`;
    if (hours < 24) return `${hours} hrs ${minutes % 60} mins ago`;
    return `${days} days ${hours % 24} hrs ago`;
  }
  return '';
};

export const validateVersion = (version): boolean => {
  const regex = new RegExp(/^\d+(.\d+){3}$/);
  return regex.test(version);
};

export const validateNumber = (value: any) => {
  const num = Number(value);
  return !Number.isNaN(num);
};

export const numberFormatter = (number: string | number, symbol = SYMBOL): string => {
  const num = Number(number);
  if (Number.isNaN(num)) {
    return '-';
  }
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${symbol}`;
};

export const thousandsNumber = (number: string | number): string => {
  const num = Number(number);
  if (number === '' || Number.isNaN(num) || number === null) return '-';
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })}`;
};

export const stringToDotString = (str?: string, maxLength?: number) => {
  if (!str || !maxLength) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

export const addSymbol = (str: string | number) => {
  return `${str} ${SYMBOL}`;
};

export const divDecimals = (num: number | string, decimals = 1e8) => {
  const bigNumber = new BigNumber(num);
  return bigNumber.dividedBy(decimals || 1e8).toNumber();
};

export const getPageNumber = (page: number, pageSize: number): number => {
  return Math.floor((page - 1) * pageSize);
};

export const getAddress = (address: string) => {
  if (!address) return '';
  const match = address.match(/(?:ELF_)?(.+?)(?:_[^_]+)?$/);
  const substring = match ? match[1] : '';
  return substring;
};

const KUnit = 1000;
const MUnit = KUnit * 1000;
const BUnit = MUnit * 1000;
const TUnit = BUnit * 1000;

export const fixedDecimals = (count?: number | BigNumber | string, num = 4) => {
  const bigCount = BigNumber.isBigNumber(count) ? count : new BigNumber(count || '');
  if (bigCount.isNaN()) return '0';
  return bigCount.dp(num, BigNumber.ROUND_HALF_UP).toFixed();
};

function enConverter(num: BigNumber, decimal = 3) {
  const abs = num.abs();
  if (abs.gt(TUnit)) {
    return fixedDecimals(num.div(TUnit), decimal) + 'T';
  } else if (abs.gte(BUnit)) {
    return fixedDecimals(num.div(BUnit), decimal) + 'B';
  } else if (abs.gte(MUnit)) {
    return fixedDecimals(num.div(MUnit), decimal) + 'M';
  } else if (abs.gte(KUnit)) {
    return fixedDecimals(num.div(KUnit), decimal) + 'K';
  }
}

export const unitConverter = (num?: number | BigNumber | string, decimal = 5) => {
  const bigNum = BigNumber.isBigNumber(num) ? num : new BigNumber(num || '');
  if (bigNum.isNaN() || bigNum.eq(0)) return '0';
  const conversionNum = enConverter(bigNum, decimal);
  if (conversionNum) return conversionNum;
  return fixedDecimals(bigNum, decimal);
};

export const getSort = (pageType: PageTypeEnum, currentPage) => {
  return pageType === PageTypeEnum.NEXT || currentPage === 1 ? 'Desc' : 'Asc';
};

export const getTransferSearchAfter = (currentPage, data, pageType) => {
  return currentPage !== 1 && data && data.length
    ? [
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].blockHeight : data[0].blockHeight,
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].transactionId : data[0].transactionId,
      ]
    : ([] as any[]);
};

export const getAccountSearchAfter = (currentPage, data, pageType) => {
  return currentPage !== 1 && data && data.length
    ? [
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].balance : data[0].balance,
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].address : data[0].address,
      ]
    : ([] as any[]);
};

export const getAddressSearchAfter = (currentPage, data, pageType) => {
  return currentPage !== 1 && data && data.length
    ? [
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].blockHeight : data[0].blockHeight,
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].transactionId : data[0].transactionId,
      ]
    : ([] as any[]);
};

export const getBlockTimeSearchAfter = (currentPage, data, pageType, key = 'blockTime') => {
  return currentPage !== 1 && data && data.length
    ? [
        pageType === PageTypeEnum.NEXT ? data[data.length - 1][key] : data[0][key],
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].transactionId : data[0].transactionId,
      ]
    : ([] as any[]);
};

export const getHoldersSearchAfter = (currentPage, data, pageType) => {
  return currentPage !== 1 && data && data.length
    ? [
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].quantity : data[0].quantity,
        pageType === PageTypeEnum.NEXT ? data[data.length - 1].address.address : data[0].address.address,
      ]
    : ([] as any[]);
};

export function getFirstHashValue(url) {
  const urlObj = new URL(url);
  const hash = urlObj.hash.slice(1);
  const hashParts = hash.split('#');
  return hashParts[0];
}

export function getSecondHashValue(url) {
  const urlObj = new URL(url);
  const hash = urlObj.hash.slice(1);
  const hashParts = hash.split('#');
  return hashParts[1];
}

export function getOrCreateUserId() {
  let userId = localStorage.getItem('userId') || '';
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export const getChainId = (chainId: string): TChainID => {
  return (chainId === MULTI_CHAIN ? '' : chainId) as TChainID;
};
