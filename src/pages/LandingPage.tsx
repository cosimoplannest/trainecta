
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Dumbbell, BarChart, MessageSquare, Shield, Calendar, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur px-4 lg:px-6 flex items-center h-16">
        <div className="container flex max-w-screen-xl items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-8" />
            <span className="font-semibold hidden sm:inline-block">Trainecta</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Accedi
            </Link>
            <Link to="/register">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Registrati
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden">
                Registrati
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background to-muted/50">
          <div className="container px-4 md:px-6 max-w-screen-xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fade-in">
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
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                <div className="relative w-full h-full min-h-[350px] overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 p-6 flex items-center justify-center animate-scale-in">
                  <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm"></div>
                  <img 
                    src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" 
                    alt="Trainecta Logo" 
                    className="relative z-10 h-32 md:h-48 animate-pulse" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 max-w-screen-xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Funzionalità principali
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Tutto ciò di cui hai bisogno per gestire la tua palestra con successo
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Gestione Clienti</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Monitora e segui l'evoluzione dei clienti e delle prove gratuite.</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Schede Allenamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Crea e assegna schede personalizzate ai tuoi clienti.</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Statistiche</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analizza le performance del tuo team e le conversioni dei clienti.</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Comunicazioni</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gestisci assenze, sostituzioni e comunica con tutto il team.</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Pianificazione</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gestisci appuntamenti, corsi e pianifica l'utilizzo degli spazi.</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Turni e Presenze</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Monitora presenze del personale e organizza i turni di lavoro.</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Gestione Accessi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Controlla gli accessi e assegna permessi specifici a ciascun ruolo.</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Gestione Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Gestisci trainer, istruttori, operatori e assistenti con facilità.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-primary/5">
          <div className="container px-4 md:px-6 max-w-screen-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 flex-1">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Pronto a migliorare la gestione della tua palestra?
                </h2>
                <p className="text-muted-foreground">
                  Registrati oggi stesso e scopri come Trainecta può trasformare il tuo business.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Inizia gratis
                  </Button>
                </Link>
                <Link to="#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Scopri di più
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-8 bg-card">
        <div className="container px-4 md:px-6 max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/cd8b60de-1697-44f7-8fb3-856b0528b471.png" alt="Trainecta Logo" className="h-6" />
                <span className="font-semibold">Trainecta</span>
              </div>
              <p className="text-sm text-muted-foreground">© 2025 Trainecta. Tutti i diritti riservati.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Azienda</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Chi siamo</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Carriere</Link></li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Supporto</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Contatti</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentazione</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                  <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">Termini</Link></li>
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Newsletter</h3>
              <p className="text-sm text-muted-foreground">Iscriviti per ricevere aggiornamenti e novità.</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="La tua email"
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button size="sm">Iscriviti</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
