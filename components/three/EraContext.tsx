'use client';
import { createContext, useContext } from 'react';
import type { Era } from '@/lib/eras';

export const EraContext = createContext<Era | null>(null);
export const useEra = () => {
  const era = useContext(EraContext);
  if (!era) throw new Error('useEra must be used inside <EraContext.Provider>');
  return era;
};
