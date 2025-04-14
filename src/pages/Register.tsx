
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gymName: "",
    clientVolume: "",
    trainerCount: "",
    trialCount: "",
    hasFollowup: true,
    followupDays: "7",
    saleMode: "both"
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
    
    // Simulazione registrazione (da sostituire con registrazione reale)
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Registrazione completata con successo");
      navigate("/dashboard");
    }, 1500);
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
                        <SelectItem value="<100">Meno di 100</SelectItem>
                        <SelectItem value="100-300">100-300</SelectItem>
                        <SelectItem value="300-500">300-500</SelectItem>
                        <SelectItem value="500+">Più di 500</SelectItem>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trialCount">Prove Gratuite Mensili</Label>
                    <Input
                      id="trialCount"
                      type="number"
                      min="0"
                      placeholder="20"
                      value={formData.trialCount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="followupDays">Giorni per Follow-up</Label>
                    <Input
                      id="followupDays"
                      type="number"
                      min="1"
                      placeholder="7"
                      value={formData.followupDays}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="saleMode">Metodo di Vendita PT</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("saleMode", value)}
                    defaultValue={formData.saleMode}
                  >
                    <SelectTrigger id="saleMode">
                      <SelectValue placeholder="Seleziona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="package">Pacchetti</SelectItem>
                      <SelectItem value="custom">Schede Personalizzate</SelectItem>
                      <SelectItem value="both">Entrambi</SelectItem>
                    </SelectContent>
                  </Select>
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
