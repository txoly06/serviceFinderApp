// ========================================
// TELA DE FAVORITOS
// ========================================
// Lista de serviços salvos pelo cliente

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { buscarFavoritos, removerFavorito } from '../servicos/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

interface ServicoFavorito {
    _id: string;
    title: string;
    category: string;
    description?: string;
    priceRange: { min: number; max: number };
    rating?: { average: number; count: number };
    location?: { city: string };
}

export default function TelaFavoritos({ navigation }: Props) {
    const [favoritos, setFavoritos] = useState<ServicoFavorito[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const { token } = useAuth();

    const carregarFavoritos = useCallback(async () => {
        if (!token) return;
        try {
            const resposta = await buscarFavoritos(token);
            setFavoritos(resposta.data?.favorites || []);
        } catch (erro) {
            console.log('Erro ao carregar favoritos:', erro);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [token]);

    useEffect(() => {
        carregarFavoritos();
    }, [carregarFavoritos]);

    const handleRemover = async (serviceId: string) => {
        Alert.alert(
            'Remover dos Favoritos',
            'Deseja remover este serviço dos seus favoritos?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await removerFavorito(token!, serviceId);
                            setFavoritos(prev => prev.filter(f => f._id !== serviceId));
                        } catch (erro) {
                            console.log('Erro ao remover:', erro);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = useCallback(({ item }: { item: ServicoFavorito }) => (
        <TouchableOpacity
            style={estilos.card}
            onPress={() => navigation.navigate('DetalhesServico', { servico: item })}
            activeOpacity={0.7}
        >
            <View style={estilos.cardHeader}>
                <View style={estilos.cardInfo}>
                    <Text style={estilos.titulo}>{item.title}</Text>
                    <View style={estilos.categoriaContainer}>
                        <Ionicons name="pricetag" size={12} color="#007AFF" />
                        <Text style={estilos.categoria}>{item.category}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={estilos.favoritoBotao}
                    onPress={() => handleRemover(item._id)}
                >
                    <Ionicons name="heart" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>

            {item.description && (
                <Text style={estilos.descricao} numberOfLines={2}>
                    {item.description}
                </Text>
            )}

            <View style={estilos.cardFooter}>
                <View style={estilos.precoContainer}>
                    <Ionicons name="cash-outline" size={14} color="#666" />
                    <Text style={estilos.preco}>
                        {item.priceRange.min.toLocaleString()} - {item.priceRange.max.toLocaleString()} Kz
                    </Text>
                </View>
                {item.rating?.average ? (
                    <View style={estilos.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={estilos.rating}>{item.rating.average.toFixed(1)}</Text>
                    </View>
                ) : null}
            </View>
        </TouchableOpacity>
    ), [navigation, token]);

    if (carregando) {
        return (
            <View style={estilos.carregando}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={estilos.container}>
            <View style={estilos.cabecalho}>
                <Text style={estilos.cabecalhoTitulo}>Meus Favoritos</Text>
                <Text style={estilos.cabecalhoSubtitulo}>
                    {favoritos.length} {favoritos.length === 1 ? 'serviço' : 'serviços'}
                </Text>
            </View>

            {favoritos.length === 0 ? (
                <View style={estilos.vazio}>
                    <Ionicons name="heart-outline" size={64} color="#C7C7CC" />
                    <Text style={estilos.vazioTitulo}>Nenhum favorito</Text>
                    <Text style={estilos.vazioTexto}>
                        Adicione serviços aos favoritos para encontrá-los rapidamente
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
                    data={favoritos}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={estilos.lista}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={atualizando}
                            onRefresh={() => {
                                setAtualizando(true);
                                carregarFavoritos();
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
    carregando: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cabecalho: {
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    cabecalhoTitulo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cabecalhoSubtitulo: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    lista: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardInfo: {
        flex: 1,
        marginRight: 12,
    },
    titulo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    categoriaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    categoria: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
    favoritoBotao: {
        padding: 4,
    },
    descricao: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    precoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    preco: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    vazio: {
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
        color: '#666',
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
