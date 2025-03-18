import { create } from 'zustand'
import { LucideIcon } from 'lucide-react'

export interface Group {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}

interface GroupsState {
  groups: Group[]
  addGroup: (group: Omit<Group, 'url'>) => void
  deleteGroup: (title: string) => void
  exitGroup: (title: string) => void
  updateGroupIcon: (title: string, icon: LucideIcon) => void
}

export const useGroupsStore = create<GroupsState>((set) => ({
  groups: [],
  
  addGroup: (group) => {
    set((state) => ({
      groups: [
        ...state.groups,
        {
          ...group,
          url: `/${group.title.toLowerCase().replace(/\s+/g, '-')}`,
        }
      ]
    }))
  },

  deleteGroup: (title) => {
    set((state) => ({
      groups: state.groups.filter(group => group.title !== title)
    }))
  },

  exitGroup: (title) => {
    set((state) => ({
      groups: state.groups.filter(group => group.title !== title)
    }))
  },

  updateGroupIcon: (title, icon) => {
    set((state) => ({
      groups: state.groups.map(group => 
        group.title === title 
          ? { ...group, icon }
          : group
      )
    }))
  }
})) 