// ========================================
// TELA NOVO SERVIÇO (Criar/Editar)
// ========================================
// Form para criar ou editar um serviço

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { criarServico, atualizarServico, uploadImages } from '../servicos/api';

type TelaNovoServicoProps = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: RouteProp<{ NovoServico: { servico?: any } }, 'NovoServico'>;
};

// Categorias disponíveis
const CATEGORIAS = [
    { id: 'home-repairs', nome: 'Reparos', icone: 'hammer' },
    { id: 'beauty', nome: 'Beleza', icone: 'cut' },
    { id: 'tech', nome: 'Tecnologia', icone: 'laptop' },
    { id: 'cleaning', nome: 'Limpeza', icone: 'sparkles' },
    { id: 'education', nome: 'Educação', icone: 'book' },
    { id: 'health', nome: 'Saúde', icone: 'medkit' },
];

export default function TelaNovoServico({ navigation, route }: TelaNovoServicoProps) {
    const servicoExistente = route.params?.servico;
    const isEditar = !!servicoExistente;

    const { token } = useAuth();
    const [carregando, setCarregando] = useState(false);

    // Form state
    const [titulo, setTitulo] = useState(servicoExistente?.title || '');
    const [descricao, setDescricao] = useState(servicoExistente?.description || '');
    const [categoria, setCategoria] = useState(servicoExistente?.category || '');
    const [precoMin, setPrecoMin] = useState(servicoExistente?.priceRange?.min?.toString() || '');
    const [precoMax, setPrecoMax] = useState(servicoExistente?.priceRange?.max?.toString() || '');
    const [cidade, setCidade] = useState(servicoExistente?.location?.city || '');
    const [estado, setEstado] = useState(servicoExistente?.location?.state || '');
    const [imagens, setImagens] = useState<string[]>(servicoExistente?.images || []);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(
        servicoExistente?.coordinates || null
    );

    // Selecionar imagens
    const selecionarImagens = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a galeria');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 5 - imagens.length,
        });

        if (!result.canceled && result.assets.length > 0) {
            try {
                setUploadingImages(true);
                const uris = result.assets.map(a => a.uri);
                const resp = await uploadImages(token!, uris);
                const newUrls = resp.data?.images || [];
                setImagens(prev => [...prev, ...newUrls].slice(0, 5));
            } catch (e: any) {
                Alert.alert('Erro', e.message || 'Falha ao enviar imagens');
            } finally {
                setUploadingImages(false);
            }
        }
    };

    // Remover imagem
    const removerImagem = (index: number) => {
        setImagens(prev => prev.filter((_, i) => i !== index));
    };

    // Obter localização GPS atual
    const obterLocalizacao = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a localização');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setCoordinates({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
            Alert.alert('Sucesso', 'Localização GPS capturada!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível obter a localização');
        }
    };

    const validarForm = (): boolean => {
        if (!titulo.trim()) {
            Alert.alert('Atenção', 'Informe o título do serviço');
            return false;
        }
        if (!descricao.trim()) {
            Alert.alert('Atenção', 'Informe a descrição do serviço');
            return false;
        }
        if (!categoria) {
            Alert.alert('Atenção', 'Selecione uma categoria');
            return false;
        }
        if (!precoMin || !precoMax) {
            Alert.alert('Atenção', 'Informe a faixa de preço');
            return false;
        }
        return true;
    };

    const salvarServico = async () => {
        if (!validarForm()) return;

        const dadosServico = {
            title: titulo.trim(),
            description: descricao.trim(),
            category: categoria,
            priceRange: {
                min: parseInt(precoMin),
                max: parseInt(precoMax),
            },
            location: {
                city: cidade.trim() || 'Luanda',
                state: estado.trim() || 'Luanda',
            },
            images: imagens,
            coordinates: coordinates,
        };

        try {
            setCarregando(true);

            if (isEditar) {
                await atualizarServico(token!, servicoExistente._id, dadosServico);
                Alert.alert('Sucesso', 'Serviço atualizado!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                await criarServico(token!, dadosServico);
                Alert.alert('Sucesso', 'Serviço criado com sucesso!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            }
        } catch (erro: any) {
            Alert.alert('Erro', erro.message || 'Não foi possível salvar');
        } finally {
            setCarregando(false);
        }
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
                    <Text style={estilos.headerTitulo}>
                        {isEditar ? 'Editar Serviço' : 'Novo Serviço'}
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={estilos.form}>
                    {/* Título */}
                    <View style={estilos.inputGroup}>
                        <Text style={estilos.label}>Título do Serviço *</Text>
                        <TextInput
                            style={estilos.input}
                            placeholder="Ex: Reparação de Computadores"
                            placeholderTextColor="#999"
                            value={titulo}
                            onChangeText={setTitulo}
                        />
                    </View>

                    {/* Descrição */}
                    <View style={estilos.inputGroup}>
                        <Text style={estilos.label}>Descrição *</Text>
                        <TextInput
                            style={estilos.textArea}
                            placeholder="Descreva o seu serviço em detalhes..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            value={descricao}
                            onChangeText={setDescricao}
                        />
                    </View>

                    {/* Imagens */}
                    <View style={estilos.inputGroup}>
                        <Text style={estilos.label}>Imagens (máx 5)</Text>
                        <View style={estilos.imagensContainer}>
                            {imagens.map((uri, index) => (
                                <View key={index} style={estilos.imagemWrapper}>
                                    <Image source={{ uri }} style={estilos.imagemPreview} />
                                    <TouchableOpacity
                                        style={estilos.removerImagem}
                                        onPress={() => removerImagem(index)}
                                    >
                                        <Ionicons name="close-circle" size={22} color="#FF3B30" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {imagens.length < 5 && (
                                <TouchableOpacity
                                    style={estilos.adicionarImagem}
                                    onPress={selecionarImagens}
                                    disabled={uploadingImages}
                                >
                                    {uploadingImages ? (
                                        <ActivityIndicator color="#007AFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="camera-outline" size={28} color="#007AFF" />
                                            <Text style={estilos.adicionarTexto}>Adicionar</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Categoria */}
                    <View style={estilos.inputGroup}>
                        <Text style={estilos.label}>Categoria *</Text>
                        <View style={estilos.categorias}>
                            {CATEGORIAS.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        estilos.categoriaItem,
                                        categoria === cat.id && estilos.categoriaAtiva,
                                    ]}
                                    onPress={() => setCategoria(cat.id)}
                                >
                                    <Ionicons
                                        name={cat.icone as any}
                                        size={20}
                                        color={categoria === cat.id ? '#FFFFFF' : '#666'}
                                    />
                                    <Text
                                        style={[
                                            estilos.categoriaTexto,
                                            categoria === cat.id && estilos.categoriaTextoAtivo,
                                        ]}
                                    >
                                        {cat.nome}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Faixa de Preço */}
                    <View style={estilos.inputGroup}>
                        <Text style={estilos.label}>Faixa de Preço (Kz) *</Text>
                        <View style={estilos.precoRow}>
                            <View style={estilos.precoInput}>
                                <Text style={estilos.precoLabel}>Mínimo</Text>
                                <TextInput
                                    style={estilos.input}
                                    placeholder="5000"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={precoMin}
                                    onChangeText={setPrecoMin}
                                />
                            </View>
                            <Text style={estilos.precoSeparador}>-</Text>
                            <View style={estilos.precoInput}>
                                <Text style={estilos.precoLabel}>Máximo</Text>
                                <TextInput
                                    style={estilos.input}
                                    placeholder="50000"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    value={precoMax}
                                    onChangeText={setPrecoMax}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Localização */}
                    <View style={estilos.inputGroup}>
                        <Text style={estilos.label}>Localização</Text>
                        <View style={estilos.localizacaoRow}>
                            <View style={estilos.localizacaoInput}>
                                <TextInput
                                    style={estilos.input}
                                    placeholder="Cidade"
                                    placeholderTextColor="#999"
                                    value={cidade}
                                    onChangeText={setCidade}
                                />
                            </View>
                            <View style={estilos.localizacaoInput}>
                                <TextInput
                                    style={estilos.input}
                                    placeholder="Província"
                                    placeholderTextColor="#999"
                                    value={estado}
                                    onChangeText={setEstado}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={estilos.gpsButton}
                            onPress={obterLocalizacao}
                        >
                            <Ionicons name="navigate" size={20} color="#007AFF" />
                            <Text style={estilos.gpsButtonText}>
                                {coordinates ? 'GPS Capturado' : 'Capturar GPS'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Botão Salvar */}
            <View style={estilos.rodapeContainer}>
                <TouchableOpacity
                    style={estilos.botaoSalvar}
                    onPress={salvarServico}
                    disabled={carregando}
                >
                    {carregando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                            <Text style={estilos.botaoSalvarTexto}>
                                {isEditar ? 'Atualizar Serviço' : 'Criar Serviço'}
                            </Text>
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
    form: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
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
    categorias: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoriaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        gap: 6,
    },
    categoriaAtiva: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    categoriaTexto: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoriaTextoAtivo: {
        color: '#FFFFFF',
    },
    precoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    precoInput: {
        flex: 1,
    },
    precoLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 6,
    },
    precoSeparador: {
        fontSize: 24,
        color: '#C7C7CC',
        marginHorizontal: 12,
        marginTop: 20,
    },
    localizacaoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    localizacaoInput: {
        flex: 1,
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
    botaoSalvar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    botaoSalvarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    // Image picker styles
    imagensContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    imagemWrapper: {
        position: 'relative',
    },
    imagemPreview: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    removerImagem: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#FFFFFF',
        borderRadius: 11,
    },
    adicionarImagem: {
        width: 80,
        height: 80,
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
    },
    adicionarTexto: {
        fontSize: 10,
        color: '#007AFF',
        marginTop: 4,
    },
    gpsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F4FF',
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    gpsButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
});
