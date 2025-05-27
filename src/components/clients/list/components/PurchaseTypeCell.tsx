
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

interface PurchaseTypeCellProps {
  purchaseType?: string | null;
}

export function PurchaseTypeCell({ purchaseType }: PurchaseTypeCellProps) {
  const getPurchaseStatusBadge = (purchaseType: string | null) => {
    if (!purchaseType || purchaseType === 'none') {
      return <Badge variant="outline" className="bg-yellow-50">In attesa</Badge>;
    }
    const variants = {
      'package': 'bg-green-50 text-green-700 border-green-200',
      'custom_plan': 'bg-blue-50 text-blue-700 border-blue-200'
    };
    const labels = {
      'package': 'Pacchetto',
      'custom_plan': 'Scheda personalizzata'
    };
    return (
      <Badge 
        variant="outline" 
        className={variants[purchaseType as keyof typeof variants]}
      >
        {labels[purchaseType as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <ShoppingBag className="h-4 w-4" />
      {getPurchaseStatusBadge(purchaseType)}
    </div>
  );
}
