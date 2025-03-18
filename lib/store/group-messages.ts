import { create } from 'zustand'

export interface Post {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  replies: number
  // Add userId for authorization checks
  userId?: string
}

interface GroupMessages {
  [groupId: string]: Post[]
}

interface GroupMessagesState {
  messages: GroupMessages
  // Function to add a new message to a specific group
  addMessage: (groupId: string, message: Omit<Post, 'id' | 'timestamp' | 'likes' | 'replies'>) => void
  // Function to get messages for a specific group
  getGroupMessages: (groupId: string) => Post[]
  // Function to like a message
  likeMessage: (groupId: string, messageId: string) => void
  // Function to delete a message
  deleteMessage: (groupId: string, messageId: string) => void
}

export const useGroupMessagesStore = create<GroupMessagesState>((set, get) => ({
  messages: {
    // Sample data for demonstration - this will be replaced with API calls
    "Group 1": [
      {
        id: "1",
        user: {
          name: "Sarah Chen",
          avatar: "/avatars/sarah.jpg"
        },
        content: "Just learned about React Server Components today! They're a game-changer for performance optimization. Key takeaway: they run on the server and reduce client-side JavaScript.",
        timestamp: "2 hours ago",
        likes: 12,
        replies: 3,
        userId: "sarah123"
      }
    ],
    "Group 2": [
      {
        id: "2",
        user: {
          name: "Alex Thompson",
          avatar: "/avatars/alex.jpg"
        },
        content: "Deep dive into TypeScript generics today. Here's a quick tip: use 'extends' to constrain generic types. Example: `<T extends object>`. This ensures better type safety!",
        timestamp: "4 hours ago",
        likes: 8,
        replies: 5,
        userId: "alex456"
      }
    ]
  },

  // Add a new message to a group
  addMessage: (groupId, message) => {
    set((state) => {
      // TODO: In the future, this will be an API call like:
      // await api.post('/groups/${groupId}/messages', message)
      
      const newMessage: Post = {
        ...message,
        id: Math.random().toString(), // This will come from the backend in the future
        timestamp: "Just now", // This will be handled by the backend
        likes: 0,
        replies: 0,
        userId: "current-user" // This will come from auth in the future
      }

      return {
        messages: {
          ...state.messages,
          [groupId]: [...(state.messages[groupId] || []), newMessage]
        }
      }
    })
  },

  // Get messages for a specific group
  getGroupMessages: (groupId) => {
    // TODO: In the future, this will be an API call like:
    // const messages = await api.get('/groups/${groupId}/messages')
    return get().messages[groupId] || []
  },

  // Like a message
  likeMessage: (groupId, messageId) => {
    set((state) => {
      // TODO: In the future, this will be an API call like:
      // await api.post('/groups/${groupId}/messages/${messageId}/like')
      
      const groupMessages = state.messages[groupId] || []
      const updatedMessages = groupMessages.map(message => 
        message.id === messageId 
          ? { ...message, likes: message.likes + 1 }
          : message
      )

      return {
        messages: {
          ...state.messages,
          [groupId]: updatedMessages
        }
      }
    })
  },

  // Delete a message
  deleteMessage: async (groupId: string, messageId: string) => {
    // TODO: In the future, this will be an API call like:
    // await api.delete('/groups/${groupId}/messages/${messageId}')
    // This should include authorization checks on the backend
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    set((state) => {
      const groupMessages = state.messages[groupId] || []
      const updatedMessages = groupMessages.filter(message => message.id !== messageId)

      return {
        messages: {
          ...state.messages,
          [groupId]: updatedMessages
        }
      }
    })
  }
})) 