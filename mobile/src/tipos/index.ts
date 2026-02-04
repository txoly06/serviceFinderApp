// ========================================
// TIPOS E INTERFACES
// ========================================
// Define os tipos de dados usados no app
// Isso ajuda a evitar erros e documenta o código

// Interface para Categoria de serviço
export interface Categoria {
    id: string;
    nome: string;
    icone: string;
}

// Interface para Prestador de serviço
export interface Prestador {
    nome: string;
    telefone: string;
    foto: string | null;
}

// Interface para Serviço
export interface Servico {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    preco: string;
    avaliacao: number;
    prestador: Prestador;
}

// Interface para Usuário logado
// Nota: 'userType' vem do backend, 'tipo' é alias para facilitar
export interface Usuario {
    id: string;
    nome: string;       // mapeado de 'name' do backend
    email: string;
    telefone: string;   // mapeado de 'phone' do backend
    tipo: 'client' | 'provider';  // mapeado de 'userType' do backend
}

// Tipos para navegação
export type RootStackParamList = {
    Login: undefined;
    Cadastro: undefined;
    Principal: undefined;
    DetalhesServico: { servico: any };  // any para aceitar formato do backend
    DetalhesPedido: { pedido: any };    // Tela de detalhes do pedido
    MeusServicos: undefined;             // Dashboard do prestador
    NovoServico: undefined;              // Criar novo serviço
    EditarServico: { servico: any };    // Editar serviço existente
    Avaliar: { pedido: any };           // Avaliar serviço concluído
    Conversas: undefined;               // Lista de conversas
    Chat: { conversationId: string; nomeOutro: string };  // Chat individual
    Favoritos: undefined;               // Lista de favoritos (cliente)
    DashboardProvider: undefined;       // Dashboard do prestador
    EditarPerfil: undefined;            // Editar perfil do usuário
};
