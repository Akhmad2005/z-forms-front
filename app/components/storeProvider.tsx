'use client'; 

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from '@/app/store/store'; 

interface ProvidersProps {
  children: ReactNode;
}

const StoreProvider: React.FC<ProvidersProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>; 
};

export default StoreProvider;