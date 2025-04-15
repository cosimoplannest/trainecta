
import { FileText } from "lucide-react";

const EmptyQuestionnaires = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-lg mb-1">Nessun questionario</h3>
      <p className="text-muted-foreground max-w-md">
        Non ci sono questionari in questa categoria. Aggiungi un nuovo questionario usando il pulsante "Nuovo questionario".
      </p>
    </div>
  );
};

export default EmptyQuestionnaires;
