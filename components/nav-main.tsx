"use client"

import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { LucideIcon, Plus, MoreVertical, LogOut, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar"
import { useGroupStore, type GroupState } from "@/components/Header"
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

interface NavMainProps {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
}

function SortableItem({ 
  item, 
  index,
  onDelete,
  onExit,
  isActive,
  onGroupSelect
}: { 
  item: NavMainProps["items"][0]
  index: number
  onDelete: (title: string) => void
  onExit: (title: string) => void
  isActive: boolean
  onGroupSelect: (title: string) => void
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

export function NavMain({ items: initialItems }: NavMainProps) {
  const [items, setItems] = useState(initialItems)
  const [open, setOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [groupCode, setGroupCode] = useState("")
  
  // Use separate selectors to prevent unnecessary re-renders
  const currentGroup = useGroupStore((state: GroupState) => state.currentGroup)
  const setCurrentGroup = useGroupStore((state: GroupState) => state.setCurrentGroup)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.title === active.id)
        const newIndex = prevItems.findIndex((item) => item.title === over.id)
        return arrayMove(prevItems, oldIndex, newIndex)
      })
    }
  }

  const handleCreateGroup = useCallback(() => {
    if (newGroupName.trim()) {
      setItems(prevItems => [
        ...prevItems,
        {
          title: newGroupName,
          url: `/${newGroupName.toLowerCase().replace(/\s+/g, '-')}`,
          icon: Plus,
          isActive: false
        }
      ])
      setNewGroupName("")
      setOpen(false)
    }
  }, [newGroupName])

  const handleDeleteGroup = useCallback((title: string) => {
    setItems(prevItems => prevItems.filter(item => item.title !== title))
    if (currentGroup === title) {
      setCurrentGroup("")
    }
  }, [currentGroup, setCurrentGroup])

  const handleExitGroup = useCallback((title: string) => {
    setItems(prevItems => prevItems.filter(item => item.title !== title))
    if (currentGroup === title) {
      setCurrentGroup("")
    }
  }, [currentGroup, setCurrentGroup])

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
            items={items.map(item => item.title)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
              <SortableItem 
                key={item.title} 
                item={item} 
                index={index}
                isActive={currentGroup === item.title}
                onGroupSelect={handleGroupSelect}
                onDelete={handleDeleteGroup}
                onExit={handleExitGroup}
              />
            ))}
          </SortableContext>
        </DndContext>
      </nav>
    </SidebarGroup>
  )
}
