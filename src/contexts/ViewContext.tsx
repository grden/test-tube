import { createContext, useContext, useState } from 'react';

interface ViewContextType {
  isWatching: boolean;
  setIsWatching: (v: boolean) => void;
}

export const ViewContext = createContext<ViewContextType>({
  isWatching: false,
  setIsWatching: () => {},
});

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [isWatching, setIsWatching] = useState(false);
  return (
    <ViewContext.Provider value={{ isWatching, setIsWatching }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useViewContext = () => useContext(ViewContext);
