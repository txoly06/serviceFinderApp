// ========================================
// TELA INICIAL (HOME)
// ========================================
// Tela principal com lista de serviços
// Design profissional sem emojis

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ListRenderItem,
    ActivityIndicator,
    RefreshControl,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Categoria } from '../tipos';
import { buscarServicos } from '../servicos/api';
import { useAuth } from '../contextos/AuthContext';
import { SkeletonList } from '../componentes/Skeleton';
import { EmptyStates } from '../componentes/EmptyState';
import { MapaServicos } from '../componentes/MapaServicos';

// Ícones para cada categoria
const CATEGORIA_ICONES: { [key: string]: string } = {
    'home-repairs': 'hammer',
    'beauty': 'cut',
    'tech': 'laptop',
    'cleaning': 'sparkles',
    'education': 'book',
    'health': 'medkit',
};

// Categorias com ícones
const categorias: Categoria[] = [
    { id: '1', nome: 'Reparos', icone: 'hammer' },
    { id: '2', nome: 'Beleza', icone: 'cut' },
    { id: '3', nome: 'Tecnologia', icone: 'laptop' },
    { id: '4', nome: 'Limpeza', icone: 'sparkles' },
    { id: '5', nome: 'Educação', icone: 'book' },
    { id: '6', nome: 'Saúde', icone: 'medkit' },
];

type TelaInicioProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Principal'>;
};

export default function TelaInicio({ navigation }: TelaInicioProps) {
    const [servicos, setServicos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [atualizando, setAtualizando] = useState<boolean>(false);

    const { usuario } = useAuth();

    useEffect(() => {
        carregarServicos();
    }, []);

    const carregarServicos = async () => {
        try {
            const resposta = await buscarServicos();
            setServicos(resposta.data.services);
        } catch (erro) {
            console.log('Erro ao carregar serviços:', erro);
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    };

    const aoAtualizar = () => {
        setAtualizando(true);
        carregarServicos();
    };

    const getIconeCategoria = (categoria: string): string => {
        return CATEGORIA_ICONES[categoria] || 'construct';
    };

    const renderCategoria: ListRenderItem<Categoria> = ({ item }) => (
        <TouchableOpacity style={estilos.categoriaItem}>
            <View style={estilos.categoriaIconeContainer}>
                <Ionicons name={item.icone as any} size={24} color="#007AFF" />
            </View>
            <Text style={estilos.categoriaTexto}>{item.nome}</Text>
        </TouchableOpacity>
    );

    const renderServico: ListRenderItem<any> = ({ item }) => (
        <TouchableOpacity
            style={estilos.servicoCard}
            onPress={() => navigation.navigate('DetalhesServico', { servico: item })}
            activeOpacity={0.7}
        >
            <View style={estilos.servicoIconeContainer}>
                {item.images && item.images.length > 0 ? (
                    <Image
                        source={{ uri: item.images[0] }}
                        style={estilos.servicoImagem}
                        resizeMode="cover"
                    />
                ) : (
                    <Ionicons
                        name={getIconeCategoria(item.category) as any}
                        size={28}
                        color="#007AFF"
                    />
                )}
            </View>
            <View style={estilos.servicoInfo}>
                <Text style={estilos.servicoTitulo}>{item.title}</Text>
                <Text style={estilos.servicoCategoria}>{item.category}</Text>
                <View style={estilos.servicoRodape}>
                    <Text style={estilos.servicoPreco}>
                        {item.priceRange?.min?.toLocaleString()} - {item.priceRange?.max?.toLocaleString()} Kz
                    </Text>
                    <View style={estilos.avaliacaoContainer}>
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <Text style={estilos.avaliacaoTexto}>
                            {item.rating?.average?.toFixed(1) || '0.0'}
                        </Text>
                    </View>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
    );

    if (carregando) {
        return (
            <View style={estilos.container}>
                <View style={estilos.cabecalho}>
                    <Text style={estilos.saudacao}>Carregando...</Text>
                </View>
                <SkeletonList count={5} />
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
                    onRefresh={aoAtualizar}
                    tintColor="#007AFF"
                />
            }
        >
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
                <View>
                    <Text style={estilos.saudacao}>
                        Olá, {usuario?.nome?.split(' ')[0] || 'Visitante'}
                    </Text>
                    <Text style={estilos.pergunta}>O que procura hoje?</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={[estilos.notificacaoBotao, { marginRight: 12 }]}
                        onPress={() => navigation.navigate('Conversas')}
                    >
                        <Ionicons name="chatbubbles-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={estilos.notificacaoBotao}>
                        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mapa de Serviços */}
            <View style={{ marginTop: 16 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 16,
                    marginBottom: 12,
                    color: '#1A1A1A'
                }}>
                    No Mapa
                </Text>
                <MapaServicos
                    servicos={servicos.map(s => ({
                        id: s._id,
                        titulo: s.title,
                        categoria: s.category,
                        preco: `${s.priceRange.min} - ${s.priceRange.max}`,
                        lat: s.coordinates?.lat || -8.839988,
                        lng: s.coordinates?.lng || 13.289437
                    }))}
                    aoSelecionar={(id) => {
                        const s = servicos.find(serv => serv._id === id);
                        if (s) navigation.navigate('DetalhesServico', { servico: s });
                    }}
                />
            </View>

            {/* Barra de Pesquisa */}
            <View style={estilos.pesquisaContainer}>
                <View style={estilos.pesquisaInput}>
                    <Ionicons name="search" size={20} color="#666" />
                    <Text style={estilos.pesquisaPlaceholder}>Pesquisar serviços...</Text>
                </View>
                <TouchableOpacity style={estilos.filtroBotao}>
                    <Ionicons name="options" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Categorias */}
            <View style={estilos.secaoHeader}>
                <Text style={estilos.secaoTitulo}>Categorias</Text>
                <TouchableOpacity>
                    <Text style={estilos.verTudo}>Ver todas</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={categorias}
                renderItem={renderCategoria}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={estilos.listaHorizontal}
            />

            {/* Mais Avaliados */}
            {servicos.filter(s => s.rating?.average > 0).length > 0 && (
                <>
                    <View style={estilos.secaoHeader}>
                        <Text style={estilos.secaoTitulo}>Mais Avaliados</Text>
                        <TouchableOpacity>
                            <Text style={estilos.verTudo}>Ver todos</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={[...servicos]
                            .filter(s => s.rating?.average > 0)
                            .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
                            .slice(0, 5)}
                        renderItem={renderServico}
                        keyExtractor={(item) => `top-${item._id}`}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={estilos.listaHorizontal}
                    />
                </>
            )}

            {/* Serviços */}
            <View style={estilos.secaoHeader}>
                <Text style={estilos.secaoTitulo}>Serviços Disponíveis</Text>
                <Text style={estilos.contador}>{servicos.length} encontrados</Text>
            </View>

            {
                servicos.length === 0 ? (
                    <View style={estilos.vazioContainer}>
                        <Ionicons name="search-outline" size={48} color="#C7C7CC" />
                        <Text style={estilos.vazioTexto}>Nenhum serviço encontrado</Text>
                    </View>
                ) : (
                    <View style={estilos.servicosLista}>
                        {servicos.map((servico) => (
                            <TouchableOpacity
                                key={servico._id}
                                style={estilos.servicoCard}
                                onPress={() => navigation.navigate('DetalhesServico', { servico })}
                                activeOpacity={0.7}
                            >
                                <View style={estilos.servicoIconeContainer}>
                                    <Ionicons
                                        name={getIconeCategoria(servico.category) as any}
                                        size={28}
                                        color="#007AFF"
                                    />
                                </View>
                                <View style={estilos.servicoInfo}>
                                    <Text style={estilos.servicoTitulo}>{servico.title}</Text>
                                    <Text style={estilos.servicoCategoria}>{servico.category}</Text>
                                    <View style={estilos.servicoRodape}>
                                        <Text style={estilos.servicoPreco}>
                                            {servico.priceRange?.min?.toLocaleString()} - {servico.priceRange?.max?.toLocaleString()} Kz
                                        </Text>
                                        <View style={estilos.avaliacaoContainer}>
                                            <Ionicons name="star" size={14} color="#FFB800" />
                                            <Text style={estilos.avaliacaoTexto}>
                                                {servico.rating?.average?.toFixed(1) || '0.0'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )
            }

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
        paddingBottom: 24,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    saudacao: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    pergunta: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    notificacaoBotao: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pesquisaContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginTop: -22,
        gap: 12,
    },
    pesquisaInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    pesquisaPlaceholder: {
        color: '#999999',
        fontSize: 15,
    },
    filtroBotao: {
        width: 48,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    secaoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 24,
        marginBottom: 16,
    },
    secaoTitulo: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    verTudo: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    contador: {
        fontSize: 14,
        color: '#666666',
    },
    listaHorizontal: {
        paddingLeft: 24,
        paddingRight: 12,
    },
    categoriaItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 72,
    },
    categoriaIconeContainer: {
        width: 56,
        height: 56,
        backgroundColor: '#E8F4FF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoriaTexto: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
    },
    servicosLista: {
        paddingHorizontal: 24,
        gap: 12,
    },
    servicoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    servicoIconeContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#E8F4FF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginRight: 14,
    },
    servicoImagem: {
        width: '100%',
        height: '100%',
    },
    servicoInfo: {
        flex: 1,
    },
    servicoTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    servicoCategoria: {
        fontSize: 13,
        color: '#666666',
        marginTop: 2,
    },
    servicoRodape: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    servicoPreco: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    avaliacaoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    avaliacaoTexto: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    vazioContainer: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    vazioTexto: {
        marginTop: 12,
        fontSize: 15,
        color: '#999999',
    },
});
