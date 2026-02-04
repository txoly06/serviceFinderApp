// ========================================
// TELA DE PERFIL
// ========================================
// Informações do usuário logado
// Design profissional sem emojis

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';

type TelaPerfilProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Principal'>;
};

export default function TelaPerfil({ navigation }: TelaPerfilProps) {
    const { usuario, logout } = useAuth();

    const fazerLogout = (): void => {
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        navigation.replace('Login');
                    }
                },
            ]
        );
    };

    const opcoes = [
        { icone: 'person-outline', titulo: 'Editar Perfil', onPress: () => navigation.navigate('EditarPerfil') },
        ...(usuario?.tipo === 'provider' ? [
            { icone: 'briefcase-outline', titulo: 'Meus Serviços', onPress: () => navigation.navigate('MeusServicos') }
        ] : []),
        { icone: 'chatbubbles-outline', titulo: 'Mensagens', onPress: () => navigation.navigate('Conversas') },
        { icone: 'notifications-outline', titulo: 'Notificações', onPress: () => Alert.alert('Em breve', 'Notificações serão implementadas') },
        { icone: 'settings-outline', titulo: 'Configurações', onPress: () => Alert.alert('Em breve', 'Configurações serão implementadas') },
        { icone: 'help-circle-outline', titulo: 'Ajuda', onPress: () => Alert.alert('Ajuda', 'Contacte: suporte@servicefinder.ao') },
    ];

    return (
        <ScrollView style={estilos.container} showsVerticalScrollIndicator={false}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
                <View style={estilos.avatarContainer}>
                    <View style={estilos.avatar}>
                        <Text style={estilos.avatarTexto}>
                            {usuario?.nome?.charAt(0).toUpperCase() || '?'}
                        </Text>
                    </View>
                    <TouchableOpacity style={estilos.editarAvatar}>
                        <Ionicons name="camera" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <Text style={estilos.nome}>{usuario?.nome || 'Usuário'}</Text>
                <View style={estilos.tipoBadge}>
                    <Ionicons
                        name={usuario?.tipo === 'provider' ? 'construct' : 'person'}
                        size={14}
                        color="#007AFF"
                    />
                    <Text style={estilos.tipoTexto}>
                        {usuario?.tipo === 'provider' ? 'Prestador' : 'Cliente'}
                    </Text>
                </View>
            </View>

            {/* Informações */}
            <View style={estilos.secao}>
                <Text style={estilos.secaoTitulo}>Informações</Text>

                <View style={estilos.infoCard}>
                    <View style={estilos.infoItem}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <View style={estilos.infoTextoContainer}>
                            <Text style={estilos.infoLabel}>Email</Text>
                            <Text style={estilos.infoValor}>{usuario?.email || 'N/A'}</Text>
                        </View>
                    </View>

                    <View style={estilos.divisor} />

                    <View style={estilos.infoItem}>
                        <Ionicons name="call-outline" size={20} color="#666" />
                        <View style={estilos.infoTextoContainer}>
                            <Text style={estilos.infoLabel}>Telefone</Text>
                            <Text style={estilos.infoValor}>{usuario?.telefone || 'N/A'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Menu de Opções */}
            <View style={estilos.secao}>
                <Text style={estilos.secaoTitulo}>Menu</Text>

                <View style={estilos.menuCard}>
                    {opcoes.map((opcao, index) => (
                        <React.Fragment key={opcao.titulo}>
                            <TouchableOpacity
                                style={estilos.menuItem}
                                onPress={opcao.onPress}
                                activeOpacity={0.7}
                            >
                                <View style={estilos.menuIconeContainer}>
                                    <Ionicons name={opcao.icone as any} size={22} color="#666" />
                                </View>
                                <Text style={estilos.menuTexto}>{opcao.titulo}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </TouchableOpacity>
                            {index < opcoes.length - 1 && <View style={estilos.divisor} />}
                        </React.Fragment>
                    ))}
                </View>
            </View>

            {/* Botão Sair */}
            <TouchableOpacity style={estilos.botaoSair} onPress={fazerLogout}>
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text style={estilos.textoBotaoSair}>Sair da Conta</Text>
            </TouchableOpacity>

            <Text style={estilos.versao}>ServiceFinder v1.0.0</Text>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    cabecalho: {
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 32,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 88,
        height: 88,
        backgroundColor: '#FFFFFF',
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    avatarTexto: {
        fontSize: 36,
        fontWeight: '700',
        color: '#007AFF',
    },
    editarAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        backgroundColor: '#007AFF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    nome: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    tipoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    tipoTexto: {
        fontSize: 13,
        fontWeight: '500',
        color: '#007AFF',
    },
    secao: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    secaoTitulo: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 14,
    },
    infoTextoContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 2,
    },
    infoValor: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    divisor: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 50,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIconeContainer: {
        width: 36,
        height: 36,
        backgroundColor: '#F8F9FA',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuTexto: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
    },
    botaoSair: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        marginTop: 32,
        backgroundColor: '#FFF0F0',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    textoBotaoSair: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    versao: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 12,
        marginTop: 24,
    },
});
