# 🎓 Workshop PostIA: Construindo um App de IA com Next.js e Genkit

Olá, desenvolvedor(a)!

Bem-vindo ao workshop do PostIA. Este documento é um guia completo e detalhado, projetado para ensinar como construir o aplicativo PostIA do zero. Vamos explorar cada arquivo, cada componente e cada linha de código, explicando os conceitos de uma forma clara e acessível, ideal para quem está começando, mas também com insights valiosos para os mais experientes.

## 🎯 Objetivo do Projeto

O PostIA é um assistente de marketing para Instagram. A ideia é simples: o usuário fornece um tópico, e nossa aplicação, com o poder de múltiplos agentes de IA, gera um pacote de conteúdo completo:

1.  **Legenda Cativante:** Com uma chamada para ação (CTA) relevante.
2.  **Hashtags Estratégicas:** Para aumentar o alcance.
3.  **Prompt de Imagem Detalhado e Seguro:** Otimizado para modelos de IA de geração de imagem, com verificação de fatos.

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

#### A Dupla Dinâmica da Estilização: `tailwind.config.ts` e `globals.css`

É crucial entender como esses dois arquivos trabalham juntos. Pense neles como o cérebro e o coração do nosso design.

-   **`tailwind.config.ts`**: Este arquivo é o **"Cérebro do Tailwind"**. Ele não contém CSS. Em vez disso, ele **configura o próprio framework**.
    -   **`content`**: Aqui dizemos ao Tailwind para escanear todos os nossos arquivos `.tsx` em busca de classes como `bg-primary` ou `text-center`. Isso é uma otimização poderosa: no final, o Tailwind gera um CSS que contém **apenas** as classes que realmente usamos, deixando o arquivo final minúsculo.
    -   **`theme.extend`**: Aqui nós "ensinamos" novos truques ao Tailwind. Criamos nossa identidade visual:
        -   **Cores:** Definimos nomes como `primary`, `accent`, `card`, etc. Mas note o valor: `hsl(var(--primary))`. Não estamos definindo a cor diretamente, mas dizendo ao Tailwind: "Ei, para a cor `primary`, use o valor da variável CSS chamada `--primary`".
        -   **Fontes:** Da mesma forma, criamos os nomes `font-headline` e `font-body`, associando-os às fontes 'Poppins' e 'PT Sans'. Agora, em qualquer lugar do app, podemos usar `font-headline` para ter a fonte de título correta.
    -   **Analogia:** Pense no `tailwind.config.ts` como a **receita e a lista de ingredientes** do seu restaurante. Ele define que o "molho especial" se chamará `primary` e que a massa `headline` usará farinha 'Poppins'.

-   **`src/app/globals.css`**: Este é o **"Coração que Bombeia os Estilos"**. É aqui que o CSS de verdade é aplicado globalmente.
    -   **`@tailwind base; ...`**: Essas três linhas no topo são as diretivas que injetam todos os estilos padrão do Tailwind no nosso projeto.
    -   **`:root`**: Aqui está a mágica! Este é um seletor CSS que representa a raiz do seu documento. Dentro dele, nós finalmente **definimos os valores** para as variáveis que usamos no `tailwind.config.ts`.
        -   `--background: 267 25% 10%;`
        -   `--primary: 267 39.2% 55%;`
        -   Quando você usa `bg-primary`, o `tailwind.config.ts` diz "use a variável `--primary`", e o `globals.css` responde: "Ok, o valor de `--primary` é `267 39.2% 55%`!".
    -   **Analogia:** O `globals.css` é a **cozinha** do seu restaurante. É aqui que você efetivamente define a temperatura do forno (os valores HSL das variáveis de cor) e mistura os ingredientes (`@tailwind`) para preparar a base de todos os pratos.

**Em resumo: `tailwind.config.ts` define os NOMES e as ABSTRAÇÕES, e `globals.css` define os VALORES REAIS dessas abstrações. Eles são inseparáveis e essenciais.**

-   **`next.config.ts`**: Configurações específicas do Next.js. Adicionamos a configuração do PWA (`@ducanh2912/next-pwa`) para tornar nosso app instalável.
-   **`.env`**: Este arquivo **não é enviado** para o repositório (por segurança!). Ele armazena "segredos", como a nossa `GEMINI_API_KEY`. O arquivo `src/ai/genkit.ts` lê essa chave para que a IA possa funcionar no ambiente de desenvolvimento local.


### 2. A Arquitetura de IA com Genkit (`src/ai/...`)

Esta é a parte mais mágica do projeto. Usamos uma **arquitetura de múltiplos agentes**, onde cada "agente" é uma ferramenta ou fluxo especializado.

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

Em vez de um único prompt gigante tentando fazer tudo, nós criamos "ferramentas" e "fluxos" menores e focados:

1.  **Agente de Legenda** (`generate-instagram-caption.ts`): Especialista em criar textos de posts.
2.  **Agente de Hashtags** (`suggest-relevant-hashtags.ts`): Especialista em marketing e SEO de hashtags.
3.  **Ferramenta de Busca** (`google-search-tool.ts`): Uma ferramenta que simula uma busca na web para verificar fatos.
4.  **Agente de Prompt de Imagem** (`generate-gemini-nano-prompt.ts`): Um engenheiro de prompt sênior que agora **usa a ferramenta de busca** para garantir a segurança dos elementos no prompt.
5.  **Agente de Conteúdo** (`content-agent-flow.ts`): O orquestrador que coordena todos os outros.

#### `src/ai/tools/google-search-tool.ts` (A Ferramenta de Busca)

Este é um novo tipo de arquivo: uma **ferramenta**. Uma ferramenta é uma função que um agente de IA pode decidir chamar para obter informações externas.

```typescript
'use server';
// ... imports ...

// Definimos a ferramenta de busca usando `ai.defineTool`.
export const googleSearchTool = ai.defineTool(
  {
    name: 'googleSearchTool',
    description: 'Realiza uma busca na web para responder a uma pergunta...',
    inputSchema: SearchInputSchema,
    outputSchema: SearchOutputSchema,
  },
  async (input) => {
    console.log(`🔎 Realizando busca simulada por: "${input.query}"`);

    // **Simulação de Respostas da API de Busca**
    // Em um app real, aqui você chamaria uma API de busca de verdade.
    const query = input.query.toLowerCase();
    if (query.includes('alface romana') && query.includes('porquinho da índia')) {
      return "Não, alface romana não é segura...";
    }
    // ... outras respostas simuladas ...

    return `Resultado da busca para "${input.query}": (Resposta simulada).`;
  }
);
```
-   **Explicação:** Nós definimos uma `googleSearchTool` que um modelo de IA pode usar. A `description` é crucial, pois é como o modelo sabe *quando* e *para que* usar a ferramenta. Por enquanto, a busca é simulada, mas ela já demonstra o conceito de dar ao agente a capacidade de buscar informações externas para tomar decisões mais seguras.


#### `src/ai/flows/generate-gemini-nano-prompt.ts` (O Agente Pesquisador)

Este agente foi promovido. Antes era uma simples ferramenta, agora é um `Flow` (fluxo) que pode usar outras ferramentas.

```typescript
'use server';
// ... imports ...
import { googleSearchTool } from '../tools/google-search-tool';

// ... esquemas de entrada e saída ...

// Define o fluxo do agente que agora pode usar ferramentas.
const imagePromptFlow = ai.defineFlow(
  {
    name: 'imagePromptGeneratorFlow',
    // ... schemas ...
  },
  async input => {
    // O prompt foi atualizado para ser muito mais explícito.
    const prompt = `Você é um Engenheiro de Prompt Sênior e um especialista em pesquisa de segurança.
**Processo Obrigatório:**
1. Analise o tópico: "${input.topic}".
2. Para CADA elemento que você pretende incluir..., você DEVE USAR a ferramenta 'googleSearchTool' para fazer uma pergunta específica sobre sua segurança.
3. Construa uma lista de elementos POSITIVOS E COMPROVADAMENTE SEGUROS com base nas respostas da busca.
...`;

    // Executa o modelo de IA, fornecendo a ferramenta de busca.
    const result = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash', // Um modelo capaz de usar ferramentas
      tools: [googleSearchTool], // Aqui está a mágica: damos a ferramenta ao agente!
      output: { schema: ImagePromptOutputSchema },
    });

    return result.output!;
  }
);
```
-   **Explicação:** O `imagePromptFlow` agora é um `ai.defineFlow`. Ao gerar o conteúdo, nós passamos a `googleSearchTool` no array de `tools`. O prompt instrui o modelo de IA a **obrigatoriamente** usar essa ferramenta para verificar cada item antes de adicioná-lo ao prompt de imagem final. Isso resolve o problema de segurança que encontramos (como o da alface romana) de uma forma robusta.


#### `src/ai/flows/content-agent-flow.ts` (O Agente Chefe)

O orquestrador foi simplificado. Em vez de gerenciar várias ferramentas, ele agora chama cada agente especializado em paralelo e aguarda os resultados.

```typescript
'use server';
// ... imports ...
import { captionGeneratorTool } from './generate-instagram-caption';
import { hashtagSuggesterTool } from './suggest-relevant-hashtags';
import { generateImagePrompt } from './generate-gemini-nano-prompt';

// ... esquemas de entrada e saída com Zod ...

export async function generatePostContent(
  input: GeneratePostContentInput
): Promise<GeneratePostContentOutput> {
  // Chama os agentes em paralelo para otimizar o tempo de resposta.
  const [captionResult, hashtagResult, imagePromptResult] = await Promise.all([
    captionGeneratorTool({ topic: input.postTopic }),
    hashtagSuggesterTool({ topic: input.postTopic }),
    generateImagePrompt({ topic: input.postTopic }), // Chama a função exportada do fluxo de imagem
  ]);

  return {
    caption: captionResult.caption,
    hashtags: hashtagResult.hashtags,
    imagePrompt: imagePromptResult.imagePrompt,
  };
}
```

-   **Explicação:** A função `generatePostContent` agora usa `Promise.all`. Isso dispara as chamadas para os três agentes (legenda, hashtags e prompt de imagem) simultaneamente. O sistema não precisa esperar a legenda terminar para começar a gerar as hashtags. Isso torna a geração de conteúdo muito mais rápida e eficiente.


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

-   **Explicação do Código:**
    -   `'use client'` no topo indica que este é um Componente de Cliente, que pode usar interatividade e estado (hooks como `useState`).
    -   `useState` é um "gancho" (hook) do React para guardar informações que mudam, como o conteúdo gerado (`generatedContent`) e o estado de carregamento (`isLoading`).
    -   `handleFormSubmit` é a função que orquestra a interação: define o carregamento, chama a IA através da `generateContentAction`, e atualiza a tela com o resultado ou um erro.

-   **Explicação do Estilo (Classes Tailwind):**
    -   `flex min-h-screen w-full flex-col`: Estamos usando Flexbox para organizar a página. `flex-col` empilha os elementos verticalmente. `min-h-screen` garante que o contêiner principal ocupe pelo menos 100% da altura da tela, e `w-full` que ocupe 100% da largura. Isso faz com que o rodapé fique no final da página, mesmo em telas com pouco conteúdo.
    -   `container mx-auto px-4`: `container` é uma classe do Tailwind que centraliza o conteúdo e define uma largura máxima. `mx-auto` centraliza o container horizontalmente, e `px-4` adiciona um espaçamento (`padding`) horizontal para que o conteúdo não cole nas bordas da tela.
    -   `text-center mb-8 md:mb-12`: `text-center` alinha o texto ao centro. `mb-8` adiciona uma margem inferior (`margin-bottom`), e `md:mb-12` é um **modificador responsivo**: em telas de tamanho médio (`md`) ou maiores, a margem será maior (`12` em vez de `8`), criando um layout mais arejado em telas grandes.
    -   `font-headline text-4xl sm:text-5xl`: `font-headline` aplica nossa fonte customizada 'Poppins'. `text-4xl` define um tamanho de fonte grande, e `sm:text-5xl` a torna ainda maior em telas pequenas (`sm`) e acima, garantindo boa legibilidade em qualquer dispositivo.

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
    -   **Estilo (Classes Tailwind):**
        -   `space-y-6`: Adiciona um espaço vertical uniforme entre todos os elementos filhos diretos do formulário (o campo de input e o botão), criando um ritmo visual agradável.
        -   `flex justify-end`: Transforma o contêiner do botão em um container flexbox e alinha seu conteúdo (`Button`) à direita (`justify-end`).
        -   `animate-spin`: Classe utilitária do Tailwind que aplica uma animação de rotação contínua. Nós a usamos no ícone `Loader2` para indicar claramente que algo está acontecendo.
        -   `hover:bg-primary/90`: Um modificador de estado. Ele diz: "quando o mouse estiver sobre este elemento (`hover:`), aplique a classe `bg-primary/90` (a cor de fundo primária com 90% de opacidade)". Isso cria o efeito visual de feedback quando o usuário passa o mouse sobre o botão.

-   **`generated-content.tsx`**: Este componente é responsável por exibir os resultados da IA de forma clara e organizada.
    -   **Props:** Ele recebe uma única prop, `content`, que é um objeto contendo a legenda (`caption`), as hashtags (`hashtags`) e o prompt de imagem (`prompt`) gerados.
    -   **Estrutura:** O conteúdo é dividido em três seções, cada uma dentro de um componente `ContentCard` customizado. Isso torna o layout modular e fácil de ler.
    -   **Estilo (Classes Tailwind):**
        -   `space-y-8`: Similar ao `space-y-6` do formulário, mas com um espaço maior para separar visualmente cada `ContentCard`.
        -   `animate-in fade-in-50 duration-500`: Um conjunto de classes de animação. Quando o componente aparece, ele terá um efeito de "fade-in" (aparecer suavemente) com uma duração de 500ms.
        -   `flex flex-wrap gap-2`: Usado no contêiner das hashtags. `flex-wrap` permite que as hashtags quebrem para a próxima linha se não couberem todas em uma só. `gap-2` adiciona um pequeno espaço entre cada hashtag.
        -   `whitespace-pre-wrap`: Uma classe muito útil! Ela diz ao navegador para respeitar as quebras de linha e os espaços que vêm do texto da legenda gerada pela IA, exibindo a formatação exatamente como foi criada.
        -   `font-mono`: Aplica uma fonte monoespaçada ao prompt de imagem, dando a ele uma aparência de "código" ou texto técnico, o que é apropriado.

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
-   **No Backend de IA**, usamos o **Genkit** para orquestrar **agentes de IA especializados** que rodam como **Server Actions** seguras. Um desses agentes agora tem a capacidade de **usar ferramentas** para buscar informações em tempo real, garantindo resultados mais seguros e precisos.
-   **O Deploy**, foi simplificado ao máximo com a **Vercel**.

Este projeto é um excelente exemplo de como as tecnologias modernas podem ser combinadas para criar aplicações de IA poderosas e úteis. Sinta-se à vontade para experimentar e expandir o projeto!
