
import { useParams } from "react-router-dom";
import GenericRegistration from "./GenericRegistration";

const AssistantRegistration = () => {
  const { gymCode } = useParams();
  
  return (
    <GenericRegistration
      roleName="Assistente"
      roleId="assistant"
      showPhoneField={true}
      gymCode={gymCode}
    />
  );
};

export default AssistantRegistration;
