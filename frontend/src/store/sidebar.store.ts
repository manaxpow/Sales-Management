import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isExpanded: boolean;
  toggleSidebar: (payload: boolean) => void;
}

export const useSideBarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isExpanded: true,

      toggleSidebar: (payload: boolean) => {
        set({ isExpanded: !payload });
      },
    }),
    {
      name: "sidebar-storage",
    }
  )
);
