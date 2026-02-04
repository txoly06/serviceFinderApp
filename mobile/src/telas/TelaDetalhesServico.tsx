// ========================================
// TELA DE DETALHES DO SERVIÇO
// ========================================
// Informações completas sobre um serviço
// Design profissional sem emojis

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { criarPedido, buscarFavoritos, adicionarFavorito, removerFavorito, buscarAvaliacoes } from '../servicos/api';

type TelaDetalhesProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'DetalhesServico'>;
    route: RouteProp<RootStackParamList, 'DetalhesServico'>;
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

export default function TelaDetalhesServico({ navigation, route }: TelaDetalhesProps) {
    const { servico } = route.params;
    const { token } = useAuth();

    const [modalVisivel, setModalVisivel] = useState(false);
    const [descricao, setDescricao] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [isFavorito, setIsFavorito] = useState(false);
    const [favoritandoCarregando, setFavoritandoCarregando] = useState(false);
    const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
    const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true);

    // Verificar se o serviço está nos favoritos ao carregar
    React.useEffect(() => {
        const verificarFavorito = async () => {
            if (!token) return;
            try {
                const resp = await buscarFavoritos(token);
                const favoritos = resp.data?.favorites || [];
                const encontrado = favoritos.some((f: any) => f._id === servico._id);
                setIsFavorito(encontrado);
            } catch (e) {
                // Ignora erro silenciosamente
            }
        };
        verificarFavorito();
    }, [token, servico._id]);

    // Carregar avaliações do serviço
    React.useEffect(() => {
        const carregarAvaliacoes = async () => {
            try {
                const resp = await buscarAvaliacoes(servico._id);
                setAvaliacoes(resp.data?.reviews || []);
            } catch (e) {
                console.log('Erro ao carregar avaliações:', e);
            } finally {
                setCarregandoAvaliacoes(false);
            }
        };
        carregarAvaliacoes();
    }, [servico._id]);

    // Toggle favorito
    const toggleFavorito = async () => {
        if (!token) {
            Alert.alert('Login necessário', 'Faça login para adicionar favoritos');
            return;
        }
        try {
            setFavoritandoCarregando(true);
            if (isFavorito) {
                await removerFavorito(token, servico._id);
                setIsFavorito(false);
            } else {
                await adicionarFavorito(token, servico._id);
                setIsFavorito(true);
            }
        } catch (e: any) {
            Alert.alert('Erro', e.message || 'Erro ao atualizar favorito');
        } finally {
            setFavoritandoCarregando(false);
        }
    };

    // Gerar opções de data (próximos 7 dias)
    const opcoesData = Array.from({ length: 7 }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() + i + 1);
        return data;
    });

    const formatarDataCurta = (data: Date): string => {
        const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return `${dias[data.getDay()]} ${data.getDate()}`;
    };

    const getIconeCategoria = (categoria: string): string => {
        return CATEGORIA_ICONES[categoria] || 'construct';
    };

    const abrirModalPedido = () => {
        if (!token) {
            Alert.alert('Login necessário', 'Faça login para solicitar serviços');
            return;
        }
        setModalVisivel(true);
    };

    const enviarPedido = async () => {
        if (!descricao.trim()) {
            Alert.alert('Atenção', 'Descreva o que você precisa');
            return;
        }
        if (!dataSelecionada) {
            Alert.alert('Atenção', 'Selecione uma data');
            return;
        }

        try {
            setCarregando(true);

            const dataISO = dataSelecionada.toISOString();
            await criarPedido(token!, servico._id, descricao, dataISO);

            setModalVisivel(false);
            setDescricao('');
            setDataSelecionada(null);

            Alert.alert(
                'Pedido Enviado',
                'O prestador receberá o seu pedido e entrará em contato.',
                [{ text: 'Ver Pedidos', onPress: () => navigation.navigate('Principal') }]
            );
        } catch (erro: any) {
            Alert.alert('Erro', erro.message || 'Não foi possível enviar o pedido');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <View style={estilos.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={estilos.header}>
                    <TouchableOpacity
                        style={estilos.voltarBotao}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={estilos.favoritoBotao}
                        onPress={toggleFavorito}
                        disabled={favoritandoCarregando}
                    >
                        <Ionicons
                            name={isFavorito ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFavorito ? '#FF3B30' : '#1A1A1A'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Ícone do Serviço */}
                {/* Imagens ou Ícone */}
                <View style={estilos.mediaContainer}>
                    {servico.images && servico.images.length > 0 ? (
                        <View>
                            <FlatList
                                data={servico.images}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: item }}
                                        style={estilos.servicoImagem}
                                        resizeMode="cover"
                                    />
                                )}
                                keyExtractor={(item, index) => `img-${index}`}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(e) => {
                                    /* Opcional: atualizar indicação de página se desejar */
                                }}
                            />
                            {servico.images.length > 1 && (
                                <View style={estilos.paginacaoContainer}>
                                    {servico.images.map((_, index) => (
                                        <View
                                            key={index}
                                            style={estilos.paginacaoPonto}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={estilos.iconeContainer}>
                            <View style={estilos.icone}>
                                <Ionicons
                                    name={getIconeCategoria(servico.category) as any}
                                    size={48}
                                    color="#007AFF"
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* Info Principal */}
                <View style={estilos.infoContainer}>
                    <Text style={estilos.titulo}>{servico.title}</Text>
                    <View style={estilos.categoriaContainer}>
                        <Text style={estilos.categoria}>{servico.category}</Text>
                    </View>

                    {/* Avaliação */}
                    <View style={estilos.avaliacaoContainer}>
                        <Ionicons name="star" size={18} color="#FFB800" />
                        <Text style={estilos.avaliacaoNumero}>
                            {servico.rating?.average?.toFixed(1) || '0.0'}
                        </Text>
                        <Text style={estilos.avaliacaoTotal}>
                            ({servico.rating?.count || 0} avaliações)
                        </Text>
                    </View>
                </View>

                {/* Descrição */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Descrição</Text>
                    <Text style={estilos.descricao}>{servico.description}</Text>
                </View>

                {/* Preço */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Faixa de Preço</Text>
                    <View style={estilos.precoCard}>
                        <Ionicons name="cash-outline" size={24} color="#007AFF" />
                        <Text style={estilos.precoTexto}>
                            {servico.priceRange?.min?.toLocaleString()} - {servico.priceRange?.max?.toLocaleString()} Kz
                        </Text>
                    </View>
                </View>

                {/* Localização */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Localização</Text>
                    <View style={estilos.localizacaoCard}>
                        <Ionicons name="location-outline" size={24} color="#666" />
                        <Text style={estilos.localizacaoTexto}>
                            {servico.location?.city || 'Não especificada'}, {servico.location?.state || ''}
                        </Text>
                    </View>
                </View>

                {/* Avaliações */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Avaliações</Text>
                    {carregandoAvaliacoes ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : avaliacoes.length === 0 ? (
                        <View style={estilos.semAvaliacoes}>
                            <Ionicons name="chatbubble-outline" size={32} color="#C7C7CC" />
                            <Text style={estilos.semAvaliacoesTexto}>Nenhuma avaliação ainda</Text>
                        </View>
                    ) : (
                        avaliacoes.slice(0, 3).map((avaliacao) => (
                            <View key={avaliacao._id} style={estilos.avaliacaoCard}>
                                <View style={estilos.avaliacaoHeader}>
                                    <View style={estilos.avaliacaoAvatar}>
                                        <Text style={estilos.avaliacaoAvatarTexto}>
                                            {avaliacao.clientId?.name?.charAt(0) || '?'}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={estilos.avaliacaoNome}>
                                            {avaliacao.clientId?.name || 'Usuário'}
                                        </Text>
                                        <View style={estilos.avaliacaoEstrelas}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Ionicons
                                                    key={star}
                                                    name={star <= avaliacao.rating ? 'star' : 'star-outline'}
                                                    size={14}
                                                    color="#FFB800"
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={estilos.avaliacaoData}>
                                        {new Date(avaliacao.createdAt).toLocaleDateString('pt-BR')}
                                    </Text>
                                </View>
                                {avaliacao.comment && (
                                    <Text style={estilos.avaliacaoComentario}>{avaliacao.comment}</Text>
                                )}
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Botão Fixo */}
            <View style={estilos.rodapeContainer}>
                <View style={estilos.rodapePreco}>
                    <Text style={estilos.rodapeLabel}>A partir de</Text>
                    <Text style={estilos.rodapeValor}>
                        {servico.priceRange?.min?.toLocaleString()} Kz
                    </Text>
                </View>
                <TouchableOpacity
                    style={estilos.botaoSolicitar}
                    onPress={abrirModalPedido}
                    activeOpacity={0.8}
                >
                    <Text style={estilos.botaoTexto}>Solicitar Serviço</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de Pedido */}
            <Modal
                visible={modalVisivel}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisivel(false)}
            >
                <View style={estilos.modalOverlay}>
                    <View style={estilos.modalContainer}>
                        <View style={estilos.modalHeader}>
                            <Text style={estilos.modalTitulo}>Solicitar Serviço</Text>
                            <TouchableOpacity onPress={() => setModalVisivel(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <Text style={estilos.modalServico}>{servico.title}</Text>

                        <View style={estilos.inputContainer}>
                            <Text style={estilos.inputLabel}>O que você precisa?</Text>
                            <TextInput
                                style={estilos.inputArea}
                                placeholder="Descreva detalhadamente o serviço que precisa..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                value={descricao}
                                onChangeText={setDescricao}
                            />
                        </View>

                        <View style={estilos.inputContainer}>
                            <Text style={estilos.inputLabel}>Selecione a data</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                                {opcoesData.map((data, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            estilos.dataOpcao,
                                            dataSelecionada?.toDateString() === data.toDateString() && estilos.dataOpcaoSelecionada
                                        ]}
                                        onPress={() => setDataSelecionada(data)}
                                    >
                                        <Text style={[
                                            estilos.dataOpcaoTexto,
                                            dataSelecionada?.toDateString() === data.toDateString() && estilos.dataOpcaoTextoSelecionado
                                        ]}>
                                            {formatarDataCurta(data)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <TouchableOpacity
                            style={estilos.botaoEnviar}
                            onPress={enviarPedido}
                            disabled={carregando}
                        >
                            {carregando ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={estilos.botaoEnviarTexto}>Enviar Pedido</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    voltarBotao: {
        width: 44,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    favoritoBotao: {
        width: 44,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconeContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    icone: {
        width: 100,
        height: 100,
        backgroundColor: '#E8F4FF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    titulo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginBottom: 8,
    },
    categoriaContainer: {
        backgroundColor: '#E8F4FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
    },
    categoria: {
        fontSize: 13,
        color: '#007AFF',
        fontWeight: '500',
    },
    avaliacaoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    avaliacaoNumero: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    avaliacaoTotal: {
        fontSize: 14,
        color: '#666666',
    },
    secao: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    secaoTitulo: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    descricao: {
        fontSize: 15,
        color: '#1A1A1A',
        lineHeight: 24,
    },
    precoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    precoTexto: {
        fontSize: 18,
        fontWeight: '600',
        color: '#007AFF',
    },
    localizacaoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    localizacaoTexto: {
        fontSize: 15,
        color: '#1A1A1A',
    },
    rodapeContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 16,
    },
    rodapePreco: {
        flex: 1,
    },
    rodapeLabel: {
        fontSize: 12,
        color: '#666666',
    },
    rodapeValor: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    botaoSolicitar: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    botaoTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitulo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    // Media Styles
    mediaContainer: {
        marginBottom: 0,
    },
    servicoImagem: {
        width: Dimensions.get('window').width,
        height: 250,
    },
    paginacaoContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
        gap: 8,
    },
    paginacaoPonto: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    modalServico: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A1A1A',
    },
    inputArea: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A1A1A',
        height: 100,
        textAlignVertical: 'top',
    },
    botaoEnviar: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    botaoEnviarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dataOpcao: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
        marginRight: 10,
        minWidth: 60,
        alignItems: 'center',
    },
    dataOpcaoSelecionada: {
        backgroundColor: '#007AFF',
    },
    dataOpcaoTexto: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    dataOpcaoTextoSelecionado: {
        color: '#FFFFFF',
    },
    // Styles para seção de avaliações
    semAvaliacoes: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    semAvaliacoesTexto: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    avaliacaoCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    avaliacaoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avaliacaoAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avaliacaoAvatarTexto: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    avaliacaoNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    avaliacaoEstrelas: {
        flexDirection: 'row',
        marginTop: 2,
    },
    avaliacaoData: {
        fontSize: 12,
        color: '#999',
    },
    avaliacaoComentario: {
        fontSize: 13,
        color: '#666',
        marginTop: 8,
        lineHeight: 18,
    },
});
