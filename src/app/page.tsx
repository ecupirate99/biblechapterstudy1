import { BibleCompanion } from '@/components/bible-companion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-headline text-foreground">
          Bible Companion
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-body mt-2">
          Chapter by Chapter Study
        </p>
      </div>
      
      <div className="w-full max-w-3xl">
        <BibleCompanion />
      </div>
    </main>
  );
}
