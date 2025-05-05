
export function TableLoadingState() {
  return (
    <div className="rounded-md border mt-4 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
        <span className="text-muted-foreground">Caricamento clienti...</span>
      </div>
    </div>
  );
}
