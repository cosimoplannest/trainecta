
import { Clock, Info, Clock4 } from "lucide-react";
import { fitnessGoals, workoutTimePreferences } from "../../constants/clientFormData";

interface TrainingPreferencesProps {
  preferredTime: string | null;
  primaryGoal: string | null;
  fitnessLevel: string | null;
  subscriptionType: string | null;
}

export const TrainingPreferencesSection = ({ 
  preferredTime, 
  primaryGoal, 
  fitnessLevel, 
  subscriptionType 
}: TrainingPreferencesProps) => {
  
  const getPreferredTimeLabel = (timeId: string | null) => {
    if (!timeId) return null;
    const timeObj = workoutTimePreferences.find(t => t.id === timeId);
    return timeObj ? timeObj.label : timeId;
  };
  
  const getGoalLabel = (goalId: string | null) => {
    if (!goalId) return null;
    const goalObj = fitnessGoals.find(g => g.id === goalId);
    return goalObj ? goalObj.label : goalId;
  };

  return (
    <div className="py-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Preferenze Allenamento</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {preferredTime && (
          <div className="flex items-start space-x-2 bg-purple-50 p-3 rounded-md">
            <Clock4 className="h-5 w-5 text-purple-700 mt-0.5" />
            <div>
              <p className="font-medium text-purple-900">Orario Preferito</p>
              <p className="text-sm text-purple-800">{getPreferredTimeLabel(preferredTime)}</p>
            </div>
          </div>
        )}
        
        {primaryGoal && (
          <div className="flex items-start space-x-2 bg-blue-50 p-3 rounded-md">
            <Clock className="h-5 w-5 text-blue-700 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Obiettivo</p>
              <p className="text-sm text-blue-800">{getGoalLabel(primaryGoal)}</p>
            </div>
          </div>
        )}
        
        {fitnessLevel && (
          <div className="flex items-start space-x-2 bg-green-50 p-3 rounded-md">
            <Info className="h-5 w-5 text-green-700 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Livello</p>
              <p className="text-sm text-green-800">
                {fitnessLevel === 'beginner' ? 'Base' :
                 fitnessLevel === 'intermediate' ? 'Intermedio' :
                 fitnessLevel === 'advanced' ? 'Avanzato' : fitnessLevel}
              </p>
            </div>
          </div>
        )}
        
        {subscriptionType && (
          <div className="flex items-start space-x-2 bg-amber-50 p-3 rounded-md">
            <Info className="h-5 w-5 text-amber-700 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Abbonamento</p>
              <p className="text-sm text-amber-800">{subscriptionType}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
