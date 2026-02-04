// ========================================
// TELA DE AVALIAÇÃO
// ========================================
// Form para avaliar um serviço após conclusão

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { criarAvaliacao } from '../servicos/api';

type TelaAvaliarProps = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: RouteProp<{ Avaliar: { pedido: any } }, 'Avaliar'>;
};

// Categorias de avaliação
const CATEGORIAS_AVALIACAO = [
    { id: 'quality', nome: 'Qualidade', icone: 'star' },
    { id: 'punctuality', nome: 'Pontualidade', icone: 'time' },
    { id: 'communication', nome: 'Comunicação', icone: 'chatbubbles' },
];

export default function TelaAvaliar({ navigation, route }: TelaAvaliarProps) {
    const { pedido } = route.params;
    const { token } = useAuth();

    const [avaliacao, setAvaliacao] = useState(0);
    const [comentario, setComentario] = useState('');
    const [categorias, setCategorias] = useState<{ [key: string]: number }>({
        quality: 0,
        punctuality: 0,
        communication: 0,
    });
    const [carregando, setCarregando] = useState(false);

    const selecionarEstrela = (valor: number) => {
        setAvaliacao(valor);
    };

    const selecionarCategoriaEstrela = (catId: string, valor: number) => {
        setCategorias(prev => ({ ...prev, [catId]: valor }));
    };

    const enviarAvaliacao = async () => {
        if (avaliacao === 0) {
            Alert.alert('Atenção', 'Selecione a avaliação geral');
            return;
        }

        try {
            setCarregando(true);

            // Se as categorias não foram avaliadas, usa a nota geral
            const categoriasFinais = {
                quality: categorias.quality || avaliacao,
                punctuality: categorias.punctuality || avaliacao,
                communication: categorias.communication || avaliacao,
            };

            await criarAvaliacao(token!, {
                requestId: pedido._id,
                rating: avaliacao,
                comment: comentario,
                categories: categoriasFinais,
            });

            Alert.alert(
                'Avaliação Enviada',
                'Obrigado por avaliar o serviço!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (erro: any) {
            Alert.alert('Erro', erro.message || 'Não foi possível enviar');
        } finally {
            setCarregando(false);
        }
    };

    const renderEstrelas = (valor: number, onPress: (n: number) => void, size = 32) => {
        return (
            <View style={estilos.estrelasContainer}>
                {[1, 2, 3, 4, 5].map(n => (
                    <TouchableOpacity key={n} onPress={() => onPress(n)}>
                        <Ionicons
                            name={n <= valor ? 'star' : 'star-outline'}
                            size={size}
                            color={n <= valor ? '#FFB800' : '#C7C7CC'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={estilos.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={estilos.header}>
                    <TouchableOpacity
                        style={estilos.voltarBotao}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={estilos.headerTitulo}>Avaliar Serviço</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Info do Serviço */}
                <View style={estilos.servicoInfo}>
                    <Text style={estilos.servicoNome}>
                        {pedido.serviceId?.title || 'Serviço'}
                    </Text>
                    <Text style={estilos.prestadorNome}>
                        por {pedido.providerId?.name || 'Prestador'}
                    </Text>
                </View>

                {/* Avaliação Geral */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Avaliação Geral</Text>
                    {renderEstrelas(avaliacao, selecionarEstrela, 40)}
                    <Text style={estilos.estrelasTexto}>
                        {avaliacao === 0 ? 'Toque para avaliar' : `${avaliacao} de 5 estrelas`}
                    </Text>
                </View>

                {/* Categorias */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Avaliação Detalhada</Text>
                    {CATEGORIAS_AVALIACAO.map(cat => (
                        <View key={cat.id} style={estilos.categoriaItem}>
                            <View style={estilos.categoriaInfo}>
                                <Ionicons name={cat.icone as any} size={20} color="#666" />
                                <Text style={estilos.categoriaNome}>{cat.nome}</Text>
                            </View>
                            {renderEstrelas(categorias[cat.id], (n) => selecionarCategoriaEstrela(cat.id, n), 24)}
                        </View>
                    ))}
                </View>

                {/* Comentário */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Comentário (opcional)</Text>
                    <TextInput
                        style={estilos.textArea}
                        placeholder="Conte sobre a sua experiência..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        value={comentario}
                        onChangeText={setComentario}
                    />
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Botão Enviar */}
            <View style={estilos.rodapeContainer}>
                <TouchableOpacity
                    style={[estilos.botaoEnviar, avaliacao === 0 && estilos.botaoDesabilitado]}
                    onPress={enviarAvaliacao}
                    disabled={carregando || avaliacao === 0}
                >
                    {carregando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                            <Text style={estilos.botaoEnviarTexto}>Enviar Avaliação</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerTitulo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    servicoInfo: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 24,
        borderRadius: 16,
        marginBottom: 24,
    },
    servicoNome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    prestadorNome: {
        fontSize: 14,
        color: '#666666',
    },
    secao: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    secaoTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    estrelasContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    estrelasTexto: {
        textAlign: 'center',
        color: '#666666',
        marginTop: 8,
    },
    categoriaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    categoriaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoriaNome: {
        fontSize: 15,
        color: '#1A1A1A',
    },
    textArea: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A1A1A',
        height: 120,
        textAlignVertical: 'top',
    },
    rodapeContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 32,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    botaoEnviar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    botaoDesabilitado: {
        backgroundColor: '#C7C7CC',
    },
    botaoEnviarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
