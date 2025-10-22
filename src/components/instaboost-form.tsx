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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  postTopic: z
    .string({ required_error: 'O tópico do post é obrigatório.' })
    .min(5, { message: 'O tópico deve ter pelo menos 5 caracteres.' })
    .max(200, { message: 'O tópico não pode ter mais de 200 caracteres.' }),
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
      postTopic: '',
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
              name="postTopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópico do Post</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Dicas para uma viagem à Itália"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Insira o tema central do seu post para a IA gerar o conteúdo.
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
