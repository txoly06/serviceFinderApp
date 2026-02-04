// ========================================
// TELA DE DETALHES DO PEDIDO
// ========================================
// Informações completas de um pedido
// Ações disponíveis por status

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';
import { atualizarStatusPedido, iniciarConversa, verificarAvaliacaoExiste } from '../servicos/api';

type TelaDetalhesPedidoProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'DetalhesPedido'>;
    route: RouteProp<RootStackParamList, 'DetalhesPedido'>;
};

// Status com config visual
const STATUS_CONFIG: { [key: string]: { label: string; cor: string; icone: string; descricao: string } } = {
    pending: { label: 'Pendente', cor: '#FF9500', icone: 'time', descricao: 'Aguardando resposta do prestador' },
    accepted: { label: 'Aceite', cor: '#34C759', icone: 'checkmark-circle', descricao: 'Prestador aceitou o pedido' },
    rejected: { label: 'Rejeitado', cor: '#FF3B30', icone: 'close-circle', descricao: 'Prestador não pode atender' },
    completed: { label: 'Concluído', cor: '#007AFF', icone: 'checkmark-done-circle', descricao: 'Serviço foi concluído' },
    cancelled: { label: 'Cancelado', cor: '#8E8E93', icone: 'ban', descricao: 'Pedido foi cancelado' },
};

export default function TelaDetalhesPedido({ navigation, route }: TelaDetalhesPedidoProps) {
    const { pedido } = route.params;
    const { token, usuario } = useAuth();
    const [carregando, setCarregando] = useState(false);
    const [statusAtual, setStatusAtual] = useState(pedido.status);
    const [jaAvaliou, setJaAvaliou] = useState(false);

    const statusConfig = STATUS_CONFIG[statusAtual] || STATUS_CONFIG.pending;

    // Verificar se já avaliou este pedido
    useEffect(() => {
        if (statusAtual === 'completed' && usuario?.tipo !== 'provider') {
            verificarAvaliacaoExiste(pedido._id).then(exists => {
                setJaAvaliou(exists);
            });
        }
    }, [pedido._id, statusAtual]);

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatarHora = (data: string) => {
        return new Date(data).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const cancelarPedido = async () => {
        Alert.alert(
            'Cancelar Pedido',
            'Tem certeza que deseja cancelar este pedido?',
            [
                { text: 'Não', style: 'cancel' },
                {
                    text: 'Sim, Cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setCarregando(true);
                            await atualizarStatusPedido(token!, pedido._id, 'cancelled');
                            setStatusAtual('cancelled');
                            Alert.alert('Sucesso', 'Pedido cancelado');
                        } catch (erro: any) {
                            Alert.alert('Erro', erro.message);
                        } finally {
                            setCarregando(false);
                        }
                    },
                },
            ]
        );
    };

    const aceitarPedido = async () => {
        try {
            setCarregando(true);
            await atualizarStatusPedido(token!, pedido._id, 'accepted');
            setStatusAtual('accepted');
            Alert.alert('Sucesso', 'Pedido aceite');
        } catch (erro: any) {
            Alert.alert('Erro', erro.message);
        } finally {
            setCarregando(false);
        }
    };

    const rejeitarPedido = async () => {
        try {
            setCarregando(true);
            await atualizarStatusPedido(token!, pedido._id, 'rejected');
            setStatusAtual('rejected');
            Alert.alert('Rejeitado', 'Pedido foi rejeitado');
        } catch (erro: any) {
            Alert.alert('Erro', erro.message);
        } finally {
            setCarregando(false);
        }
    };

    const completarPedido = async () => {
        try {
            setCarregando(true);
            await atualizarStatusPedido(token!, pedido._id, 'completed');
            setStatusAtual('completed');
            Alert.alert('Concluído', 'Serviço marcado como concluído');
        } catch (erro: any) {
            Alert.alert('Erro', erro.message);
        } finally {
            setCarregando(false);
        }
    };

    // Verifica se o utilizador é o prestador
    const isProvider = usuario?.id === pedido.providerId?._id || usuario?.tipo === 'provider';

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
                    <Text style={estilos.headerTitulo}>Detalhes do Pedido</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Status Card */}
                <View style={[estilos.statusCard, { backgroundColor: statusConfig.cor + '15' }]}>
                    <View style={[estilos.statusIcone, { backgroundColor: statusConfig.cor }]}>
                        <Ionicons name={statusConfig.icone as any} size={28} color="#FFFFFF" />
                    </View>
                    <Text style={[estilos.statusLabel, { color: statusConfig.cor }]}>
                        {statusConfig.label}
                    </Text>
                    <Text style={estilos.statusDescricao}>{statusConfig.descricao}</Text>
                </View>

                {/* Info do Serviço */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Serviço</Text>
                    <View style={estilos.infoCard}>
                        <Text style={estilos.servicoNome}>{pedido.serviceId?.title || 'Serviço'}</Text>
                        <Text style={estilos.servicoCategoria}>{pedido.serviceId?.category}</Text>
                    </View>
                </View>

                {/* Info do Prestador/Cliente */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>
                        {isProvider ? 'Cliente' : 'Prestador'}
                    </Text>
                    <View style={estilos.infoCard}>
                        <View style={estilos.pessoaInfo}>
                            <View style={estilos.avatar}>
                                <Text style={estilos.avatarTexto}>
                                    {(isProvider ? pedido.clientId?.name : pedido.providerId?.name)?.charAt(0) || '?'}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={estilos.pessoaNome}>
                                    {isProvider ? pedido.clientId?.name : pedido.providerId?.name}
                                </Text>
                                {(isProvider ? pedido.clientId?.phone : pedido.providerId?.phone) && (
                                    <Text style={estilos.pessoaTelefone}>
                                        {isProvider ? pedido.clientId?.phone : pedido.providerId?.phone}
                                    </Text>
                                )}
                                <View style={estilos.contactosBotoes}>
                                    <TouchableOpacity
                                        style={estilos.contactarBotao}
                                        onPress={async () => {
                                            try {
                                                const outroId = isProvider ? pedido.clientId?._id : pedido.providerId?._id;
                                                const outroNome = isProvider ? pedido.clientId?.name : pedido.providerId?.name;
                                                if (!outroId) return;
                                                const resp = await iniciarConversa(token!, outroId, pedido.serviceId?._id);
                                                navigation.navigate('Chat', {
                                                    conversationId: resp.data.conversation._id,
                                                    nomeOutro: outroNome || 'Usuário'
                                                });
                                            } catch (e: any) {
                                                Alert.alert('Erro', e.message || 'Não foi possível iniciar conversa');
                                            }
                                        }}
                                    >
                                        <Ionicons name="chatbubble-outline" size={16} color="#007AFF" />
                                        <Text style={estilos.contactarTexto}>Mensagem</Text>
                                    </TouchableOpacity>
                                    {(isProvider ? pedido.clientId?.phone : pedido.providerId?.phone) && (
                                        <TouchableOpacity
                                            style={[estilos.contactarBotao, { marginLeft: 12, backgroundColor: '#34C75915' }]}
                                            onPress={() => {
                                                const phone = isProvider ? pedido.clientId?.phone : pedido.providerId?.phone;
                                                if (phone) Linking.openURL(`tel:${phone}`);
                                            }}
                                        >
                                            <Ionicons name="call-outline" size={16} color="#34C759" />
                                            <Text style={[estilos.contactarTexto, { color: '#34C759' }]}>Ligar</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Detalhes do Pedido */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Detalhes</Text>
                    <View style={estilos.infoCard}>
                        <View style={estilos.detalheItem}>
                            <Ionicons name="calendar-outline" size={20} color="#666" />
                            <View style={estilos.detalheTexto}>
                                <Text style={estilos.detalheLabel}>Data Agendada</Text>
                                <Text style={estilos.detalheValor}>{formatarData(pedido.scheduledDate)}</Text>
                            </View>
                        </View>

                        <View style={estilos.divisor} />

                        <View style={estilos.detalheItem}>
                            <Ionicons name="time-outline" size={20} color="#666" />
                            <View style={estilos.detalheTexto}>
                                <Text style={estilos.detalheLabel}>Horário</Text>
                                <Text style={estilos.detalheValor}>{formatarHora(pedido.scheduledDate)}</Text>
                            </View>
                        </View>

                        {pedido.proposedPrice && (
                            <>
                                <View style={estilos.divisor} />
                                <View style={estilos.detalheItem}>
                                    <Ionicons name="cash-outline" size={20} color="#666" />
                                    <View style={estilos.detalheTexto}>
                                        <Text style={estilos.detalheLabel}>Preço Proposto</Text>
                                        <Text style={estilos.detalheValor}>{pedido.proposedPrice?.toLocaleString()} Kz</Text>
                                    </View>
                                </View>
                            </>
                        )}

                        {pedido.location?.address && (
                            <>
                                <View style={estilos.divisor} />
                                <View style={estilos.detalheItem}>
                                    <Ionicons name="location-outline" size={20} color="#666" />
                                    <View style={estilos.detalheTexto}>
                                        <Text style={estilos.detalheLabel}>Localização</Text>
                                        <Text style={estilos.detalheValor}>{pedido.location.address}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                {/* Descrição */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Descrição</Text>
                    <View style={estilos.infoCard}>
                        <Text style={estilos.descricaoTexto}>{pedido.description}</Text>
                    </View>
                </View>

                {/* ID do Pedido */}
                <View style={estilos.secao}>
                    <Text style={estilos.pedidoId}>Pedido #{pedido._id?.slice(-8).toUpperCase()}</Text>
                    <Text style={estilos.pedidoData}>
                        Criado em {formatarData(pedido.createdAt)}
                    </Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Botões de Ação */}
            {carregando ? (
                <View style={estilos.acoesContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <>
                    {/* Ações do Cliente */}
                    {!isProvider && statusAtual === 'pending' && (
                        <View style={estilos.acoesContainer}>
                            <TouchableOpacity style={estilos.botaoCancelar} onPress={cancelarPedido}>
                                <Text style={estilos.botaoCancelarTexto}>Cancelar Pedido</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Ações do Prestador */}
                    {isProvider && statusAtual === 'pending' && (
                        <View style={estilos.acoesContainer}>
                            <TouchableOpacity style={estilos.botaoRejeitar} onPress={rejeitarPedido}>
                                <Text style={estilos.botaoRejeitarTexto}>Rejeitar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={estilos.botaoAceitar} onPress={aceitarPedido}>
                                <Text style={estilos.botaoAceitarTexto}>Aceitar</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Marcar como Concluído (Apenas Prestador) */}
                    {isProvider && statusAtual === 'accepted' && (
                        <View style={estilos.acoesContainer}>
                            <TouchableOpacity style={estilos.botaoCompletar} onPress={completarPedido}>
                                <Text style={estilos.botaoCompletarTexto}>Marcar como Concluído</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Avaliar Serviço (cliente após conclusão, apenas se ainda não avaliou) */}
                    {!isProvider && statusAtual === 'completed' && !jaAvaliou && (
                        <View style={estilos.acoesContainer}>
                            <TouchableOpacity
                                style={estilos.botaoAvaliar}
                                onPress={() => navigation.navigate('Avaliar', { pedido })}
                            >
                                <Ionicons name="star" size={20} color="#FFFFFF" />
                                <Text style={estilos.botaoAvaliarTexto}>Avaliar Serviço</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {!isProvider && statusAtual === 'completed' && jaAvaliou && (
                        <View style={estilos.acoesContainer}>
                            <View style={[estilos.botaoAvaliar, { backgroundColor: '#34C759' }]}>
                                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                <Text style={estilos.botaoAvaliarTexto}>Já Avaliado</Text>
                            </View>
                        </View>
                    )}
                </>
            )}
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
    statusCard: {
        margin: 24,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    statusIcone: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusLabel: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    statusDescricao: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    secao: {
        paddingHorizontal: 24,
        marginBottom: 20,
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
        padding: 16,
    },
    servicoNome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    servicoCategoria: {
        fontSize: 14,
        color: '#666666',
    },
    pessoaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        backgroundColor: '#E8F4FF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTexto: {
        fontSize: 18,
        fontWeight: '600',
        color: '#007AFF',
    },
    pessoaNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    contactarBotao: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    contactarTexto: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    detalheItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 4,
    },
    detalheTexto: {
        flex: 1,
    },
    detalheLabel: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 2,
    },
    detalheValor: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    divisor: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
        marginLeft: 34,
    },
    descricaoTexto: {
        fontSize: 15,
        color: '#1A1A1A',
        lineHeight: 24,
    },
    pedidoId: {
        fontSize: 13,
        color: '#999999',
        textAlign: 'center',
    },
    pedidoData: {
        fontSize: 12,
        color: '#C7C7CC',
        textAlign: 'center',
        marginTop: 4,
    },
    acoesContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 24,
        paddingBottom: 32,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 12,
    },
    botaoCancelar: {
        flex: 1,
        backgroundColor: '#FFF0F0',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botaoCancelarTexto: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    botaoRejeitar: {
        flex: 1,
        backgroundColor: '#FFF0F0',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botaoRejeitarTexto: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
    botaoAceitar: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botaoAceitarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    botaoCompletar: {
        flex: 1,
        backgroundColor: '#34C759',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    botaoCompletarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    botaoAvaliar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFB800',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    botaoAvaliarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    pessoaTelefone: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    contactosBotoes: {
        flexDirection: 'row',
        marginTop: 12,
    },
});

