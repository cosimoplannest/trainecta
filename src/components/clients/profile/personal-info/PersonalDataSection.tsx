
import { User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface PersonalDataProps {
  firstName: string;
  lastName: string;
  gender: string | null;
  birthDate: string | null;
}

export const PersonalDataSection = ({ firstName, lastName, gender, birthDate }: PersonalDataProps) => {
  return (
    <div className="py-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Dati Anagrafici</h3>
      
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
          <User className="h-5 w-5 text-purple-700" />
        </div>
        <div>
          <p className="font-medium text-lg">{firstName} {lastName}</p>
          <p className="text-sm text-gray-600">{gender === 'male' ? 'Uomo' : gender === 'female' ? 'Donna' : gender || "Genere non specificato"}</p>
        </div>
      </div>
      
      {birthDate && (
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <div>
            <span className="text-gray-600">Data di nascita:</span>{' '}
            <span className="font-medium">{format(new Date(birthDate), "d MMMM yyyy", { locale: it })}</span>
          </div>
        </div>
      )}
    </div>
  );
};
