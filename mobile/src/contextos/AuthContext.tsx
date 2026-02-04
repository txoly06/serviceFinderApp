// ========================================
// CONTEXTO DE AUTENTICAÇÃO
// ========================================
// Guarda o usuário logado e o token JWT
// Permite aceder ao usuário em qualquer tela

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { disconnectSocket } from '../servicos/socket';
import { Usuario } from '../tipos';

// Define o tipo do contexto
interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    login: (usuario: Usuario, token: string) => void;
    logout: () => void;
    atualizarUsuario: (usuario: Usuario) => void;
    estaLogado: boolean;
}

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props do Provider
interface AuthProviderProps {
    children: ReactNode;
}

// Provider que envolve o app
export function AuthProvider({ children }: AuthProviderProps) {
    // Estado para guardar o usuário logado
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    // Estado para guardar o token JWT
    const [token, setToken] = useState<string | null>(null);

    // Função para fazer login
    const login = (novoUsuario: Usuario, novoToken: string) => {
        setUsuario(novoUsuario);
        setToken(novoToken);
    };

    // Função para fazer logout
    const logout = () => {
        disconnectSocket(); // Fecha conexão socket ao sair
        setUsuario(null);
        setToken(null);
    };

    // Função para atualizar dados do usuário (após editar perfil)
    const atualizarUsuario = (novoUsuario: Usuario) => {
        setUsuario(novoUsuario);
    };

    // Verifica se está logado
    const estaLogado = usuario !== null && token !== null;

    return (
        <AuthContext.Provider value={{ usuario, token, login, logout, atualizarUsuario, estaLogado }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook para usar o contexto
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

