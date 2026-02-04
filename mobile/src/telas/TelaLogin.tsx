// ========================================
// TELA DE LOGIN
// ========================================
// Tela de entrada do aplicativo
// Design profissional sem emojis

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { fazerLogin } from '../servicos/api';
import { useAuth } from '../contextos/AuthContext';

type TelaLoginProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function TelaLogin({ navigation }: TelaLoginProps) {
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(false);
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

    const { login } = useAuth();

    const handleLogin = async (): Promise<void> => {
        if (email === '' || senha === '') {
            Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos');
            return;
        }

        try {
            setCarregando(true);
            const resposta = await fazerLogin(email, senha);
            login(resposta.data.user, resposta.data.token);
            navigation.replace('Principal');
        } catch (erro: any) {
            Alert.alert('Erro de autenticação', erro.message || 'Email ou senha incorretos');
        } finally {
            setCarregando(false);
        }
    };

    const irParaCadastro = (): void => {
        navigation.navigate('Cadastro');
    };

    return (
        <KeyboardAvoidingView
            style={estilos.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={estilos.conteudo}>
                {/* Logo e Título */}
                <View style={estilos.logoContainer}>
                    <View style={estilos.logoIcone}>
                        <Ionicons name="search" size={40} color="#FFFFFF" />
                    </View>
                    <Text style={estilos.titulo}>ServiceFinder</Text>
                    <Text style={estilos.subtitulo}>Encontre serviços perto de você</Text>
                </View>

                {/* Formulário */}
                <View style={estilos.formulario}>
                    {/* Campo Email */}
                    <View style={estilos.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={estilos.inputIcone} />
                        <TextInput
                            style={estilos.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!carregando}
                        />
                    </View>

                    {/* Campo Senha */}
                    <View style={estilos.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={estilos.inputIcone} />
                        <TextInput
                            style={estilos.input}
                            placeholder="Senha"
                            placeholderTextColor="#999"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry={!mostrarSenha}
                            editable={!carregando}
                        />
                        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                            <Ionicons
                                name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Botão Login */}
                    <TouchableOpacity
                        style={[estilos.botao, carregando && estilos.botaoDesativado]}
                        onPress={handleLogin}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={estilos.textoBotao}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link Cadastro */}
                    <TouchableOpacity
                        style={estilos.linkContainer}
                        onPress={irParaCadastro}
                        disabled={carregando}
                    >
                        <Text style={estilos.linkTexto}>Não tem conta? </Text>
                        <Text style={estilos.linkDestaque}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>

                {/* Credenciais de teste */}
                <View style={estilos.testeContainer}>
                    <Text style={estilos.testeTexto}>Teste: ana@email.com / senha123</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    conteudo: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoIcone: {
        width: 80,
        height: 80,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    titulo: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 16,
        color: '#666666',
    },
    formulario: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    inputIcone: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
    },
    botao: {
        backgroundColor: '#007AFF',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    botaoDesativado: {
        backgroundColor: '#A0C4FF',
        shadowOpacity: 0,
        elevation: 0,
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    linkTexto: {
        color: '#666666',
        fontSize: 15,
    },
    linkDestaque: {
        color: '#007AFF',
        fontSize: 15,
        fontWeight: '600',
    },
    testeContainer: {
        position: 'absolute',
        bottom: 32,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    testeTexto: {
        color: '#999999',
        fontSize: 12,
    },
});
