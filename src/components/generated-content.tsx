import React from 'react';
import type {
  GeneratedContent as GeneratedContentType,
  ImageGenerator,
} from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/copy-button';
import { Captions, Hash, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';
import { Button } from './ui/button';

const IMAGE_GENERATORS: ImageGenerator[] = [
  { name: 'Gemini', url: 'https://gemini.google.com/' },
  {
    name: 'Microsoft Designer',
    url: 'https://designer.microsoft.com/image-creator',
  },
];

interface GeneratedContentProps {
  content: GeneratedContentType;
}

export function GeneratedContent({ content }: GeneratedContentProps) {
  const { caption, hashtags, imagePrompt, imageUrl } = content;

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `postia-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <ContentCard
        title="Legenda Sugerida"
        icon={<Captions className="h-5 w-5 text-muted-foreground" />}
        textToCopy={caption}
      >
        <p className="text-card-foreground/90 whitespace-pre-wrap">{caption}</p>
      </ContentCard>

      <ContentCard
        title="Hashtags Relevantes"
        icon={<Hash className="h-5 w-5 text-muted-foreground" />}
        textToCopy={hashtags.map(h => `#${h}`).join(' ')}
      >
        <div className="flex flex-wrap gap-2">
          {hashtags.map(tag => (
            <Badge key={tag} variant="secondary" className="font-normal">
              #{tag}
            </Badge>
          ))}
        </div>
      </ContentCard>

      <ContentCard
        title="Prompt para Geração de Imagem"
        icon={<ImageIcon className="h-5 w-5 text-muted-foreground" />}
        textToCopy={imagePrompt}
      >
        {imageUrl && (
          <div className="relative group mb-6 overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl transition-all hover:scale-[1.01]">
            <img
              src={imageUrl}
              alt="Imagem gerada pela IA"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                onClick={handleDownload}
                variant="secondary"
                className="gap-2 font-semibold shadow-lg backdrop-blur-sm bg-white/20 hover:bg-white/30 border-white/30"
              >
                <Download className="h-5 w-5" />
                Baixar Imagem Premium
              </Button>
            </div>
          </div>
        )}

        <p className="font-mono text-sm bg-muted rounded-md p-3 text-card-foreground/90 mb-4">
          {imagePrompt}
        </p>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            Gostou do prompt? Use em outras plataformas se desejar:
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            {IMAGE_GENERATORS.map(generator => (
              <Button
                key={generator.name}
                asChild
                variant="outline"
                className="justify-start"
              >
                <a
                  href={generator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {generator.name}
                  <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </ContentCard>
    </div>
  );
}

interface ContentCardProps {
  title: string;
  icon: React.ReactNode;
  textToCopy: string;
  children: React.ReactNode;
}

function ContentCard({ title, icon, textToCopy, children }: ContentCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle className="text-lg font-headline font-semibold">
            {title}
          </CardTitle>
        </div>
        <CopyButton textToCopy={textToCopy} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
