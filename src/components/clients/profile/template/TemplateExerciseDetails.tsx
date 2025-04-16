
import { Video } from "lucide-react";

interface TemplateExercise {
  id: string;
  sets: number;
  reps: string;
  exercise: {
    id: string;
    name: string;
    video_url?: string;
  }
}

interface TemplateExerciseDetailsProps {
  exercises: TemplateExercise[];
}

const TemplateExerciseDetails = ({ exercises }: TemplateExerciseDetailsProps) => {
  return (
    <div className="mt-4 mb-6 pl-4 border-l-2 border-muted">
      <h4 className="text-sm font-medium mb-2">Dettaglio Esercizi</h4>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Esercizio</th>
              <th className="px-4 py-2 text-center">Serie</th>
              <th className="px-4 py-2 text-center">Ripetizioni</th>
              <th className="px-4 py-2 text-right">Video</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise.id} className="border-t border-muted">
                <td className="px-4 py-2">{exercise.exercise.name}</td>
                <td className="px-4 py-2 text-center">{exercise.sets}</td>
                <td className="px-4 py-2 text-center">{exercise.reps}</td>
                <td className="px-4 py-2 text-right">
                  {exercise.exercise.video_url ? (
                    <a 
                      href={exercise.exercise.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 inline-flex items-center gap-1"
                    >
                      <Video className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemplateExerciseDetails;
