
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface GymInfoFormProps {
  formData: {
    gymName: string;
    address: string;
    phone: string;
    socialLink: string;
    clientVolume: string;
    trainerCount: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (id: string, value: string) => void;
  prevStep: () => void;
  isLoading: boolean;
}

export const GymInfoForm: React.FC<GymInfoFormProps> = ({
  formData,
  handleChange,
  handleSelectChange,
  prevStep,
  isLoading
}) => {
  return (
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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrazione...
            </>
          ) : (
            "Registrati"
          )}
        </Button>
      </div>
    </>
  );
};
