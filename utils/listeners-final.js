import { atividadesComLicenca } from "../config/dados-teste-final.js";

export function configurarListenersMEI(engine) {
  // Debug: capturar TODOS os eventos
  engine.on("*", (event, api) => {
    console.log(`🔍 ${event}: ${api?.id || api?.name || "unknown"}`);
  });

  engine.on("start", () => console.log("🚀 Processo iniciado"));

  engine.on("activity.start", (api) => {
    console.log(`▶️ ${api.id}: ${api.name}`);
  });

  // Listeners essenciais para controlar o fluxo BPMN

  engine.on("activity.enter", (api) => {
    const variables = api.environment.variables;

    switch (api.id) {
      case "Task_VerificarRequisitos":
        // Verificar requisitos básicos
        const atendeIdade = variables.idade >= 18;
        const naoTemEmpresa = !variables.jaTemEmpresa;
        const naoEMEI = !variables.jaEMEI;

        const podeSerMEI = atendeIdade && naoTemEmpresa && naoEMEI;
        api.environment.variables.podeSerMEI = podeSerMEI;

        console.log(
          `📋 Requisitos: ${podeSerMEI ? "✅ APROVADO" : "❌ REJEITADO"}`
        );
        break;

      case "Task_DefinirAtividade":
        // Verificar se atividade precisa licença
        const precisaLicenca = atividadesComLicenca.includes(
          variables.atividade
        );
        api.environment.variables.precisaLicenca = precisaLicenca;

        console.log(`🏢 Atividade: ${variables.atividade_desc}`);
        if (precisaLicenca) console.log(`⚠️ Precisa licença municipal`);
        break;

      case "Task_DefinirEndereco":
        // Verificar se endereço é válido
        const enderecoValido =
          variables.endereco?.cep !== "00000-000" &&
          variables.endereco?.rua?.length > 0;
        api.environment.variables.enderecoValido = enderecoValido;

        console.log(
          `📍 Endereço: ${enderecoValido ? "✅ Válido" : "❌ Inválido"}`
        );
        break;

      case "Activity_0duifpe": // Corrigir endereço
        // Simular correção automática
        if (variables.endereco) {
          variables.endereco.cep = "12345-678";
          variables.endereco.rua = "Endereço corrigido";
        }
        api.environment.variables.enderecoValido = true;
        console.log(`🔧 Endereço corrigido`);
        break;

      case "Task_GerarCNPJ":
        // Gerar CNPJ simulado
        const cnpj = `12.345.678/0001-90`;
        api.environment.variables.cnpj = cnpj;
        console.log(`🏢 CNPJ gerado: ${cnpj}`);
        break;

      default:
        console.log(`🔄 ${api.name}`);
        break;
    }
  });

  engine.on("activity.wait", (api) => {
    // Simular ações de usuário
    setTimeout(() => {
      switch (api.id) {
        case "Task_CriarContaGovBr":
          console.log(
            `🔐 Conta gov.br: ${
              api.environment.variables.temGovBr ? "✅ Ok" : "📝 Criada"
            }`
          );
          api.signal({ contaCriada: true });
          break;

        case "Task_OrientarLicenca":
          console.log(`📋 Orientação sobre licenças fornecida`);
          api.signal({ orientado: true });
          break;

        default:
          api.signal({ processado: true });
          break;
      }
    }, 100);
  });

  engine.on("end", (api) => {
    const vars = api.environment.variables;
    if (vars.cnpj) {
      console.log(`🎉 MEI aberto com sucesso! CNPJ: ${vars.cnpj}`);
    } else {
      console.log(`❌ MEI não aprovado`);
    }
  });
}
