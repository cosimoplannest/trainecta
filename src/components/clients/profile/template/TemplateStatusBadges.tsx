
import { Badge } from "@/components/ui/badge";

interface TemplateStatusBadgesProps {
  deliveryStatus?: string | null;
  deliveryChannel?: string | null;
  conversionStatus?: string | null;
}

const TemplateStatusBadges = ({ 
  deliveryStatus, 
  deliveryChannel, 
  conversionStatus 
}: TemplateStatusBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {deliveryStatus && (
        <Badge 
          variant="outline" 
          className={`
            ${deliveryStatus === 'sent' ? 'bg-green-50 text-green-700 border-green-200' : ''}
            ${deliveryStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
            ${deliveryStatus === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : ''}
          `}
        >
          {deliveryStatus === 'sent' ? 'Inviato' : 
           deliveryStatus === 'pending' ? 'In attesa' : 
           deliveryStatus === 'failed' ? 'Fallito' : 
           deliveryStatus}
        </Badge>
      )}
      
      {deliveryChannel && (
        <Badge 
          variant="outline" 
          className={`
            ${deliveryChannel === 'whatsapp' ? 'bg-green-50 text-green-700 border-green-200' : ''}
            ${deliveryChannel === 'email' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
            ${deliveryChannel === 'sms' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
          `}
        >
          {deliveryChannel === 'whatsapp' ? 'WhatsApp' : 
           deliveryChannel === 'email' ? 'Email' : 
           deliveryChannel === 'sms' ? 'SMS' : 
           deliveryChannel}
        </Badge>
      )}
      
      {conversionStatus && (
        <Badge 
          variant="outline" 
          className={`
            ${conversionStatus === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
            ${conversionStatus === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
            ${conversionStatus === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
            ${conversionStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
          `}
        >
          {conversionStatus === 'completed' ? 'Completato' : 
           conversionStatus === 'in_progress' ? 'In corso' : 
           conversionStatus === 'pending' ? 'In attesa' : 
           conversionStatus === 'rejected' ? 'Rifiutato' : 
           conversionStatus}
        </Badge>
      )}
    </div>
  );
};

export default TemplateStatusBadges;
