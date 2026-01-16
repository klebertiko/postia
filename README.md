# 🚀 PostIA: Seu Assistente de Conteúdo para Instagram com IA

Bem-vindo ao PostIA! Este projeto é uma aplicação web completa, construída com Next.js e Genkit, projetada para atuar como um assistente de marketing de mídia social. Com o poder da IA generativa do Google, o PostIA gera legendas, hashtags relevantes e prompts de imagem detalhados, tudo a partir de um único tópico.

Este `README` irá guiá-lo para configurar, executar e fazer o deploy do projeto.

![Demonstração do PostIA](https://storage.googleapis.com/static.aifirebase.dev/project-wizards/instaboost-ai.gif)

## ✨ Funcionalidades Principais

-   **Geração de Conteúdo com um Clique:** Insira um tópico e deixe a IA fazer o resto.
-   **Geração de Legendas, Hashtags e Prompts de Imagem:** Um pacote completo de conteúdo para suas postagens.
-   **Links para Geradores de Imagem:** Após gerar um prompt de imagem, o app fornece links diretos para plataformas como o Gemini para você poder criar sua imagem instantaneamente.
-   **Interface Moderna e Responsiva:** Construído com Next.js, React, Tailwind CSS e shadcn/ui.
-   **Progressive Web App (PWA):** O aplicativo pode ser instalado em dispositivos móveis e desktops para uma experiência nativa.
-   **Monetização com Google AdSense:** Preparado para exibir anúncios e gerar receita.

## 🛠️ Tecnologias Utilizadas

-   **Framework:** [Next.js](https://nextjs.org/) (com App Router)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/)
-   **Inteligência Artificial:** [Genkit (Google AI)](https://genkit.dev/)
-   **Formulários:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Ícones:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Deploy:** [Vercel](https://vercel.com/)

## ⚙️ Configuração e Execução Local

Siga os passos abaixo para ter uma cópia do PostIA rodando em sua máquina.

### 1. Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
-   [Git](https://git-scm.com/)

### 2. Obtenha uma Chave de API do Gemini

Para que a IA funcione, você precisa de uma chave de API do Google Gemini.

1.  Acesse o [Google AI Studio](https://aistudio.google.com/).
2.  Clique em "**Get API key**" (Obter chave de API) e crie uma nova chave.
3.  Copie a chave gerada. Você a usará no próximo passo.

### 3. Clone e Configure o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_USUARIO/PostIA.git
    cd PostIA
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Crie o arquivo de ambiente:**
    Crie um novo arquivo chamado `.env` na raiz do projeto e adicione suas chaves de ambiente:
    ```.env
    GEMINI_API_KEY=SUA_CHAVE_DE_API_AQUI
    NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-SEU_ID_DE_CLIENTE_AQUI
    ```
    - Substitua `SUA_CHAVE_DE_API_AQUI` pela chave que você obteve no Google AI Studio.
    - Opcional: Substitua `ca-pub-SEU_ID_DE_CLIENTE_AQUI` pelo seu ID de cliente do Google AdSense para habilitar os anúncios.

### 4. Execute a Aplicação Localmente

A aplicação Next.js já inclui os fluxos de IA como Server Actions, então você só precisa de um comando para rodar tudo.

```bash
npm run dev
```

Agora, acesse `http://localhost:9002` em seu navegador para ver o PostIA em ação!

## 🚀 Deploy na Vercel

Fazer o deploy do PostIA é um processo simples com a Vercel.

### 1. Crie uma Conta e Conecte seu Git

1.  Crie uma conta gratuita na [Vercel](https://vercel.com/signup).
2.  Faça o upload do seu projeto para um repositório no GitHub, GitLab ou Bitbucket.
3.  Na Vercel, clique em "**Add New...**" -> "**Project**".
4.  Importe o repositório do seu projeto.

### 2. Configure o Projeto

A Vercel detectará automaticamente que é um projeto Next.js e usará as configurações corretas. A única etapa manual é configurar as variáveis de ambiente.

1.  Dentro das configurações do seu projeto na Vercel, vá para a aba "**Settings**" -> "**Environment Variables**".
2.  Adicione as seguintes variáveis:
    -   **`GEMINI_API_KEY`**: Cole a chave de API que você obteve do Google AI Studio. Certifique-se de que a variável **não esteja** marcada como "Exposed to the client".
    -   **`NEXT_PUBLIC_ADSENSE_CLIENT_ID`**: (Opcional) Cole o seu ID de Cliente do Google AdSense (ex: `ca-pub-123456789...`). Como ela começa com `NEXT_PUBLIC_`, a Vercel a disponibilizará para o cliente automaticamente.
3.  Salve as variáveis.
4.  Clique em "**Deploy**" para publicar sua aplicação com as novas configurações.

A Vercel cuidará de todo o processo de build e deploy. Em poucos minutos, seu PostIA estará online e acessível globalmente!

## 📚 Quer Aprender Mais?

Para um mergulho profundo em como cada parte do PostIA foi construída, confira nosso documento de workshop! Ele é um tutorial completo que explica o projeto do zero.

➡️ **Leia o [WORKSHOP.md](./WORKSHOP.md)**
