
import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ClientNotesCardProps {
  notes: string;
}

export const ClientNotesCard = ({ notes }: ClientNotesCardProps) => {
  if (!notes) return null;
  
  return (
    <Card className="mt-4 bg-white shadow-md">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b">
        <CardTitle className="text-xl flex items-center gap-1">
          <Info className="h-5 w-5" />
          Note Interne
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-sm whitespace-pre-line">{notes}</p>
      </CardContent>
    </Card>
  );
};
