// ========================================
// TELA DE CADASTRO
// ========================================
// Criar nova conta no aplicativo
// Design profissional sem emojis

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { fazerCadastro } from '../servicos/api';
import { useAuth } from '../contextos/AuthContext';

type TelaCadastroProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;
};

type TipoUsuario = 'client' | 'provider';

export default function TelaCadastro({ navigation }: TelaCadastroProps) {
    const [nome, setNome] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>('client');
    const [carregando, setCarregando] = useState<boolean>(false);
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

    const { login } = useAuth();

    const handleCadastro = async (): Promise<void> => {
        if (nome === '' || email === '' || telefone === '' || senha === '') {
            Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos');
            return;
        }

        if (senha.length < 6) {
            Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            setCarregando(true);
            const resposta = await fazerCadastro(nome, email, senha, telefone, tipoUsuario);
            login(resposta.data.user, resposta.data.token);
            Alert.alert('Conta criada', 'Bem-vindo ao ServiceFinder!', [
                { text: 'Continuar', onPress: () => navigation.replace('Principal') }
            ]);
        } catch (erro: any) {
            Alert.alert('Erro', erro.message || 'Erro ao criar conta');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={estilos.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={estilos.scroll}
                contentContainerStyle={estilos.scrollConteudo}
                showsVerticalScrollIndicator={false}
            >
                {/* Cabeçalho */}
                <View style={estilos.cabecalho}>
                    <TouchableOpacity
                        style={estilos.voltarBotao}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text style={estilos.titulo}>Criar Conta</Text>
                    <Text style={estilos.subtitulo}>Preencha os dados abaixo</Text>
                </View>

                {/* Formulário */}
                <View style={estilos.formulario}>
                    {/* Nome */}
                    <View style={estilos.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#666" style={estilos.inputIcone} />
                        <TextInput
                            style={estilos.input}
                            placeholder="Nome completo"
                            placeholderTextColor="#999"
                            value={nome}
                            onChangeText={setNome}
                            editable={!carregando}
                        />
                    </View>

                    {/* Email */}
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

                    {/* Telefone */}
                    <View style={estilos.inputContainer}>
                        <Ionicons name="call-outline" size={20} color="#666" style={estilos.inputIcone} />
                        <TextInput
                            style={estilos.input}
                            placeholder="Telefone"
                            placeholderTextColor="#999"
                            value={telefone}
                            onChangeText={setTelefone}
                            keyboardType="phone-pad"
                            editable={!carregando}
                        />
                    </View>

                    {/* Senha */}
                    <View style={estilos.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={estilos.inputIcone} />
                        <TextInput
                            style={estilos.input}
                            placeholder="Senha (mín. 6 caracteres)"
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

                    {/* Tipo de Usuário */}
                    <Text style={estilos.label}>Tipo de conta</Text>
                    <View style={estilos.tipoContainer}>
                        <TouchableOpacity
                            style={[
                                estilos.tipoOpcao,
                                tipoUsuario === 'client' && estilos.tipoSelecionado,
                            ]}
                            onPress={() => setTipoUsuario('client')}
                            disabled={carregando}
                        >
                            <Ionicons
                                name="person"
                                size={24}
                                color={tipoUsuario === 'client' ? '#FFFFFF' : '#666'}
                            />
                            <Text style={[
                                estilos.tipoTexto,
                                tipoUsuario === 'client' && estilos.tipoTextoSelecionado
                            ]}>
                                Cliente
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                estilos.tipoOpcao,
                                tipoUsuario === 'provider' && estilos.tipoSelecionado,
                            ]}
                            onPress={() => setTipoUsuario('provider')}
                            disabled={carregando}
                        >
                            <Ionicons
                                name="construct"
                                size={24}
                                color={tipoUsuario === 'provider' ? '#FFFFFF' : '#666'}
                            />
                            <Text style={[
                                estilos.tipoTexto,
                                tipoUsuario === 'provider' && estilos.tipoTextoSelecionado
                            ]}>
                                Prestador
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Botão Cadastrar */}
                    <TouchableOpacity
                        style={[estilos.botao, carregando && estilos.botaoDesativado]}
                        onPress={handleCadastro}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={estilos.textoBotao}>Criar Conta</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link Login */}
                    <TouchableOpacity
                        style={estilos.linkContainer}
                        onPress={() => navigation.goBack()}
                        disabled={carregando}
                    >
                        <Text style={estilos.linkTexto}>Já tem conta? </Text>
                        <Text style={estilos.linkDestaque}>Faça login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scroll: {
        flex: 1,
    },
    scrollConteudo: {
        paddingBottom: 40,
    },
    cabecalho: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    voltarBotao: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
        paddingHorizontal: 24,
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
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginTop: 8,
    },
    tipoContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    tipoOpcao: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    tipoSelecionado: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    tipoTexto: {
        fontSize: 15,
        fontWeight: '500',
        color: '#666666',
    },
    tipoTextoSelecionado: {
        color: '#FFFFFF',
    },
    botao: {
        backgroundColor: '#007AFF',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
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
});
