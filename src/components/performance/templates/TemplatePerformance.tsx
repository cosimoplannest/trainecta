
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateUsageCard } from "../components/TemplateUsageCard";
import { PerformanceChartCard } from "../components/PerformanceChartCard";
import { usePerformanceData } from "../hooks/usePerformanceData";

export const TemplatePerformance = () => {
  const { 
    data: templateData, 
    isLoading: isLoadingTemplates 
  } = usePerformanceData("month", "templates");
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TemplateUsageCard 
        data={templateData || []}
        loading={isLoadingTemplates}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Schede</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <PerformanceChartCard 
              data={templateData || []} 
              loading={isLoadingTemplates}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
