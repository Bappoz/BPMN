// Visualizador BPMN - JavaScript
class BPMNViewer {
  constructor() {
    this.viewer = new BpmnJS({
      container: "#canvas",
      height: 600,
    });

    this.currentDiagram = null;
    this.activities = [];
    this.init();
  }

  async init() {
    try {
      await this.loadDiagram();
      this.setupEventListeners();
    } catch (error) {
      console.error("Erro na inicialização:", error);
      this.showError("Erro ao inicializar o visualizador");
    }
  }

  async loadDiagram() {
    try {
      // Carrega o diagrama BPMN
      const response = await fetch("./processos/processo-mei.bpmn");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xml = await response.text();
      await this.viewer.importXML(xml);

      this.currentDiagram = xml;
      this.extractActivities();
      this.displayActivities();

      // Auto-fit no viewport
      this.fitViewport();

      console.log("✅ Diagrama carregado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao carregar diagrama:", error);
      this.showError(`Erro ao carregar o diagrama: ${error.message}`);
    }
  }

  extractActivities() {
    const elementRegistry = this.viewer.get("elementRegistry");
    this.activities = [];

    // Primeiro, coleta todos os elementos
    const allElements = [];
    elementRegistry.forEach((element) => {
      if (this.isActivity(element)) {
        allElements.push({
          id: element.id,
          name: element.businessObject.name || element.id,
          type: this.getElementType(element),
          element: element,
          x: element.x || 0,
          y: element.y || 0,
          incoming: element.businessObject.incoming || [],
          outgoing: element.businessObject.outgoing || [],
        });
      }
    });

    // Ordena as atividades seguindo o fluxo do processo
    this.activities = this.sortActivitiesByFlow(allElements);

    console.log(
      `📊 ${this.activities.length} atividades encontradas e ordenadas por fluxo`
    );
  }

  sortActivitiesByFlow(elements) {
    // Encontra o elemento de início
    const startElement = elements.find(
      (el) => el.element.type === "bpmn:StartEvent"
    );

    if (!startElement) {
      // Se não houver evento de início, ordena por posição (x, y)
      return elements.sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });
    }

    const ordered = [];
    const visited = new Set();
    const elementMap = new Map();

    // Cria um mapa para acesso rápido aos elementos
    elements.forEach((el) => elementMap.set(el.id, el));

    // Função recursiva para percorrer o fluxo
    const traverseFlow = (element) => {
      if (!element || visited.has(element.id)) return;

      visited.add(element.id);
      ordered.push(element);

      // Segue as conexões de saída
      if (element.outgoing && element.outgoing.length > 0) {
        const outgoingElements = [];

        element.outgoing.forEach((flow) => {
          if (flow.targetRef && elementMap.has(flow.targetRef.id)) {
            const targetElement = elementMap.get(flow.targetRef.id);
            if (!visited.has(targetElement.id)) {
              outgoingElements.push(targetElement);
            }
          }
        });

        // Ordena os elementos de saída por posição para manter consistência
        outgoingElements.sort((a, b) => {
          if (a.y !== b.y) return a.y - b.y;
          return a.x - b.x;
        });

        // Percorre recursivamente
        outgoingElements.forEach(traverseFlow);
      }
    };

    // Inicia a travessia pelo elemento de início
    traverseFlow(startElement);

    // Adiciona elementos não visitados (podem existir em processos com múltiplos caminhos)
    elements.forEach((element) => {
      if (!visited.has(element.id)) {
        ordered.push(element);
      }
    });

    return ordered;
  }

  isActivity(element) {
    const type = element.type;
    return (
      type.includes("Task") ||
      type.includes("Event") ||
      type.includes("Gateway") ||
      type === "bpmn:StartEvent" ||
      type === "bpmn:EndEvent"
    );
  }

  getElementType(element) {
    const type = element.type;

    const typeMap = {
      "bpmn:StartEvent": "🚀 Evento de Início",
      "bpmn:EndEvent": "🏁 Evento de Fim",
      "bpmn:Task": "📋 Tarefa",
      "bpmn:UserTask": "👤 Tarefa do Usuário",
      "bpmn:ServiceTask": "⚙️ Tarefa de Serviço",
      "bpmn:SendTask": "📤 Tarefa de Envio",
      "bpmn:ReceiveTask": "📥 Tarefa de Recebimento",
      "bpmn:ScriptTask": "📜 Tarefa de Script",
      "bpmn:BusinessRuleTask": "📊 Regra de Negócio",
      "bpmn:ManualTask": "✋ Tarefa Manual",
      "bpmn:ExclusiveGateway": "🔀 Gateway Exclusivo",
      "bpmn:ParallelGateway": "⚡ Gateway Paralelo",
      "bpmn:InclusiveGateway": "🔗 Gateway Inclusivo",
      "bpmn:EventBasedGateway": "⏰ Gateway Baseado em Eventos",
    };

    return typeMap[type] || "📄 Elemento";
  }

  displayActivities() {
    const activityList = document.getElementById("activityList");

    if (this.activities.length === 0) {
      activityList.innerHTML =
        '<div class="loading">Nenhuma atividade encontrada</div>';
      return;
    }

    const html = this.activities
      .map(
        (activity, index) => `
            <div class="activity-item" onclick="viewer.highlightActivity('${
              activity.id
            }')" data-id="${activity.id}">
                <div class="activity-header">
                    <span class="activity-order">${index + 1}</span>
                    <div class="activity-name">${activity.name}</div>
                </div>
                <div class="activity-id">ID: ${activity.id}</div>
                <span class="activity-type">${activity.type}</span>
            </div>
        `
      )
      .join("");

    activityList.innerHTML = html;
  }

  highlightActivity(activityId) {
    try {
      const canvas = this.viewer.get("canvas");
      const elementRegistry = this.viewer.get("elementRegistry");

      // Remove destaque anterior
      this.removeAllHighlights();

      // Destaca o elemento selecionado
      const element = elementRegistry.get(activityId);
      if (element) {
        canvas.addMarker(activityId, "highlight");

        // Centraliza o elemento na tela
        canvas.viewbox({
          x: element.x - 200,
          y: element.y - 200,
          width: 400,
          height: 400,
        });

        // Destaca o item na lista
        document.querySelectorAll(".activity-item").forEach((item) => {
          item.classList.remove("highlighted");
        });

        const listItem = document.querySelector(`[data-id="${activityId}"]`);
        if (listItem) {
          listItem.classList.add("highlighted");
          listItem.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        console.log(
          `✨ Destacando atividade: ${
            element.businessObject.name || activityId
          }`
        );
      }
    } catch (error) {
      console.error("Erro ao destacar atividade:", error);
    }
  }

  highlightActivities() {
    try {
      const canvas = this.viewer.get("canvas");

      // Remove destaques anteriores
      this.removeAllHighlights();

      // Destaca todas as atividades
      this.activities.forEach((activity, index) => {
        setTimeout(() => {
          canvas.addMarker(activity.id, "highlight-all");
        }, index * 100); // Efeito de animação escalonada
      });

      console.log("✨ Todas as atividades foram destacadas!");
    } catch (error) {
      console.error("Erro ao destacar atividades:", error);
    }
  }

  removeAllHighlights() {
    const canvas = this.viewer.get("canvas");
    this.activities.forEach((activity) => {
      canvas.removeMarker(activity.id, "highlight");
      canvas.removeMarker(activity.id, "highlight-all");
    });
  }

  setupEventListeners() {
    // Event listener para cliques nos elementos do diagrama
    this.viewer.on("element.click", (event) => {
      const element = event.element;
      if (this.isActivity(element)) {
        this.highlightActivity(element.id);
      }
    });

    // Event listener para hover nos elementos
    this.viewer.on("element.hover", (event) => {
      const element = event.element;
      if (this.isActivity(element)) {
        document.body.style.cursor = "pointer";
      }
    });

    this.viewer.on("element.out", () => {
      document.body.style.cursor = "default";
    });
  }

  // Controles de zoom
  zoomIn() {
    const zoomScroll = this.viewer.get("zoomScroll");
    zoomScroll.stepZoom(1);
  }

  zoomOut() {
    const zoomScroll = this.viewer.get("zoomScroll");
    zoomScroll.stepZoom(-1);
  }

  resetZoom() {
    const canvas = this.viewer.get("canvas");
    canvas.zoom("fit-viewport");
  }

  fitViewport() {
    const canvas = this.viewer.get("canvas");
    canvas.zoom("fit-viewport", "auto");
  }

  async exportDiagram() {
    try {
      const { svg } = await this.viewer.saveSVG();

      // Cria um link para download
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "processo-mei-diagram.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

      console.log("💾 Diagrama exportado como SVG!");
    } catch (error) {
      console.error("Erro ao exportar diagrama:", error);
      this.showError("Erro ao exportar o diagrama");
    }
  }

  showError(message) {
    const activityList = document.getElementById("activityList");
    activityList.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Adiciona estilos CSS para os destaques
const style = document.createElement("style");
style.textContent = `
    .djs-element.highlight .djs-visual > :nth-child(1) {
        stroke: #ff6b6b !important;
        stroke-width: 4px !important;
        filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.7));
    }
    
    .djs-element.highlight-all .djs-visual > :nth-child(1) {
        stroke: #74b9ff !important;
        stroke-width: 3px !important;
        filter: drop-shadow(0 0 8px rgba(116, 185, 255, 0.5));
    }
    
    .activity-item.highlighted {
        background: #667eea !important;
        color: white !important;
        transform: translateX(10px) !important;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
    }
    
    .activity-item.highlighted .activity-id,
    .activity-item.highlighted .activity-name {
        color: white !important;
    }
    
    .activity-item.highlighted .activity-type {
        background: rgba(255, 255, 255, 0.2) !important;
    }
`;
document.head.appendChild(style);

// Inicializa o visualizador
let viewer;
document.addEventListener("DOMContentLoaded", () => {
  viewer = new BPMNViewer();
});

// Funções globais para os botões
function loadDiagram() {
  viewer.loadDiagram();
}

function highlightActivities() {
  viewer.highlightActivities();
}

function exportDiagram() {
  viewer.exportDiagram();
}

function fitViewport() {
  viewer.fitViewport();
}

function zoomIn() {
  viewer.zoomIn();
}

function zoomOut() {
  viewer.zoomOut();
}

function resetZoom() {
  viewer.resetZoom();
}
