// ========================================
// TELA DE CONVERSAS (Lista de Chats)
// ========================================

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { buscarConversas } from '../servicos/api';
import { SkeletonList } from '../componentes/Skeleton';
import { EmptyState } from '../componentes/EmptyState';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function TelaConversas({ navigation }: Props) {
    const [conversas, setConversas] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const { token, usuario } = useAuth();

    const carregarConversas = useCallback(async () => {
        if (!token) return;
        try {
            const resposta = await buscarConversas(token);
            setConversas(resposta.data?.conversations || []);
        } catch (erro) {
            console.log('Erro ao carregar conversas:', erro);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [token]);

    useFocusEffect(
        useCallback(() => {
            carregarConversas();
        }, [carregarConversas])
    );

    const getOutroParticipante = (participantes: any[]) => {
        return participantes.find(p => p._id !== usuario?.id) || participantes[0];
    };

    const formatarData = (data: string) => {
        const d = new Date(data);
        const hoje = new Date();
        if (d.toDateString() === hoje.toDateString()) {
            return d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
    };

    const renderConversa = ({ item }: { item: any }) => {
        const outro = getOutroParticipante(item.participants);
        return (
            <TouchableOpacity
                style={estilos.conversaItem}
                onPress={() => navigation.navigate('Chat', {
                    conversationId: item._id,
                    nomeOutro: outro?.name || 'Usuário'
                })}
            >
                <View style={estilos.avatar}>
                    <Text style={estilos.avatarTexto}>
                        {outro?.name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
                <View style={estilos.conversaInfo}>
                    <Text style={estilos.nome}>{outro?.name || 'Usuário'}</Text>
                    <Text style={estilos.ultimaMensagem} numberOfLines={1}>
                        {item.lastMessage?.content || 'Sem mensagens'}
                    </Text>
                </View>
                <View style={estilos.meta}>
                    <Text style={estilos.hora}>
                        {item.lastMessage?.createdAt ? formatarData(item.lastMessage.createdAt) : ''}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                </View>
            </TouchableOpacity>
        );
    };

    if (carregando) {
        return (
            <View style={estilos.container}>
                <View style={estilos.header}>
                    <Text style={estilos.headerTitulo}>Mensagens</Text>
                </View>
                <SkeletonList count={5} />
            </View>
        );
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.header}>
                <Text style={estilos.headerTitulo}>Mensagens</Text>
            </View>

            {conversas.length === 0 ? (
                <EmptyState
                    icon="chatbubbles-outline"
                    titulo="Nenhuma conversa"
                    mensagem="As suas conversas com prestadores aparecerão aqui"
                />
            ) : (
                <FlatList
                    data={conversas}
                    renderItem={renderConversa}
                    keyExtractor={item => item._id}
                    contentContainerStyle={estilos.lista}
                    refreshControl={
                        <RefreshControl
                            refreshing={atualizando}
                            onRefresh={() => {
                                setAtualizando(true);
                                carregarConversas();
                            }}
                            tintColor="#007AFF"
                        />
                    }
                />
            )}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    headerTitulo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    lista: {
        padding: 16,
    },
    conversaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTexto: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '600',
    },
    conversaInfo: {
        flex: 1,
        marginLeft: 12,
    },
    nome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    ultimaMensagem: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    meta: {
        alignItems: 'flex-end',
        gap: 8,
    },
    hora: {
        fontSize: 12,
        color: '#999999',
    },
});
