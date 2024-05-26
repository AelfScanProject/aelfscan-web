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

async function service(url: string, options: RequestWithParams) {
  const { params = {} } = options || {};
  const paramsArr: Array<any> = [];
  if (Object.keys(params).length > 0) {
    for (const item in params) {
      if ((params[item] !== undefined && params[item]) || params[item] === 0) {
        paramsArr.push(item + '=' + params[item]);
      }
    }
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArr.join('&');
    } else {
      url += '&' + paramsArr.join('&');
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
