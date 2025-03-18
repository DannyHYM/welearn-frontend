"use client"

import { PanelLeftClose } from "lucide-react"
import { create } from "zustand"
import { useSidebar } from "@/components/ui/sidebar"

export interface GroupState {
  currentGroup: string
  setCurrentGroup: (group: string) => void
}

export const useGroupStore = create<GroupState>((set) => ({
  currentGroup: "",
  setCurrentGroup: (group: string) => set({ currentGroup: group }),
}))

export function Header() {
  const { toggleSidebar } = useSidebar()
  const currentGroup = useGroupStore((state: GroupState) => state.currentGroup)

  return (
    <header className="flex h-14 items-center gap-4 border-b px-6">
      <button
        onClick={toggleSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent"
      >
        <PanelLeftClose className="h-4 w-4" />
      </button>
      {currentGroup && (
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{currentGroup}</h1>
        </div>
      )}
    </header>
  )
} 