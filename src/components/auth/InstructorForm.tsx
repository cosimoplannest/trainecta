
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Specialty {
  id: string;
  name: string;
  description: string | null;
}

interface InstructorFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  validationError: string;
  isLoading: boolean;
  loadingSpecialties: boolean;
  specialties: Specialty[];
  selectedSpecialties: string[];
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleSpecialtyChange: (specialtyId: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const InstructorForm: React.FC<InstructorFormProps> = ({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
  validationError,
  isLoading,
  loadingSpecialties,
  specialties,
  selectedSpecialties,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
  setPassword,
  setConfirmPassword,
  handleSpecialtyChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Cognome</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefono</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Conferma Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Specializzazioni</Label>
        {loadingSpecialties ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : specialties.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 mt-2">
            {specialties.map((specialty) => (
              <div key={specialty.id} className="flex items-center space-x-2">
                <Checkbox
                  id={specialty.id}
                  checked={selectedSpecialties.includes(specialty.id)}
                  onCheckedChange={() => handleSpecialtyChange(specialty.id)}
                />
                <Label htmlFor={specialty.id} className="cursor-pointer">
                  {specialty.name}
                  {specialty.description && (
                    <p className="text-xs text-muted-foreground">{specialty.description}</p>
                  )}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nessuna specializzazione disponibile. Contatta l'amministratore.</p>
        )}
      </div>
      
      {validationError && (
        <p className="text-destructive text-sm">{validationError}</p>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading || specialties.length === 0}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrazione in corso...
          </>
        ) : (
          "Registrati"
        )}
      </Button>
    </form>
  );
};
