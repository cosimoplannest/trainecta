
interface FollowupStatusBadgeProps {
  type: string;
  outcome: string | null;
}

const FollowupStatusBadge = ({ type, outcome }: FollowupStatusBadgeProps) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
        {type === "whatsapp" 
          ? "WhatsApp" 
          : type === "call" 
          ? "Chiamata"
          : type === "email"
          ? "Email"
          : type === "in_app"
          ? "App"
          : type}
      </span>
      {outcome && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          outcome.toLowerCase().includes("positiv") 
            ? "bg-green-100 text-green-800" 
            : outcome.toLowerCase().includes("negativ") 
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800"
        }`}>
          {outcome}
        </span>
      )}
    </div>
  );
};

export default FollowupStatusBadge;
