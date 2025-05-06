
import { useParams } from "react-router-dom";
import GenericRegistration from "./GenericRegistration";

const OperatorRegistration = () => {
  const { gymCode } = useParams();
  
  return (
    <GenericRegistration
      roleName="Operatore"
      roleId="operator"
      gymCode={gymCode}
    />
  );
};

export default OperatorRegistration;
