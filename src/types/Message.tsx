// types/Message.ts
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  seenBy: string[];
}
