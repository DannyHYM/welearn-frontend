"use client"

import { useState } from "react"
import { MessageSquare, Share2, BookmarkPlus, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Post {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  replies: number
}

export function GroupChat({ groupName }: { groupName: string }) {
  if (!groupName) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-4">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome to WeLearn!</h2>
          <p className="text-muted-foreground">
            You haven't joined any learning groups yet. Create or join a group to start sharing your daily learnings with others.
          </p>
          <p className="text-sm text-muted-foreground">
            Click the + button next to "Learning Groups" in the sidebar to get started.
          </p>
        </div>
      </div>
    )
  }

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg"
      },
      content: "Just learned about React Server Components today! They're a game-changer for performance optimization. Key takeaway: they run on the server and reduce client-side JavaScript.",
      timestamp: "2 hours ago",
      likes: 12,
      replies: 3
    },
    {
      id: "2",
      user: {
        name: "Alex Thompson",
        avatar: "/avatars/alex.jpg"
      },
      content: "Deep dive into TypeScript generics today. Here's a quick tip: use 'extends' to constrain generic types. Example: `<T extends object>`. This ensures better type safety!",
      timestamp: "4 hours ago",
      likes: 8,
      replies: 5
    }
  ])

  return (
    <div className="flex flex-col h-full">
      {/* Chat Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="group rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{post.user.name}</p>
                      <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {post.replies}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <BookmarkPlus className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-6">
        <div className="flex space-x-4">
          <Input 
            placeholder="Share what you learned today..." 
            className="flex-1"
          />
          <Button>Post</Button>
        </div>
      </div>
    </div>
  )
} 