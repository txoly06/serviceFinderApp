// ========================================
// CONFIGURAÇÃO DE NAVEGAÇÃO
// ========================================
// Rotas e navegação com tabs separadas para Cliente e Prestador

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../tipos';
import { useAuth } from '../contextos/AuthContext';

// Importa as telas
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import TelaInicio from '../telas/TelaInicio';
import TelaDetalhesServico from '../telas/TelaDetalhesServico';
import TelaPerfil from '../telas/TelaPerfil';
import TelaPedidos from '../telas/TelaPedidos';
import TelaDetalhesPedido from '../telas/TelaDetalhesPedido';
import TelaMeusServicos from '../telas/TelaMeusServicos';
import TelaNovoServico from '../telas/TelaNovoServico';
import TelaAvaliar from '../telas/TelaAvaliar';
import TelaConversas from '../telas/TelaConversas';
import TelaChat from '../telas/TelaChat';
import TelaFavoritos from '../telas/TelaFavoritos';
import TelaDashboardProvider from '../telas/TelaDashboardProvider';
import TelaEditarPerfil from '../telas/TelaEditarPerfil';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Estilo comum para tabs
const tabBarStyle = {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 84,
    paddingBottom: 28,
    paddingTop: 12,
};

// ========================================
// TABS DO CLIENTE
// ========================================
function ClientTabs() {
    return (
        <Tab.Navigator
            id="ClientTabs"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#999999',
                tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
                tabBarIcon: ({ focused, color }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Favoritos') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Pedidos') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    } else if (route.name === 'Mensagens') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Inicio" component={TelaInicio} options={{ tabBarLabel: 'Início' }} />
            <Tab.Screen name="Favoritos" component={TelaFavoritos} options={{ tabBarLabel: 'Favoritos' }} />
            <Tab.Screen name="Pedidos" component={TelaPedidos} options={{ tabBarLabel: 'Pedidos' }} />
            <Tab.Screen name="Mensagens" component={TelaConversas} options={{ tabBarLabel: 'Mensagens' }} />
            <Tab.Screen name="Perfil" component={TelaPerfil} options={{ tabBarLabel: 'Perfil' }} />
        </Tab.Navigator>
    );
}

// ========================================
// TABS DO PRESTADOR
// ========================================
function ProviderTabs() {
    return (
        <Tab.Navigator
            id="ProviderTabs"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#999999',
                tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
                tabBarIcon: ({ focused, color }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    } else if (route.name === 'Servicos') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    } else if (route.name === 'Pedidos') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    } else if (route.name === 'Mensagens') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={TelaDashboardProvider} options={{ tabBarLabel: 'Dashboard' }} />
            <Tab.Screen name="Servicos" component={TelaMeusServicos} options={{ tabBarLabel: 'Serviços' }} />
            <Tab.Screen name="Pedidos" component={TelaPedidos} options={{ tabBarLabel: 'Pedidos' }} />
            <Tab.Screen name="Mensagens" component={TelaConversas} options={{ tabBarLabel: 'Mensagens' }} />
            <Tab.Screen name="Perfil" component={TelaPerfil} options={{ tabBarLabel: 'Perfil' }} />
        </Tab.Navigator>
    );
}

// ========================================
// TAB NAVIGATOR PRINCIPAL (Condicional)
// ========================================
function TabNavegador() {
    const { usuario } = useAuth();

    // Retorna tabs baseado no tipo de usuário
    if (usuario?.tipo === 'provider') {
        return <ProviderTabs />;
    }
    return <ClientTabs />;
}

// ========================================
// STACK NAVIGATOR PRINCIPAL
// ========================================
export default function Navegacao() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                id="RootStack"
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#F8F9FA' },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="Login" component={TelaLogin} />
                <Stack.Screen name="Cadastro" component={TelaCadastro} />
                <Stack.Screen name="Principal" component={TabNavegador} />
                <Stack.Screen name="DetalhesServico" component={TelaDetalhesServico} />
                <Stack.Screen name="DetalhesPedido" component={TelaDetalhesPedido} />
                <Stack.Screen name="MeusServicos" component={TelaMeusServicos} />
                <Stack.Screen name="NovoServico" component={TelaNovoServico} />
                <Stack.Screen name="EditarServico" component={TelaNovoServico} />
                <Stack.Screen name="Avaliar" component={TelaAvaliar} />
                <Stack.Screen name="Conversas" component={TelaConversas} />
                <Stack.Screen name="Chat" component={TelaChat} />
                <Stack.Screen name="EditarPerfil" component={TelaEditarPerfil} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

