
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center">
          <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-10" />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Accedi
          </Link>
          <Link to="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Registrati
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Gestisci la tua palestra con efficienza
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Trainecta ti permette di monitorare i personal trainer, gestire lo staff e ottimizzare le prestazioni della tua struttura.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/register">
                    <Button size="lg" className="bg-primary">
                      Inizia subito
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Accedi
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-full min-h-[300px] rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm"></div>
                  <img 
                    src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" 
                    alt="Trainecta Logo" 
                    className="relative z-10 h-32 md:h-48" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="bg-card rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestione Clienti</h3>
                <p className="text-muted-foreground">Monitora e segui l'evoluzione dei clienti e delle prove gratuite.</p>
              </div>
              <div className="bg-card rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Schede Allenamento</h3>
                <p className="text-muted-foreground">Crea e assegna schede personalizzate ai tuoi clienti.</p>
              </div>
              <div className="bg-card rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Statistiche</h3>
                <p className="text-muted-foreground">Analizza le performance del tuo team e le conversioni dei clienti.</p>
              </div>
              <div className="bg-card rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comunicazioni</h3>
                <p className="text-muted-foreground">Gestisci assenze, sostituzioni e comunica con tutto il team.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-6" />
              <p className="text-sm text-muted-foreground">© 2025 Trainecta. Tutti i diritti riservati.</p>
            </div>
            <nav className="flex gap-4">
              <Link to="#" className="text-sm hover:underline underline-offset-4">Privacy</Link>
              <Link to="#" className="text-sm hover:underline underline-offset-4">Termini</Link>
              <Link to="#" className="text-sm hover:underline underline-offset-4">Contatti</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
