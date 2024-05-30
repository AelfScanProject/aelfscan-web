export type RequestWithParams = {
  params?: any;
} & RequestInit;

const DEFAULT_FETCH_TIMEOUT = 300000;
const myServer = new Function();
const timeoutPromise = (delay: number) => {
  return new Promise<{ type: string }>((resolve) => {
    setTimeout(() => {
      resolve({ type: 'timeout' });
    }, delay);
  });
};
function formatQueryParams(params) {
  const queryStrings = <any>[];

  function processObject(obj, prefix?, isObject?) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const prefixedKey = prefix ? (isObject ? `${prefix}.${key}` : `${prefix}[${key}]`) : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            processObject(item, `${prefixedKey}[${index}]`, true);
          } else {
            queryStrings.push(`${prefixedKey}[${index}]=${encodeURIComponent(item)}`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        processObject(value, prefixedKey);
      } else if ((value !== undefined && value) || value === 0) {
        queryStrings.push(`${prefixedKey}=${encodeURIComponent(value)}`);
      }
    });
  }

  processObject(params);

  return queryStrings.join('&');
}

async function service(url: string, options: RequestWithParams) {
  const { params = {} } = options || {};
  if (Object.keys(params).length > 0) {
    let query;
    try {
      query = formatQueryParams(params);
    } catch (error) {
      console.log(error, error);
    }
    if (url.search(/\?/) === -1) {
      url += '?' + query;
    } else {
      url += '&' + query;
    }
  }

  console.log(url, options, 'url-----------');

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    } else {
      return {
        type: 'error',
        message: 'fetch fail',
      };
    }
  } catch (error) {
    return {
      type: 'error',
      message: error,
    };
  }
}

myServer.prototype.parseRouter = function (name: string, urlObj: any) {
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach((key) => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

myServer.prototype.send = async function (url: string, options: RequestWithParams) {
  const rs = await Promise.race([service(url, options), timeoutPromise(DEFAULT_FETCH_TIMEOUT)]);
  if (rs?.type === 'timeout') {
    // console.error('timeout');
    throw new Error('fetch timeout');
  } else if (rs?.type === 'error') {
    // console.error('error');
    throw new Error(rs.message);
  } else if (rs.code && rs.code !== '20000') {
    throw new Error(rs.message);
  }
  return rs;
};

export default myServer.prototype;
