import { describe, expect, it } from "vitest";
import {
  validateEntityData,
  getEntityMetadata,
  getAllEntitiesMetadata,
} from "./metadata";

describe("Metadata System", () => {
  describe("getEntityMetadata", () => {
    it("deve retornar metadados de Clientes", () => {
      const metadata = getEntityMetadata("clientes");
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe("clientes");
      expect(metadata?.fields.length).toBeGreaterThan(0);
    });

    it("deve retornar metadados de Produtos", () => {
      const metadata = getEntityMetadata("produtos");
      expect(metadata).toBeDefined();
      expect(metadata?.name).toBe("produtos");
      expect(metadata?.fields.length).toBeGreaterThan(0);
    });

    it("deve retornar null para entidade inexistente", () => {
      const metadata = getEntityMetadata("inexistente");
      expect(metadata).toBeNull();
    });

    it("deve ser case-insensitive", () => {
      const metadata1 = getEntityMetadata("CLIENTES");
      const metadata2 = getEntityMetadata("clientes");
      expect(metadata1).toEqual(metadata2);
    });
  });

  describe("getAllEntitiesMetadata", () => {
    it("deve retornar array com todas as entidades", () => {
      const entities = getAllEntitiesMetadata();
      expect(Array.isArray(entities)).toBe(true);
      expect(entities.length).toBeGreaterThan(0);
    });

    it("deve incluir Clientes e Produtos", () => {
      const entities = getAllEntitiesMetadata();
      const names = entities.map((e) => e.name);
      expect(names).toContain("clientes");
      expect(names).toContain("produtos");
    });
  });

  describe("validateEntityData - Clientes", () => {
    it("deve validar dados válidos de cliente", () => {
      const data = {
        nome: "João Silva",
        email: "joao@example.com",
        telefone: "(11) 98765-4321",
        endereco: "Rua A, 123",
      };
      const result = validateEntityData("clientes", data);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it("deve rejeitar cliente sem nome", () => {
      const data = {
        email: "joao@example.com",
      };
      const result = validateEntityData("clientes", data);
      expect(result.valid).toBe(false);
      expect(result.errors.nome).toBeDefined();
    });

    it("deve rejeitar cliente com email inválido", () => {
      const data = {
        nome: "João Silva",
        email: "email-invalido",
      };
      const result = validateEntityData("clientes", data);
      expect(result.valid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("deve rejeitar nome muito curto", () => {
      const data = {
        nome: "Jo",
        email: "joao@example.com",
      };
      const result = validateEntityData("clientes", data);
      expect(result.valid).toBe(false);
      expect(result.errors.nome).toBeDefined();
    });

    it("deve permitir telefone vazio (não obrigatório)", () => {
      const data = {
        nome: "João Silva",
        email: "joao@example.com",
      };
      const result = validateEntityData("clientes", data);
      expect(result.valid).toBe(true);
    });
  });

  describe("validateEntityData - Produtos", () => {
    it("deve validar dados válidos de produto", () => {
      const data = {
        nome: "Notebook",
        descricao: "Notebook de alta performance",
        preco: 3500.0,
        categoria: "eletronicos",
        estoque: 10,
      };
      const result = validateEntityData("produtos", data);
      expect(result.valid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it("deve rejeitar produto sem nome", () => {
      const data = {
        preco: 3500.0,
        categoria: "eletronicos",
        estoque: 10,
      };
      const result = validateEntityData("produtos", data);
      expect(result.valid).toBe(false);
      expect(result.errors.nome).toBeDefined();
    });

    it("deve rejeitar produto com preço negativo", () => {
      const data = {
        nome: "Notebook",
        preco: -100,
        categoria: "eletronicos",
        estoque: 10,
      };
      const result = validateEntityData("produtos", data);
      expect(result.valid).toBe(false);
      expect(result.errors.preco).toBeDefined();
    });

    it("deve rejeitar produto com estoque negativo", () => {
      const data = {
        nome: "Notebook",
        preco: 3500,
        categoria: "eletronicos",
        estoque: -5,
      };
      const result = validateEntityData("produtos", data);
      expect(result.valid).toBe(false);
      expect(result.errors.estoque).toBeDefined();
    });

    it("deve permitir descrição vazia (não obrigatória)", () => {
      const data = {
        nome: "Notebook",
        preco: 3500,
        categoria: "eletronicos",
        estoque: 10,
      };
      const result = validateEntityData("produtos", data);
      expect(result.valid).toBe(true);
    });
  });
});
