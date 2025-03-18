"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Share2, BookmarkPlus, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGroupMessagesStore, type Post } from "@/lib/store/group-messages"

export function GroupChat({ groupName }: { groupName: string }) {
  const [newMessage, setNewMessage] = useState("")
  const { getGroupMessages, addMessage, likeMessage } = useGroupMessagesStore()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  
  // Get messages for this specific group
  const posts = getGroupMessages(groupName)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [posts]) // Re-run when posts change

  if (!groupName) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-4">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome to WeLearn!</h2>
          <p className="text-muted-foreground">
            Looks like you haven't selected or joined any learning groups yet. Create or join a group to start sharing your daily learnings with others.
          </p>
          <p className="text-sm text-muted-foreground">
            Click the + button next to "Learning Groups" in the sidebar to get started.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // TODO: In the future, this will also include user data from auth
    addMessage(groupName, {
      user: {
        name: "Current User",
        avatar: "/avatars/default.jpg"
      },
      content: newMessage
    })

    setNewMessage("")
  }

  const handleLike = (messageId: string) => {
    likeMessage(groupName, messageId)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Message List */}
      <div className="flex-1 min-h-0"> {/* min-h-0 is crucial for nested flex scroll */}
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="space-y-8 p-6">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                ref={index === posts.length - 1 ? lastMessageRef : null}
                className="group rounded-xl bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => handleLike(post.id)}
                      >
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
            {/* Invisible element to scroll to */}
            <div ref={lastMessageRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-none border-t bg-background p-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input 
            placeholder="Share what you learned today..." 
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit">Post</Button>
        </form>
      </div>
    </div>
  )
} 