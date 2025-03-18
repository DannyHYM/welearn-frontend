"use client"

import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { LucideIcon, Plus, MoreVertical, LogOut, Trash2, GripVertical, BookOpen, Users, GraduationCap, Brain, Lightbulb, BookMarked, Target, Trophy, Star, Heart, BookOpenCheck, BookOpenText, BookOpenCheckIcon, BookOpenTextIcon, BookOpenIcon, UsersIcon, GraduationCapIcon, BrainIcon, LightbulbIcon, BookMarkedIcon, TargetIcon, TrophyIcon, StarIcon, HeartIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"
import { useGroupStore, type GroupState } from "@/components/Header"
import { useGroupsStore } from "@/lib/store/groups"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const AVAILABLE_ICONS = [
  { name: "Book", icon: BookOpenIcon },
  { name: "Users", icon: UsersIcon },
  { name: "Graduation Cap", icon: GraduationCapIcon },
  { name: "Brain", icon: BrainIcon },
  { name: "Lightbulb", icon: LightbulbIcon },
  { name: "Bookmarked", icon: BookMarkedIcon },
  { name: "Target", icon: TargetIcon },
  { name: "Trophy", icon: TrophyIcon },
  { name: "Star", icon: StarIcon },
  { name: "Heart", icon: HeartIcon },
  { name: "Book Open Check", icon: BookOpenCheckIcon },
  { name: "Book Open Text", icon: BookOpenTextIcon },
]

function SortableItem({ 
  item, 
  index,
  onDelete,
  onExit,
  isActive,
  onGroupSelect,
  onUpdateIcon
}: { 
  item: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }
  index: number
  onDelete: (title: string) => void
  onExit: (title: string) => void
  isActive: boolean
  onGroupSelect: (title: string) => void
  onUpdateIcon: (title: string, icon: LucideIcon) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.title })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [iconDialogOpen, setIconDialogOpen] = useState(false)

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center touch-none">
      <button
        {...attributes}
        {...listeners}
        className="flex h-8 w-8 items-center justify-center hover:cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <button
        onClick={() => onGroupSelect(item.title)}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start flex-1",
          isActive && "bg-accent",
          "hover:bg-accent"
        )}
      >
        <item.icon className="mr-2 h-4 w-4" />
        {item.title}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIconDialogOpen(true)}>
            <item.icon className="mr-2 h-4 w-4" />
            Change Icon
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setExitDialogOpen(true)}
            className="text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Exit Group
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={iconDialogOpen} onOpenChange={setIconDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Group Icon</DialogTitle>
            <DialogDescription>
              Select a new icon for your group.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-4 gap-4">
              {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                <Button
                  key={name}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    onUpdateIcon(item.title, Icon)
                    setIconDialogOpen(false)
                  }}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs text-center">{name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              and remove all data associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(item.title)
                setDeleteDialogOpen(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit this group? You'll need a new invitation code to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onExit(item.title)
                setExitDialogOpen(false)
              }}
            >
              Exit Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function NavMain() {
  const [open, setOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [groupCode, setGroupCode] = useState("")
  
  // Use separate selectors to prevent unnecessary re-renders
  const currentGroup = useGroupStore((state: GroupState) => state.currentGroup)
  const setCurrentGroup = useGroupStore((state: GroupState) => state.setCurrentGroup)
  
  const { groups, addGroup, deleteGroup, exitGroup, updateGroupIcon } = useGroupsStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // TODO: Implement drag and drop reordering in the store
    }
  }

  const handleCreateGroup = useCallback(() => {
    if (newGroupName.trim()) {
      addGroup({
        title: newGroupName,
        icon: BookOpenIcon, // Default icon
        isActive: false
      })
      setNewGroupName("")
      setOpen(false)
    }
  }, [newGroupName, addGroup])

  const handleDeleteGroup = useCallback((title: string) => {
    deleteGroup(title)
    if (currentGroup === title) {
      setCurrentGroup("")
    }
  }, [currentGroup, setCurrentGroup, deleteGroup])

  const handleExitGroup = useCallback((title: string) => {
    exitGroup(title)
    if (currentGroup === title) {
      setCurrentGroup("")
    }
  }, [currentGroup, setCurrentGroup, exitGroup])

  const handleGroupSelect = useCallback((title: string) => {
    setCurrentGroup(title)
  }, [setCurrentGroup])

  return (
    <SidebarGroup className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between px-0">
        <SidebarGroupLabel>Learning Groups</SidebarGroupLabel>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join or Create a Group</DialogTitle>
              <DialogDescription>
                Join an existing group with a code or create your own learning group.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="join">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="join">Join Group</TabsTrigger>
                <TabsTrigger value="create">Create Group</TabsTrigger>
              </TabsList>
              <TabsContent value="join" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groupCode">Group Code</Label>
                  <Input
                    id="groupCode"
                    placeholder="Enter group code"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Join Group</Button>
                </DialogFooter>
              </TabsContent>
              <TabsContent value="create" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup}>Create Group</Button>
                </DialogFooter>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <nav className="grid gap-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={groups.map(item => item.title)}
            strategy={verticalListSortingStrategy}
          >
            {groups.map((item, index) => (
              <SortableItem 
                key={item.title} 
                item={item} 
                index={index}
                isActive={currentGroup === item.title}
                onGroupSelect={handleGroupSelect}
                onDelete={handleDeleteGroup}
                onExit={handleExitGroup}
                onUpdateIcon={updateGroupIcon}
              />
            ))}
          </SortableContext>
        </DndContext>
      </nav>
    </SidebarGroup>
  )
}
