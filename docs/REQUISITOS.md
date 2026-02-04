# Levantamento de Requisitos - ServiceFinder App

**Projeto**: ServiceFinder App  
**Data**: 24 de Janeiro de 2026  
**Versão**: 1.0

---

## 1. REQUISITOS FUNCIONAIS

### RF01 - Gestão de Usuários

#### RF01.1 - Cadastro de Usuário Cliente
**Descrição**: O sistema deve permitir que novos usuários se cadastrem como clientes.  
**Prioridade**: Alta  
**Dados necessários**:
- Nome completo
- Email
- Telefone
- Senha
- Localização (cidade/região)
- Foto de perfil (opcional)

#### RF01.2 - Cadastro de Prestador de Serviços
**Descrição**: O sistema deve permitir que prestadores de serviços se cadastrem.  
**Prioridade**: Alta  
**Dados necessários**:
- Dados pessoais (nome, email, telefone, senha)
- Categorias de serviços oferecidos
- Descrição profissional
- Portfólio/fotos de trabalhos anteriores
- Certificações (se aplicável)
- Área de atuação
- Disponibilidade de horários

#### RF01.3 - Login e Autenticação
**Descrição**: O sistema deve permitir login seguro com email e senha.  
**Prioridade**: Alta  
**Funcionalidades**:
- Login com email/senha
- Recuperação de senha
- Logout
- Manter sessão ativa

#### RF01.4 - Perfil do Usuário
**Descrição**: Usuários devem poder visualizar e editar seus perfis.  
**Prioridade**: Média  
**Funcionalidades**:
- Visualizar dados pessoais
- Editar informações
- Alterar senha
- Gerenciar foto de perfil

---

### RF02 - Busca e Descoberta de Serviços

#### RF02.1 - Busca por Categoria
**Descrição**: O sistema deve permitir busca de serviços por categoria.  
**Prioridade**: Alta  
**Categorias sugeridas**:
- Reparos Domésticos (eletricista, encanador, pedreiro)
- Beleza e Estética (cabeleireiro, manicure, maquiador)
- Saúde e Bem-estar (fisioterapeuta, personal trainer, nutricionista)
- Educação (aulas particulares, reforço escolar)
- Tecnologia (técnico em informática, instalação de equipamentos)
- Limpeza e Organização
- Transporte e Mudanças
- Eventos (fotógrafo, DJ, buffet)
- Outros

#### RF02.2 - Busca por Palavra-chave
**Descrição**: Permitir busca textual de serviços.  
**Prioridade**: Alta

#### RF02.3 - Filtros de Busca
**Descrição**: Sistema deve oferecer filtros para refinar resultados.  
**Prioridade**: Média  
**Filtros**:
- Localização/distância
- Faixa de preço
- Avaliação mínima
- Disponibilidade

#### RF02.4 - Ordenação de Resultados
**Descrição**: Permitir ordenar resultados da busca.  
**Prioridade**: Média  
**Opções**:
- Mais relevantes
- Melhor avaliados
- Menor preço
- Maior preço
- Mais próximos

---

### RF03 - Visualização de Serviços

#### RF03.1 - Detalhes do Serviço
**Descrição**: Exibir informações completas do prestador e serviço.  
**Prioridade**: Alta  
**Informações exibidas**:
- Nome do prestador
- Foto de perfil
- Categoria do serviço
- Descrição detalhada
- Preço ou faixa de preço
- Localização/área de atuação
- Avaliações e comentários
- Portfólio/galeria de fotos
- Tempo de experiência
- Disponibilidade

#### RF03.2 - Galeria de Portfólio
**Descrição**: Visualizar trabalhos anteriores do prestador.  
**Prioridade**: Média

---

### RF04 - Solicitação e Agendamento

#### RF04.1 - Solicitar Serviço
**Descrição**: Cliente pode solicitar um serviço ao prestador.  
**Prioridade**: Alta  
**Dados da solicitação**:
- Descrição do problema/necessidade
- Fotos do local/problema (opcional)
- Data e horário preferencial
- Localização do serviço
- Observações adicionais

#### RF04.2 - Aceitar/Recusar Solicitação
**Descrição**: Prestador pode aceitar ou recusar solicitações.  
**Prioridade**: Alta

#### RF04.3 - Proposta de Valor
**Descrição**: Prestador pode enviar proposta com valor estimado.  
**Prioridade**: Média

#### RF04.4 - Agendamento
**Descrição**: Sistema deve gerenciar agendamentos confirmados.  
**Prioridade**: Alta

---

### RF05 - Comunicação

#### RF05.1 - Chat entre Cliente e Prestador
**Descrição**: Sistema de mensagens interno para comunicação.  
**Prioridade**: Alta  
**Funcionalidades**:
- Enviar mensagens de texto
- Enviar fotos
- Notificações de novas mensagens
- Histórico de conversas

#### RF05.2 - Notificações Push
**Descrição**: Notificar usuários sobre eventos importantes.  
**Prioridade**: Média  
**Eventos notificados**:
- Nova solicitação de serviço
- Solicitação aceita/recusada
- Nova mensagem
- Lembrete de agendamento
- Avaliação recebida

---

### RF06 - Avaliações e Reputação

#### RF06.1 - Avaliar Prestador
**Descrição**: Cliente pode avaliar o prestador após o serviço.  
**Prioridade**: Alta  
**Dados da avaliação**:
- Nota (1 a 5 estrelas)
- Comentário escrito
- Fotos do resultado (opcional)
- Categorias de avaliação (pontualidade, qualidade, atendimento)

#### RF06.2 - Visualizar Avaliações
**Descrição**: Exibir todas as avaliações de um prestador.  
**Prioridade**: Alta

#### RF06.3 - Média de Avaliações
**Descrição**: Calcular e exibir média de avaliações.  
**Prioridade**: Alta

#### RF06.4 - Responder Avaliações
**Descrição**: Prestador pode responder às avaliações recebidas.  
**Prioridade**: Baixa

---

### RF07 - Histórico e Favoritos

#### RF07.1 - Histórico de Serviços
**Descrição**: Usuários podem ver histórico de serviços solicitados/prestados.  
**Prioridade**: Média

#### RF07.2 - Favoritos
**Descrição**: Cliente pode salvar prestadores favoritos.  
**Prioridade**: Baixa

#### RF07.3 - Solicitar Novamente
**Descrição**: Facilitar nova solicitação de serviço já contratado.  
**Prioridade**: Baixa

---

### RF08 - Configurações

#### RF08.1 - Configurações de Notificações
**Descrição**: Gerenciar preferências de notificações.  
**Prioridade**: Baixa

#### RF08.2 - Privacidade
**Descrição**: Gerenciar configurações de privacidade.  
**Prioridade**: Média

#### RF08.3 - Ajuda e Suporte
**Descrição**: Acesso a FAQ e suporte.  
**Prioridade**: Baixa

---

## 2. REQUISITOS NÃO FUNCIONAIS

### RNF01 - Desempenho

#### RNF01.1 - Tempo de Resposta
**Descrição**: O aplicativo deve carregar telas em no máximo 3 segundos.  
**Prioridade**: Alta

#### RNF01.2 - Carregamento de Listas
**Descrição**: Implementar paginação/scroll infinito para listas com mais de 20 itens.  
**Prioridade**: Média

#### RNF01.3 - Otimização de Imagens
**Descrição**: Imagens devem ser comprimidas e otimizadas para carregamento rápido.  
**Prioridade**: Média

---

### RNF02 - Usabilidade

#### RNF02.1 - Interface Intuitiva
**Descrição**: Interface deve ser simples e fácil de usar.  
**Prioridade**: Alta

#### RNF02.2 - Responsividade
**Descrição**: App deve funcionar em diferentes tamanhos de tela (smartphones).  
**Prioridade**: Alta

#### RNF02.3 - Acessibilidade
**Descrição**: Seguir boas práticas de acessibilidade.  
**Prioridade**: Média  
**Implementações**:
- Contraste adequado de cores
- Tamanho de fonte ajustável
- Leitores de tela compatíveis

#### RNF02.4 - Feedback Visual
**Descrição**: Fornecer feedback claro para ações do usuário.  
**Prioridade**: Alta

---

### RNF03 - Segurança

#### RNF03.1 - Criptografia de Senha
**Descrição**: Senhas devem ser criptografadas no armazenamento.  
**Prioridade**: Alta

#### RNF03.2 - Comunicação Segura
**Descrição**: Usar HTTPS para todas as comunicações.  
**Prioridade**: Alta

#### RNF03.3 - Validação de Dados
**Descrição**: Validar todos os dados de entrada.  
**Prioridade**: Alta

#### RNF03.4 - Proteção contra Injeção
**Descrição**: Implementar proteções contra SQL injection e XSS.  
**Prioridade**: Alta

#### RNF03.5 - Autenticação Segura
**Descrição**: Implementar tokens JWT para sessões.  
**Prioridade**: Alta

---

### RNF04 - Confiabilidade

#### RNF04.1 - Disponibilidade
**Descrição**: Sistema deve estar disponível 95% do tempo (para projeto acadêmico).  
**Prioridade**: Média

#### RNF04.2 - Tratamento de Erros
**Descrição**: Implementar tratamento adequado de erros.  
**Prioridade**: Alta

#### RNF04.3 - Backup de Dados
**Descrição**: Sistema deve fazer backup regular dos dados.  
**Prioridade**: Média

---

### RNF05 - Compatibilidade

#### RNF05.1 - Plataformas
**Descrição**: App deve funcionar em Android e iOS.  
**Prioridade**: Alta

#### RNF05.2 - Versões de SO
**Descrição**: 
- Android: versão 8.0 ou superior
- iOS: versão 12.0 ou superior  
**Prioridade**: Alta

#### RNF05.3 - Conexão
**Descrição**: App deve funcionar com 3G/4G/5G e WiFi.  
**Prioridade**: Alta

---

### RNF06 - Manutenibilidade

#### RNF06.1 - Código Limpo
**Descrição**: Código deve seguir boas práticas e padrões.  
**Prioridade**: Alta

#### RNF06.2 - Documentação
**Descrição**: Código deve ser documentado.  
**Prioridade**: Média

#### RNF06.3 - Versionamento
**Descrição**: Usar Git para controle de versão.  
**Prioridade**: Alta

#### RNF06.4 - Componentização
**Descrição**: Código deve ser modular e reutilizável.  
**Prioridade**: Alta

---

### RNF07 - Escalabilidade

#### RNF07.1 - Arquitetura Modular
**Descrição**: Sistema deve permitir adição de novas funcionalidades.  
**Prioridade**: Média

#### RNF07.2 - Banco de Dados
**Descrição**: Estrutura de dados deve suportar crescimento.  
**Prioridade**: Média

---

### RNF08 - Portabilidade

#### RNF08.1 - React Native
**Descrição**: Usar React Native para compatibilidade multiplataforma.  
**Prioridade**: Alta

#### RNF08.2 - Dependências
**Descrição**: Minimizar dependências específicas de plataforma.  
**Prioridade**: Média

---

## 3. REGRAS DE NEGÓCIO

### RN01 - Cadastro
- Usuário deve escolher entre perfil de cliente ou prestador no cadastro
- Email deve ser único no sistema
- Telefone deve ser validado

### RN02 - Serviços
- Prestador pode oferecer serviços em múltiplas categorias
- Cliente só pode avaliar serviços que contratou
- Avaliação só pode ser feita após conclusão do serviço

### RN03 - Solicitações
- Cliente pode cancelar solicitação antes da aceitação
- Prestador pode recusar solicitação com justificativa
- Após aceitação, cancelamento requer acordo de ambas as partes

### RN04 - Avaliações
- Avaliação é obrigatória após conclusão do serviço
- Nota mínima: 1 estrela, máxima: 5 estrelas
- Avaliação não pode ser editada após envio

---

## 4. TECNOLOGIAS SUGERIDAS

### Frontend (Mobile)
- **React Native**: Framework principal
- **React Navigation**: Navegação entre telas
- **React Native Paper** ou **NativeBase**: Componentes UI
- **Axios**: Requisições HTTP
- **AsyncStorage**: Armazenamento local
- **React Native Maps**: Integração com mapas
- **React Native Image Picker**: Upload de fotos

### Backend (Sugestão)
- **Node.js** com **Express**: API REST
- **MongoDB** ou **PostgreSQL**: Banco de dados
- **Firebase**: Autenticação e notificações push
- **Socket.io**: Chat em tempo real

### Ferramentas
- **Git/GitHub**: Controle de versão
- **Expo** (opcional): Facilitar desenvolvimento
- **Postman**: Testar API
- **Figma**: Design de interfaces

---

## 5. PRÓXIMOS PASSOS

1. ✅ Levantamento de requisitos concluído
2. ⏳ Criar casos de uso detalhados
3. ⏳ Desenhar arquitetura do sistema
4. ⏳ Criar protótipos de telas (wireframes)
5. ⏳ Definir cronograma detalhado
6. ⏳ Configurar ambiente de desenvolvimento
7. ⏳ Iniciar desenvolvimento

---

**Documento elaborado em**: 24/01/2026  
**Próxima revisão**: Conforme evolução do projeto
