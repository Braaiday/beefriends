export interface Chat {
  id: string;
  createdBy: string;
  participants: string[];
  friendlyNames: Record<string, string>;
  photoURLs: Record<string, string>;
  type: "private" | "group";
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  } | null;
  name?: string;
  avatarUrl?: string;
  unreadCounts?: Record<string, number>;
}
