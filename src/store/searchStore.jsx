// src/store/searchStore.jsx - 검색 스토어 관리
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

// eslint-disable-next-line react-refresh/only-export-components
// 검색 스토어 훅 사용 (SearchProvider 내에서만 사용)
export function useSearchStore() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("SearchProvider 내에서 사용해야 합니다.");
  return context;
}