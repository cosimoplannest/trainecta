
import GenericRegistration from "./GenericRegistration";

const TrainerRegistration = () => {
  return (
    <GenericRegistration
      roleName="Trainer"
      roleId="trainer"
      showPhoneField={true}
    />
  );
};

export default TrainerRegistration;
