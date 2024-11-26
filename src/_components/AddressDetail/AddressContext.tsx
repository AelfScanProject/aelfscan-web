import { createContext, useContext } from 'react';

interface IAddressContext {
  isAddress: boolean;
}

export const AddressContext = createContext<IAddressContext | undefined>(undefined);

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('error');
  }
  return context;
};

interface AddressContextProviderProps {
  isAddress: boolean;
  children: React.ReactNode;
}

export const AddressContextProvider: React.FC<AddressContextProviderProps> = ({ isAddress, children }) => {
  return <AddressContext.Provider value={{ isAddress }}>{children}</AddressContext.Provider>;
};
