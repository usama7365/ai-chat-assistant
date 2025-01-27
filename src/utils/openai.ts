import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-small"
  });
  
  return response.data[0].embedding;
};

export const generateResponse = async (
  query: string, 
  context: string
): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant. Use the following context to answer the user's question. If you cannot answer based on the context, say so."
      },
      {
        role: "user",
        content: `Context: ${context}\n\nQuestion: ${query}`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content || "Sorry, I couldn't generate a response.";
};