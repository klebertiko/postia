# 🎓 Workshop PostIA: Construindo um App de IA com Next.js e Genkit

Olá, desenvolvedor(a)!

Bem-vindo ao workshop do PostIA. Este documento é um guia completo e detalhado, projetado para ensinar como construir o aplicativo PostIA do zero. Vamos explorar cada arquivo, cada componente e cada linha de código, explicando os conceitos de uma forma clara e acessível, ideal para quem está começando, mas também com insights valiosos para os mais experientes.

## 🎯 Objetivo do Projeto

O PostIA é um assistente de marketing para Instagram. A ideia é simples: o usuário fornece um tópico, e nossa aplicação, com o poder de múltiplos agentes de IA, gera um pacote de conteúdo completo:

1.  **Legenda Cativante:** Com uma chamada para ação (CTA) relevante.
2.  **Hashtags Estratégicas:** Para aumentar o alcance.
3.  **Prompt de Imagem Detalhado:** Otimizado para modelos de IA de geração de imagem.

## 🛠️ A Arquitetura: Next.js + Genkit na Vercel

Nossa aplicação usa uma arquitetura moderna e eficiente, perfeita para deploy na Vercel:

-   **Frontend (Cliente):** Uma interface web construída com **Next.js** e **React**. É o que o usuário vê e interage.
-   **Backend de IA (Servidor):** A lógica de inteligência artificial é gerenciada pelo **Genkit** e executada como **Server Actions** do Next.js. Isso significa que não precisamos de um servidor de backend separado. Nossos fluxos de IA vivem dentro da própria aplicação Next.js, tornando o deploy muito mais simples.

---

## 🗺️ Passo a Passo: Desvendando o Código

Vamos explorar o projeto pasta por pasta, arquivo por arquivo.

### 1. Configurações Iniciais (`package.json`, `tailwind.config.ts`, etc.)

Esses arquivos definem a estrutura e as dependências do nosso projeto.

-   **`package.json`**: O coração de qualquer projeto Node.js. Ele lista todas as "peças" (pacotes) que usamos, como `next`, `react`, `genkit`, `tailwindcss`, etc. Os `scripts` definem atalhos como `npm run dev` para iniciar o projeto.
-   **`tailwind.config.ts`**: Arquivo de configuração do Tailwind CSS. Aqui definimos nossa paleta de cores (`primary`, `accent`, etc.) e nossas fontes (`Poppins` para títulos, `PT Sans` para o corpo do texto), mantendo o estilo consistente.
-   **`src/app/globals.css`**: É onde as variáveis de cor definidas no `tailwind.config.ts` são aplicadas. Usamos variáveis CSS (`--background: ...`) para criar temas (no nosso caso, um tema escuro).
-   **`next.config.ts`**: Configurações específicas do Next.js. Adicionamos a configuração do PWA (`@ducanh2912/next-pwa`) para tornar nosso app instalável.
-   **`.env`**: Este arquivo **não é enviado** para o repositório (por segurança!). Ele armazena "segredos", como a nossa `GEMINI_API_KEY`. O arquivo `src/ai/genkit.ts` lê essa chave para que a IA possa funcionar no ambiente de desenvolvimento local.

### 2. A Arquitetura de IA com Genkit (`src/ai/...`)

Esta é a parte mais mágica do projeto. Usamos uma **arquitetura de múltiplos agentes**, onde cada "agente" é uma ferramenta especializada.

#### `src/ai/genkit.ts`

Este é o ponto de entrada do Genkit.
```typescript
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from 'dotenv';

config({path: '.env'}); // Carrega as variáveis do arquivo .env

// `ai` é o nosso objeto principal do Genkit
export const ai = genkit({
  plugins: [
    googleAI({ // Habilita o uso dos modelos de IA do Google (Gemini)
      apiKey: process.env.GEMINI_API_KEY, // Usa a chave de API que configuramos
    }),
  ],
  model: 'googleai/gemini-2.5-flash', // Modelo padrão para geração de texto
});
```
-   **Explicação:** Nós inicializamos o Genkit, dizemos a ele para usar o plugin `googleAI` e fornecemos nossa chave de API a partir das variáveis de ambiente (`process.env.GEMINI_API_KEY`). Isso funciona tanto localmente (com o arquivo `.env`) quanto na Vercel (com as variáveis de ambiente configuradas no painel).

#### A Estratégia dos Múltiplos Agentes

Em vez de um único prompt gigante tentando fazer tudo, nós criamos "ferramentas" (agentes) menores e focadas:

1.  **Agente de Legenda** (`generate-instagram-caption.ts`): Especialista em criar textos de posts.
2.  **Agente de Hashtags** (`suggest-relevant-hashtags.ts`): Especialista em marketing e SEO de hashtags.
3.  **Agente de Prompt de Imagem** (`generate-gemini-nano-prompt.ts`): Um engenheiro de prompt sênior que sabe exatamente como pedir a uma IA para desenhar algo incrível.

E, orquestrando tudo, temos o **Agente de Conteúdo**.

#### `src/ai/flows/content-agent-flow.ts` (O Agente Chefe)

Este é o orquestrador. Ele recebe o tópico do usuário e coordena os outros agentes para produzir o resultado final.

```typescript
'use server';
// ... imports ...
import { captionGeneratorTool } from './generate-instagram-caption';
import { hashtagSuggesterTool } from './suggest-relevant-hashtags';
import { imagePromptGeneratorTool } from './generate-gemini-nano-prompt';

// ... esquemas de entrada e saída com Zod ...

// O fluxo principal
const contentAgentFlow = ai.defineFlow(
  { /* ... schemas ... */ },
  async input => {
    // O prompt para o agente orquestrador
    const prompt = `Você é um agente de IA assistente de marketing...
Sua tarefa é gerar o conteúdo completo para um post...
Você DEVE usar as ferramentas disponíveis...
Tópico do Post: ${input.postTopic}`;

    // A mágica acontece aqui!
    const result = await ai.generate({
      prompt: prompt,
      tools: [ // Fornecemos as "ferramentas" (nossos outros agentes)
        captionGeneratorTool,
        hashtagSuggesterTool,
        imagePromptGeneratorTool,
      ],
      output: { // Definimos o formato que queremos receber de volta
        schema: GeneratePostContentOutputSchema,
      },
    });

    return result.output!; // Acessamos a saída já estruturada
  }
);
```

-   **Explicação:** O `contentAgentFlow` recebe o tópico. Ele então instrui um modelo de IA (o "cérebro" do orquestrador) a usar as três ferramentas (`captionGeneratorTool`, `hashtagSuggesterTool`, `imagePromptGeneratorTool`) para cumprir a tarefa. O Genkit gerencia a chamada a essas ferramentas e monta a resposta final no formato que especificamos (`GeneratePostContentOutputSchema`).

#### As Ferramentas (`src/ai/flows/generate-instagram-caption.ts`, etc.)

Vamos olhar para um dos agentes-ferramenta, o `captionGeneratorTool`.

```typescript
'use server';
// ... imports ...

// Definimos a ferramenta com `ai.defineTool`
export const captionGeneratorTool = ai.defineTool(
  {
    name: 'captionGenerator',
    description: 'Gera uma legenda de postagem do Instagram...', // A descrição é MUITO importante. É como o orquestrador sabe para que serve a ferramenta.
    inputSchema: CaptionInputSchema, // O que a ferramenta espera receber
    outputSchema: CaptionOutputSchema, // O que ela devolve
  },
  async input => { // A lógica da ferramenta
    // Prompt específico para esta tarefa
    const prompt = `Você é um especialista em marketing de mídia social...
Gere uma legenda envolvente... NÃO inclua hashtags... DEVE terminar com um CTA...
Tópico da postagem: ${input.topic}`;

    // Chama a IA para gerar o texto
    const { text } = await ai.generate({ prompt });
    
    // Retorna o resultado no formato esperado
    return { caption: text };
  }
);
```

-   **Explicação:** Cada arquivo de ferramenta define um `ai.defineTool`. Ele tem um `name` e uma `description` (para o orquestrador entender o que faz) e `inputSchema`/`outputSchema` (para validar os dados). A lógica interna é um prompt focado em uma única tarefa, garantindo um resultado de alta qualidade. Os outros agentes (`hashtagSuggesterTool` e `imagePromptGeneratorTool`) seguem exatamente a mesma estrutura.

### 3. A Interface do Usuário (`src/app/...` e `src/components/...`)

Agora vamos para o frontend, onde o usuário interage com nossa IA.

#### `src/app/page.tsx` (A Página Principal)

Este é o componente principal da nossa aplicação. Ele gerencia o estado (o que está acontecendo na tela) e junta todas as peças.

```typescript
'use client';

import { useState } from 'react';
// ... outros imports

export default function Home() {
  // `useState` para gerenciar os dados da tela
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Para mostrar notificações

  // Função chamada quando o formulário é enviado
  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true); // Mostra o "loading"
    setGeneratedContent(null); // Limpa o conteúdo antigo
    
    // Chama nossa Ação de Servidor (a ponte para a IA)
    const result = await generateContentAction(data);
    
    if (result.error || !result.data) {
      toast({ /* ... mostra erro ... */ });
    } else {
      setGeneratedContent(result.data); // Mostra o novo conteúdo
    }
    setIsLoading(false); // Esconde o "loading"
  };

  // O JSX que renderiza a página
  return (
    // ... Header, etc ...
    <PostiaForm onSubmit={handleFormSubmit} isLoading={isLoading} />

    <div className="mt-8 md:mt-12">
      {isLoading && <LoadingState />}
      {generatedContent && <GeneratedContent content={generatedContent} />}
    </div>
    // ... Footer ...
  );
}
```

-   **Explicação:**
    -   `'use client'` no topo indica que este é um Componente de Cliente, que pode usar interatividade e estado (hooks como `useState`).
    -   `useState` é um "gancho" (hook) do React para guardar informações que mudam, como o conteúdo gerado (`generatedContent`) e o estado de carregamento (`isLoading`).
    -   `handleFormSubmit` é a função que orquestra a interação: define o carregamento, chama a IA através da `generateContentAction`, e atualiza a tela com o resultado ou um erro.

#### `src/app/actions.ts` (A Ponte para a IA)

Este arquivo usa as **Ações de Servidor (Server Actions)** do Next.js. É uma forma segura e moderna de chamar código do lado do servidor (como nossos fluxos Genkit) a partir do lado do cliente.

```typescript
'use server';

// ... imports
import { generatePostContent } from '@/ai/flows/content-agent-flow'; // Importa nosso agente orquestrador

// ... Zod schema para validação

export async function generateContentAction(data: unknown): Promise<{...}> {
  // 1. Validação dos dados que vêm do formulário
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    return { data: null, error: 'Dados de entrada inválidos.' };
  }
  
  const { postTopic } = validation.data;

  try {
    // 2. Chama o fluxo principal da IA
    const result = await generatePostContent({ postTopic });

    // 3. Valida e formata a resposta
    if (!result?.caption || !result?.hashtags || !result?.imagePrompt) {
        throw new Error('A IA não conseguiu gerar todo o conteúdo.');
    }

    // 4. Devolve os dados para o frontend
    return {
      data: {
        caption: result.caption,
        hashtags: result.hashtags.slice(0, 15),
        prompt: result.imagePrompt,
      },
      error: null,
    };
  } catch (error) {
    // ... tratamento de erro
  }
}
```

-   **Explicação:** A diretiva `'use server'` transforma esta função em uma Ação de Servidor. A página `page.tsx` pode chamar `generateContentAction` como se fosse uma função local, mas o Next.js a executa de forma segura no servidor. Ela valida a entrada, chama o fluxo Genkit e retorna os dados (ou um erro) para a página.

#### Componentes Customizados (`src/components/...`)

Aqui detalhamos os componentes que criamos especificamente para o PostIA.

-   **`postia-form.tsx`**: Este é o coração da interação com o usuário.
    -   **Tecnologias:** Usamos `react-hook-form` para gerenciar o estado do formulário de forma eficiente e `zod` com `@hookform/resolvers/zod` para criar um esquema de validação robusto. Isso garante que o usuário não possa enviar um tópico vazio ou muito curto, por exemplo.
    -   **Props (Propriedades):** Ele recebe duas props da página principal: `onSubmit` (a função que será chamada quando o formulário for enviado com sucesso) e `isLoading` (um booleano que nos diz se a IA está processando).
    -   **Funcionalidade:** Quando o botão "Gerar Conteúdo Mágico" é clicado, `react-hook-form` valida os dados. Se forem válidos, ele chama a função `onSubmit` passando o tópico. A prop `isLoading` é usada para desabilitar o botão e mostrar um ícone de carregamento (`Loader2`), prevenindo envios duplicados e dando feedback visual ao usuário.
    -   **UI:** O componente é estilizado usando componentes `shadcn/ui` como `Card`, `Form`, `FormLabel`, `Input` e `Button`, garantindo consistência visual com o resto do app.

-   **`generated-content.tsx`**: Este componente é responsável por exibir os resultados da IA de forma clara e organizada.
    -   **Props:** Ele recebe uma única prop, `content`, que é um objeto contendo a legenda (`caption`), as hashtags (`hashtags`) e o prompt de imagem (`prompt`) gerados.
    -   **Estrutura:** O conteúdo é dividido em três seções, cada uma dentro de um componente `ContentCard` customizado. Isso torna o layout modular e fácil de ler. Usamos `Badge` para exibir as hashtags e `whitespace-pre-wrap` para que a quebra de linha da legenda seja respeitada.
    -   **Componente Filho:** Ele utiliza nosso `copy-button.tsx` em cada card para permitir que o usuário copie facilmente cada parte do conteúdo.

-   **`copy-button.tsx`**: Um pequeno mas poderoso componente de usabilidade.
    -   **Funcionalidade:** Ele recebe uma prop `textToCopy`. Ao ser clicado, ele usa a API do navegador `navigator.clipboard.writeText()` para copiar o texto para a área de transferência do usuário.
    -   **Feedback Visual:** Para confirmar a ação, o componente gerencia um estado interno `copied`. Quando o texto é copiado, o estado muda para `true`, o ícone de "Copiar" (`Copy`) é substituído por um ícone de "Verificado" (`Check`), e a cor do ícone muda para verde. Após 2 segundos, um `setTimeout` reseta o estado, e o ícone volta ao normal. Isso fornece um feedback claro e imediato para o usuário.

-   **`src/components/ui/`**: Esta pasta contém os blocos de construção da nossa interface, como `Button`, `Input`, `Card`, etc. Eles são da biblioteca `shadcn/ui`, que nos dá componentes bonitos, acessíveis e customizáveis.

---

### 4. Deploy na Vercel: Levando seu App para o Mundo

A Vercel é a plataforma criada pelos mesmos desenvolvedores do Next.js, tornando o processo de deploy incrivelmente simples.

#### Passo 1: Preparando o Terreno

1.  **Crie uma conta:** Se ainda não tiver, crie uma conta gratuita na [Vercel](https://vercel.com/signup).
2.  **Envie para o Git:** Coloque seu projeto em um repositório do GitHub, GitLab ou Bitbucket. A Vercel se integra perfeitamente com eles.

#### Passo 2: Importando e Configurando o Projeto

1.  No seu painel da Vercel, vá em "**Add New...**" -> "**Project**".
2.  Encontre e importe o repositório do seu PostIA.
3.  A Vercel vai reconhecer que é um projeto Next.js e preencher a maioria das configurações. A única coisa que precisamos fazer é adicionar nossa chave de API.

#### Passo 3: Adicionando a Variável de Ambiente

Esta é a etapa mais importante. Precisamos informar à Vercel qual é a nossa `GEMINI_API_KEY` de forma segura.

1.  Nas configurações do projeto na Vercel, encontre a aba "**Settings**" e depois clique em "**Environment Variables**".
2.  Crie uma nova variável com os seguintes dados:
    -   **Name:** `GEMINI_API_KEY`
    -   **Value:** `SUA_CHAVE_DE_API_AQUI` (cole a mesma chave que você usou no arquivo `.env` local).
3.  **Importante:** Deixe a variável com o tipo padrão ("Secret"), garantindo que ela não fique exposta no código do cliente.
4.  Salve a variável.

#### Passo 4: Deploy!

1.  Volte para a aba "**Deployments**" do seu projeto.
2.  Encontre o último build (que pode ter sido acionado automaticamente ao importar) e clique em "**Redeploy**" ou acione um novo deploy.
3.  A Vercel vai instalar as dependências, construir o projeto e colocá-lo no ar.

**Pronto!** Em poucos minutos, você receberá um link para o seu PostIA, funcionando perfeitamente em produção.

---

## 🎉 Conclusão

Parabéns! Você desvendou a arquitetura completa do PostIA e aprendeu a fazer o deploy.

-   **No Frontend**, usamos a elegância do **React com Next.js**.
-   **No Backend de IA**, usamos o **Genkit** para orquestrar **agentes de IA especializados** que rodam como **Server Actions** seguras.
-   **O Deploy**, foi simplificado ao máximo com a **Vercel**.

Este projeto é um excelente exemplo de como as tecnologias modernas podem ser combinadas para criar aplicações de IA poderosas e úteis. Sinta-se à vontade para experimentar e expandir o projeto!
