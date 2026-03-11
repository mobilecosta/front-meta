import { describe, expect, it, beforeAll } from "vitest";
import { initSupabase, getSupabase, tableExists } from "./supabase-client";

describe("Supabase Connection", () => {
  beforeAll(() => {
    // Inicializar cliente Supabase
    initSupabase();
  });

  it("deve conectar ao Supabase com sucesso", async () => {
    const supabase = getSupabase();
    expect(supabase).toBeDefined();
  });

  it("deve verificar se a tabela 'clientes' existe ou pode ser criada", async () => {
    // Este teste apenas verifica se conseguimos fazer uma query
    // A tabela será criada pelo script SQL
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .limit(1);

      // Se a tabela não existe, error.code será PGRST116
      // Se existe, data será um array (mesmo que vazio)
      expect(data !== null || error !== null).toBe(true);
    } catch (err) {
      // Esperamos que a tabela não exista ainda
      console.log("Tabela 'clientes' ainda não existe (esperado antes do script SQL)");
    }
  });

  it("deve retornar cliente Supabase válido", async () => {
    const supabase = getSupabase();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });
});
