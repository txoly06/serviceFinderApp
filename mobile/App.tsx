// ========================================
// ARQUIVO PRINCIPAL DO APP
// ========================================
// Este é o ponto de entrada do aplicativo
// Agora inclui o AuthProvider para gerenciar autenticação

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

// Importa o contexto de autenticação
import { AuthProvider } from './src/contextos/AuthContext';
// Importa o sistema de navegação
import Navegacao from './src/navegacao/Navegacao';
// Importa o provider de toasts
import { ToastProvider } from './src/componentes/Toast';
// Importa serviço de notificações
import { registerForPushNotificationsAsync } from './src/servicos/notifications';

export default function App(): React.ReactElement {
    // Registrar para push notifications ao iniciar o app
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                console.log('📱 Push Token:', token);
                // TODO: Enviar token para o backend associar ao usuário
            }
        });
    }, []);

    return (
        // AuthProvider envolve todo o app para compartilhar o estado do usuário
        <AuthProvider>
            {/* ToastProvider permite mostrar mensagens em qualquer tela */}
            <ToastProvider>
                {/* StatusBar configura a barra superior do celular */}
                <StatusBar style="light" />

                {/* Navegacao contém todas as telas do app */}
                <Navegacao />
            </ToastProvider>
        </AuthProvider>
    );
}
