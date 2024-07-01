export const dailyTransactionsData = {
  list: [
    {
      date: 1602892800000,
      transactionCount: 98782,
      blockCount: 45415,
    },
    {
      date: 1602979200000,
      transactionCount: 367372,
      blockCount: 169184,
    },
    {
      date: 1603065600000,
      transactionCount: 153278,
      blockCount: 70701,
    },
  ],
  highestTransactionCount: {
    date: 1602979200000,
    transactionCount: 367372,
    blockCount: 169184,
  },
  lowesTransactionCount: {
    date: 1602892800000,
    transactionCount: 98782,
    blockCount: 45415,
  },
  chainId: 'AELF',
};

export const dailyAddAddressData = {
  list: [
    {
      date: 1603152000000,
      addressCount: 9,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1603238400000,
      addressCount: 1,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1603324800000,
      addressCount: 1,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1605052800000,
      addressCount: 9002,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1605139200000,
      addressCount: 2623,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1605225600000,
      addressCount: 3,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1605657600000,
      addressCount: 4662,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1605744000000,
      addressCount: 6768,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1605830400000,
      addressCount: 5076,
      totalUniqueAddresses: 6000,
    },
    {
      date: 1605916800000,
      addressCount: 489,
      totalUniqueAddresses: 6000,
    },
  ],
  highestIncrease: {
    date: 1605052800000,
    addressCount: 9002,
  },
  lowestIncrease: {
    date: 1603238400000,
    addressCount: 1,
  },
  chainId: 'AELF',
};

export const dailyActiveAddressData = {
  list: [
    {
      date: 1605916800000,
      addressCount: 9,
      sendAddressCount: 5,
      receiveAddressCount: 4,
    },
  ],
  highestActiveCount: {
    date: 1605916800000,
    addressCount: 9,
    sendAddressCount: 5,
    receiveAddressCount: 4,
  },
  lowestActiveCount: {
    date: 1605916800000,
    addressCount: 9,
    sendAddressCount: 5,
    receiveAddressCount: 4,
  },
  chainId: 'AELF',
};

export const BlockProductionRateData = {
  chainId: 'aelf',
  highestBlockProductionRate: {
    date: 19823828282,
    blockProductionRate: '90.1',
    blockCount: 100000,
    missedBlockCount: 1000,
  },
  lowestBlockProductionRate: {
    date: 19823828282,
    blockProductionRate: '90.1',
    blockCount: 100000,
    missedBlockCount: 1000,
  },
  list: [
    {
      date: 19823828282,
      blockProductionRate: '90.1',
      blockCount: 100000,
      missedBlockCount: 1000,
    },
  ],
};

export const AelfDailyCycleCountData = {
  chainId: 'aelf',
  highestBmissedCycle: {
    date: 19823828282,
    missedCycle: '90.1',
  },
  lowestmissedCycle: {
    date: 19823828282,
    missedCycle: '90.1',
  },
  list: [
    {
      date: 19823828282,
      cycleCount: 1000,
      missedBlockCount: 10,
      missedCycle: 1,
    },
  ],
};

export const AelfAVGBlockDurationData = {
  chainId: 'aelf',
  highestAvgBlockDuration: {
    date: 19823828282,
    avgBlockDuration: '0.4555',
  },
  lowestAvgBlockDuration: {
    date: 19823828282,
    avgBlockDuration: '0.4555',
  },
  list: [
    {
      date: 1605916800000,
      avgBlockDuration: '0.4555',
      longestBlockDuration: '0.4555',
      shortestBlockDuration: '0.4555',
    },
  ],
};
