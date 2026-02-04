# Tarefas do Projeto - ServiceFinder App

**Última atualização**: 24/01/2026

---

## 📋 STATUS DAS TAREFAS

Legenda:
- ✅ Concluído
- 🔄 Em andamento
- ⏳ Pendente
- ⚠️ Bloqueado
- ❌ Cancelado

---

## FASE 1: PLANEJAMENTO E DOCUMENTAÇÃO

### Documentação
- ✅ Levantamento de requisitos funcionais
- ✅ Levantamento de requisitos não funcionais
- ✅ Definição da arquitetura
- ✅ Cronograma do projeto
- ✅ Guia de instalação
- ✅ Guia de apresentação
- ⏳ Casos de uso detalhados
- ⏳ Diagramas UML
- ⏳ Wireframes das telas

### Design
- ⏳ Definir paleta de cores
- ⏳ Criar logo do app
- ⏳ Wireframes baixa fidelidade
- ⏳ Protótipos alta fidelidade
- ⏳ Sistema de design (componentes)

---

## FASE 2: SETUP DO AMBIENTE

### Configuração Inicial
- ⏳ Instalar Node.js
- ⏳ Instalar Expo CLI
- ⏳ Criar projeto React Native
- ⏳ Instalar dependências necessárias
- ⏳ Configurar estrutura de pastas
- ⏳ Configurar Git
- ⏳ Criar repositório no GitHub

### Configurações do Projeto
- ⏳ Configurar ESLint
- ⏳ Configurar Prettier
- ⏳ Configurar tema global
- ⏳ Configurar navegação
- ⏳ Configurar ícones e fontes

---

## FASE 3: DESENVOLVIMENTO - COMPONENTES BASE

### Componentes Comuns
- ⏳ Button component
- ⏳ Input component
- ⏳ Card component
- ⏳ Header component
- ⏳ Loading component
- ⏳ Avatar component
- ⏳ Rating component
- ⏳ Badge component

### Layout Components
- ⏳ Container
- ⏳ Screen wrapper
- ⏳ TabBar customizado
- ⏳ SearchBar

---

## FASE 4: DESENVOLVIMENTO - TELAS PRINCIPAIS

### Autenticação
- ⏳ Splash Screen
  - [ ] Design
  - [ ] Implementação
  - [ ] Animação
  
- ⏳ Login Screen
  - [ ] UI/Layout
  - [ ] Formulário
  - [ ] Validação
  - [ ] Mock de autenticação
  
- ⏳ Registro Screen
  - [ ] UI/Layout
  - [ ] Formulário de cliente
  - [ ] Formulário de prestador
  - [ ] Validação
  - [ ] Mock de cadastro
  
- ⏳ Esqueci Senha Screen
  - [ ] UI/Layout
  - [ ] Implementação

### Home e Navegação Principal
- ⏳ Home Screen
  - [ ] Design
  - [ ] Lista de categorias
  - [ ] Serviços em destaque
  - [ ] Banner/carrossel
  - [ ] Integração com dados mock
  
- ⏳ Bottom Tab Navigation
  - [ ] Configuração
  - [ ] Ícones
  - [ ] Estilização

### Serviços
- ⏳ Service List Screen
  - [ ] UI/Layout
  - [ ] Lista de serviços
  - [ ] Filtros
  - [ ] Ordenação
  - [ ] Loading states
  
- ⏳ Service Detail Screen
  - [ ] UI/Layout
  - [ ] Informações do prestador
  - [ ] Galeria de fotos
  - [ ] Avaliações
  - [ ] Botão de contato
  
- ⏳ Service Request Screen
  - [ ] UI/Layout
  - [ ] Formulário de solicitação
  - [ ] Upload de fotos (mock)
  - [ ] Confirmação

### Busca
- ⏳ Search Screen
  - [ ] UI/Layout
  - [ ] Barra de busca
  - [ ] Sugestões
  - [ ] Histórico de busca
  - [ ] Resultados

### Perfil
- ⏳ Profile Screen
  - [ ] UI/Layout
  - [ ] Informações do usuário
  - [ ] Menu de opções
  - [ ] Estatísticas (se prestador)
  
- ⏳ Edit Profile Screen
  - [ ] UI/Layout
  - [ ] Formulário de edição
  - [ ] Upload de foto (mock)
  
- ⏳ Settings Screen
  - [ ] UI/Layout
  - [ ] Opções de configuração
  - [ ] Logout

### Chat (Se houver tempo)
- ⏳ Chat List Screen
  - [ ] UI/Layout
  - [ ] Lista de conversas
  
- ⏳ Chat Screen
  - [ ] UI/Layout
  - [ ] Mensagens
  - [ ] Input de mensagem

---

## FASE 5: FUNCIONALIDADES

### Dados e Estado
- ⏳ Criar dados mockados
  - [ ] Usuários
  - [ ] Serviços
  - [ ] Categorias
  - [ ] Avaliações
  - [ ] Mensagens (se aplicável)
  
- ⏳ Context API
  - [ ] AuthContext
  - [ ] UserContext
  - [ ] ServicesContext
  
- ⏳ Custom Hooks
  - [ ] useAuth
  - [ ] useServices
  - [ ] useDebounce

### Funcionalidades Core
- ⏳ Sistema de busca
  - [ ] Busca por texto
  - [ ] Busca por categoria
  - [ ] Filtros
  - [ ] Ordenação
  
- ⏳ Sistema de avaliações
  - [ ] Exibir avaliações
  - [ ] Calcular média
  - [ ] Formulário de avaliação (se tempo)
  
- ⏳ Sistema de favoritos
  - [ ] Adicionar/remover favoritos
  - [ ] Lista de favoritos
  - [ ] Persistência local

### Storage Local
- ⏳ AsyncStorage setup
  - [ ] Salvar token/sessão
  - [ ] Salvar favoritos
  - [ ] Salvar histórico de busca
  - [ ] Salvar preferências

---

## FASE 6: REFINAMENTOS

### UI/UX
- ⏳ Animações
  - [ ] Transições de tela
  - [ ] Loading animations
  - [ ] Micro-interações
  
- ⏳ Feedback visual
  - [ ] Toasts/Snackbars
  - [ ] Estados vazios
  - [ ] Estados de erro
  
- ⏳ Responsividade
  - [ ] Testar em diferentes tamanhos
  - [ ] Ajustes de layout
  - [ ] Orientação (portrait/landscape)

### Performance
- ⏳ Otimização de imagens
- ⏳ Lazy loading
- ⏳ Memoização de componentes
- ⏳ Redução de re-renders

---

## FASE 7: TESTES

### Testes Funcionais
- ⏳ Testar fluxo de login
- ⏳ Testar navegação
- ⏳ Testar busca
- ⏳ Testar favoritos
- ⏳ Testar em iOS (se possível)
- ⏳ Testar em Android

### Testes de Usabilidade
- ⏳ Testar com usuários
- ⏳ Coletar feedback
- ⏳ Fazer ajustes

### Correção de Bugs
- ⏳ Lista de bugs encontrados
- ⏳ Priorização
- ⏳ Correção
- ⏳ Reteste

---

## FASE 8: PREPARAÇÃO PARA APRESENTAÇÃO

### Documentação Final
- ⏳ README atualizado
- ⏳ Manual do usuário
- ⏳ Documentação técnica
- ⏳ Comentários no código

### Apresentação
- ⏳ Criar slides
- ⏳ Preparar demonstração
- ⏳ Tirar screenshots
- ⏳ Gravar vídeo (backup)
- ⏳ Ensaiar apresentação
- ⏳ Preparar respostas para perguntas

### Finalização
- ⏳ Commit final no Git
- ⏳ Criar release/tag
- ⏳ Documentação de instalação testada
- ⏳ Build final testado

---

## 🎯 PRIORIDADES PARA MVP (2 DIAS)

### DIA 1 - CRÍTICO ⚡
1. Setup do projeto
2. Navegação básica
3. Tela de Login (UI)
4. Tela Home
5. Lista de Serviços
6. Detalhes do Serviço
7. Dados mockados básicos

### DIA 2 - CRÍTICO ⚡
8. Busca funcional
9. Perfil do usuário
10. Refinamentos visuais
11. Correção de bugs críticos
12. Testes gerais
13. Preparação da apresentação

### SE SOBRAR TEMPO 🎁
- Favoritos
- Avaliações
- Chat básico
- Animações
- Histórico

---

## 📊 MÉTRICAS DE PROGRESSO

### Geral
- Total de tarefas: ~150
- Concluídas: 6 (4%)
- Em andamento: 0 (0%)
- Pendentes: 144 (96%)

### Por Fase
- Fase 1 (Planejamento): 60% concluído
- Fase 2 (Setup): 0% concluído
- Fase 3 (Componentes): 0% concluído
- Fase 4 (Telas): 0% concluído
- Fase 5 (Funcionalidades): 0% concluído
- Fase 6 (Refinamentos): 0% concluído
- Fase 7 (Testes): 0% concluído
- Fase 8 (Apresentação): 0% concluído

---

## 📝 NOTAS

### Decisões Tomadas
- Usar Expo para agilizar desenvolvimento
- Focar em MVP com dados mockados
- Priorizar visual e funcionalidades essenciais
- Deixar backend para futuro

### Riscos Identificados
- ⚠️ Tempo muito curto (2 dias)
- ⚠️ Possível falta de experiência com React Native
- ⚠️ Muitas funcionalidades desejadas vs tempo disponível

### Mitigações
- ✅ Documentação completa criada
- ✅ Priorização clara (MVP)
- ✅ Guias de instalação e apresentação
- ⏳ Focar apenas no essencial

---

**Atualizar este arquivo conforme progresso!**
