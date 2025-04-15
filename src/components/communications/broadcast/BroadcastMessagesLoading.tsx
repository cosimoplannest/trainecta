
import { LoaderCircle } from "lucide-react";

export function BroadcastMessagesLoading() {
  return (
    <div className="flex items-center justify-center py-10">
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
