// ===== PROCESSO REAL DE ABERTURA MEI =====
import { Engine } from "bpmn-engine";
import fs from "fs";

console.log("=".repeat(70));
console.log("🏢 PROCESSO REAL DE ABERTURA MEI - BRASIL 2025");
console.log("=".repeat(70));
console.log("📋 Baseado nos requisitos atuais da Receita Federal");

const source = fs.readFileSync("./processo-mei-real.bpmn", "utf8");

const engine = new Engine({
  name: "Processo Real MEI",
  source: source,
});

// ===== LISTENERS =====
engine.on("start", () => {
  console.log("\n🚀 INICIANDO ANÁLISE PARA ABERTURA DE MEI");
});

engine.on("end", () => {
  console.log("\n🎉 PROCESSO CONCLUÍDO!");
  console.log("=".repeat(70));
});

engine.on("activity.start", (api) => {
  console.log(`\n📋 ${api.name}`);
});

engine.on("activity.end", (api) => {
  console.log(`✅ Concluído: ${api.name}`);
});

// ===== TRATAMENTO DAS ATIVIDADES =====
engine.on("activity.wait", (api) => {
  console.log(`   ↳ Processando...`);

  // VERIFICAR REQUISITOS
  if (api.id === "Task_VerificarRequisitos") {
    setTimeout(() => {
      const faturamentoAnual = api.environment.variables.faturamentoAnual || 0;
      const temOutraEmpresa =
        api.environment.variables.temOutraEmpresa || false;
      const ehServidorPublico =
        api.environment.variables.ehServidorPublico || false;
      const temSocio = api.environment.variables.temSocio || false;

      console.log(`   ↳ Faturamento anual: R$ ${faturamentoAnual.toFixed(2)}`);
      console.log(`   ↳ Tem outra empresa: ${temOutraEmpresa ? "SIM" : "NÃO"}`);
      console.log(
        `   ↳ Servidor público: ${ehServidorPublico ? "SIM" : "NÃO"}`
      );
      console.log(`   ↳ Tem sócios: ${temSocio ? "SIM" : "NÃO"}`);

      // REGRAS DO MEI:
      // - Faturamento até R$ 81.000,00/ano
      // - Não pode ter sócios
      // - Servidor público pode (com restrições)
      // - Não pode ter outra empresa (salvo exceções)

      const podeSerMEI =
        faturamentoAnual <= 81000 && !temSocio && !temOutraEmpresa;

      console.log(
        `   ↳ Resultado: ${
          podeSerMEI ? "✅ PODE SER MEI" : "❌ NÃO PODE SER MEI"
        }`
      );

      if (!podeSerMEI) {
        if (faturamentoAnual > 81000)
          console.log("   ↳ Motivo: Faturamento acima de R$ 81.000,00");
        if (temSocio) console.log("   ↳ Motivo: MEI não pode ter sócios");
        if (temOutraEmpresa)
          console.log("   ↳ Motivo: Já possui outra empresa");
      }

      api.signal({ podeSerMEI: podeSerMEI });
    }, 2000);
  }

  // CRIAR/VERIFICAR CONTA GOV.BR
  else if (api.id === "Task_CriarContaGovBr") {
    setTimeout(() => {
      console.log("   ↳ Verificando conta gov.br...");
      console.log("   ↳ ✅ Conta gov.br verificada/criada");
      console.log("   ↳ 📱 Necessário nível prata ou ouro");
      api.signal({ contaGovBr: true });
    }, 1500);
  }

  // DEFINIR ATIVIDADE
  else if (api.id === "Task_DefinirAtividade") {
    setTimeout(() => {
      const atividade =
        api.environment.variables.atividade || "Desenvolvimento de software";
      console.log(`   ↳ Atividade escolhida: ${atividade}`);
      console.log(
        "   ↳ CNAE: 6201-5/00 - Desenvolvimento de programas de computador sob encomenda"
      );
      console.log("   ↳ ✅ Atividade permitida para MEI");

      api.signal({
        atividade: atividade,
        cnae: "6201-5/00",
      });
    }, 2000);
  }

  // DEFINIR ENDEREÇO
  else if (api.id === "Task_DefinirEndereco") {
    setTimeout(() => {
      const endereco = api.environment.variables.endereco || "Residencial";
      console.log(`   ↳ Tipo de endereço: ${endereco}`);
      console.log("   ↳ Endereço: Rua das Flores, 123 - São Paulo/SP");
      console.log("   ↳ ✅ Endereço validado");

      // Algumas atividades precisam de licença municipal
      const atividade = api.environment.variables.atividade || "";
      const precisaLicenca =
        atividade.includes("alimentação") ||
        atividade.includes("beleza") ||
        atividade.includes("saúde");

      api.signal({
        endereco: "Rua das Flores, 123 - São Paulo/SP",
        precisaLicenca: precisaLicenca,
      });
    }, 1800);
  }

  // ORIENTAR SOBRE LICENÇA
  else if (api.id === "Task_OrientarLicenca") {
    setTimeout(() => {
      console.log("   ↳ 📋 Orientações sobre licenças:");
      console.log("   ↳ • Consultar Prefeitura para licença municipal");
      console.log("   ↳ • Verificar Vigilância Sanitária se necessário");
      console.log(
        "   ↳ • Consultar Corpo de Bombeiros para algumas atividades"
      );
      console.log("   ↳ ✅ Cliente orientado");
      api.signal();
    }, 2500);
  }

  // PREENCHER PORTAL DO EMPREENDEDOR
  else if (api.id === "Task_PreencherPortal") {
    setTimeout(() => {
      console.log("   ↳ 🌐 Acessando Portal do Empreendedor (gov.br)");
      console.log("   ↳ 📝 Preenchendo dados do cliente");
      console.log("   ↳ 💰 Taxa: GRATUITO (R$ 0,00)");
      console.log("   ↳ ✅ Formulário preenchido");
      api.signal({ taxaPaga: 0 });
    }, 3000);
  }

  // GERAR CNPJ
  else if (api.id === "Task_GerarCNPJ") {
    setTimeout(() => {
      console.log("   ↳ 🔄 Processando na Receita Federal...");
      const cnpj = "12.345.678/0001-90"; // Exemplo
      console.log(`   ↳ 🎯 CNPJ gerado: ${cnpj}`);
      console.log("   ↳ ✅ MEI ativo no Simples Nacional");
      console.log("   ↳ 📄 CCMEI (Certificado) disponível para download");

      api.signal({
        cnpj: cnpj,
        ativo: true,
        ccmeiDisponivel: true,
      });
    }, 4000);
  }

  // ENVIAR DOCUMENTOS
  else if (api.id === "Task_EnviarDocumentos") {
    setTimeout(() => {
      console.log("   ↳ 📧 Enviando documentos para o cliente:");
      console.log("   ↳ • CCMEI (Certificado da Condição de MEI)");
      console.log("   ↳ • Cartão CNPJ");
      console.log("   ↳ • Manual de orientações");
      console.log("   ↳ ✅ Documentos enviados por email");
      api.signal({ documentosEnviados: true });
    }, 1500);
  }

  // ORIENTAR SOBRE DAS-MEI
  else if (api.id === "Task_OrientarDAS") {
    setTimeout(() => {
      console.log("   ↳ 💰 Orientações sobre DAS-MEI:");
      console.log("   ↳ • Valor mensal: R$ 67,00 (aprox.)");
      console.log("   ↳ • Vencimento: todo dia 20");
      console.log("   ↳ • Pagamento no Portal do Simples Nacional");
      console.log("   ↳ • INSS + ICMS/ISS conforme atividade");
      console.log("   ↳ ✅ Cliente orientado sobre DAS-MEI");
      api.signal();
    }, 2000);
  }

  // ORIENTAR OBRIGAÇÕES
  else if (api.id === "Task_OrientarObrigacoes") {
    setTimeout(() => {
      console.log("   ↳ 📊 Orientações sobre obrigações anuais:");
      console.log("   ↳ • DASN-SIMEI (até 31/maio)");
      console.log("   ↳ • Declarar faturamento anual");
      console.log("   ↳ • Manter documentos organizados");
      console.log("   ↳ • Limite anual: R$ 81.000,00");
      console.log("   ↳ ✅ Cliente orientado sobre obrigações");
      api.signal();
    }, 2200);
  }
});

// ===== EXECUÇÃO =====
console.log("\n▶️ Iniciando análise...");

engine
  .execute({
    variables: {
      // DADOS DO CLIENTE PARA TESTE
      faturamentoAnual: 45000, // Dentro do limite
      temOutraEmpresa: false, // Pode ser MEI
      ehServidorPublico: false, // Não é servidor
      temSocio: false, // Não tem sócios
      atividade: "Desenvolvimento de software",
      endereco: "Residencial",
      tipoCliente: "Pessoa Física",
    },
  })
  .then(() => {
    console.log("\n📋 RESUMO DO PROCESSO REAL MEI:");
    console.log("✅ Verificação de requisitos (impedimentos)");
    console.log("✅ Conta gov.br (obrigatória)");
    console.log("✅ Definição de atividade permitida");
    console.log("✅ Endereço (residencial ou comercial)");
    console.log("✅ Portal do Empreendedor (gratuito)");
    console.log("✅ CNPJ gerado automaticamente");
    console.log("✅ Simples Nacional automático");
    console.log("✅ Orientações sobre DAS-MEI e obrigações");
    console.log(
      "\n❌ NÃO PRECISA: Junta Comercial, taxas, RLE, certificado digital"
    );
  })
  .catch((err) => {
    console.error("\n❌ Erro:", err.message);
  });

/* 
=== RESUMO: PROCESSO REAL DO MEI ===

✅ OBRIGATÓRIO:
1. Conta gov.br (nível prata/ouro)
2. Verificar requisitos (faturamento, sócios, etc.)
3. Escolher atividade permitida (CNAE)
4. Definir endereço
5. Preencher Portal do Empreendedor (GRATUITO)
6. CNPJ gerado automaticamente
7. Enquadramento automático no Simples Nacional

📋 PÓS-ABERTURA:
- DAS-MEI mensal (~R$ 67,00)
- DASN-SIMEI anual (até 31/maio)
- Licenças municipais (conforme atividade)

❌ NÃO PRECISA:
- Junta Comercial
- FCN, DBE, DFB, DFP
- Taxas de registro
- RLE obrigatório
- Certificado digital
- Processo de assinatura complexo
- Contrato social

TEMPO REAL: 15-30 minutos online
CUSTO REAL: R$ 0,00 (gratuito)
*/
