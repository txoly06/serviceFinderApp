import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { buscarMensagens } from '../servicos/api';
import { initSocket, getSocket } from '../servicos/socket';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    route: RouteProp<{ Chat: { conversationId: string; nomeOutro: string; serviceTitulo?: string } }, 'Chat'>;
};

interface Mensagem {
    _id: string;
    sender: { _id: string; name: string } | string;
    content: string;
    createdAt: string;
    read: boolean;
}

export default function TelaChat({ navigation, route }: Props) {
    const { conversationId, nomeOutro, serviceTitulo } = route.params;
    const { token, usuario } = useAuth();

    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    const flatListRef = useRef<FlatList>(null);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        carregarMensagens();
        conectarSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_conversation', conversationId);
                socketRef.current.off('new_message');
            }
        };
    }, []);

    const conectarSocket = () => {
        if (!token) return;

        const socket = initSocket(token);
        socketRef.current = socket;

        // Entrar na sala
        socket.emit('join_conversation', conversationId);

        // Ouvir novas mensagens
        socket.on('new_message', (mensagem: Mensagem) => {
            setMensagens(prev => [...prev, mensagem]);
            setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        });
    };

    const carregarMensagens = async () => {
        if (!token) return;
        try {
            const resposta = await buscarMensagens(token, conversationId);
            setMensagens(resposta.data?.messages || []);
        } catch (erro) {
            console.log('Erro ao carregar mensagens:', erro);
        } finally {
            setCarregando(false);
        }
    };

    const handleEnviar = async () => {
        if (!novaMensagem.trim()) return;

        try {
            setEnviando(true);
            const socket = getSocket();

            // Enviar via Socket
            socket.emit('send_message', {
                conversationId,
                content: novaMensagem.trim()
            });

            setNovaMensagem('');
            // A mensagem será adicionada via evento 'new_message'
        } catch (erro: any) {
            console.log('Erro ao enviar:', erro.message);
        } finally {
            setEnviando(false);
        }
    };

    const getSenderId = (sender: any): string => {
        return typeof sender === 'string' ? sender : sender?._id || '';
    };

    const renderMensagem = useCallback(({ item }: { item: Mensagem }) => {
        const isMinha = getSenderId(item.sender) === usuario?.id;
        return (
            <View style={[estilos.mensagemContainer, isMinha && estilos.mensagemMinha]}>
                <View style={[estilos.balao, isMinha ? estilos.balaoMeu : estilos.balaoOutro]}>
                    <Text style={[estilos.texto, isMinha && estilos.textoMeu]}>
                        {item.content}
                    </Text>
                    <Text style={[estilos.hora, isMinha && estilos.horaMinha]}>
                        {new Date(item.createdAt).toLocaleTimeString('pt-PT', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>
        );
    }, [usuario?.id]);

    if (carregando) {
        return (
            <View style={estilos.carregando}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={estilos.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            {/* Header */}
            <View style={estilos.header}>
                <TouchableOpacity
                    style={estilos.voltarBotao}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={estilos.headerInfo}>
                    <Text style={estilos.headerNome}>{nomeOutro}</Text>
                    <Text style={estilos.statusOnline}>Online agora</Text>
                </View>
            </View>

            {/* Service Context Banner */}
            {serviceTitulo && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#E8F4FF',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#D0E8FF',
                }}>
                    <Ionicons name="briefcase-outline" size={16} color="#007AFF" />
                    <Text style={{ marginLeft: 8, fontSize: 13, color: '#007AFF', fontWeight: '500' }}>
                        Sobre: {serviceTitulo}
                    </Text>
                </View>
            )}

            {/* Mensagens */}
            <FlatList
                ref={flatListRef}
                data={mensagens}
                renderItem={renderMensagem}
                keyExtractor={item => item._id}
                contentContainerStyle={estilos.lista}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            {/* Input */}
            <View style={estilos.inputContainer}>
                <TextInput
                    style={estilos.input}
                    placeholder="Escreva uma mensagem..."
                    placeholderTextColor="#999"
                    value={novaMensagem}
                    onChangeText={setNovaMensagem}
                    multiline
                    maxLength={1000}
                />
                <TouchableOpacity
                    style={[estilos.enviarBotao, !novaMensagem.trim() && estilos.enviarDesativado]}
                    onPress={handleEnviar}
                    disabled={!novaMensagem.trim()}
                >
                    <Ionicons name="send" size={20} color="#FFFFFF" />
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
    carregando: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    voltarBotao: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 8,
    },
    headerNome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    statusOnline: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    lista: {
        padding: 16,
        paddingBottom: 8,
    },
    mensagemContainer: {
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    mensagemMinha: {
        alignItems: 'flex-end',
    },
    balao: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    balaoMeu: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    balaoOutro: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    texto: {
        fontSize: 15,
        color: '#1A1A1A',
        lineHeight: 20,
    },
    textoMeu: {
        color: '#FFFFFF',
    },
    hora: {
        fontSize: 11,
        color: '#999999',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    horaMinha: {
        color: 'rgba(255,255,255,0.7)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        paddingBottom: 32,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
    },
    input: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#1A1A1A',
    },
    enviarBotao: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    enviarDesativado: {
        backgroundColor: '#C7C7CC',
    },
});
