
import { UseFormReturn } from "react-hook-form";
import { ClientFormData } from "../types/edit-client-types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface EditClientNotesProps {
  form: UseFormReturn<ClientFormData>;
  isLoading: boolean;
}

const EditClientNotes = ({ form, isLoading }: EditClientNotesProps) => {
  return (
    <FormField
      control={form.control}
      name="internal_notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Note interne</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Note interne sul cliente"
              className="resize-none"
              disabled={isLoading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EditClientNotes;
