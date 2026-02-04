// ========================================
// TELA MEUS SERVIÇOS (Provider Dashboard)
// ========================================
// Lista serviços do prestador com opções de editar/criar

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { buscarMeusServicos, eliminarServico } from '../servicos/api';

type TelaMeusServicosProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Principal'>;
};

// Ícones para cada categoria
const CATEGORIA_ICONES: { [key: string]: string } = {
    'home-repairs': 'hammer',
    'beauty': 'cut',
    'tech': 'laptop',
    'cleaning': 'sparkles',
    'education': 'book',
    'health': 'medkit',
};

export default function TelaMeusServicos({ navigation }: TelaMeusServicosProps) {
    const [servicos, setServicos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [atualizando, setAtualizando] = useState<boolean>(false);

    const { token, usuario } = useAuth();

    const carregarServicos = useCallback(async () => {
        if (!token) return;

        try {
            const resposta = await buscarMeusServicos(token);
            setServicos(resposta.data?.services || []);
        } catch (erro) {
            console.log('Erro ao carregar serviços:', erro);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [token]);

    useEffect(() => {
        carregarServicos();
    }, [carregarServicos]);

    const aoAtualizar = () => {
        setAtualizando(true);
        carregarServicos();
    };

    const confirmarEliminacao = (servicoId: string, titulo: string) => {
        Alert.alert(
            'Eliminar Serviço',
            `Tem certeza que deseja eliminar "${titulo}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await eliminarServico(token!, servicoId);
                            setServicos(servicos.filter(s => s._id !== servicoId));
                            Alert.alert('Sucesso', 'Serviço eliminado');
                        } catch (erro: any) {
                            Alert.alert('Erro', erro.message);
                        }
                    },
                },
            ]
        );
    };

    const getIconeCategoria = (categoria: string): string => {
        return CATEGORIA_ICONES[categoria] || 'construct';
    };

    const renderServico = ({ item }: { item: any }) => (
        <View style={estilos.servicoCard}>
            <View style={estilos.cabecalhoCard}>
                <View style={estilos.iconeContainer}>
                    {item.images && item.images.length > 0 ? (
                        <Image
                            source={{ uri: item.images[0] }}
                            style={estilos.servicoImagem}
                            resizeMode="cover"
                        />
                    ) : (
                        <Ionicons
                            name={getIconeCategoria(item.category) as any}
                            size={24}
                            color="#007AFF"
                        />
                    )}
                </View>
                <View style={estilos.servicoInfo}>
                    <Text style={estilos.servicoNome}>{item.title}</Text>
                    <Text style={estilos.servicoCategoria}>{item.category}</Text>
                </View>
                <View
                    style={[
                        estilos.statusBadge,
                        { backgroundColor: item.active !== false ? '#E8F8ED' : '#FFF0F0' },
                    ]}
                >
                    <Text
                        style={[
                            estilos.statusTexto,
                            { color: item.active !== false ? '#34C759' : '#FF3B30' },
                        ]}
                    >
                        {item.active !== false ? 'Ativo' : 'Inativo'}
                    </Text>
                </View>
            </View>

            <Text style={estilos.descricao} numberOfLines={2}>
                {item.description}
            </Text>

            <View style={estilos.detalhes}>
                <View style={estilos.detalheItem}>
                    <Ionicons name="cash-outline" size={16} color="#666" />
                    <Text style={estilos.detalheTexto}>
                        {item.priceRange?.min?.toLocaleString()} - {item.priceRange?.max?.toLocaleString()} Kz
                    </Text>
                </View>
                <View style={estilos.detalheItem}>
                    <Ionicons name="star" size={16} color="#FFB800" />
                    <Text style={estilos.detalheTexto}>
                        {item.rating?.average?.toFixed(1) || '0.0'} ({item.rating?.count || 0})
                    </Text>
                </View>
            </View>

            <View style={estilos.acoes}>
                <TouchableOpacity
                    style={estilos.botaoEditar}
                    onPress={() => navigation.navigate('EditarServico' as any, { servico: item })}
                >
                    <Ionicons name="create-outline" size={18} color="#007AFF" />
                    <Text style={estilos.botaoEditarTexto}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={estilos.botaoEliminar}
                    onPress={() => confirmarEliminacao(item._id, item.title)}
                >
                    <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                    <Text style={estilos.botaoEliminarTexto}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (carregando) {
        return (
            <View style={estilos.carregando}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={estilos.carregandoTexto}>Carregando serviços...</Text>
            </View>
        );
    }

    return (
        <View style={estilos.container}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
                <Text style={estilos.titulo}>Meus Serviços</Text>
                <Text style={estilos.subtitulo}>
                    {servicos.length} {servicos.length === 1 ? 'serviço' : 'serviços'}
                </Text>
            </View>

            {/* Botão Criar Novo */}
            <TouchableOpacity
                style={estilos.botaoCriar}
                onPress={() => navigation.navigate('NovoServico' as any)}
            >
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text style={estilos.botaoCriarTexto}>Criar Novo Serviço</Text>
            </TouchableOpacity>

            {/* Lista de Serviços */}
            {servicos.length === 0 ? (
                <View style={estilos.vazioContainer}>
                    <Ionicons name="briefcase-outline" size={64} color="#C7C7CC" />
                    <Text style={estilos.vazioTitulo}>Nenhum serviço</Text>
                    <Text style={estilos.vazioTexto}>
                        Crie o seu primeiro serviço para começar a receber pedidos
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={servicos}
                    renderItem={renderServico}
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
    botaoCriar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#34C759',
        margin: 24,
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    botaoCriarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    listaContainer: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    servicoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cabecalhoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconeContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#E8F4FF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginRight: 12,
    },
    servicoImagem: {
        width: '100%',
        height: '100%',
    },
    servicoInfo: {
        flex: 1,
    },
    servicoNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    servicoCategoria: {
        fontSize: 13,
        color: '#666666',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusTexto: {
        fontSize: 12,
        fontWeight: '600',
    },
    descricao: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
        marginBottom: 12,
    },
    detalhes: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 16,
    },
    detalheItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detalheTexto: {
        fontSize: 13,
        color: '#666666',
    },
    acoes: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
        gap: 12,
    },
    botaoEditar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F4FF',
        padding: 12,
        borderRadius: 10,
        gap: 6,
    },
    botaoEditarTexto: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    botaoEliminar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF0F0',
        padding: 12,
        borderRadius: 10,
        gap: 6,
    },
    botaoEliminarTexto: {
        fontSize: 14,
        color: '#FF3B30',
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
});
