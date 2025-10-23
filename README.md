# 🚀 PostIA: Seu Assistente de Conteúdo para Instagram com IA

Bem-vindo ao PostIA! Este projeto é uma aplicação web completa, construída com Next.js e Genkit, projetada para atuar como um assistente de marketing de mídia social. Com o poder da IA generativa do Google, o PostIA gera legendas, hashtags relevantes e prompts de imagem detalhados, tudo a partir de um único tópico.

Este `README` irá guiá-lo para configurar e executar o projeto em seu ambiente local.

![Demonstração do PostIA](https://storage.googleapis.com/static.aifirebase.dev/project-wizards/instaboost-ai.gif)

## ✨ Funcionalidades Principais

-   **Geração de Conteúdo com um Clique:** Insira um tópico e deixe a IA fazer o resto.
-   **Arquitetura Multi-Agentes:** O sistema usa agentes de IA especializados (ferramentas Genkit) para cada tarefa:
    -   Um agente para criar legendas persuasivas com uma chamada para ação (CTA).
    -   Um agente para sugerir as hashtags mais relevantes para o seu tópico.
    -   Um agente "Engenheiro de Prompt Sênior" que cria prompts de imagem otimizados.
-   **Interface Moderna e Responsiva:** Construído com Next.js, React, Tailwind CSS e shadcn/ui.
-   **Progressive Web App (PWA):** O aplicativo pode ser instalado em dispositivos móveis e desktops para uma experiência nativa.

## 🛠️ Tecnologias Utilizadas

-   **Framework:** [Next.js](https://nextjs.org/) (com App Router)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/)
-   **Inteligência Artificial:** [Genkit (Google AI)](https://genkit.dev/)
-   **Formulários:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Ícones:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)

## ⚙️ Configuração e Execução Local

Siga os passos abaixo para ter uma cópia do PostIA rodando em sua máquina.

### 1. Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18 ou superior)
-   [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)

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
    Renomeie o arquivo `.env.example` (se houver) para `.env` ou crie um novo arquivo `.env` na raiz do projeto e adicione sua chave de API:

    ```.env
    GEMINI_API_KEY=SUA_CHAVE_DE_API_AQUI
    ```
    Substitua `SUA_CHAVE_DE_API_AQUI` pela chave que você obteve no Google AI Studio.

### 4. Execute a Aplicação

O projeto usa dois servidores de desenvolvimento que precisam rodar simultaneamente: um para a aplicação Next.js (frontend) e outro para o Genkit (backend de IA).

1.  **Inicie o servidor do Next.js:**
    Abra um terminal e execute:
    ```bash
    npm run dev
    ```
    Isso iniciará a aplicação em `http://localhost:9002`.

2.  **Inicie o servidor do Genkit:**
    Abra um **novo terminal** e execute:
    ```bash
    npm run genkit:watch
    ```
    Isso inicia o servidor Genkit, que expõe os fluxos de IA para a aplicação Next.js. O comando `genkit:watch` monitora as alterações nos arquivos de fluxo e reinicia o servidor automaticamente.

Agora, acesse `http://localhost:9002` em seu navegador para ver o PostIA em ação!

## 📚 Quer Aprender Mais?

Para um mergulho profundo em como cada parte do PostIA foi construída, confira nosso documento de workshop! Ele é um tutorial completo que explica o projeto do zero.

➡️ **Leia o [WORKSHOP.md](./WORKSHOP.md)**
