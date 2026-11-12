import React, { createContext, useContext, useState } from 'react';
import { ActiveTab } from '@/types';

interface DeliveryTabContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeOrdersCount: number;
  setActiveOrdersCount: (count: number) => void;
}

const DeliveryTabContext = createContext<DeliveryTabContextType | undefined>(undefined);

export const DeliveryTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('active');
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(0);

  return (
    <DeliveryTabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeOrdersCount,
        setActiveOrdersCount,
      }}
    >
      {children}
    </DeliveryTabContext.Provider>
  );
};

export const useDeliveryTab = () => {
  const context = useContext(DeliveryTabContext);
  if (!context) {
    return {
      activeTab: 'active' as ActiveTab,
      setActiveTab: () => {},
      activeOrdersCount: 0,
      setActiveOrdersCount: () => {},
    };
  }
  return context;
};
