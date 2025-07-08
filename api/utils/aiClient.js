import { CohereClient } from 'cohere-ai';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const getEmbedding = async (text) => {
  try {
    const response = await cohere.embed({
      texts: [text],
      model: 'embed-english-v3.0',
      inputType: 'search_document', // required by v3.0 models
    });

    return response.embeddings[0];
  } catch (error) {
    console.error('Cohere error:', error.message);
    return Array(1024).fill(0.001); // fallback vector
  }
};


// export const getEmbedding = async (text) => {
//     const response = await axios.post(
//       'https://api.cohere.ai/v1/embed',
//       { texts: [text], model: 'embed-english-v3.0' },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
  
//     return response.data.embeddings[0];
//   };