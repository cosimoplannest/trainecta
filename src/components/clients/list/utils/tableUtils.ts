
/**
 * Utility functions for client list table components
 */

/**
 * Generates badge UI for different purchase types
 */
export const getPurchaseStatusBadge = (purchaseType: string | null) => {
  if (!purchaseType || purchaseType === 'none') {
    return { variant: "outline", className: "bg-yellow-50", label: "In attesa" };
  }
  
  const variants: {[key: string]: string} = {
    'package': 'bg-green-50 text-green-700 border-green-200',
    'custom_plan': 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  const labels: {[key: string]: string} = {
    'package': 'Pacchetto',
    'custom_plan': 'Scheda personalizzata'
  };
  
  return { 
    variant: "outline", 
    className: variants[purchaseType], 
    label: labels[purchaseType] 
  };
};

/**
 * Get initials from first and last name
 */
export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Get a color for the avatar based on the name
 */
export const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-100 text-blue-600', 
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600', 
    'bg-amber-100 text-amber-600', 
    'bg-rose-100 text-rose-600',
    'bg-sky-100 text-sky-600',
    'bg-emerald-100 text-emerald-600',
    'bg-indigo-100 text-indigo-600'
  ];
  
  // Simple hash function to determine color based on name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
