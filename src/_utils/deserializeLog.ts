import { store } from '@_store';
import AElf from 'aelf-sdk';

const CONTRACT_PROTOS = {};

export enum SupportedELFChainId {
  MAIN_NET = 'AELF',
  TDVV_NET = 'tDVV',
  TDVW_NET = 'tDVW',
}

export function getAElf(rpcUrl: string) {
  return new AElf(new AElf.providers.HttpProvider(rpcUrl, 60000));
}

async function getProto(address, rpc) {
  const aelf = getAElf(rpc);
  if (!CONTRACT_PROTOS[address]) {
    try {
      const file = await aelf.chain.getContractFileDescriptorSet(address);
      CONTRACT_PROTOS[address] = AElf.pbjs.Root.fromDescriptor(file);
    } catch (e) {
      return null;
    }
  }
  return CONTRACT_PROTOS[address];
}

function decodeBase64(str) {
  const { util } = AElf.pbjs;
  const buffer = util.newBuffer(util.base64.length(str));
  util.base64.decode(str, buffer, 0);
  return buffer;
}
export async function deserializeLog(log, rpc) {
  const { Indexed = [], NonIndexed, Name, Address } = log;
  const proto = await getProto(Address, rpc);
  if (!proto) {
    return {};
  }
  const serializedData = [...(Indexed || [])];
  if (NonIndexed) {
    serializedData.push(NonIndexed);
  }
  const dataType = proto.lookupType(Name);
  let deserializeLogResult = serializedData.reduce((acc, v) => {
    let deserialize = dataType.decode(decodeBase64(v));
    deserialize = dataType.toObject(deserialize, {
      enums: String, // enums as string names
      longs: String, // longs as strings (requires long.js)
      bytes: String, // bytes as base64 encoded strings
      defaults: false, // includes default values
      arrays: true, // populates empty arrays (repeated fields) even if defaults=false
      objects: true, // populates empty objects (map fields) even if defaults=false
      oneofs: true, // includes virtual oneof fields set to the present field's name
    });
    return {
      ...acc,
      ...deserialize,
    };
  }, {});
  // eslint-disable-next-line max-len
  deserializeLogResult = AElf.utils.transform.transform(
    dataType,
    deserializeLogResult,
    AElf.utils.transform.OUTPUT_TRANSFORMERS,
  );
  deserializeLogResult = AElf.utils.transform.transformArrayToMap(dataType, deserializeLogResult);
  return deserializeLogResult;
}

/**
 * use token contract for examples to demonstrate how to get a contract instance.
 * @param tokenContractAddress address of token contract
 * @returns a contract instance.
 */
export const getContractInstance = async (tokenContractAddress: string, rpcUrl: string) => {
  // const aelf = new AElf(new AElf.providers.HttpProvider('https://explorer-test.aelf.io/chain'));
  const aelf = getAElf(rpcUrl);
  const wallet = AElf.wallet.createNewWallet();

  const contract = await aelf.chain.contractAt(tokenContractAddress, wallet);
  return contract;
};
