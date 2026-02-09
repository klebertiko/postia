'use client';

import { useState } from 'react';
import { PostiaForm } from '@/components/postia-form';
import { GeneratedContent } from '@/components/generated-content';
import type { GeneratedContent as GeneratedContentType } from '@/lib/types';
import { generateContentAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { PenSquare, Sparkles, Zap, Image as ImageIcon, Download as DownloadIcon, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

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
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mx-auto flex flex-col gap-8 md:gap-12 max-w-4xl 2xl:max-w-7xl">
          <header className="text-center">
            <div className="inline-flex items-center gap-4 mb-4">
              <PenSquare className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
                PostIA
              </h1>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl">
              Eleve seu conteúdo a outro nível. Gere legendas, hashtags e
              prompts de imagem com o poder da IA.
            </p>
          </header>

          <PostiaForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          <div>
            {isLoading && <LoadingState />}
            {generatedContent && <GeneratedContent content={generatedContent} />}
          </div>

          {!generatedContent && !isLoading && (
            <div className="space-y-16 py-8">
              {/* Features Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={<Sparkles className="h-8 w-8 text-primary" />}
                  title="Legendas Magnéticas"
                  description="Crie textos que engajam seu público instantaneamente, otimizados para conversão."
                />
                <FeatureCard
                  icon={<Zap className="h-8 w-8 text-primary" />}
                  title="IA Multimodal"
                  description="Gere imagem, legenda e hashtags em uma única chamada usando a tecnologia Gemini 2.0."
                />
                <FeatureCard
                  icon={<ImageIcon className="h-8 w-8 text-primary" />}
                  title="Imagens Exclusivas"
                  description="Transforme suas ideias em realidade visual com nossa geração de imagem integrada."
                />
              </section>

              {/* How it Works Section */}
              <section className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-primary/10">
                <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <Step step="1" title="Tópico" description="Digite o tema central do seu post." />
                  <Step step="2" title="Geração" description="Nossa IA cria o conteúdo completo." />
                  <Step step="3" title="Revisão" description="Ajuste a legenda e as hashtags." />
                  <Step step="4" title="Download" description="Baixe sua imagem premium pronta." />
                </div>
              </section>

              {/* SEO Content Section */}
              <section className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold">Por que usar a PostIA?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A PostIA foi desenvolvida para criadores de conteúdo que valorizam tempo e qualidade.
                  Em vez de alternar entre várias ferramentas, unificamos todo o processo criativo.
                  Nossas soluções utilizam os modelos de linguagem e visão mais avançados do mundo,
                  garantindo que cada post tenha uma identidade visual e textual única.
                </p>
                <div className="flex flex-wrap justify-center gap-4 py-4">
                  {[
                    "Mais Engajamento",
                    "Postagens Consistentes",
                    "Economia de Tempo",
                    "Qualidade Profissional"
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className='border-none bg-primary/5 shadow-none group hover:bg-primary/10 transition-colors'>
      <CardContent className='pt-8 text-center space-y-4'>
        <div className='flex justify-center'>{icon}</div>
        <h3 className='font-bold text-xl'>{title}</h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({ step, title, description }: { step: string, title: string, description: string }) {
  return (
    <div className='text-center space-y-3 relative'>
      <div className='text-4xl font-black text-primary/20'>{step}</div>
      <h3 className='font-bold'>{title}</h3>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  );
}
