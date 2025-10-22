'use client';

import { useState } from 'react';
import { InstaBoostForm } from '@/components/instaboost-form';
import { GeneratedContent } from '@/components/generated-content';
import type { GeneratedContent as GeneratedContentType } from '@/lib/types';
import { generateContentAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { PenSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type FormValues = {
  postTopic: string;
};

export default function Home() {
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setGeneratedContent(null);
    const result = await generateContentAction(data);
    if (result.error || !result.data) {
      toast({
        variant: 'destructive',
        title: 'Erro na Geração',
        description:
          result.error ||
          'Não foi possível gerar o conteúdo. Tente novamente.',
      });
    } else {
      setGeneratedContent(result.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-4 mb-4">
              <PenSquare className="h-12 w-12 text-primary" />
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
                PostIA
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Eleve seu conteúdo a outro nível. Gere legendas, hashtags e
              prompts de imagem com o poder da IA.
            </p>
          </header>

          <InstaBoostForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          <div className="mt-8 md:mt-12">
            {isLoading && <LoadingState />}
            {generatedContent && <GeneratedContent content={generatedContent} />}
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} PostIA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
       <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-12 w-full" />
        </div>
    </div>
  );
}
