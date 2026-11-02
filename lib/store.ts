import { create } from 'zustand';

type Transition = { active: boolean; href: string; label: string; sub: string; id: number };

type State = {
  selected: string | null;
  select: (id: string | null) => void;
  discovered: Record<string, true>;
  markDiscovered: (key: string) => void;

  transition: Transition;
  travel: (href: string, label: string, sub?: string) => void;
  endTransition: () => void;

  soundOn: boolean;
  setSoundOn: (v: boolean) => void;
  track: string;
  setTrack: (t: string) => void;
};

export const useStore = create<State>((set, get) => ({
  selected: null,
  select: (id) => set({ selected: id }),
  discovered: {},
  markDiscovered: (key) => {
    if (get().discovered[key]) return;
    set({ discovered: { ...get().discovered, [key]: true } });
  },

  transition: { active: false, href: '/', label: '', sub: '', id: 0 },
  travel: (href, label, sub = '') => {
    if (get().transition.active) return;
    set({ transition: { active: true, href, label, sub, id: get().transition.id + 1 } });
  },
  endTransition: () => set({ transition: { ...get().transition, active: false } }),

  soundOn: false,
  setSoundOn: (v) => set({ soundOn: v }),
  track: 'portal',
  setTrack: (t) => set({ track: t }),
}));
