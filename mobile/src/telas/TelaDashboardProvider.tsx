// ========================================
// DASHBOARD DO PRESTADOR
// ========================================
// Estatísticas e ações rápidas para providers

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { buscarServicosDoProvider, buscarMeusPedidos } from '../servicos/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

interface Stats {
    totalServicos: number;
    pedidosPendentes: number;
    pedidosAceitos: number;
    pedidosConcluidos: number;
}

export default function TelaDashboardProvider({ navigation }: Props) {
    const [stats, setStats] = useState<Stats>({
        totalServicos: 0,
        pedidosPendentes: 0,
        pedidosAceitos: 0,
        pedidosConcluidos: 0,
    });
    const [servicosRecentes, setServicosRecentes] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const { token, usuario } = useAuth();

    const carregarDados = useCallback(async () => {
        if (!token) return;
        try {
            // Buscar serviços do provider
            const servicosResp = await buscarServicosDoProvider(token);
            const servicos = servicosResp.data?.services || [];

            // Buscar pedidos
            const pedidosResp = await buscarMeusPedidos(token);
            const pedidos = pedidosResp.data?.requests || [];

            // Calcular estatísticas
            setStats({
                totalServicos: servicos.length,
                pedidosPendentes: pedidos.filter((p: any) => p.status === 'pending').length,
                pedidosAceitos: pedidos.filter((p: any) => p.status === 'accepted').length,
                pedidosConcluidos: pedidos.filter((p: any) => p.status === 'completed').length,
            });

            setServicosRecentes(servicos.slice(0, 3));
        } catch (erro) {
            console.log('Erro ao carregar dashboard:', erro);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [token]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    if (carregando) {
        return (
            <View style={estilos.carregando}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView
            style={estilos.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={atualizando}
                    onRefresh={() => {
                        setAtualizando(true);
                        carregarDados();
                    }}
                    tintColor="#007AFF"
                />
            }
        >
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
                <Text style={estilos.saudacao}>Olá, {usuario?.nome?.split(' ')[0]}!</Text>
                <Text style={estilos.subtitulo}>Veja como está o seu negócio</Text>
            </View>

            {/* Cards de Estatísticas */}
            <View style={estilos.statsContainer}>
                <View style={[estilos.statCard, { backgroundColor: '#007AFF15' }]}>
                    <Ionicons name="briefcase" size={24} color="#007AFF" />
                    <Text style={estilos.statNumero}>{stats.totalServicos}</Text>
                    <Text style={estilos.statLabel}>Serviços</Text>
                </View>

                <View style={[estilos.statCard, { backgroundColor: '#FF950015' }]}>
                    <Ionicons name="time" size={24} color="#FF9500" />
                    <Text style={estilos.statNumero}>{stats.pedidosPendentes}</Text>
                    <Text style={estilos.statLabel}>Pendentes</Text>
                </View>

                <View style={[estilos.statCard, { backgroundColor: '#34C75915' }]}>
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                    <Text style={estilos.statNumero}>{stats.pedidosAceitos}</Text>
                    <Text style={estilos.statLabel}>Aceitos</Text>
                </View>

                <View style={[estilos.statCard, { backgroundColor: '#5856D615' }]}>
                    <Ionicons name="trophy" size={24} color="#5856D6" />
                    <Text style={estilos.statNumero}>{stats.pedidosConcluidos}</Text>
                    <Text style={estilos.statLabel}>Concluídos</Text>
                </View>
            </View>

            {/* Ações Rápidas */}
            <View style={estilos.secao}>
                <Text style={estilos.secaoTitulo}>Ações Rápidas</Text>
                <View style={estilos.acoesContainer}>
                    <TouchableOpacity
                        style={estilos.acaoBotao}
                        onPress={() => navigation.navigate('NovoServico')}
                    >
                        <View style={[estilos.acaoIcone, { backgroundColor: '#34C75915' }]}>
                            <Ionicons name="add-circle" size={24} color="#34C759" />
                        </View>
                        <Text style={estilos.acaoTexto}>Novo Serviço</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={estilos.acaoBotao}
                        onPress={() => navigation.navigate('MeusServicos')}
                    >
                        <View style={[estilos.acaoIcone, { backgroundColor: '#007AFF15' }]}>
                            <Ionicons name="list" size={24} color="#007AFF" />
                        </View>
                        <Text style={estilos.acaoTexto}>Ver Serviços</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={estilos.acaoBotao}
                        onPress={() => navigation.navigate('Conversas')}
                    >
                        <View style={[estilos.acaoIcone, { backgroundColor: '#FF950015' }]}>
                            <Ionicons name="chatbubbles" size={24} color="#FF9500" />
                        </View>
                        <Text style={estilos.acaoTexto}>Mensagens</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Serviços Recentes */}
            <View style={estilos.secao}>
                <View style={estilos.secaoHeader}>
                    <Text style={estilos.secaoTitulo}>Meus Serviços</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('MeusServicos')}>
                        <Text style={estilos.verTodos}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                {servicosRecentes.length === 0 ? (
                    <View style={estilos.vazioCard}>
                        <Ionicons name="briefcase-outline" size={32} color="#C7C7CC" />
                        <Text style={estilos.vazioTexto}>Nenhum serviço cadastrado</Text>
                        <TouchableOpacity
                            style={estilos.botaoCriar}
                            onPress={() => navigation.navigate('NovoServico')}
                        >
                            <Text style={estilos.botaoCriarTexto}>Criar Primeiro Serviço</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    servicosRecentes.map(servico => (
                        <TouchableOpacity
                            key={servico._id}
                            style={estilos.servicoCard}
                            onPress={() => navigation.navigate('EditarServico', { servico })}
                        >
                            <View style={estilos.servicoInfo}>
                                <Text style={estilos.servicoTitulo}>{servico.title}</Text>
                                <Text style={estilos.servicoCategoria}>{servico.category}</Text>
                            </View>
                            <View style={estilos.servicoStats}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={estilos.servicoRating}>
                                    {servico.rating?.average?.toFixed(1) || 'N/A'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    carregando: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cabecalho: {
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
    saudacao: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    subtitulo: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 12,
    },
    statCard: {
        width: '47%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    statNumero: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    secao: {
        padding: 16,
    },
    secaoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    secaoTitulo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    verTodos: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    acoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    acaoBotao: {
        alignItems: 'center',
        flex: 1,
    },
    acaoIcone: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    acaoTexto: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    vazioCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    vazioTexto: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    botaoCriar: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        marginTop: 16,
    },
    botaoCriarTexto: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    servicoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    servicoInfo: {
        flex: 1,
    },
    servicoTitulo: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    servicoCategoria: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    servicoStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    servicoRating: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
});
