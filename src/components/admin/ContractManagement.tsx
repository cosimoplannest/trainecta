
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contractTypes = [
  { value: "subscription", label: "Abbonamento" },
  { value: "trial", label: "Prova Gratuita" },
  { value: "package", label: "Pacchetto" },
  { value: "promotion", label: "Promozione" }
];

const durations = [
  { value: "1_month", label: "1 Mese" },
  { value: "3_months", label: "3 Mesi" },
  { value: "6_months", label: "6 Mesi" },
  { value: "12_months", label: "12 Mesi" },
  { value: "custom", label: "Personalizzato" }
];

export function ContractManagement() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContract, setCurrentContract] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "subscription", // Default non-empty value
    price: "",
    duration: "1_month", // Default non-empty value
    status: "active"  // Default non-empty value
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i contratti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    // Ensure we never set an empty string value
    if (value === "") return;
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "subscription",
      price: "",
      duration: "1_month",
      status: "active"
    });
    setIsEditing(false);
    setCurrentContract(null);
  };

  const openEditDialog = (contract) => {
    setCurrentContract(contract);
    setFormData({
      name: contract.name || "",
      description: contract.description || "",
      type: contract.type || "subscription",
      price: contract.price?.toString() || "",
      duration: contract.duration || "1_month",
      status: contract.status || "active"
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast({
          title: "Campo richiesto",
          description: "Inserire un nome per il contratto",
          variant: "destructive",
        });
        return;
      }

      // Ensure we have valid non-empty values for all select fields
      const dataToSubmit = {
        ...formData,
        // Ensure these values are never empty strings
        type: formData.type || "subscription",
        duration: formData.duration || "1_month",
        status: formData.status || "active",
        price: parseFloat(formData.price) || 0
      };

      if (isEditing && currentContract) {
        const { error } = await supabase
          .from("subscriptions")
          .update(dataToSubmit)
          .eq("id", currentContract.id);

        if (error) throw error;
        toast({
          title: "Contratto aggiornato",
          description: "Il contratto è stato aggiornato con successo",
        });
      } else {
        const { error } = await supabase
          .from("subscriptions")
          .insert({
            ...dataToSubmit,
            gym_id: "11111111-1111-1111-1111-111111111111", // Example hardcoded ID
          });

        if (error) throw error;
        toast({
          title: "Contratto creato",
          description: "Il contratto è stato creato con successo",
        });
      }

      fetchContracts();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving contract:", error);
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContract = async (id) => {
    if (!confirm("Sei sicuro di voler eliminare questo contratto?")) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Contratto eliminato",
        description: "Il contratto è stato eliminato con successo",
      });
      
      fetchContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il contratto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Contratti e Abbonamenti</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Nuovo Contratto</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifica Contratto" : "Crea Nuovo Contratto"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="es. Premium Mensile"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrizione</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descrizione del contratto..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipologia</Label>
                  <Select
                    value={formData.type || "subscription"}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="price">Prezzo (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Durata</Label>
                  <Select
                    value={formData.duration || "1_month"}
                    onValueChange={(value) => handleSelectChange("duration", value)}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Seleziona durata" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Stato</Label>
                  <Select
                    value={formData.status || "active"}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Seleziona stato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Attivo</SelectItem>
                      <SelectItem value="inactive">Inattivo</SelectItem>
                      <SelectItem value="draft">Bozza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}>
                Annulla
              </Button>
              <Button onClick={handleSubmit}>
                {isEditing ? "Aggiorna" : "Crea"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contratti Disponibili</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nessun contratto disponibile. Crea il tuo primo contratto.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Durata</TableHead>
                    <TableHead>Prezzo</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.name}</TableCell>
                      <TableCell>
                        {contractTypes.find(t => t.value === contract.type)?.label || contract.type}
                      </TableCell>
                      <TableCell>
                        {durations.find(d => d.value === contract.duration)?.label || contract.duration}
                      </TableCell>
                      <TableCell>€{contract.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contract.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : contract.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {contract.status === 'active' ? 'Attivo' : 
                           contract.status === 'inactive' ? 'Inattivo' : 
                           contract.status === 'draft' ? 'Bozza' : contract.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openEditDialog(contract)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteContract(contract.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
