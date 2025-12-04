import { REQUEST_API_TYPE, API_List, REQUEST_FUNCTION } from './list';
import myServer from './server';

export type Additional_API_Type = {
  [X in string]: {
    [Y in string]: string;
  };
};

Object.entries(API_List).forEach(([key, value]) => {
  myServer.parseRouter(key, value);
});

export const initServerApi = <T extends Additional_API_Type>(apis: T) => {
  Object.entries(apis).forEach(([key, value]) => {
    myServer.parseRouter(key, value);
  });

  return Object.assign({}, myServer.send, myServer) as REQUEST_API_TYPE & {
    [X in keyof T]: {
      [Y in keyof T[X]]: REQUEST_FUNCTION;
    };
  };
};

const request: REQUEST_API_TYPE = Object.assign({}, myServer.send, myServer);

export const extendRequest = <T extends Additional_API_Type>(apis: T) => {
  const result = initServerApi(apis);
  return result;
};

export default request;
