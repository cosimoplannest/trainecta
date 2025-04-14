
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gymName: "",
    clientVolume: "",
    trainerCount: "",
    address: "",
    phone: "",
    socialLink: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Register the user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create a new gym
        const { data: gymData, error: gymError } = await supabase
          .from('gyms')
          .insert([
            {
              name: formData.gymName,
              address: formData.address,
              phone: formData.phone,
              website: formData.socialLink
            }
          ])
          .select('id')
          .single();

        if (gymError) throw gymError;

        // Update the user record with gym_id and role = 'admin'
        const { error: userError } = await supabase
          .from('users')
          .update({
            gym_id: gymData.id,
            role: 'admin'
          })
          .eq('id', authData.user.id);

        if (userError) throw userError;

        // Create initial gym settings
        const { error: settingsError } = await supabase
          .from('gym_settings')
          .insert([
            {
              gym_id: gymData.id,
              max_trials_per_client: 1,
              enable_auto_followup: true,
              days_to_first_followup: 7,
              days_to_active_confirmation: 30,
              template_sent_by: 'both',
              template_viewable_by_client: true,
              allow_template_duplication: true,
              default_trainer_assignment_logic: 'manual'
            }
          ]);

        if (settingsError) throw settingsError;

        toast.success("Registrazione completata con successo");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Errore durante la registrazione");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Crea il tuo account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Inserisci i tuoi dati per iniziare a usare Trainecta
          </p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 space-y-6">
          <div className="flex justify-between mb-4">
            {[1, 2].map((s) => (
              <div 
                key={s} 
                className={`w-1/2 h-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Mario Rossi"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@esempio.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button type="button" className="w-full" onClick={nextStep}>
                  Continua
                </Button>
              </>
            )}
            
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gymName">Nome Palestra</Label>
                  <Input
                    id="gymName"
                    placeholder="Fit Center"
                    value={formData.gymName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo Palestra</Label>
                  <Input
                    id="address"
                    placeholder="Via Roma 123, Milano"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Contatto Telefonico</Label>
                  <Input
                    id="phone"
                    placeholder="+39 123 456 7890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="socialLink">Link Social (opzionale)</Label>
                  <Input
                    id="socialLink"
                    placeholder="https://instagram.com/tuapalestra"
                    value={formData.socialLink}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientVolume">Numero Clienti</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("clientVolume", value)}
                      defaultValue={formData.clientVolume}
                    >
                      <SelectTrigger id="clientVolume">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<500">Meno di 500</SelectItem>
                        <SelectItem value="500-1500">500-1500</SelectItem>
                        <SelectItem value="1500-3000">1500-3000</SelectItem>
                        <SelectItem value=">3000">Più di 3000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trainerCount">Numero Trainer</Label>
                    <Input
                      id="trainerCount"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={formData.trainerCount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button type="button" variant="outline" className="w-1/2" onClick={prevStep}>
                    Indietro
                  </Button>
                  <Button type="submit" className="w-1/2" disabled={isLoading}>
                    {isLoading ? "Registrazione..." : "Registrati"}
                  </Button>
                </div>
              </>
            )}
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

export default Register;
