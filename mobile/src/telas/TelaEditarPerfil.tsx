// ========================================
// TELA DE EDITAR PERFIL
// ========================================
// Formulário de edição de dados do usuário

import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { atualizarPerfil } from '../servicos/api';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function TelaEditarPerfil({ navigation }: Props) {
    const { token, usuario, atualizarUsuario } = useAuth();

    const [nome, setNome] = useState(usuario?.nome || '');
    const [telefone, setTelefone] = useState(usuario?.telefone || '');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [salvando, setSalvando] = useState(false);

    const handleSalvar = async () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'O nome é obrigatório');
            return;
        }

        try {
            setSalvando(true);

            const dadosAtualizados: any = {
                name: nome.trim(),
            };

            if (telefone.trim()) {
                dadosAtualizados.phone = telefone.trim();
            }

            if (cidade.trim() && estado.trim()) {
                dadosAtualizados.location = {
                    city: cidade.trim(),
                    state: estado.trim(),
                };
            }

            const resposta = await atualizarPerfil(token!, dadosAtualizados);

            // Atualizar contexto local
            if (atualizarUsuario && resposta.data?.user) {
                atualizarUsuario({
                    ...usuario!,
                    nome: resposta.data.user.name,
                    telefone: resposta.data.user.phone,
                });
            }

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (erro: any) {
            Alert.alert('Erro', erro.message || 'Não foi possível atualizar o perfil');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={estilos.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Header */}
            <View style={estilos.header}>
                <TouchableOpacity
                    style={estilos.voltarBotao}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={estilos.headerTitulo}>Editar Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={estilos.form}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Avatar */}
                <View style={estilos.avatarSection}>
                    <View style={estilos.avatar}>
                        <Text style={estilos.avatarTexto}>
                            {nome.charAt(0).toUpperCase() || '?'}
                        </Text>
                    </View>
                    <TouchableOpacity style={estilos.mudarFoto}>
                        <Ionicons name="camera" size={16} color="#007AFF" />
                        <Text style={estilos.mudarFotoTexto}>Mudar foto</Text>
                    </TouchableOpacity>
                </View>

                {/* Campos */}
                <View style={estilos.campo}>
                    <Text style={estilos.label}>Nome completo</Text>
                    <TextInput
                        style={estilos.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Seu nome"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={estilos.campo}>
                    <Text style={estilos.label}>Email</Text>
                    <View style={[estilos.input, estilos.inputDesabilitado]}>
                        <Text style={estilos.inputDesabilitadoTexto}>
                            {usuario?.email}
                        </Text>
                        <Ionicons name="lock-closed" size={16} color="#999" />
                    </View>
                    <Text style={estilos.hint}>O email não pode ser alterado</Text>
                </View>

                <View style={estilos.campo}>
                    <Text style={estilos.label}>Telefone</Text>
                    <TextInput
                        style={estilos.input}
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="+244 9XX XXX XXX"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={estilos.campo}>
                    <Text style={estilos.label}>Localização</Text>
                    <View style={estilos.row}>
                        <TextInput
                            style={[estilos.input, estilos.inputMeio]}
                            value={cidade}
                            onChangeText={setCidade}
                            placeholder="Cidade"
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={[estilos.input, estilos.inputMeio]}
                            value={estado}
                            onChangeText={setEstado}
                            placeholder="Província"
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                {/* Tipo de conta */}
                <View style={estilos.tipoContainer}>
                    <Ionicons
                        name={usuario?.tipo === 'provider' ? 'construct' : 'person'}
                        size={20}
                        color="#007AFF"
                    />
                    <Text style={estilos.tipoTexto}>
                        Conta {usuario?.tipo === 'provider' ? 'Prestador' : 'Cliente'}
                    </Text>
                </View>

                {/* Botão Salvar */}
                <TouchableOpacity
                    style={[estilos.botaoSalvar, salvando && estilos.botaoDesabilitado]}
                    onPress={handleSalvar}
                    disabled={salvando}
                >
                    {salvando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={estilos.botaoSalvarTexto}>Salvar Alterações</Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 50 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    voltarBotao: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitulo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    form: {
        flex: 1,
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        backgroundColor: '#007AFF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTexto: {
        fontSize: 40,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    mudarFoto: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 12,
    },
    mudarFotoTexto: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    campo: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    inputDesabilitado: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    inputDesabilitadoTexto: {
        fontSize: 15,
        color: '#666',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    inputMeio: {
        flex: 1,
    },
    tipoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#007AFF10',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 24,
    },
    tipoTexto: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    botaoSalvar: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botaoDesabilitado: {
        opacity: 0.7,
    },
    botaoSalvarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
