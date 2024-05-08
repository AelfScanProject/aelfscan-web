import { HolderItem, IActivityTableData, ItemSymbolDetailActivity, ItemSymbolDetailHolders } from './type';

const activeList: IActivityTableData[] = Array.from(new Array(100).keys()).map((item) => {
  return {
    transactionHash: item + 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
    status: 'Fail',
    action: 'Sales',
    timestamp: '2023-08-15T08:42:41.1123602Z',
    price: 1001,
    amount: 11,
    from: {
      name: 'AELF',
      address: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy',
      addressType: 0,
      isManager: false,
      isProducer: true,
    },
    to: {
      name: 'AELF',
      address: 'AELF.Contract.Token',
      addressType: 0,
      isManager: false,
      isProducer: true,
    },
    marketPlaces: {
      marketName: '',
      marketLogo: '',
      marketUrl: '',
    },
  };
});
async function fetchActiveData({ page, pageSize }): Promise<ItemSymbolDetailActivity> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: activeList.slice((page - 1) * pageSize, page * pageSize),
  };
}

const holderList: HolderItem[] = Array.from(new Array(100).keys()).map((item, i) => {
  return {
    rank: i,
    address: {
      name: 'name' + i,
      address: 'address' + i,
      addressType: 0,
      isManager: false,
      isProducer: true,
    },
    quantity: 1000.21,
    percentage: 0.34,
  };
});
async function fetchHolderData({ page, pageSize }): Promise<ItemSymbolDetailHolders> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: holderList.slice((page - 1) * pageSize, page * pageSize),
  };
}
export { activeList, holderList, fetchActiveData, fetchHolderData };
