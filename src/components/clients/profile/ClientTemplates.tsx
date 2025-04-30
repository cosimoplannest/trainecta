
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TemplateItem from "./template/TemplateItem";
import EmptyTemplates from "./template/EmptyTemplates";
import { AssignedTemplate } from "@/types/workout";

interface ClientTemplatesProps {
  templates: AssignedTemplate[];
  clientPhone?: string;
}

const ClientTemplates = ({ templates, clientPhone }: ClientTemplatesProps) => {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const toggleTemplateDetails = (templateId: string) => {
    if (activeTemplate === templateId) {
      setActiveTemplate(null);
    } else {
      setActiveTemplate(templateId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schede Assegnate</CardTitle>
        <CardDescription>Schede di allenamento assegnate al cliente</CardDescription>
      </CardHeader>
      <CardContent>
        {templates.length > 0 ? (
          <div className="space-y-4">
            {templates.map((template) => (
              <TemplateItem
                key={template.id}
                template={template}
                isActive={activeTemplate === template.id}
                onToggle={() => toggleTemplateDetails(template.id)}
                clientPhone={clientPhone}
              />
            ))}
          </div>
        ) : (
          <EmptyTemplates />
        )}
      </CardContent>
    </Card>
  );
};

export default ClientTemplates;
