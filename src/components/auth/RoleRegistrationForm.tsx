
import { useState } from "react";
import { Loader2, User, Mail, Phone, Lock, Eye, EyeOff, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Specialty {
  id: string;
  name: string;
  description: string | null;
}

export interface RoleRegistrationFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  validationError: string;
  isLoading: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone?: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  // Optional props for instructor specialties
  loadingSpecialties?: boolean;
  specialties?: Specialty[];
  selectedSpecialties?: string[];
  handleSpecialtyChange?: (specialtyId: string) => void;
  // Role-specific display options
  showPhoneField?: boolean;
  roleName: string;
  requiresSpecialties?: boolean;
}

export const RoleRegistrationForm: React.FC<RoleRegistrationFormProps> = ({
  firstName,
  lastName,
  email,
  phone = "",
  password,
  confirmPassword,
  validationError,
  isLoading,
  setFirstName,
  setLastName,
  setEmail,
  setPhone = () => {},
  setPassword,
  setConfirmPassword,
  handleSubmit,
  // Optional specialty props
  loadingSpecialties = false,
  specialties = [],
  selectedSpecialties = [],
  handleSpecialtyChange = () => {},
  // Display options
  showPhoneField = false,
  roleName,
  requiresSpecialties = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Validazione in tempo reale
  const passwordMatch = password === confirmPassword;
  const passwordStrong = password.length >= 6;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = !showPhoneField || phone.length >= 8;

  // Determine if form is valid based on requirements
  const formIsValid = 
    firstName && 
    lastName && 
    emailValid && 
    phoneValid && 
    passwordStrong && 
    passwordMatch && 
    (!requiresSpecialties || selectedSpecialties.length > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nome
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="transition-all focus:border-primary"
            required
            placeholder="Mario"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cognome
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="transition-all focus:border-primary"
            required
            placeholder="Rossi"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`transition-all focus:border-primary ${email && !emailValid ? 'border-destructive' : ''}`}
          required
          placeholder="nome@esempio.com"
        />
        {email && !emailValid && (
          <p className="text-destructive text-xs mt-1">Inserisci un indirizzo email valido</p>
        )}
      </div>
      
      {showPhoneField && (
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telefono
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="transition-all focus:border-primary"
            required
            placeholder="+39 123 456 7890"
          />
          {phone && !phoneValid && (
            <p className="text-destructive text-xs mt-1">Inserisci un numero di telefono valido</p>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="transition-all focus:border-primary pr-10"
            required
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {password && !passwordStrong && (
          <p className="text-destructive text-xs mt-1">La password deve contenere almeno 6 caratteri</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Conferma Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`transition-all focus:border-primary pr-10 ${confirmPassword && !passwordMatch ? 'border-destructive' : ''}`}
            required
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={toggleShowConfirmPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {confirmPassword && !passwordMatch && (
          <p className="text-destructive text-xs mt-1">Le password non coincidono</p>
        )}
      </div>
      
      {requiresSpecialties && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Specializzazioni
          </Label>
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
      )}
      
      {validationError && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          {validationError}
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading || !formIsValid}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrazione in corso...
          </>
        ) : (
          `Registra come ${roleName}`
        )}
      </Button>
      
      <div className="text-xs text-muted-foreground text-center">
        Completando la registrazione, accetti i nostri <a href="#" className="text-primary hover:underline">Termini di Servizio</a> e <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
      </div>
    </form>
  );
};
