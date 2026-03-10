# PRN PulseOps (Protótipo interativo)

Protótipo inicial de plataforma interna para organização operacional da PRN Diagnósticos.

## Como executar

```bash
python3 -m http.server 4173
```

Acesse: `http://localhost:4173`

## Recursos interativos

- Dashboard com KPIs de execução
- Kanban com arrastar e soltar
- Filtro por prioridade/status
- Criação rápida de tarefa
- Modo foco
- Evolução por fases com IA
- **Data Studio** para editar dados críticos (prioridades, próximos passos e base semanal)
- **Checagem de dados** antes de salvar, com mensagens de inconsistência
- Persistência no navegador via `localStorage`

## Como tornar ainda mais inteligente (subagentes)

Você pode usar um fluxo de “subagentes lógicos” no processo de produto/engenharia:

1. **Agente de Diagnóstico de Dados**: valida campos obrigatórios e qualidade dos dados.
2. **Agente de Estratégia Operacional**: revisa prioridades/impacto e propõe reordenação.
3. **Agente de UX e Fluxo**: avalia fricções e recomenda simplificações de interação.
4. **Agente Integrador**: consolida recomendações e gera um plano único de implementação.

No protótipo atual, isso foi iniciado com o Data Studio + validação local. Em próxima fase, esse fluxo pode evoluir para IA assistiva real.
