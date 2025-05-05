
import { Phone, Mail, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactInfoProps {
  phone: string | null;
  email: string | null;
  contactTime: string | null;
  contactMethod: string | null;
}

export const ContactInfoSection = ({ phone, email, contactTime, contactMethod }: ContactInfoProps) => {
  const openWhatsApp = () => {
    if (phone) {
      // Remove any non-digit characters from phone
      const phoneDigits = phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneDigits}`, '_blank');
    }
  };

  return (
    <div className="py-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contatti</h3>
      
      {phone && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{phone}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50"
            onClick={openWhatsApp}
          >
            <MessageSquare className="mr-1.5 h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      )}
      
      {email && (
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{email}</span>
        </div>
      )}
      
      {/* Preferenze di Contatto */}
      <div className="mt-2 grid grid-cols-1 gap-2">
        {contactTime && (
          <div className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded-md">
            <Bell className="h-4 w-4 text-amber-600" />
            <div>
              <span className="text-gray-600">Preferisce essere contattato:</span>{' '}
              <span className="font-medium">{contactTime === 'morning' ? 'Mattina' : 
                contactTime === 'afternoon' ? 'Pomeriggio' : 
                contactTime === 'evening' ? 'Sera' : contactTime}</span>
            </div>
          </div>
        )}
        
        {contactMethod && (
          <div className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded-md">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <div>
              <span className="text-gray-600">Modalità preferita:</span>{' '}
              <span className="font-medium">{contactMethod === 'phone' ? 'Telefonata' : 
                contactMethod === 'message' ? 'Messaggio' : contactMethod}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
