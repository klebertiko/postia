'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  imageDescription: z
    .string({ required_error: 'A descrição da imagem é obrigatória.' })
    .min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' })
    .max(1000, { message: 'A descrição não pode ter mais de 1000 caracteres.' }),
  postTheme: z
    .string()
    .max(100, { message: 'O tema não pode ter mais de 100 caracteres.' })
    .optional(),
  instagramTrends: z
    .string()
    .max(500, { message: 'As tendências não podem ter mais de 500 caracteres.' })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InstaBoostFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading: boolean;
}

export function InstaBoostForm({ onSubmit, isLoading }: InstaBoostFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDescription: '',
      postTheme: '',
      instagramTrends: '',
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Crie seu Conteúdo</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="imageDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Imagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: um cachorro golden retriever sorrindo em uma praia ensolarada"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Descreva em detalhes o que está na sua imagem ou o que você quer gerar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postTheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema da Postagem (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Férias de verão, Dicas de viagem" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagramTrends"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tendências do Instagram (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Cores vibrantes, estética minimalista, vídeos curtos"
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                   <FormDescription>
                    Adicione tendências para otimizar o prompt de geração de imagem.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} size="lg" className="bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Gerar Conteúdo Mágico
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
