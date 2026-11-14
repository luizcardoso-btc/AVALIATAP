# Bianca · Setor de vendas

A Bianca faz a varredura diária de empresas de Feira de Santana e entrega os leads em `bianca/lotes/AAAA-MM-DD.json`.
O servidor importa cada arquivo uma única vez, no início (a cada deploy). Empresas repetidas (mesmo telefone, Instagram ou nome + bairro) são ignoradas.

Formato:
```json
{ "data": "2026-11-13", "empresas": [
  { "nome": "Barbearia Exemplo", "telefone": "+55 75 99999-0000", "segmento": "Barbearia", "bairro": "Centro",
    "endereco": "Rua X, 10 - Centro", "instagram": "exemplo", "google_nota": 4.2, "google_avaliacoes": 31 } ] }
```
Regras: só dados públicos e comerciais da empresa; nunca invente telefone, nota ou nº de avaliações (deixe o campo de fora).
Cada empresa precisa de telefone ou Instagram. Os leads aparecem no painel em Prospecção → Hoje, já pontuados.

Opcional: com a variável `BIANCA_TOKEN` (16+ caracteres) na Railway, `POST /api/prospeccao/bianca/lote` aceita o mesmo JSON com o cabeçalho `x-bianca-token`.
