
interface TemplateStatusBadgesProps {
  conversionStatus: string | null;
  deliveryStatus: string;
  deliveryChannel: string;
}

const TemplateStatusBadges = ({ 
  conversionStatus, 
  deliveryStatus, 
  deliveryChannel 
}: TemplateStatusBadgesProps) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        conversionStatus === "converted" 
          ? "bg-green-100 text-green-800" 
          : conversionStatus === "not_converted"
          ? "bg-red-100 text-red-800"
          : "bg-amber-100 text-amber-800"
      }`}>
        {conversionStatus === "converted" 
          ? "Convertito" 
          : conversionStatus === "not_converted"
          ? "Non Convertito"
          : "In attesa"}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        deliveryStatus === "delivered" 
          ? "bg-blue-100 text-blue-800" 
          : "bg-gray-100 text-gray-800"
      }`}>
        {deliveryStatus === "delivered" ? "Consegnato" : "Non consegnato"}
      </span>
      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
        {deliveryChannel === "whatsapp" ? "WhatsApp" : "Email"}
      </span>
    </div>
  );
};

export default TemplateStatusBadges;
