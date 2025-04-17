
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DeliveryMethodSelectorProps {
  deliveryChannel: string;
  setDeliveryChannel: (channel: string) => void;
}

export function DeliveryMethodSelector({ deliveryChannel, setDeliveryChannel }: DeliveryMethodSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label>Metodo di invio</Label>
      <RadioGroup value={deliveryChannel} onValueChange={setDeliveryChannel} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="whatsapp" id="whatsapp" />
          <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="email" />
          <Label htmlFor="email" className="cursor-pointer">Email</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
