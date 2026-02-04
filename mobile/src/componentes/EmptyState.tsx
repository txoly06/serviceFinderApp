// ========================================
// EMPTY STATE COMPONENT
// ========================================
// Estados vazios amigáveis para listas

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
    icon: string;
    titulo: string;
    mensagem: string;
    botaoTexto?: string;
    onPress?: () => void;
}

export function EmptyState({
    icon,
    titulo,
    mensagem,
    botaoTexto,
    onPress
}: EmptyStateProps) {
    return (
        <View style={estilos.container}>
            <View style={estilos.iconeContainer}>
                <Ionicons name={icon as any} size={64} color="#C7C7CC" />
            </View>
            <Text style={estilos.titulo}>{titulo}</Text>
            <Text style={estilos.mensagem}>{mensagem}</Text>
            {botaoTexto && onPress && (
                <TouchableOpacity style={estilos.botao} onPress={onPress}>
                    <Text style={estilos.botaoTexto}>{botaoTexto}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// Presets comuns
export const EmptyStates = {
    SemServicos: () => (
        <EmptyState
            icon="search-outline"
            titulo="Nenhum serviço encontrado"
            mensagem="Tente ajustar os filtros ou buscar por outro termo"
        />
    ),
    SemPedidos: () => (
        <EmptyState
            icon="document-text-outline"
            titulo="Nenhum pedido ainda"
            mensagem="Os seus pedidos de serviço aparecerão aqui"
        />
    ),
    SemFavoritos: () => (
        <EmptyState
            icon="heart-outline"
            titulo="Nenhum favorito"
            mensagem="Guarde os serviços que mais gosta para aceder rapidamente"
        />
    ),
    SemAvaliacoes: () => (
        <EmptyState
            icon="star-outline"
            titulo="Sem avaliações"
            mensagem="Este serviço ainda não foi avaliado"
        />
    ),
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 48,
        paddingVertical: 60,
    },
    iconeContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    titulo: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    mensagem: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
    },
    botao: {
        marginTop: 24,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    botaoTexto: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
