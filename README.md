# 🎰 Poker Tournament Timer

Sistema profissional de gerenciamento de torneios de poker com timer de blinds automático.

## ✨ Features Implementadas (v1.0)

- ⏱️ **Timer automático** com progressão de blinds
- 🎮 **Controles completos**: Play, Pause, Reset, Next/Prev Level
- ⚡ **Ajustes rápidos**: Adicionar/remover tempo (1min, 5min)
- 🎨 **Design premium** inspirado em cassinos reais
- 📊 **Estrutura de blinds** pré-configurada (12 níveis)
- 🔔 **Alertas visuais** quando o tempo está acabando
- 📱 **100% Responsivo** - funciona em qualquer dispositivo
- 💾 **Estado gerenciado** com Zustand (preparado para persistência)

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. **Instale as dependências:**
```bash
npm install
```

2. **Rode em modo desenvolvimento:**
```bash
npm run dev
```

3. **Abra no navegador:**
```
http://localhost:3000
```

## 🏗️ Arquitetura

### Stack Tecnológica
- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Zustand** (gerenciamento de estado)
- **Tailwind CSS** (estilização)
- **Lucide React** (ícones)

### Estrutura de Pastas
```
poker-timer-app/
├── app/
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globais
├── components/
│   └── TimerDisplay.tsx    # Componente principal do timer
├── hooks/
│   └── useTournamentTimer.ts  # Hook customizado
├── store/
│   └── tournament-store.ts    # Zustand store
├── types/
│   └── tournament.ts       # TypeScript types
└── lib/
    └── utils.ts            # Utilitários
```

## 🎯 Como Usar

1. **Iniciar Torneio**: Clique em "START" para começar o timer
2. **Pausar**: Use "PAUSE" durante breaks
3. **Ajustar Tempo**: Use os botões "+1 MIN" ou "-1 MIN" conforme necessário
4. **Avançar Nível**: Use "NEXT" para pular para o próximo nível manualmente
5. **Resetar**: "RESET" volta tudo ao início

## 📝 Estrutura de Blinds Padrão

O sistema vem com uma estrutura de 12 níveis pré-configurada:

- Níveis 1-2: 25/50 e 50/100 (sem ante)
- Níveis 3-12: Progressão gradual até 1000/2000
- Duração: 20 minutos por nível (1200 segundos)

## 🔧 Customização

### Modificar Estrutura de Blinds

Edite o arquivo `store/tournament-store.ts`:

```typescript
const defaultStructure: BlindLevel[] = [
  { level: 1, smallBlind: 25, bigBlind: 50, ante: 0, duration: 1200 },
  // Adicione mais níveis aqui
];
```

### Ajustar Cores do Tema

Edite `tailwind.config.js` para mudar o esquema de cores.

## 🚀 Próximos Passos

- [ ] Persistência com localStorage
- [ ] Multiple tournament templates
- [ ] Player management
- [ ] Payout calculator
- [ ] Sound alerts
- [ ] Export/Import structures
- [ ] Responsive mobile layout optimization

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🎨 Design Features

- **Gradientes emerald/slate** para tema de cassino premium
- **Animações suaves** com Tailwind
- **Tipografia Playfair Display** para elegância
- **Alertas visuais** com cores: verde (normal), amarelo (warning), vermelho (crítico)
- **Background pattern** com naipes de cartas animados

## 🛠️ Tecnologias de Estado

### Por que Zustand?
- ✅ Leve e performático
- ✅ Sem boilerplate
- ✅ TypeScript-first
- ✅ Fácil de testar
- ✅ Preparado para persistência futura

## 📄 Licença

MIT

---

Desenvolvido com ♠️ ♥️ ♦️ ♣️
