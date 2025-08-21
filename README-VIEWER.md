# 📊 Visualizador BPMN - Processo MEI

Um visualizador web interativo para facilitar a visualização das atividades do diagrama BPMN do processo de abertura de MEI.

## 🚀 Como usar

### 1. Iniciar o servidor web

```bash
npm run viewer
```

ou

```bash
npm run web
```

### 2. Acessar o visualizador

Abra seu navegador e acesse: `http://localhost:3000`

## ✨ Funcionalidades

### 🎯 Visualização Interativa

- **Visualização completa** do diagrama BPMN
- **Zoom** in/out e ajuste automático
- **Navegação** suave pelo diagrama
- **Design responsivo** para dispositivos móveis

### 📋 Lista de Atividades

- **Lista completa** de todas as atividades do processo
- **Tipos identificados** (Tarefas, Eventos, Gateways)
- **Clique para destacar** atividades específicas
- **Navegação rápida** entre elementos

### 🎨 Recursos Visuais

- **Destaque de atividades** com cores e animações
- **Interface moderna** com gradientes e sombras
- **Ícones intuitivos** para diferentes tipos de elementos
- **Feedback visual** em tempo real

### 💾 Exportação

- **Exportar como SVG** para uso em documentações
- **Qualidade vetorial** preservada

## 🛠️ Controles Disponíveis

### Botões Principais

- **📁 Carregar Diagrama**: Recarrega o arquivo BPMN
- **✨ Destacar Atividades**: Destaca todas as atividades
- **💾 Exportar SVG**: Baixa o diagrama como arquivo SVG
- **🔍 Ajustar Zoom**: Ajusta o zoom para mostrar todo o diagrama

### Controles de Zoom

- **+**: Aumentar zoom
- **−**: Diminuir zoom
- **⌂**: Resetar zoom para visualização completa

### Interações

- **Clique** em uma atividade na lista para destacá-la
- **Clique** em elementos do diagrama para selecioná-los
- **Hover** sobre elementos para feedback visual

## 📁 Estrutura do Projeto

```
📦 BPMN/
├── 🌐 index.html          # Interface do visualizador
├── ⚡ viewer.js           # Lógica JavaScript
├── 🖥️  server.js          # Servidor Express
├── 📋 main.js             # Engine BPMN original
└── 📁 processos/
    └── 📄 processo-mei.bpmn  # Diagrama BPMN
```

## 🎨 Características do Design

### Paleta de Cores

- **Primary**: Gradiente azul-roxo (#667eea → #764ba2)
- **Secondary**: Azul claro (#74b9ff → #0984e3)
- **Success**: Verde (#00b894 → #00a085)
- **Destaque**: Vermelho suave (#ff6b6b)

### Tipografia

- **Família**: Segoe UI, sistema
- **Pesos**: Regular (400), Semibold (600)
- **Tamanhos**: Responsivos e hierárquicos

## 🔧 Tecnologias Utilizadas

- **[bpmn-js](https://bpmn.io/toolkit/bpmn-js/)**: Visualização BPMN
- **[Express.js](https://expressjs.com/)**: Servidor HTTP
- **HTML5/CSS3**: Interface moderna
- **JavaScript ES6+**: Lógica interativa

## 📱 Responsividade

O visualizador é totalmente responsivo e se adapta a:

- **Desktop**: Experiência completa
- **Tablet**: Layout otimizado
- **Mobile**: Controles adaptados

## 🐛 Resolução de Problemas

### Servidor não inicia

```bash
# Verificar se a porta 3000 está livre
netstat -an | grep :3000

# Instalar dependências novamente
npm install
```

### Diagrama não carrega

- Verificar se o arquivo `processos/processo-mei.bpmn` existe
- Verificar console do navegador para erros JavaScript

### Erro de CORS

- Sempre usar o servidor (`npm run viewer`)
- Não abrir o `index.html` diretamente no navegador

## 🎯 Próximos Passos

- [ ] Adicionar filtros por tipo de atividade
- [ ] Implementar busca por nome de atividade
- [ ] Adicionar informações detalhadas em tooltips
- [ ] Suporte para múltiplos diagramas
- [ ] Modo escuro
- [ ] Histórico de visualização

---

**Desenvolvido para facilitar a visualização e compreensão do processo BPMN de abertura de MEI** 🎉
