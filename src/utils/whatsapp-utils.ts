
import { WorkoutTemplate } from "@/types/workout";

export const formatTemplateForWhatsApp = (template: Partial<WorkoutTemplate> | null): string => {
  if (!template || !template.template_exercises) {
    return '';
  }
  
  // Create header with template details
  let message = `*SCHEDA DI ALLENAMENTO*\n`;
  message += `*${template.name}*\n`;
  message += `Categoria: ${template.category} | Tipo: ${template.type || 'Standard'}\n\n`;
  
  if (template.description) {
    message += `${template.description}\n\n`;
  }
  
  // Add exercises
  message += `*ESERCIZI*:\n\n`;
  
  // Sort exercises by order_index
  const sortedExercises = [...template.template_exercises]
    .sort((a, b) => a.order_index - b.order_index);
  
  sortedExercises.forEach((ex, index) => {
    const exerciseName = 'exercise' in ex && ex.exercise ? ex.exercise.name : 'Esercizio sconosciuto';
    
    message += `${index + 1}. *${exerciseName}*\n`;
    message += `   Serie: ${ex.sets} | Ripetizioni: ${ex.reps}\n`;
    
    if (ex.notes) {
      message += `   Note: ${ex.notes}\n`;
    }
    
    message += '\n';
  });
  
  // Add footer
  message += `--\nScheda generata automaticamente.\nIn caso di domande, contatta il tuo trainer.`;
  
  return message;
};

export const openWhatsApp = (phone: string, message: string): void => {
  // Format phone number - remove spaces, dashes, etc.
  const formattedPhone = phone.replace(/\D/g, '');
  
  // Make sure it has country code (assume Italian if not present)
  const phoneWithCountry = formattedPhone.startsWith('+') 
    ? formattedPhone 
    : formattedPhone.startsWith('00')
      ? formattedPhone
      : `+39${formattedPhone}`; // Assuming Italian number if no country code
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Generate WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
  
  // Open in new window
  window.open(whatsappUrl, '_blank');
};
