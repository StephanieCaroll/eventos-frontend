# Endpoints Corretos do Backend

## Base URL
```javascript
const API_BASE = 'http://localhost:8080';
```

## Endpoints Implementados e Corrigidos

### 1. **StandController (/api/stand)**

| Método | Endpoint | Função Frontend | Parâmetros |
|--------|----------|----------------|------------|
| `GET` | `/api/stand` | `getAllStands()` | - |
| `POST` | `/api/stand` | `createStand()` | `{codigo, userId, eventoId}` |
| `GET` | `/api/stand/selecao` | `getStandsForSelection()` | `?eventoId=1&userId=email@user.com` |
| `GET` | `/api/stand/disponiveis-evento/{eventId}` | `getAvailableStands()` | Path param: eventId |
| `POST` | `/api/stand/processar-reserva` | `processReservation()` | `{standId, eventoId, usuarioId, operacao, observacoes}` |
| `GET` | `/api/stand/registered` | `getRegisteredStands()` | `?userId=email@user.com` |
| `GET` | `/api/stand/usuario` | `getUserStandsByEvent()` | `?userId=email&eventoId=1` |
| `GET` | `/api/stand/{id}/info` | `getStandInfo()` | Path param: id |
| `PUT` | `/api/stand/{id}` | `updateStand()` | Path param: id + body |

### 2. **StandSelectionController (/api/stand-selection)**

| Método | Endpoint | Função Frontend | Parâmetros |
|--------|----------|----------------|------------|
| `GET` | `/api/stand-selection/grid` | `getStandGrid()` | - |
| `POST` | `/api/stand-selection/toggle` | `toggleStandSelection()` | `{standId, eventoId, usuarioId}` |
| `POST` | `/api/stand-selection/batch` | `batchOperation()` | `{standIds[], eventoId, usuarioId, operacao, observacoes}` |

### 3. **EventoController (/api/evento)**

| Método | Endpoint | Função Frontend | Parâmetros |
|--------|----------|----------------|------------|
| `GET` | `/api/evento` | `getEventos()` | - |
| `GET` | `/api/evento/{eventId}/stands-disponiveis` | `getEventAvailableStands()` | Path param: eventId |

## Exemplos de Uso Correto

### 1. **Buscar Stands para Seleção Visual**
```javascript
// Com parâmetros opcionais
GET http://localhost:8080/api/stand/selecao?eventoId=1&userId=email@user.com

// Sem parâmetros (todos os stands)
GET http://localhost:8080/api/stand/selecao
```

### 2. **Processar Reserva Individual**
```javascript
POST http://localhost:8080/api/stand/processar-reserva
Content-Type: application/json
Authorization: Bearer {token}

{
  "standId": 1,
  "eventoId": 2,
  "usuarioId": "email@user.com",
  "operacao": "RESERVAR",
  "observacoes": "Reserva para exposição"
}
```

### 3. **Operações em Lote**
```javascript
POST http://localhost:8080/api/stand-selection/batch
Content-Type: application/json
Authorization: Bearer {token}

{
  "standIds": [1, 2, 3],
  "eventoId": 2,
  "usuarioId": "email@user.com",
  "operacao": "RESERVAR",
  "observacoes": "Reserva múltipla via interface"
}
```

### 4. **Buscar Grid Visual**
```javascript
GET http://localhost:8080/api/stand-selection/grid
Authorization: Bearer {token}
```

### 5. **Criar Novo Stand**
```javascript
POST http://localhost:8080/api/stand
Content-Type: application/json
Authorization: Bearer {token}

{
  "codigo": "A1",
  "userId": "email@user.com",
  "eventoId": 1
}
```

## Estruturas de Dados

### Stand Request/Response
```javascript
{
  "id": 1,
  "codigo": "A1",
  "disponivel": true,
  "eventoId": 2,
  "eventoNome": "Tech Conference 2025",
  "usuarioId": "email@user.com",
  "usuarioNome": "João Silva",
  "fileira": "A",
  "numero": 1,
  "descricao": "Stand para tecnologia"
}
```

### Batch Operation Request
```javascript
{
  "standIds": [1, 2, 3],
  "eventoId": 2,
  "usuarioId": "email@user.com",
  "operacao": "RESERVAR", // ou "LIBERAR"
  "observacoes": "Operação em lote via interface"
}
```

## Autenticação

Todas as requisições (exceto login) devem incluir:
```javascript
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## Status Codes Esperados

- `200 OK` - Operação bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Token inválido ou ausente
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro do servidor

## Configuração no Frontend

### StandSelectionService.js
```javascript
const API_BASE_URL = 'http://localhost:8080';

// Exemplo de função corrigida
getStandsForSelection: async (eventoId = null, userId = null) => {
  try {
    let url = `${API_BASE_URL}/api/stand/selecao`;
    const params = new URLSearchParams();
    
    if (eventoId) params.append('eventoId', eventoId);
    if (userId) params.append('userId', userId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url, getAxiosConfig());
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar stands:', error);
    throw error;
  }
}
```

## Testes Recomendados

### 1. Teste Manual via cURL
```bash
# Listar stands
curl -H "Authorization: Bearer {token}" \
     http://localhost:8080/api/stand

# Seleção com filtros
curl -H "Authorization: Bearer {token}" \
     "http://localhost:8080/api/stand/selecao?eventoId=1&userId=email@user.com"
```

### 2. Teste via Browser DevTools
```javascript
// No console do navegador
fetch('http://localhost:8080/api/stand/selecao', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log);
```

Todos os endpoints foram corrigidos e padronizados para usar a base URL correta! 🚀