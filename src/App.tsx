import { useState } from 'react'
import './App.css'

interface SourceDocument {
  source: string
  page_start: number | null
  page_end: number | null
}

interface QuestionResponse {
  answer: string
  sources: SourceDocument[]
  conversation_id: string | null
}

const PROMPT_TYPES = [
  { value: 'default', label: 'Default' },
  { value: 'few_shot', label: 'Few-Shot' },
  { value: 'chain_of_thought', label: 'Chain-of-Thought' },
  { value: 'structured', label: 'Structured' },
  { value: 'direct', label: 'Direct' },
  { value: 'anti_hallucination', label: 'Anti-Hallucination' },
  { value: 'react', label: 'ReAct' },
  { value: 'least_to_most', label: 'Least-to-Most' },
]

const EXAMPLE_QUESTIONS = [
  {
    label: 'Quemaduras',
    question: '¿Qué debo hacer si alguien tiene una quemadura?'
  },
  {
    label: 'RCP',
    question: '¿Cómo realizar RCP en un adulto?'
  },
  {
    label: 'Ahogos',
    question: '¿Cuántos soplos de respiración de salvamento se deben dar a una víctima de ahogos?'
  },
  {
    label: 'Heridas',
    question: '¿Cómo tratar una herida sangrante?'
  },
  {
    label: 'Fracturas',
    question: '¿Qué hacer ante una sospecha de fractura?'
  },
  {
    label: 'Shock',
    question: '¿Cuáles son los signos de shock y cómo tratarlo?'
  }
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function App() {
  const [question, setQuestion] = useState('')
  const [promptType, setPromptType] = useState('default')
  const [useMemory, setUseMemory] = useState(true)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<QuestionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          prompt_type: promptType,
          use_memory: useMemory,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Error desconocido' }))
        throw new Error(errorData.detail || `Error ${res.status}`)
      }

      const data: QuestionResponse = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la pregunta')
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (exampleQuestion: string) => {
    setQuestion(exampleQuestion)
  }

  const formatSourceName = (source: string) => {
    return source.replace('.pdf', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Asistente Médico RAG</h1>
        <p>Consulta información médica basada en guías de MSF y Cruz Roja</p>
      </header>

      <main className="main">
        <form onSubmit={handleSubmit} className="question-form">
          <div className="form-group">
            <label htmlFor="prompt-type">Tipo de Prompt Engineering</label>
            <select
              id="prompt-type"
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
              className="select-input"
            >
              {PROMPT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useMemory}
                onChange={(e) => setUseMemory(e.target.checked)}
                className="checkbox-input"
              />
              <span>Usar memoria conversacional</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="question">Tu Pregunta</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribe tu pregunta médica aquí..."
              className="textarea-input"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Ejemplos de Consultas</label>
            <div className="example-buttons">
              {EXAMPLE_QUESTIONS.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleExampleClick(example.question)}
                  className="example-button"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="submit-button"
          >
            {loading ? 'Procesando...' : 'Enviar Pregunta'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className="response-container">
            <div className="response-section">
              <h2>Respuesta</h2>
              <div className="answer-content">
                {response.answer.split('\n').map((line, idx) => (
                  <p key={idx}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>

            {response.sources && response.sources.length > 0 && (
              <div className="sources-section">
                <h2>Fuentes y Contexto</h2>
                <div className="sources-list">
                  {response.sources.map((source, idx) => (
                    <div key={idx} className="source-item">
                      <div className="source-name">
                        {formatSourceName(source.source)}
                      </div>
                      {source.page_start !== null && (
                        <div className="source-pages">
                          Páginas: {source.page_start}
                          {source.page_end !== null && source.page_end !== source.page_start && ` - ${source.page_end}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
