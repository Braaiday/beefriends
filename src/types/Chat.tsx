export interface Chat {
  id: string;
  participants: string[];
  friendlyNames: string[];
  type: "private" | "group";
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  name?: string;
  avatarUrl?: string;
  unreadCounts?: Record<string, number>; 
}
