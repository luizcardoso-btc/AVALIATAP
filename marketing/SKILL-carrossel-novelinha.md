---
name: carrossel-novelinha-nextap
description: Cria carrosséis e fotos estilo "novelinha" (mini-histórias em capítulos com personagens de IA) e prévias grátis de placa para prospects (mockup com o nome do negócio) para divulgar a NexTap no Instagram e abrir conversa de venda. Use sempre que o Luiz pedir carrossel, novelinha, história em capítulos, post de Instagram da NexTap, apresentação do negócio de um cliente ou lead feita com IA, prévia/mockup da placa para uma empresa, ou material de porta de entrada para a Bianca/vendedor abordar, mesmo que ele não diga "skill".
---

# Carrossel novelinha + prévia grátis NexTap

A NexTap vende placas NFC + QR Code que levam o cliente direto à tela de avaliar no Google. Este skill produz os dois materiais de **porta de entrada**: o que atrai atenção (carrossel em capítulos) e o que abre a conversa com uma empresa específica (prévia grátis da placa dela). A placa é o produto principal; o conteúdo só precisa levar até ela.

Os scripts ficam no repositório `luizcardoso-btc/NEXTAP`, pasta `marketing/` (`scripts/render_carousel.py`, `scripts/mockup_prospect.py`, `assets/logo-nextap.png`). Dependências: Pillow e segno (`pip install --break-system-packages pillow segno`). Se o repositório não estiver no ambiente, adicione com add_repo e clone antes de começar.

## 1. Carrossel novelinha (história em capítulos)

### Por que funciona
Cada slide termina com uma pergunta aberta ("E aí?", "A virada"), então a pessoa desliza para saber o que acontece. A história é de um dono de negócio com a dor que o público do Luiz reconhece (ótimo serviço, pouca avaliação no Google). A placa aparece como virada, não como anúncio na capa.

### Roteiro (6 a 8 slides, 4:5, 1080×1350)
1. **Capa**: promessa dramática curta + "Novela NexTap · Ep. N". Máx. 12 palavras.
2. **Conflito**: a cena da dor (salão vazio, concorrente com 300 avaliações).
3. **Piora ou dúvida**: o dono descobre por que ninguém o acha.
4. **Virada**: um cliente aproxima o celular da placa e cai na tela de avaliar.
5. **Revelação**: o efeito (mais avaliações, mais cliques, mais mesas). Sem número prometido.
6. **Final + CTA**: "Peça uma prévia grátis com o nome do seu negócio" e como (link na bio / WhatsApp / comentar).
Cada capítulo: título de até 8 palavras e texto de até 25. Dê um gancho ao fim de cada slide, menos o último.

### Personagens e imagens de IA
- Reaproveite o mesmo personagem entre os episódios: escreva uma "ficha" (idade, cabelo, roupa, local) e cole-a em todo prompt de imagem. Se o Luiz tiver a modelo virtual recorrente (loira, ~22 anos, gaúcha, olhos azuis, delineado, tatuagem de borboleta no antebraço), use-a como a vendedora/apresentadora; a placa tem ~10 × 10 cm, e mantenha essa proporção nas imagens.
- Gere um arquivo `prompts.md` com um prompt por slide (cena, enquadramento vertical 4:5, luz, expressão, a placa visível quando fizer parte da cena). Este ambiente não gera imagens: o Luiz cria as artes numa ferramenta de imagem e passa os arquivos; você troca só o campo `imagem` do roteiro e renderiza de novo. Sem imagem, o script usa um fundo em degradê com o número do capítulo, que já serve de rascunho para aprovar o texto.
- Quando a IA deformar a placa ou o logo, substitua pela arte original (a placa NexTap tem fotos em `midia/` no repositório do site).

### Gerar
Monte o `roteiro.json` e rode `python3 marketing/scripts/render_carousel.py roteiro.json saida --zip`.
```json
{"aviso":"História fictícia · cena ilustrativa","paleta":{"bg":"#0a1f16","acento":"#22c55e"},
 "slides":[{"tipo":"capa","capitulo":"Novela NexTap · Ep. 1","titulo":"...","gancho":"Capítulo 1"},
           {"capitulo":"Capítulo 1","titulo":"...","texto":"...","gancho":"E aí?","imagem":"/caminho/arte.png"},
           {"tipo":"cta","capitulo":"Final","titulo":"...","texto":"..."}]}
```
Abra pelo menos a capa, um slide do meio e o CTA com Read para conferir: texto cortado, contraste, rosto coberto pelo texto.

## 2. Prévia grátis para o prospect (porta de entrada)

Use quando existe uma empresa-alvo (da aba Prospecção, da Bianca ou citada pelo Luiz). A prévia mostra a placa com o **nome** da empresa e, se houver, a nota e o número de avaliações do Google, e vem com a mensagem pronta de abordagem.
```
python3 marketing/scripts/mockup_prospect.py --empresa "Nome" --segmento "Barbearia" --nota 4.1 --avaliacoes 23 --saida previa.png
```
Gera `previa.png` e `previa.txt`. Entregue as duas coisas. Só nome em texto: não use logo, foto ou fachada da empresa sem autorização dela. Para um lote, rode uma vez por empresa e nomeie por slug.

## Regras de conformidade (por que existem)
- História de ficção é marcada como tal ("História fictícia · cena ilustrativa"): o Meta e o consumidor precisam saber que não é depoimento real.
- Nada de avaliação, depoimento ou resultado inventado apresentado como real. Números só ilustrativos e rotulados; nunca prometa aumento de faturamento ou de nota.
- Respeite a política do Google: nada de oferecer brinde por avaliação nem pedir só para quem vai dar nota boa.
- Rosto de pessoa real só com autorização. Personagens de IA não imitam ninguém.
- Preço ou condição no criativo: asterisco e rodapé com a condição.
- Cite negócios clientes (Qê Pizza, Stop Pastelaria, Neto, Expresso) só depois de o Luiz confirmar que autorizaram.

## Entrega
Responda em poucas linhas: o roteiro em uma frase por capítulo, os arquivos (`SendUserFile` do zip ou da prévia), e um próximo passo útil (ex.: gerar as artes de IA com `prompts.md`, ou versão em vídeo com o editor-de-video-pro). Sem recap do processo.
