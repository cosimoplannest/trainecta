import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png"
              alt="Trainecta Logo"
              className="h-8"
            />
            <span className="text-xl font-bold">Trainecta</span>
          </div>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link to="/login">Accedi</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Registrati</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-12">
        <div className="container text-center">
          <h1 className="text-4xl font-extrabold mb-4">
            Benvenuto in Trainecta
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            La piattaforma per la gestione completa della tua palestra.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link to="/register">Inizia ora</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/#features">Scopri di più</Link>
            </Button>
          </div>
        </div>
      </main>

      <section id="features" className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Funzionalità principali
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">
                Gestione Clienti
              </h3>
              <p className="text-muted-foreground">
                Tieni traccia dei tuoi clienti, dei loro progressi e dei loro
                obiettivi.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">
                Schede di Allenamento
              </h3>
              <p className="text-muted-foreground">
                Crea e personalizza schede di allenamento per i tuoi clienti.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">
                Statistiche e Report
              </h3>
              <p className="text-muted-foreground">
                Analizza i dati e ottieni report dettagliati sull'andamento
                della tua attività.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 Trainecta. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
