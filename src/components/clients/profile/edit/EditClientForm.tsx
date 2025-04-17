
import { UseFormReturn } from "react-hook-form";
import { ClientFormData } from "../types/edit-client-types";
import EditClientPersonalInfo from "./EditClientPersonalInfo";
import EditClientNotes from "./EditClientNotes";

interface EditClientFormProps {
  form: UseFormReturn<ClientFormData>;
  isLoading: boolean;
}

const EditClientForm = ({ form, isLoading }: EditClientFormProps) => {
  return (
    <div className="space-y-6">
      <EditClientPersonalInfo form={form} isLoading={isLoading} />
      <EditClientNotes form={form} isLoading={isLoading} />
    </div>
  );
};

export default EditClientForm;
