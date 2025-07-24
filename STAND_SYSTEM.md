# Sistema de Seleção Visual de Stands

## Visão Geral

Este sistema permite que administradores e expositores gerenciem stands de eventos através de uma interface visual intuitiva, substituindo a digitação manual por um grid visual interativo.

## Componentes Principais

### 1. StandVisualSelection
Componente principal que fornece a interface visual para seleção de stands.

**Características:**
- Grid visual customizado (fileiras A-I, números 1-4)
- Stands disponíveis: A1-A4, B1-B4, C1-C4, D1-D2, E1-E2, F1-F2, G1-G3, H1-H3, I1-I3
- Sistema de cores: Verde (disponível), Vermelho (ocupado), Azul (selecionado)
- Tooltip com informações detalhadas do stand
- Filtros por evento, disponibilidade e busca
- Seleção múltipla com operações em lote
- Modo gerenciamento com salvamento automático

### 2. StandSelectionService
Serviço responsável pelas chamadas da API.

**Endpoints utilizados:**
- `GET /api/stand/selecao` - Lista stands para seleção
- `POST /api/stand/processar-reserva` - Processa reservas/liberações
- `POST /api/stand-selection/batch` - Operações em lote
- `GET /api/evento` - Lista eventos disponíveis

### 3. useStandSelection (Hook)
Hook personalizado para gerenciar estado dos stands.

**Funcionalidades:**
- Controle de seleção de stands
- Processamento de reservas/liberações
- Gerenciamento de loading e erros
- Sincronização com backend

## Estrutura de Dados

### StandSelectionDTO
```javascript
{
  "id": 1,
  "codigo": "A1",
  "disponivel": true,
  "eventoId": 2,
  "eventoNome": "Tech Conference 2025",
  "usuarioId": null,
  "usuarioNome": null,
  "fileira": "A",
  "numero": 1
}
```

### Operações de Reserva
```javascript
{
  "standId": 1,
  "eventoId": 2,
  "usuarioId": 3,
  "operacao": "RESERVAR", // ou "LIBERAR"
  "observacoes": "Reserva para exposição"
}
```

## Interface do Usuário

### Grid Visual
- **Grid customizado** organizados por fileira (A-I) e número (1-4)
- **Stands disponíveis:** A1-A4, B1-B4, C1-C4, D1-D2, E1-E2, F1-F2, G1-G3, H1-H3, I1-I3
- **Cores indicativas:**
  - 🟢 Verde: Stand disponível
  - 🔴 Vermelho: Stand ocupado
  - 🔵 Azul: Stand selecionado
- **Interações:**
  - Clique para selecionar/desselecionar
  - Hover para tooltip informativo
  - Seleção múltipla
- **Modo Gerenciamento:**
  - Salvamento automático das alterações
  - Retorno à página anterior após salvar
  - Design consistente com o restante da aplicação

### Filtros e Busca
- **Filtro por evento:** Dropdown com todos os eventos
- **Filtro por disponibilidade:** Todos/Disponíveis/Ocupados
- **Busca por código:** Campo de texto para buscar stands específicos

### Painel de Controle
- **Stands selecionados:** Lista com stands atualmente selecionados
- **Ações em lote:** Botões para selecionar todos disponíveis ou limpar seleção
- **Operações:** Botões para reservar ou liberar stands selecionados
- **Observações:** Campo opcional para comentários

## Estados e Variáveis

### Estados Principais
```javascript
const [standsData, setStandsData] = useState([]);        // Dados dos stands
const [selectedStands, setSelectedStands] = useState(new Set()); // Stands selecionados
const [currentEvent, setCurrentEvent] = useState('');    // Evento filtrado
const [isLoading, setIsLoading] = useState(false);       // Estado de loading
const [error, setError] = useState('');                  // Mensagens de erro
```

### Funções Principais
- `toggleStandSelection(standId)` - Alterna seleção de um stand
- `processReservation(operation, eventoId, observacoes)` - Processa operações
- `filterStands()` - Aplica filtros aos stands
- `fetchStands()` - Busca dados do backend

## Integração com Backend

### Endpoints Necessários
1. **GET /api/stand/selecao**
   - Retorna lista de stands com status de disponibilidade
   
2. **POST /api/stand/processar-reserva**
   - Processa reserva individual de stand
   
3. **POST /api/stand-selection/batch**
   - Processa múltiplas operações simultaneamente
   
4. **GET /api/stand/disponiveis-evento/{eventoId}**
   - Stands disponíveis para evento específico

### Autenticação
- Todas as requisições incluem token JWT no header
- Token obtido do localStorage
- Configuração automática via StandSelectionService

## Estilos e Responsividade

### CSS Classes
- `.stand-grid` - Container principal do grid
- `.stand-cell` - Célula individual do stand
- `.selected-stand-card` - Card de stand selecionado
- Animações CSS para hover e seleção

### Responsividade
- Grid redimensiona automaticamente em telas menores
- Layout adapta-se a diferentes resoluções
- Tooltips ajustam posição conforme necessário

## Como Usar

### Para Administradores
1. Abrir modal de seleção visual de stands
2. Filtrar por evento se necessário
3. Selecionar stands clicando no grid
4. Adicionar observações se desejado
5. Confirmar operação (reservar/liberar)

### Para Expositores
1. Visualizar stands disponíveis em eventos ativos
2. Selecionar stands desejados
3. Confirmar reserva
4. Gerenciar stands já reservados

## Troubleshooting

### Erros Comuns
- **"Não é possível ler propriedades de undefined"**: Verificar se dados estão sendo carregados corretamente
- **"Stand já ocupado"**: Outro usuário reservou o stand simultaneamente
- **"Token inválido"**: Fazer login novamente

### Debug
- Console do navegador mostra logs detalhados
- Estados podem ser inspecionados via React DevTools
- Network tab mostra requisições para API

## Melhorias Futuras
- Drag & drop para seleção em área
- Visualização em tempo real de mudanças
- Histórico de operações
- Notificações push para mudanças de status