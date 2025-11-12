# RAG Medical Assistant Frontend

A simple and effective React frontend for interacting with the RAG Medical Assistant backend.

## Features

- Select prompt engineering technique (8 types available)
- Toggle conversational memory on/off
- Ask medical questions with a clean interface
- Pre-defined example questions for quick testing
- View answers with source citations
- Modern and responsive design

## Available Prompt Types

1. **Default**: Structured prompt with sections
2. **Few-Shot**: Includes example Q&A pairs
3. **Chain-of-Thought**: Step-by-step reasoning
4. **Structured**: Highly structured with strict format
5. **Direct**: Concise and direct answer
6. **Anti-Hallucination**: Explicit verification against context
7. **ReAct**: Reasoning and Acting with iterative verification
8. **Least-to-Most**: Breaks down into sub-problems sequentially

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the API URL (optional):
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` if your backend is running on a different port

3. Start the development server:
```bash
npm run dev
```

4. Make sure the backend is running on `http://localhost:8000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Select a prompt engineering technique from the dropdown
2. Toggle memory on/off as needed
3. Type your question or click an example button
4. Click "Enviar Pregunta" to get the answer
5. View the response and source documents below

## Example Questions

The interface includes pre-defined examples for:
- Quemaduras (Burns)
- RCP (CPR)
- Ahogos (Drowning)
- Heridas (Wounds)
- Fracturas (Fractures)
- Shock

## Technologies

- React 19
- TypeScript
- Vite
- CSS3
