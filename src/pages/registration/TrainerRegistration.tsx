
import { useParams } from "react-router-dom";
import GenericRegistration from "./GenericRegistration";

const TrainerRegistration = () => {
  const { gymCode } = useParams();
  
  return (
    <GenericRegistration
      roleName="Trainer"
      roleId="trainer"
      showPhoneField={true}
      gymCode={gymCode}
    />
  );
};

export default TrainerRegistration;
