// ========================================
// TELA DE PEDIDOS
// ========================================
// Lista todos os pedidos do utilizador
// Filtros por status, pull to refresh

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { buscarMeusPedidos } from '../servicos/api';

type TelaPedidosProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Principal'>;
};

// Status badges com cores
const STATUS_CONFIG: { [key: string]: { label: string; cor: string; icone: string } } = {
    pending: { label: 'Pendente', cor: '#FF9500', icone: 'time' },
    accepted: { label: 'Aceite', cor: '#34C759', icone: 'checkmark-circle' },
    rejected: { label: 'Rejeitado', cor: '#FF3B30', icone: 'close-circle' },
    completed: { label: 'Concluído', cor: '#007AFF', icone: 'checkmark-done-circle' },
    cancelled: { label: 'Cancelado', cor: '#8E8E93', icone: 'ban' },
};

// Filtros disponíveis
const FILTROS = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Pendentes' },
    { id: 'accepted', label: 'Aceites' },
    { id: 'completed', label: 'Concluídos' },
];

export default function TelaPedidos({ navigation }: TelaPedidosProps) {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [atualizando, setAtualizando] = useState<boolean>(false);
    const [filtroAtivo, setFiltroAtivo] = useState<string>('all');

    const { token } = useAuth();

    const carregarPedidos = useCallback(async () => {
        if (!token) return;

        try {
            const resposta = await buscarMeusPedidos(token);
            setPedidos(resposta.data.requests || []);
        } catch (erro) {
            console.log('Erro ao carregar pedidos:', erro);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [token]);

    useEffect(() => {
        carregarPedidos();
    }, [carregarPedidos]);

    const aoAtualizar = () => {
        setAtualizando(true);
        carregarPedidos();
    };

    // Filtra pedidos por status
    const pedidosFiltrados = filtroAtivo === 'all'
        ? pedidos
        : pedidos.filter(p => p.status === filtroAtivo);

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const renderFiltro = ({ item }: { item: typeof FILTROS[0] }) => (
        <TouchableOpacity
            style={[
                estilos.filtroItem,
                filtroAtivo === item.id && estilos.filtroAtivo,
            ]}
            onPress={() => setFiltroAtivo(item.id)}
        >
            <Text
                style={[
                    estilos.filtroTexto,
                    filtroAtivo === item.id && estilos.filtroTextoAtivo,
                ]}
            >
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const renderPedido = ({ item }: { item: any }) => {
        const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;

        return (
            <TouchableOpacity
                style={estilos.pedidoCard}
                onPress={() => navigation.navigate('DetalhesPedido', { pedido: item })}
                activeOpacity={0.7}
            >
                <View style={estilos.pedidoCabecalho}>
                    <View style={estilos.servicoInfo}>
                        <Text style={estilos.servicoNome}>
                            {item.serviceId?.title || 'Serviço'}
                        </Text>
                        <Text style={estilos.prestadorNome}>
                            {item.providerId?.name || 'Prestador'}
                        </Text>
                    </View>
                    <View style={[estilos.statusBadge, { backgroundColor: statusConfig.cor + '20' }]}>
                        <Ionicons name={statusConfig.icone as any} size={14} color={statusConfig.cor} />
                        <Text style={[estilos.statusTexto, { color: statusConfig.cor }]}>
                            {statusConfig.label}
                        </Text>
                    </View>
                </View>

                <View style={estilos.pedidoInfo}>
                    <View style={estilos.infoItem}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <Text style={estilos.infoTexto}>
                            {formatarData(item.scheduledDate)}
                        </Text>
                    </View>
                    {item.proposedPrice && (
                        <View style={estilos.infoItem}>
                            <Ionicons name="cash-outline" size={16} color="#666" />
                            <Text style={estilos.infoTexto}>
                                {item.proposedPrice?.toLocaleString()} Kz
                            </Text>
                        </View>
                    )}
                </View>

                <View style={estilos.pedidoRodape}>
                    <Text style={estilos.pedidoId}>#{item._id?.slice(-6).toUpperCase()}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>
            </TouchableOpacity>
        );
    };

    if (carregando) {
        return (
            <View style={estilos.carregando}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={estilos.carregandoTexto}>Carregando pedidos...</Text>
            </View>
        );
    }

    return (
        <View style={estilos.container}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
                <Text style={estilos.titulo}>Meus Pedidos</Text>
                <Text style={estilos.subtitulo}>{pedidos.length} pedidos</Text>
            </View>

            {/* Filtros */}
            <FlatList
                data={FILTROS}
                renderItem={renderFiltro}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={estilos.filtrosContainer}
            />

            {/* Lista de Pedidos */}
            {pedidosFiltrados.length === 0 ? (
                <View style={estilos.vazioContainer}>
                    <Ionicons name="document-text-outline" size={64} color="#C7C7CC" />
                    <Text style={estilos.vazioTitulo}>Nenhum pedido</Text>
                    <Text style={estilos.vazioTexto}>
                        {filtroAtivo === 'all'
                            ? 'Você ainda não fez nenhum pedido'
                            : `Nenhum pedido ${FILTROS.find(f => f.id === filtroAtivo)?.label.toLowerCase()}`
                        }
                    </Text>
                    <TouchableOpacity
                        style={estilos.botaoExplorar}
                        onPress={() => navigation.navigate('Principal')}
                    >
                        <Text style={estilos.botaoExplorarTexto}>Explorar Serviços</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={pedidosFiltrados}
                    renderItem={renderPedido}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={estilos.listaContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={atualizando}
                            onRefresh={aoAtualizar}
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
    carregando: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    carregandoTexto: {
        marginTop: 12,
        color: '#666666',
        fontSize: 15,
    },
    cabecalho: {
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    titulo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    subtitulo: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    filtrosContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 8,
    },
    filtroItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    filtroAtivo: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    filtroTexto: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    filtroTextoAtivo: {
        color: '#FFFFFF',
    },
    listaContainer: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    pedidoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    pedidoCabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    servicoInfo: {
        flex: 1,
        marginRight: 12,
    },
    servicoNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    prestadorNome: {
        fontSize: 13,
        color: '#666666',
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    statusTexto: {
        fontSize: 12,
        fontWeight: '600',
    },
    pedidoInfo: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoTexto: {
        fontSize: 13,
        color: '#666666',
    },
    pedidoRodape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    pedidoId: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
    },
    vazioContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 48,
    },
    vazioTitulo: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginTop: 16,
    },
    vazioTexto: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center',
        marginTop: 8,
    },
    botaoExplorar: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 24,
    },
    botaoExplorarTexto: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
