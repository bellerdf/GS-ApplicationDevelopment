# Meu Ponto SP - Global Solution FIAP (Application Development)

Aplicação web responsiva desenvolvida em HTML, CSS e JavaScript que consome a **API Olho Vivo da SPTrans** para auxiliar cidadãos no monitoramento de paradas e previsão de chegada de ônibus em tempo real na cidade de São Paulo.

## O que o aplicativo faz
- **Busca de Paradas (`/Parada/Buscar`):** Permite pesquisar pontos de ônibus por nome da via, bairro ou endereço (ex: Paulista, Lapa, Consolação).
- **Painel de Previsão em Tempo Real (`/Previsao/Parada`):** Exibe os próximos veículos que passarão no ponto selecionado, informando letreiro da linha, destino, prefixo do veículo e horário estimado de chegada.
- **Indicador de Acessibilidade:** Destaca visualmente os veículos adaptados para pessoas com deficiência (`♿ Veículo Acessível`).
- **Interface Responsiva:** Layout adaptável para uso em celulares e computadores, com créditos oficiais aos dados da SPTrans no rodapé.

## Estrutura do Projeto
- `index.html`: Estrutura semântica da aplicação.
- `style.css`: Estilização responsiva em tema escuro (preto, verde e branco).
- `script.js`: Lógica de consumo da API, manipulação de DOM e eventos de busca.
- `api/sptrans.js`: Função serverless na Vercel responsável pela autenticação (`POST /Login/Autenticar`) e consulta às rotas da API Olho Vivo, contornando restrições de CORS.
- `participantes.txt`: Identificação e divisão de tarefas.

## Como Executar
1. **Acesso direto (Produção):** Acesse o link publicado na Vercel: `https://gs-application-development.vercel.app`
2. **Execução local:**
   - Clone este repositório: `git clone https://github.com/bellerdf/GS-ApplicationDevelopment.git`
   - Instale a CLI da Vercel (`npm i -g vercel`) e execute `vercel dev` na raiz do projeto para rodar o frontend junto com a função serverless (`/api/sptrans`).

---
*Dados fornecidos pela SPTrans (API Olho Vivo).*
