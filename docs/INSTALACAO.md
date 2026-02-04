# Guia de Instalação e Setup - ServiceFinder App

**Projeto**: ServiceFinder App  
**Data**: 24/01/2026  
**Versão**: 1.0

---

## 📋 PRÉ-REQUISITOS

### Software Necessário

1. **Node.js** (versão 16 ou superior)
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version`

2. **npm** ou **yarn** (gerenciador de pacotes)
   - npm vem com Node.js
   - yarn (opcional): `npm install -g yarn`
   - Verificar: `npm --version` ou `yarn --version`

3. **Git** (controle de versão)
   - Download: https://git-scm.com/
   - Verificar: `git --version`

4. **Editor de Código** (recomendado)
   - VS Code: https://code.visualstudio.com/
   - Extensões recomendadas:
     - ES7+ React/Redux/React-Native snippets
     - Prettier
     - ESLint
     - React Native Tools

5. **Expo CLI** (para desenvolvimento React Native)
   ```bash
   npm install -g expo-cli
   ```

6. **Aplicativo Expo Go** (para testar no celular)
   - iOS: App Store
   - Android: Google Play Store

---

## 🚀 OPÇÃO 1: SETUP COM EXPO (RECOMENDADO PARA MVP)

### Passo 1: Criar Projeto

```bash
# Navegar até a pasta do projeto
cd /Users/nurityoliveiira/Desktop/Claude\ Desketop/ServiceFinderApp

# Criar projeto React Native com Expo
npx create-expo-app mobile-app

# Entrar na pasta do projeto
cd mobile-app
```

### Passo 2: Instalar Dependências

```bash
# Navegação
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# UI Components
npm install react-native-paper
npx expo install react-native-vector-icons

# Storage
npx expo install @react-native-async-storage/async-storage

# Formulários e Validação
npm install react-hook-form
npm install yup

# Outros
npx expo install expo-image-picker
npx expo install expo-location
```

### Passo 3: Estruturar Projeto

```bash
# Criar estrutura de pastas
mkdir -p src/{components,screens,navigation,services,contexts,hooks,utils,styles,assets}
mkdir -p src/components/{common,forms,layout}
mkdir -p src/screens/{auth,home,services,profile,chat,search}
mkdir -p src/assets/{images,icons}
```

### Passo 4: Iniciar Projeto

```bash
# Iniciar servidor de desenvolvimento
npm start
# ou
npx expo start
```

### Passo 5: Testar no Celular

1. Abrir app **Expo Go** no celular
2. Escanear QR Code que aparece no terminal
3. App será carregado no celular

---

## 🔧 OPÇÃO 2: SETUP COM REACT NATIVE CLI (AVANÇADO)

⚠️ **Não recomendado para este projeto devido ao prazo curto**

### Android
- Instalar Android Studio
- Configurar Android SDK
- Configurar emulador

### iOS (apenas macOS)
- Instalar Xcode
- Instalar CocoaPods
- Configurar simulador

---

## 📦 ESTRUTURA INICIAL DO PROJETO

### Arquivo: App.js (Básico)

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
```

### Arquivo: src/navigation/AppNavigator.js

```javascript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';

// Importar telas
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {!user ? (
        // Telas de autenticação
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Telas principais
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}
```

---

## 🎨 CONFIGURAÇÃO DE TEMA

### Arquivo: src/styles/theme.js

```javascript
export const colors = {
  primary: '#6200ee',
  secondary: '#03dac6',
  background: '#ffffff',
  surface: '#ffffff',
  error: '#b00020',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
};
```

---

## 📱 DADOS MOCKADOS (PARA MVP)

### Arquivo: src/data/mockData.js

```javascript
export const mockServices = [
  {
    id: '1',
    title: 'Eletricista Residencial',
    providerId: 'p1',
    providerName: 'João Silva',
    category: 'Reparos Domésticos',
    description: 'Serviços elétricos residenciais e comerciais',
    rating: 4.8,
    reviewCount: 127,
    priceRange: { min: 50, max: 200 },
    image: 'https://via.placeholder.com/300x200',
    location: 'São Paulo, SP',
  },
  {
    id: '2',
    title: 'Encanador 24h',
    providerId: 'p2',
    providerName: 'Maria Santos',
    category: 'Reparos Domésticos',
    description: 'Reparos e instalações hidráulicas',
    rating: 4.9,
    reviewCount: 89,
    priceRange: { min: 80, max: 300 },
    image: 'https://via.placeholder.com/300x200',
    location: 'Rio de Janeiro, RJ',
  },
  // Adicionar mais serviços...
];

export const mockCategories = [
  { id: 'cat1', name: 'Reparos Domésticos', icon: 'hammer' },
  { id: 'cat2', name: 'Beleza e Estética', icon: 'content-cut' },
  { id: 'cat3', name: 'Tecnologia', icon: 'laptop' },
  { id: 'cat4', name: 'Educação', icon: 'school' },
  { id: 'cat5', name: 'Saúde', icon: 'heart' },
  { id: 'cat6', name: 'Limpeza', icon: 'broom' },
];

export const mockUser = {
  id: 'u1',
  name: 'Usuário Teste',
  email: 'usuario@teste.com',
  phone: '(11) 98765-4321',
  avatar: 'https://via.placeholder.com/150',
  location: 'São Paulo, SP',
  userType: 'client',
};
```

---

## 🔍 VERIFICAÇÃO DE INSTALAÇÃO

### Checklist

- [ ] Node.js instalado
- [ ] npm/yarn funcionando
- [ ] Expo CLI instalado
- [ ] Projeto criado
- [ ] Dependências instaladas
- [ ] Estrutura de pastas criada
- [ ] App rodando sem erros
- [ ] App abre no celular (Expo Go)

### Comandos de Verificação

```bash
# Verificar versões
node --version
npm --version
expo --version

# Listar dependências instaladas
npm list --depth=0

# Ver status do projeto
npm run android  # Para testar no Android
npm run ios      # Para testar no iOS (apenas macOS)
npm start        # Iniciar com Expo
```

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### Problema: Erro ao instalar dependências
**Solução**:
```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules e reinstalar
rm -rf node_modules
rm package-lock.json
npm install
```

### Problema: App não conecta ao Expo
**Solução**:
- Certifique-se de que celular e computador estão na mesma rede WiFi
- Desabilite VPN
- Reinicie o servidor: `npm start`

### Problema: Erro de permissões
**Solução** (macOS/Linux):
```bash
sudo chown -R $USER /usr/local/lib/node_modules
```

### Problema: Metro Bundler não inicia
**Solução**:
```bash
npx expo start --clear
```

---

## 📚 RECURSOS ÚTEIS

### Documentação
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- React Native Paper: https://reactnativepaper.com/

### Tutoriais
- Expo Getting Started: https://docs.expo.dev/get-started/introduction/
- React Navigation Tutorial: https://reactnavigation.org/docs/getting-started

---

## 🎯 PRÓXIMOS PASSOS

Após instalação:

1. ✅ Setup concluído
2. ⏳ Criar primeira tela (Login)
3. ⏳ Implementar navegação
4. ⏳ Adicionar componentes comuns
5. ⏳ Implementar telas principais
6. ⏳ Integrar dados mockados
7. ⏳ Testar no dispositivo

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verificar documentação oficial do Expo
2. Procurar no Stack Overflow
3. Verificar issues no GitHub do React Native
4. Consultar comunidade React Native Brasil

---

**Documento elaborado em**: 24/01/2026  
**Última atualização**: 24/01/2026
