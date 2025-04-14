
import GenericRegistration from "./GenericRegistration";

const InstructorRegistration = () => {
  return (
    <GenericRegistration
      roleName="Istruttore"
      roleId="instructor"
      showPhoneField={true}
      requiresSpecialties={true}
    />
  );
};

export default InstructorRegistration;
