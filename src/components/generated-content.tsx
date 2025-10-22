import type { GeneratedContent as GeneratedContentType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/copy-button';
import { Captions, Hash, Image as ImageIcon } from 'lucide-react';

interface GeneratedContentProps {
  content: GeneratedContentType;
}

export function GeneratedContent({ content }: GeneratedContentProps) {
  const { caption, hashtags, prompt } = content;

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
          {hashtags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              #{tag}
            </Badge>
          ))}
        </div>
      </ContentCard>

      <ContentCard
        title="Prompt para Geração de Imagem"
        icon={<ImageIcon className="h-5 w-5 text-muted-foreground" />}
        textToCopy={prompt}
      >
        <p className="font-mono text-sm bg-muted rounded-md p-3 text-card-foreground/90">
          {prompt}
        </p>
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
