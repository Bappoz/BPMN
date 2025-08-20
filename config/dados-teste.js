export const cenariosMEI = {
  // ✅ FLUXO 1: Processo completo com sucesso - sem licenças
  sucesso_simples: {
    nome: "João Silva",
    cpf: "123.456.789-00",
    idade: 30,
    jaTemEmpresa: false,
    jaEMEI: false,
    atividade: "62.01-5-01", // Desenvolvimento de software
    atividade_desc: "Desenvolvimento de software",
    endereco: {
      cep: "01234-567",
      rua: "Rua A, 123",
      cidade: "São Paulo",
      uf: "SP",
    },
    email: "joao@email.com",
    temGovBr: true,
    podeSerMEI: true,
  },

  // ❌ FLUXO 2: Rejeição por não atender requisitos
  rejeicao_requisitos: {
    nome: "Pedro Menor",
    cpf: "456.789.123-00",
    idade: 16, // Menor de idade
    jaTemEmpresa: false,
    jaEMEI: false,
    atividade: "62.01-5-01",
    atividade_desc: "Desenvolvimento de software",
    endereco: {
      cep: "01234-567",
      rua: "Rua B, 456",
      cidade: "Rio de Janeiro",
      uf: "RJ",
    },
    email: "pedro@email.com",
    temGovBr: true,
    podeSerMEI: false, // Deve ser rejeitado
  },

  // ✅ FLUXO 3: Processo completo com licenças municipais
  sucesso_com_licenca: {
    nome: "Maria Cabeleireira",
    cpf: "789.123.456-00",
    idade: 35,
    jaTemEmpresa: false,
    jaEMEI: false,
    atividade: "96.02-5-01", // Cabeleireiros - precisa licença
    atividade_desc: "Cabeleireiros e manicure",
    endereco: {
      cep: "04567-890",
      rua: "Av. Central, 789",
      cidade: "São Paulo",
      uf: "SP",
    },
    email: "maria@email.com",
    temGovBr: true,
    podeSerMEI: true,
  },

  // ✅ FLUXO 4: Endereço inválido que precisa correção
  endereco_invalido: {
    nome: "Ana Comerciante",
    cpf: "321.654.987-00",
    idade: 28,
    jaTemEmpresa: false,
    jaEMEI: false,
    atividade: "47.11-3-02", // Comércio
    atividade_desc: "Comércio varejista",
    endereco: {
      cep: "00000-000", // CEP inválido
      rua: "", // Endereço vazio
      cidade: "Belo Horizonte",
      uf: "MG",
    },
    email: "ana@email.com",
    temGovBr: false, // Precisa criar conta gov.br
    podeSerMEI: true,
  },
};

export const atividadesComLicenca = [
  "96.02-5-01", // Cabeleireiros
  "56.11-2-01", // Restaurantes
  "47.11-3-02", // Comércio (alguns casos)
];

export const limitesMEI = {
  idadeMinima: 18,
  valorDASMensal: 67.0,
};
