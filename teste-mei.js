// ===== PROCESSO DE ABERTURA MEI - BPMN ENGINE =====
import { Engine } from "bpmn-engine";
import fs from "fs";

console.log("=".repeat(70));
console.log("SISTEMA DE ABERTURA DE MEI - DEPARTAMENTO PROCESSUAL");
console.log("=".repeat(70));

const source = fs.readFileSync("./processo-mei.bpmn", "utf8");

const engine = new Engine({
  name: "Processo de Abertura MEI",
  source: source,
});

