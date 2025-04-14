
import React from 'react';
import { Link } from "react-router-dom";

export const RegisterHeader: React.FC = () => {
  return (
    <div className="text-center">
      <Link to="/" className="inline-block">
        <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-12 mx-auto" />
      </Link>
      <h2 className="mt-6 text-3xl font-bold">Crea il tuo account</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Inserisci i tuoi dati per iniziare a usare Trainecta
      </p>
    </div>
  );
};
