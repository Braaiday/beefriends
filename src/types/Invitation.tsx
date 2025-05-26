export interface Invitation {
  id: string;
  createdAt: Date;
  participants: string[];
  status: "pending" | "accepted" | "rejected";
  initiatedBy: string;
  friendlyNames: Record<string, string>;
}
