import React, { createContext, useContext, useEffect, useState } from 'react';

type ListContextType = {
  list: string[];
  addToList: (item: string) => void;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [list, setList] = useState<string[]>([]);

  const addToList = (item: string) => {
    setList((prevList) => [...prevList, item]);
  };

  useEffect(() => {
    console.log("Shared list updated:", list);
  }, [list]);

  return (
    <ListContext.Provider value={{ list, addToList }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = (): ListContextType => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
};