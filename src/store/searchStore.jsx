// src/store/searchStore.jsx
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return (
    <SearchContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchStore() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("SearchProvider 내에서 사용해야 합니다.");
  return context;
}