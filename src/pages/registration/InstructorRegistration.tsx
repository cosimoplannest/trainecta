
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Specialty {
  id: string;
  name: string;
  description: string | null;
}

const InstructorRegistration = () => {
  const { gymCode } = useParams<{ gymCode: string }>();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    const fetchSpecialties = async () => {
      if (!gymCode) return;

      try {
        const { data: gymData } = await supabase.rpc('get_gym_id_from_code', {
          registration_code: gymCode
        });

        if (!gymData) {
          toast.error("Codice palestra non valido");
          return;
        }

        const { data, error } = await supabase
          .from('instructor_specialties')
          .select('*')
          .eq('gym_id', gymData);

        if (error) throw error;
        setSpecialties(data || []);
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast.error("Impossibile caricare le specializzazioni");
      } finally {
        setLoadingSpecialties(false);
      }
    };

    fetchSpecialties();
  }, [gymCode]);

  const validateForm = () => {
    if (password !== confirmPassword) {
      setValidationError("Le password non coincidono");
      return false;
    }
    if (password.length < 6) {
      setValidationError("La password deve contenere almeno 6 caratteri");
      return false;
    }
    if (selectedSpecialties.length === 0) {
      setValidationError("Seleziona almeno una specializzazione");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSpecialtyChange = (specialtyId: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialtyId)
        ? prev.filter(id => id !== specialtyId)
        : [...prev, specialtyId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Get gym ID from the registration code
      const { data: gymData, error: gymError } = await supabase.rpc('get_gym_id_from_code', {
        registration_code: gymCode
      });

      if (gymError || !gymData) {
        toast.error("Codice di registrazione non valido o scaduto");
        setIsLoading(false);
        return;
      }

      // Verify that the code is for instructor role
      const { data: roleData, error: roleError } = await supabase.rpc('get_role_from_code', {
        registration_code: gymCode
      });

      if (roleError || roleData !== 'instructor') {
        toast.error("Questo codice non è valido per la registrazione come istruttore");
        setIsLoading(false);
        return;
      }

      // Register the user
      const userData = {
        full_name: `${firstName} ${lastName}`,
        role: 'instructor',
        gym_id: gymData
      };

      const { user, error } = await signUp(email, password, userData);

      if (error) {
        throw error;
      }

      if (user) {
        // Create user profile with additional information
        const { error: profileError } = await supabase
          .from('users')
          .update({
            phone,
            status: 'pending_approval'
          })
          .eq('id', user.id);

        if (profileError) {
          throw profileError;
        }

        // Add specialty links
        const specialtyLinks = selectedSpecialties.map(specialtyId => ({
          user_id: user.id,
          specialty_id: specialtyId
        }));

        const { error: specialtyError } = await supabase
          .from('instructor_specialty_links')
          .insert(specialtyLinks);

        if (specialtyError) {
          throw specialtyError;
        }

        toast.success("Registrazione completata con successo! Attendi l'approvazione dell'amministratore.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Errore durante la registrazione");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Registrazione Istruttore</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea il tuo account come istruttore per la palestra
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 space-y-6">
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
          
          <div className="text-center text-sm">
            <p>
              Hai già un account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorRegistration;
