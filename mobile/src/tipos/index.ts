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

// Interface para Serviço (formato legado)
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
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    tipo: 'client' | 'provider';
}

// ========================================
// INTERFACES DA API (Backend)
// ========================================

// Serviço retornado pela API
export interface ServiceAPI {
    _id: string;
    title: string;
    description: string;
    category: string;
    priceRange: {
        min: number;
        max: number;
    };
    location: {
        city: string;
        state: string;
    };
    coordinates?: {
        lat: number;
        lng: number;
    };
    images: string[];
    providerId: {
        _id: string;
        name: string;
        phone?: string;
    };
    rating: {
        average: number;
        count: number;
    };
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Pedido retornado pela API
export interface RequestAPI {
    _id: string;
    serviceId: {
        _id: string;
        title: string;
        category: string;
    };
    clientId: {
        _id: string;
        name: string;
        phone?: string;
    };
    providerId: {
        _id: string;
        name: string;
        phone?: string;
    };
    description: string;
    scheduledDate: string;
    proposedPrice?: number;
    location?: {
        city: string;
        state: string;
        address?: string;
    };
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

// Avaliação retornada pela API
export interface ReviewAPI {
    _id: string;
    requestId: string;
    serviceId: string;
    clientId: {
        _id: string;
        name: string;
    };
    providerId: string;
    rating: number;
    comment: string;
    categories: {
        quality: number;
        punctuality: number;
        communication: number;
    };
    response?: string;
    createdAt: string;
}

// Conversa retornada pela API
export interface ConversationAPI {
    _id: string;
    participants: Array<{
        _id: string;
        name: string;
        avatar?: string;
    }>;
    lastMessage?: {
        content: string;
        sender: string;
        createdAt: string;
    };
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}

// Mensagem retornada pela API
export interface MessageAPI {
    _id: string;
    sender: {
        _id: string;
        name: string;
    };
    content: string;
    read: boolean;
    createdAt: string;
}

// ========================================
// TIPOS PARA NAVEGAÇÃO
// ========================================
export type RootStackParamList = {
    Login: undefined;
    Cadastro: undefined;
    Principal: undefined;
    DetalhesServico: { servico: ServiceAPI };
    DetalhesPedido: { pedido: RequestAPI };
    MeusServicos: undefined;
    NovoServico: undefined;
    EditarServico: { servico: ServiceAPI };
    Avaliar: { pedido: RequestAPI };
    Conversas: undefined;
    Chat: { conversationId: string; nomeOutro: string; serviceTitulo?: string };
    Favoritos: undefined;
    DashboardProvider: undefined;
    EditarPerfil: undefined;
};
