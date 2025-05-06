
import { useParams } from "react-router-dom";
import GenericRegistration from "./GenericRegistration";

const InstructorRegistration = () => {
  const { gymCode } = useParams();
  
  return (
    <GenericRegistration
      roleName="Istruttore"
      roleId="instructor"
      showPhoneField={true}
      requiresSpecialties={true}
      gymCode={gymCode}
    />
  );
};

export default InstructorRegistration;
