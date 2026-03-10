# PRN PulseOps (Protótipo interativo)

Protótipo de plataforma interna para organização operacional da PRN Diagnósticos, com foco em painel diário, edição de dados e experiência moderna.

## Como executar

```bash
python3 -m http.server 4173
```

Acesse: `http://localhost:4173`

## Recursos interativos

- Dashboard com KPIs operacionais animados
- Kanban com arrastar e soltar
- Filtro por prioridade/status
- Criação rápida e estruturada de tarefas
- Modo foco
- Evolução por fases com IA
- Data Studio para editar dados críticos
- Checagem de consistência dos dados antes de salvar
- Persistência no navegador via `localStorage`
- Efeitos visuais modernos: cards com glow, entrada em scroll e canvas responsivo animado no fundo

## Estratégia de “subagentes lógicos” aplicada

1. **Subagente de Diagnóstico UI**: identifica gargalos visuais e responsividade.
2. **Subagente de Motion/Interação**: define animações com ganho funcional (não apenas estética).
3. **Subagente de Dados**: garante edição + validação de dados críticos.
4. **Subagente Integrador**: consolida UX + visual + dinâmica em uma entrega única.

> Neste protótipo, essa estratégia foi aplicada diretamente no código para acelerar implementação prática.
