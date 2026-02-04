// ========================================
// SERVIÇO DE API
// ========================================
// Funções para comunicar com o backend
// Usa fetch() para fazer requisições HTTP

import { API_URL } from '../config/api';
import { Servico, Usuario } from '../tipos';

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ========================================

// Interface para resposta de login
interface LoginResponse {
    status: string;
    data: {
        user: Usuario;
        token: string;
    };
}

// Fazer login
export async function fazerLogin(email: string, senha: string): Promise<LoginResponse> {
    const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: senha }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao fazer login');
    }

    // Mapeia os campos do backend para o formato do mobile
    return {
        status: dados.status,
        data: {
            user: {
                id: dados.data.user.id,
                nome: dados.data.user.name,
                email: dados.data.user.email,
                telefone: dados.data.user.phone || '',
                tipo: dados.data.user.userType,
            },
            token: dados.data.token,
        },
    };
}

// Interface para resposta de cadastro
interface CadastroResponse {
    status: string;
    data: {
        user: Usuario;
        token: string;
    };
}

// Criar conta nova
export async function fazerCadastro(
    nome: string,
    email: string,
    senha: string,
    telefone: string,
    tipoUsuario: 'client' | 'provider'
): Promise<CadastroResponse> {
    const resposta = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: nome,
            email,
            password: senha,
            phone: telefone,
            userType: tipoUsuario,
        }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao criar conta');
    }

    // Mapeia os campos do backend para o formato do mobile
    return {
        status: dados.status,
        data: {
            user: {
                id: dados.data.user.id,
                nome: dados.data.user.name,
                email: dados.data.user.email,
                telefone: dados.data.user.phone || '',
                tipo: dados.data.user.userType,
            },
            token: dados.data.token,
        },
    };
}

// ========================================
// FUNÇÕES DE SERVIÇOS
// ========================================

// Interface para resposta de serviços
interface ServicosResponse {
    status: string;
    results: number;
    data: {
        services: any[];
    };
}

// Buscar todos os serviços
export async function buscarServicos(): Promise<ServicosResponse> {
    const resposta = await fetch(`${API_URL}/api/services`);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar serviços');
    }

    return dados;
}

// Buscar um serviço específico
export async function buscarServico(id: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/services/${id}`);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar serviço');
    }

    return dados;
}

// Buscar meus serviços (provider)
export async function buscarMeusServicos(token: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/services?provider=me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar serviços');
    }

    return dados;
}

// Criar um novo serviço (provider)
export async function criarServico(token: string, dadosServico: any): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dadosServico),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao criar serviço');
    }

    return dados;
}

// Atualizar serviço existente (provider)
export async function atualizarServico(token: string, servicoId: string, dadosServico: any): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/services/${servicoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dadosServico),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao atualizar serviço');
    }

    return dados;
}

// Eliminar serviço (provider)
export async function eliminarServico(token: string, servicoId: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/services/${servicoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao eliminar serviço');
    }

    return dados;
}

// ========================================
// FUNÇÕES DE PEDIDOS
// ========================================

// Criar um pedido de serviço
export async function criarPedido(
    token: string,
    servicoId: string,
    descricao: string,
    dataAgendada: string
): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/requests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            serviceId: servicoId,
            description: descricao,
            scheduledDate: dataAgendada,
        }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao criar pedido');
    }

    return dados;
}

// Buscar meus pedidos
export async function buscarMeusPedidos(token: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/requests/my`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar pedidos');
    }

    return dados;
}

// Atualizar status de um pedido
export async function atualizarStatusPedido(
    token: string,
    pedidoId: string,
    novoStatus: string
): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/requests/${pedidoId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao atualizar pedido');
    }

    return dados;
}

// ========================================
// FUNÇÕES DE AVALIAÇÕES
// ========================================

// Criar uma avaliação
export async function criarAvaliacao(token: string, dadosAvaliacao: any): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAvaliacao),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao criar avaliação');
    }

    return dados;
}

// Buscar avaliações de um serviço
export async function buscarAvaliacoes(servicoId: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/reviews/service/${servicoId}`);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar avaliações');
    }

    return dados;
}

// ========================================
// FUNÇÕES DE PESQUISA
// ========================================

// Pesquisar serviços com filtros
export async function pesquisarServicos(
    query: string = '',
    categoria: string = '',
    cidade: string = ''
): Promise<any> {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (categoria) params.append('category', categoria);
    if (cidade) params.append('city', cidade);

    const resposta = await fetch(`${API_URL}/api/services?${params.toString()}`);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao pesquisar serviços');
    }

    return dados;
}

// ========================================
// FUNÇÕES DE PERFIL E FAVORITOS
// ========================================

// Atualizar perfil do usuário
export async function atualizarPerfil(
    token: string,
    dados: { name?: string; phone?: string; location?: { city: string; state: string } }
): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.message || 'Erro ao atualizar perfil');
    }

    return resultado;
}

// Buscar favoritos do usuário
export async function buscarFavoritos(token: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/users/favorites`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar favoritos');
    }

    return dados;
}

// Adicionar serviço aos favoritos
export async function adicionarFavorito(token: string, servicoId: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/users/favorites/${servicoId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao adicionar favorito');
    }

    return dados;
}

// Remover serviço dos favoritos
export async function removerFavorito(token: string, servicoId: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/users/favorites/${servicoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao remover favorito');
    }

    return dados;
}

// ========================================
// FUNÇÕES DE CHAT
// ========================================

// Buscar conversas do usuário
export async function buscarConversas(token: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/chat`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar conversas');
    }

    return dados;
}

// Criar ou obter conversa com outro usuário
export async function iniciarConversa(
    token: string,
    userId: string,
    serviceId?: string
): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/chat/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, serviceId }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao iniciar conversa');
    }

    return dados;
}

// Buscar mensagens de uma conversa
export async function buscarMensagens(token: string, conversationId: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/chat/${conversationId}/messages`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar mensagens');
    }

    return dados;
}

// Enviar mensagem
export async function enviarMensagem(
    token: string,
    conversationId: string,
    content: string
): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/chat/${conversationId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao enviar mensagem');
    }

    return dados;
}

// ========================================
// FUNÇÕES DE PROVIDER
// ========================================

// Buscar serviços do provider logado
export async function buscarServicosDoProvider(token: string): Promise<any> {
    const resposta = await fetch(`${API_URL}/api/services?provider=me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar serviços');
    }

    return dados;
}

// ========================================
// FUNÇÕES DE UPLOAD
// ========================================

// Upload de imagens (retorna array de URLs)
export async function uploadImages(token: string, imageUris: string[]): Promise<any> {
    const formData = new FormData();

    imageUris.forEach((uri, index) => {
        // Extrair extensão do arquivo
        const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

        formData.append('images', {
            uri,
            type: mimeType,
            name: `image-${index}.${ext}`,
        } as any);
    });

    const resposta = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao fazer upload das imagens');
    }

    return dados;
}
