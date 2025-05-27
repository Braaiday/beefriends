export interface Notification {
  id: string;
  text: string;
  participants: string[];
  createdAt: Date;
  chatId: string | null;
}
