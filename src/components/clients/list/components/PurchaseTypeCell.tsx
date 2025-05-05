
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { ClientData } from "../../types/client-types";
import { getPurchaseStatusBadge } from "../utils/tableUtils";

interface PurchaseTypeCellProps {
  client: ClientData;
}

export function PurchaseTypeCell({ client }: PurchaseTypeCellProps) {
  const badgeInfo = getPurchaseStatusBadge(client.purchase_type);
  
  return (
    <div className="flex items-center gap-2">
      <ShoppingBag className="h-4 w-4" />
      <Badge variant="outline" className={badgeInfo.className}>
        {badgeInfo.label}
      </Badge>
    </div>
  );
}
