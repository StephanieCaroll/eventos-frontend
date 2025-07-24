import { useState } from 'react';
import { debugBatchOperation } from '../services/StandSelectionService';

const BatchTestComponent = () => {
  const [testData, setTestData] = useState({
    standIds: [1, 2, 3],
    eventoId: 1,
    usuarioId: 'test@example.com',
    operacao: 'RESERVAR'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await debugBatchOperation(
        testData.standIds,
        testData.eventoId,
        testData.usuarioId,
        testData.operacao
      );
      setResult({ success: true, data: response });
    } catch (error) {
      setResult({ 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🔧 Debug Batch Operation</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Stand IDs (separados por vírgula):</label>
        <input
          type="text"
          value={testData.standIds.join(',')}
          onChange={(e) => setTestData({
            ...testData,
            standIds: e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
          })}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Evento ID:</label>
        <input
          type="number"
          value={testData.eventoId}
          onChange={(e) => setTestData({ ...testData, eventoId: parseInt(e.target.value) })}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Usuario ID:</label>
        <input
          type="text"
          value={testData.usuarioId}
          onChange={(e) => setTestData({ ...testData, usuarioId: e.target.value })}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Operação:</label>
        <select
          value={testData.operacao}
          onChange={(e) => setTestData({ ...testData, operacao: e.target.value })}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="RESERVAR">RESERVAR</option>
          <option value="LIBERAR">LIBERAR</option>
        </select>
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testando...' : 'Testar Endpoint'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <h4>{result.success ? '✅ Sucesso!' : '❌ Erro!'}</h4>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(result.success ? result.data : result.error, null, 2)}
          </pre>
          {!result.success && result.status && (
            <p><strong>Status:</strong> {result.status}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchTestComponent;