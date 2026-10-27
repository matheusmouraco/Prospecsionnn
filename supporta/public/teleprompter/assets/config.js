/**
 * Canal de tempo real.
 *
 * Usa apenas o servico Realtime do Supabase como transporte de mensagens.
 * Nenhuma tabela, nenhum dado gravado no banco: o broadcast e efemero.
 * Os roteiros ficam no navegador (localStorage), nunca no servidor.
 *
 * Esta chave e publica por design (client-side) e so permite falar no canal.
 * Para trocar de projeto, basta mudar as duas linhas abaixo.
 */
export const SUPABASE_URL = "https://bzarlpqkbbvhuwmmdzem.supabase.co";
export const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6YXJscHFrYmJ2aHV3bW1kemVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzAxNDUsImV4cCI6MjA5NzkwNjE0NX0.jdDvvNqAHJ5j6WsVJmUvLLMMSyhPw3XZg7I58p2LvSw";
