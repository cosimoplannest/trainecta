
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useClientForm } from "./form/useClientForm";
import PersonalInfoSection from "./form/PersonalInfoSection";
import SubscriptionSection from "./form/SubscriptionSection";
import TrainingPreferencesSection from "./form/TrainingPreferencesSection";
import FitnessGoalsSection from "./form/FitnessGoalsSection";
import AdditionalInfoSection from "./form/AdditionalInfoSection";

interface AddClientFormProps {
  onClientAdded: () => void;
}

const AddClientForm = ({ onClientAdded }: AddClientFormProps) => {
  const { form, trainers, subscriptions, isSubmitting, onSubmit } = useClientForm(onClientAdded);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggiungi Nuovo Cliente</CardTitle>
        <CardDescription>
          Inserisci le informazioni per registrare un nuovo cliente.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <PersonalInfoSection form={form} />
            <SubscriptionSection form={form} subscriptions={subscriptions} />
            <TrainingPreferencesSection form={form} />
            <FitnessGoalsSection form={form} />
            <AdditionalInfoSection form={form} trainers={trainers} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvataggio..." : "Salva Cliente"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AddClientForm;
