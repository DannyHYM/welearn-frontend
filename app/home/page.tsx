"use client"

import { GroupChat } from "@/components/group-chat"
import { useGroupStore } from "@/components/Header"

export default function HomePage() {
  const currentGroup = useGroupStore((state) => state.currentGroup)
  return <GroupChat groupName={currentGroup} />
}
