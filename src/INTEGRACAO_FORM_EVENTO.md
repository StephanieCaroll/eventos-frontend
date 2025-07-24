// Exemplo de integração no FormEvento.jsx

// No início do arquivo, adicionar o import:
import FormEventoStandSelector from '../components/FormEventoStandSelector';

// No componente FormEvento, substituir o campo de stands por:

// Substituir isto:
/*
<Form.Group className="mb-3">
  <Form.Label>Stands Disponíveis</Form.Label>
  <Form.Control
    type="text"
    value={formData.standsInput}
    onChange={handleChange}
    name="standsInput"
    placeholder="Ex: A1, B2, C3..."
  />
</Form.Group>
*/

// Por isto:
<FormEventoStandSelector
  selectedStands={formData.stands}
  standsInput={formData.standsInput}
  onStandsChange={(stands) => {
    setFormData(prev => ({
      ...prev,
      stands: stands
    }));
  }}
  onStandsInputChange={(standsInput) => {
    setFormData(prev => ({
      ...prev,
      standsInput: standsInput,
      stands: standsInput
        .split(',')
        .map(stand => stand.trim())
        .filter(stand => stand)
    }));
  }}
/>

// Isso vai garantir que:
// 1. Stands digitados no campo de texto apareçam como ocupados na seleção visual
// 2. Stands selecionados visualmente sejam adicionados ao campo de texto
// 3. A sincronização funcione nos dois sentidos