
import GenericRegistration from "./GenericRegistration";

const AssistantRegistration = () => {
  return (
    <GenericRegistration
      roleName="Assistente"
      roleId="assistant"
      showPhoneField={true}
    />
  );
};

export default AssistantRegistration;
