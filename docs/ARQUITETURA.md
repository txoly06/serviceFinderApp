# Arquitetura do Sistema - ServiceFinder App

**Projeto**: ServiceFinder App  
**Versão**: 1.0  
**Data**: 24/01/2026

---

## 1. VISÃO GERAL DA ARQUITETURA

### Tipo de Arquitetura
- **Cliente-Servidor** com **Arquitetura em Camadas**
- **Mobile First** com React Native

### Componentes Principais
```
┌─────────────────────────────────────────┐
│         CAMADA DE APRESENTAÇÃO          │
│         (React Native - Mobile)         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  iOS    │  │ Android │  │  Expo   │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│        CAMADA DE COMUNICAÇÃO            │
│           (REST API / HTTP)             │
│         (WebSocket - Chat)              │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         CAMADA DE APLICAÇÃO             │
│         (Backend - Node.js)             │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │   API    │  │  Socket  │  │  Auth  ││
│  │  Server  │  │   .io    │  │Firebase││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│       CAMADA DE PERSISTÊNCIA            │
│  ┌────────────┐      ┌────────────┐    │
│  │  MongoDB   │      │  Firebase  │    │
│  │    ou      │      │  Storage   │    │
│  │ PostgreSQL │      │            │    │
│  └────────────┘      └────────────┘    │
└─────────────────────────────────────────┘
```

---

## 2. ARQUITETURA MOBILE (React Native)

### Estrutura de Pastas

```
src/
├── assets/              # Imagens, ícones, fontes
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/          # Componentes reutilizáveis
│   ├── common/         # Botões, inputs, cards
│   ├── forms/          # Formulários
│   └── layout/         # Header, footer, containers
│
├── screens/            # Telas do app
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── ForgotPasswordScreen.js
│   ├── home/
│   │   └── HomeScreen.js
│   ├── services/
│   │   ├── ServiceListScreen.js
│   │   ├── ServiceDetailScreen.js
│   │   └── ServiceRequestScreen.js
│   ├── profile/
│   │   ├── ProfileScreen.js
│   │   └── EditProfileScreen.js
│   ├── chat/
│   │   ├── ChatListScreen.js
│   │   └── ChatScreen.js
│   └── search/
│       └── SearchScreen.js
│
├── navigation/         # Configuração de rotas
│   ├── AppNavigator.js
│   ├── AuthNavigator.js
│   └── MainNavigator.js
│
├── services/          # Serviços e API
│   ├── api/
│   │   ├── apiClient.js
│   │   ├── authApi.js
│   │   ├── servicesApi.js
│   │   └── userApi.js
│   ├── storage/       # AsyncStorage
│   └── firebase/      # Firebase config
│
├── contexts/          # Context API
│   ├── AuthContext.js
│   ├── UserContext.js
│   └── ThemeContext.js
│
├── hooks/             # Custom hooks
│   ├── useAuth.js
│   ├── useApi.js
│   └── useDebounce.js
│
├── utils/             # Utilitários
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
│
├── styles/            # Estilos globais
│   ├── colors.js
│   ├── typography.js
│   └── spacing.js
│
└── App.js             # Arquivo principal
```

### Padrões de Código

#### 1. Componentes Funcionais com Hooks
```javascript
// Exemplo: ServiceCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const ServiceCard = ({ service, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(service.id)}>
      <View style={styles.card}>
        <Image source={{ uri: service.image }} style={styles.image} />
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.rating}>⭐ {service.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceCard;
```

#### 2. Context para Estado Global
```javascript
// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    // Lógica de login
  };

  const logout = async () => {
    // Lógica de logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 3. Custom Hooks
```javascript
// useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

---

## 3. ARQUITETURA BACKEND

### Estrutura do Backend (Node.js + Express)

```
backend/
├── src/
│   ├── config/           # Configurações
│   │   ├── database.js
│   │   ├── firebase.js
│   │   └── env.js
│   │
│   ├── models/           # Modelos de dados
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Request.js
│   │   └── Review.js
│   │
│   ├── controllers/      # Controladores
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── serviceController.js
│   │   └── reviewController.js
│   │
│   ├── routes/           # Rotas da API
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── services.js
│   │   └── reviews.js
│   │
│   ├── middlewares/      # Middlewares
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   │
│   ├── services/         # Lógica de negócio
│   │   ├── authService.js
│   │   ├── emailService.js
│   │   └── notificationService.js
│   │
│   ├── utils/            # Utilitários
│   │   ├── jwt.js
│   │   └── validators.js
│   │
│   └── app.js            # Configuração Express
│
├── tests/                # Testes
├── package.json
└── .env
```

### APIs REST

#### Endpoints Principais

**Autenticação**
```
POST   /api/auth/register      # Registrar usuário
POST   /api/auth/login         # Login
POST   /api/auth/logout        # Logout
POST   /api/auth/refresh       # Refresh token
POST   /api/auth/forgot        # Esqueci senha
```

**Usuários**
```
GET    /api/users/:id          # Obter perfil
PUT    /api/users/:id          # Atualizar perfil
GET    /api/users/:id/services # Serviços do usuário
```

**Serviços**
```
GET    /api/services           # Listar serviços
GET    /api/services/:id       # Detalhes do serviço
POST   /api/services           # Criar serviço
PUT    /api/services/:id       # Atualizar serviço
DELETE /api/services/:id       # Deletar serviço
GET    /api/services/search    # Buscar serviços
```

**Solicitações**
```
POST   /api/requests           # Criar solicitação
GET    /api/requests/:id       # Detalhes
PUT    /api/requests/:id       # Atualizar status
GET    /api/requests/user/:id  # Por usuário
```

**Avaliações**
```
POST   /api/reviews            # Criar avaliação
GET    /api/reviews/service/:id # Por serviço
GET    /api/reviews/user/:id   # Por usuário
```

---

## 4. BANCO DE DADOS

### Modelo de Dados (MongoDB - Exemplo)

#### Collection: Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  userType: String (enum: ['client', 'provider']),
  avatar: String (URL),
  location: {
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection: Services
```javascript
{
  _id: ObjectId,
  providerId: ObjectId (ref: Users),
  title: String,
  description: String,
  category: String,
  subcategory: String,
  priceRange: {
    min: Number,
    max: Number
  },
  images: [String], // URLs
  availability: {
    days: [String],
    hours: String
  },
  rating: {
    average: Number,
    count: Number
  },
  location: {
    city: String,
    state: String
  },
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection: ServiceRequests
```javascript
{
  _id: ObjectId,
  clientId: ObjectId (ref: Users),
  serviceId: ObjectId (ref: Services),
  providerId: ObjectId (ref: Users),
  description: String,
  images: [String],
  scheduledDate: Date,
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: String (enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled']),
  proposedPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection: Reviews
```javascript
{
  _id: ObjectId,
  requestId: ObjectId (ref: ServiceRequests),
  clientId: ObjectId (ref: Users),
  serviceId: ObjectId (ref: Services),
  providerId: ObjectId (ref: Users),
  rating: Number (1-5),
  comment: String,
  categories: {
    quality: Number,
    punctuality: Number,
    communication: Number
  },
  images: [String],
  response: String,
  createdAt: Date
}
```

---

## 5. FLUXOS PRINCIPAIS

### Fluxo de Autenticação
```
1. Usuário → Insere credenciais
2. App → POST /api/auth/login
3. Backend → Valida credenciais
4. Backend → Gera JWT token
5. Backend → Retorna token + dados do usuário
6. App → Armazena token (AsyncStorage)
7. App → Redireciona para Home
```

### Fluxo de Busca de Serviços
```
1. Usuário → Digita termo ou seleciona categoria
2. App → GET /api/services/search?q=termo&category=x
3. Backend → Busca no banco de dados
4. Backend → Retorna lista de serviços
5. App → Exibe resultados
6. Usuário → Clica em serviço
7. App → Navega para tela de detalhes
```

### Fluxo de Solicitação de Serviço
```
1. Usuário → Preenche formulário de solicitação
2. App → POST /api/requests
3. Backend → Cria registro de solicitação
4. Backend → Envia notificação ao prestador
5. Prestador → Recebe notificação
6. Prestador → Aceita ou recusa
7. App → Atualiza status da solicitação
8. Backend → Notifica cliente
```

---

## 6. SEGURANÇA

### Autenticação JWT
```javascript
// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Criptografia de Senhas
```javascript
const bcrypt = require('bcrypt');

// Hash de senha
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Verificar senha
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

---

## 7. INTEGRAÇÕES

### Firebase
- **Authentication**: Login com Google, Facebook
- **Cloud Messaging**: Notificações push
- **Storage**: Upload de imagens

### Serviços Externos (Opcionais)
- **Google Maps API**: Localização e mapas
- **SendGrid**: Envio de emails
- **Twilio**: SMS de verificação

---

## 8. PARA MVP (SIMPLIFICADO)

### O que implementar primeiro:
1. ✅ Estrutura de pastas
2. ✅ Navegação básica
3. ✅ Telas principais (UI)
4. ✅ Dados mockados (JSON local)
5. ✅ AsyncStorage para autenticação simples

### O que deixar para depois:
- Backend real
- Banco de dados
- APIs REST completas
- Autenticação real
- Chat em tempo real
- Notificações push

---

**Documento elaborado em**: 24/01/2026
