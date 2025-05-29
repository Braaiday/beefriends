export const MessageSkeleton = ({
  isCurrentUser,
}: {
  isCurrentUser: boolean;
}) => {
  return (
    <div
      className={`flex gap-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar skeleton */}
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-background animate-pulse" />
      )}

      <div className="flex flex-col items-start max-w-[75%] space-y-2">
        <div
          className={`px-4 py-2 rounded-lg shadow break-words ${
            isCurrentUser
              ? "bg-primary/50 rounded-br-none self-end animate-pulse"
              : "bg-card/50 rounded-bl-none animate-pulse"
          }`}
          style={{ width: isCurrentUser ? "120px" : "160px", height: "20px" }}
        />
        <div
          className={`h-4 rounded ${
            isCurrentUser ? "self-end" : ""
          } bg-muted/50 animate-pulse`}
          style={{ width: "60px" }}
        />
      </div>

      {/* Avatar skeleton on the right for current user */}
      {isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-background animate-pulse" />
      )}
    </div>
  );
};
