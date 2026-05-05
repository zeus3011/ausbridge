import { AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Loading and error state components for Sanity data
 */

export function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-12 w-12 animate-spin text-gold" />
        <p className="text-muted-foreground">Loading website...</p>
      </div>
    </div>
  );
}

export function PageError() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center px-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground mt-2">We couldn't load the website content. Please try refreshing the page.</p>
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="default"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
