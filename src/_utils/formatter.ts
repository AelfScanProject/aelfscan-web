/*
 * @Date: 2023-08-14 18:50:18
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 20:12:44
 * @Description: formatter utils
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
const SYMBOL = process.env.NEXT_PUBLIC_SYMBOL;
dayjs.extend(utc);
export const formatDate = (date: string | number, type: string, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (date) {
    if (type === 'Date Time (UTC)') {
      return dayjs.utc(date).format(format);
    }
    const seconds = dayjs().diff(date, 'seconds');
    const minutes = dayjs().diff(date, 'minutes');
    const hours = dayjs().diff(date, 'hours');
    const days = dayjs().diff(date, 'days');

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

export const numberFormatter = (number: string, symbol = SYMBOL): string => {
  const num = Number(number);
  if (Number.isNaN(num)) {
    return number;
  }
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${symbol}`;
};

export const thousandsNumber = (number: string | number): string => {
  const num = Number(number);
  if (number === '' || Number.isNaN(num)) return '-';
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 8 })}`;
};

export const stringToDotString = (str?: string, maxLength?: number) => {
  if (!str || !maxLength) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};
