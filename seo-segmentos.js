// Páginas de SEO por segmento + guias + hub. ARQUIVO NOVO. Só texto; preços vêm de ctx.tabela()/ctx.minimo().
// Cada página tem texto próprio (sem copiar de uma para outra) para o Google tratar como conteúdo distinto.

const SEG = [
  {
    slug: 'restaurante', nome: 'Restaurante', art: 'o seu restaurante', plural: 'restaurantes',
    intro: 'Quem escolhe onde comer pesquisa no Google Maps, olha a nota e lê as últimas avaliações antes de decidir. Um restaurante com 4,7 e centenas de avaliações recentes aparece na frente e passa confiança antes mesmo do cliente ver o cardápio.',
    porque: ['O cliente sai da mesa feliz, mas esquece de avaliar. A placa transforma a vontade em ação em 5 segundos.', 'Avaliações recentes pesam na ordem em que o restaurante aparece em "restaurantes perto de mim".', 'Respostas do dono às avaliações mostram cuidado e ajudam a recuperar quem teve uma experiência ruim.'],
    onde: ['Na mesa ou no suporte do pagamento, onde o cliente já está com o celular na mão.', 'No balcão do caixa, ao lado da maquininha.', 'Na comanda ou na conta, com um aviso curto como "Gostou? Avalie no Google".'],
    momento: 'O melhor momento é logo depois da refeição, quando a conta chega ou o garçom pergunta se estava tudo bem. Treine a equipe para falar uma frase só: "Se gostou, aproxime o celular da plaquinha e deixe sua avaliação".',
    cuidado: 'Não prometa sobremesa, desconto ou brinde em troca da avaliação. O Google proíbe avaliações incentivadas e pode remover as avaliações do seu perfil.',
    faq: [['Quantas placas um restaurante precisa?', 'Uma por mesa grande ou por área de atendimento e uma no caixa. Para começar, 3 a 5 placas cobrem a maioria dos restaurantes pequenos.'], ['Funciona para delivery?', 'A placa é para o cliente presencial. Para delivery, use o mesmo link de avaliação em um cartão dentro da embalagem ou no QR Code impresso na sacola.']],
  },
  {
    slug: 'clinica-e-consultorio', nome: 'Clínica e consultório', art: 'a sua clínica ou consultório', plural: 'clínicas e consultórios',
    intro: 'Antes de marcar uma consulta, o paciente procura a clínica no Google, vê a nota e lê o que outros pacientes escreveram. Uma boa reputação online reduz a insegurança do primeiro contato e aumenta os agendamentos.',
    porque: ['O paciente decide em minutos entre duas ou três clínicas próximas; a nota e a quantidade de avaliações pesam muito.', 'Avaliações reais sobre atendimento, pontualidade e acolhimento ajudam quem está com receio de começar um tratamento.', 'Perfis com muitas avaliações recentes aparecem melhor em buscas como "clínica perto de mim".'],
    onde: ['Na recepção, ao lado do balcão de atendimento.', 'Na sala de espera, em um suporte visível.', 'No balcão de saída, onde o paciente paga ou agenda o retorno.'],
    momento: 'Peça quando o paciente já está de saída e satisfeito com o atendimento, no momento do pagamento ou do agendamento do retorno. Evite pedir durante o tratamento ou dentro da sala de atendimento.',
    cuidado: 'Na área da saúde existem regras dos conselhos profissionais (CFM, CFO, CRP e outros) sobre divulgação e depoimentos. A placa só facilita o acesso à tela de avaliação do Google, mas confirme as normas do seu conselho antes de divulgar avaliações e nunca ofereça benefício em troca de nota.',
    faq: [['A placa pode ser usada em consultório médico?', 'Sim, ela apenas leva o paciente à tela de avaliação do Google. Cada profissional deve seguir as normas do seu conselho sobre divulgação e não pode oferecer vantagens em troca da avaliação.'], ['O paciente precisa instalar algo?', 'Não. Basta aproximar o celular (NFC) ou ler o QR Code com a câmera.']],
  },
  {
    slug: 'salao-de-beleza', nome: 'Salão de beleza', art: 'o seu salão de beleza', plural: 'salões de beleza',
    intro: 'Beleza é um serviço de confiança: ninguém entrega o cabelo a um profissional desconhecido. O cliente olha fotos, nota e comentários no Google para escolher o salão, e boas avaliações viram agenda cheia.',
    porque: ['Cliente que acabou de ver o resultado no espelho está no pico da satisfação, o melhor momento para avaliar.', 'Comentários que citam o profissional e o serviço (corte, coloração, escova) atraem quem procura exatamente isso.', 'Nota alta e avaliações recentes diferenciam o salão em bairros com muita concorrência.'],
    onde: ['No caixa, onde o cliente paga e espera a maquininha.', 'Na bancada do espelho ou no balcão de recepção.', 'Na saída, junto ao cartão com o horário do retorno.'],
    momento: 'Logo depois do serviço, com o cliente olhando o resultado. A frase certa é simples: "Gostou? Aproxima o celular aqui e conta pra gente".',
    cuidado: 'Não selecione quem pode avaliar. O Google proíbe filtrar clientes para só receber avaliações positivas, e a prática pode derrubar seu perfil.',
    faq: [['Posso colocar uma placa por profissional?', 'Pode, mas o link de avaliação é o do salão. Se cada profissional tiver o próprio perfil, cada placa pode apontar para o respectivo link.'], ['Qual a vantagem sobre um cartãozinho com QR Code?', 'A placa fica fixa e visível, não se perde, e o NFC deixa o acesso ainda mais rápido para quem tem celular compatível.']],
  },
  {
    slug: 'barbearia', nome: 'Barbearia', art: 'a sua barbearia', plural: 'barbearias',
    intro: 'Barbearia vive de recorrência e indicação, e o Google é a nova indicação: o cliente novo busca "barbearia perto de mim" e escolhe pela nota. Quem junta avaliações aparece primeiro e ocupa a agenda.',
    porque: ['O cliente de barbearia costuma voltar a cada 15 ou 30 dias; cada visita é uma chance de pedir uma avaliação.', 'Avaliações citando o barbeiro e o estilo de corte trazem clientes que procuram aquele serviço.', 'Nota alta compensa a localização menos nobre e ajuda a cobrar melhor.'],
    onde: ['No balcão de pagamento, na altura do olhar.', 'No espelho da cadeira ou na bancada de cada barbeiro.', 'Na área de espera, junto ao material de divulgação.'],
    momento: 'Depois do corte, quando o cliente se olha no espelho e aprova o resultado. O barbeiro só precisa apontar para a placa e dizer "se curtiu, avalia a gente".',
    cuidado: 'Não pague nem dê desconto por avaliação. Avaliação incentivada vai contra as regras do Google e pode ser removida.',
    faq: [['Quantas placas colocar na barbearia?', 'Uma no caixa e uma na espera já resolvem. Barbearias com várias cadeiras podem colocar uma por bancada.'], ['Serve também para o perfil do Instagram?', 'O QR Code é dinâmico, então o destino pode ser trocado depois, por exemplo, para o Instagram, sem trocar a placa.']],
  },
  {
    slug: 'oficina-mecanica', nome: 'Oficina mecânica', art: 'a sua oficina', plural: 'oficinas mecânicas',
    intro: 'Quem precisa de mecânico quer segurança de que não vai levar prejuízo. O Google virou o filtro: o cliente procura "oficina perto de mim", compara notas e lê se o serviço foi honesto, no prazo e com o preço combinado.',
    porque: ['Confiança é o principal fator na escolha de uma oficina, e avaliações são a prova social mais direta.', 'Cliente que retirou o carro funcionando e pagou o valor combinado tende a avaliar bem se for lembrado.', 'Poucas oficinas pedem avaliação; quem pede se destaca facilmente na região.'],
    onde: ['No balcão de entrega do veículo, onde o cliente paga e pega a chave.', 'Na recepção, ao lado do quadro de serviços.', 'Anexada à ordem de serviço, com o QR Code à vista.'],
    momento: 'Na entrega do carro, depois de mostrar o serviço feito e explicar o que foi trocado. O cliente aliviado e satisfeito é o que mais avalia.',
    cuidado: 'Responda também às críticas com educação e explique o que foi feito. Quem lê as avaliações percebe quando o dono se importa.',
    faq: [['Posso usar a placa em autopeças e funilaria?', 'Sim, qualquer negócio local com perfil no Google pode usar. Basta ter o link de avaliação do seu perfil.'], ['O cliente consegue avaliar sem sair do carro?', 'Sim, aproximando o celular da placa ou lendo o QR Code, em poucos segundos.']],
  },
  {
    slug: 'hotel-e-pousada', nome: 'Hotel e pousada', art: 'o seu hotel ou pousada', plural: 'hotéis e pousadas',
    intro: 'O hóspede compara hospedagens pelo Google Maps e pelas notas antes de reservar. Uma pousada bem avaliada converte mais reservas diretas e depende menos de plataformas que cobram comissão.',
    porque: ['Reserva direta rende mais que reserva por plataforma, e a nota no Google ajuda a trazê-la.', 'Hóspedes satisfeitos costumam avaliar no check-out se o caminho for rápido.', 'Avaliações citando limpeza, café da manhã e atendimento respondem as dúvidas de quem vai reservar.'],
    onde: ['No balcão do check-out, ao lado do sino ou do terminal de cartão.', 'No quarto, em uma mesa de cabeceira ou junto ao guia da casa.', 'No café da manhã, na mesa de saída ou no balcão de buffet.'],
    momento: 'No check-out ou no último café da manhã, quando a experiência está completa. A recepção pode entregar a chave de volta e sugerir a avaliação.',
    cuidado: 'Não peça avaliação a quem teve problema e mande só os satisfeitos. O Google proíbe esse filtro, e é mais seguro resolver o problema e deixar o hóspede decidir.',
    faq: [['A placa funciona para hóspedes estrangeiros?', 'Sim. O QR Code e o NFC funcionam em qualquer celular compatível, e a tela de avaliação abre no idioma do Google do hóspede.'], ['Posso colocar uma placa em cada quarto?', 'Pode. Muitas pousadas usam uma no quarto e outra na recepção.']],
  },
  {
    slug: 'academia', nome: 'Academia', art: 'a sua academia', plural: 'academias',
    intro: 'Quem procura academia pesquisa no Google a nota, as fotos e os comentários sobre equipamentos, limpeza e atendimento dos professores. Boas avaliações pesam na hora de fechar a matrícula.',
    porque: ['Matrícula é decisão de médio prazo; o interessado quer ver que outras pessoas estão satisfeitas.', 'Alunos engajados avaliam facilmente se o convite acontece no momento certo, como após um treino bom.', 'Comentários sobre professores e ambiente respondem às dúvidas mais comuns de quem está começando.'],
    onde: ['Na recepção, ao lado da catraca ou do totem de check-in.', 'No vestiário, perto do espelho de saída.', 'No bebedouro ou na área de alongamento, onde o aluno fica parado.'],
    momento: 'Depois do treino, na saída, ou em datas simbólicas como o aniversário de matrícula. Professores podem lembrar com uma frase curta ao final da aula.',
    cuidado: 'Não faça sorteios ou prêmios por avaliação. O Google proíbe avaliações incentivadas, e você pode perder as avaliações já conquistadas.',
    faq: [['Quantas placas colocar na academia?', 'Uma na recepção e uma na saída do vestiário costumam ser suficientes para a maioria das academias.'], ['Serve para estúdios de pilates e crossfit?', 'Sim, qualquer estúdio ou box com perfil no Google pode usar.']],
  },
  {
    slug: 'pet-shop', nome: 'Pet shop', art: 'o seu pet shop', plural: 'pet shops e clínicas veterinárias',
    intro: 'Tutor de pet é exigente e leal: quando acha um lugar de confiança para banho, tosa ou consulta, volta sempre. O Google é onde ele pesquisa antes e onde indica depois.',
    porque: ['O tutor confia em quem trata bem o animal e costuma elogiar o atendimento publicamente.', 'Avaliações com fotos e nomes dos pets criam proximidade e ajudam novos clientes a escolher.', 'Cuidado com os bichos é emocional; boas notas reduzem a hesitação do primeiro atendimento.'],
    onde: ['No balcão, onde o tutor pega o pet após o banho e paga.', 'Na entrada, em um suporte visível para quem espera.', 'Na bancada de entrega, junto ao laço ou à embalagem do banho.'],
    momento: 'Na entrega do pet limpo e feliz, quando o tutor vê o resultado. É o pico de satisfação e é difícil encontrar momento melhor.',
    cuidado: 'Peça a todos os clientes, não só aos que elogiaram. O Google proíbe filtrar quem pode avaliar, e a reputação fica mais real com todos.',
    faq: [['Posso usar em clínica veterinária?', 'Sim. Veterinárias também usam para reforçar a confiança. Siga as normas do conselho veterinário sobre divulgação.'], ['O QR Code muda se eu trocar de perfil?', 'O QR Code é dinâmico: o destino pode ser alterado pelo painel sem trocar a placa.']],
  },
  {
    slug: 'loja-de-roupas', nome: 'Loja de roupas', art: 'a sua loja de roupas', plural: 'lojas de roupas e boutiques',
    intro: 'Quem passa pela vitrine e quem pesquisa "loja de roupas perto de mim" olha a nota antes de entrar. Uma loja bem avaliada ganha tráfego de rua e também de busca.',
    porque: ['A experiência de compra e o atendimento da vendedora são os pontos mais citados e ajudam a atrair quem busca bom atendimento.', 'Cliente que acabou de comprar algo que gostou está motivado e disposto a dividir a experiência.', 'Mais avaliações aumentam o número de pessoas que pedem rota e ligam para a loja.'],
    onde: ['No caixa, onde o cliente já está com o celular para pagar.', 'No provador, em um espelho ou suporte pequeno.', 'No balcão de embalagem, junto à sacola ou ao cartão de agradecimento.'],
    momento: 'Na hora do pagamento, enquanto a vendedora embala. Uma frase como "se gostou do atendimento, avalia a gente no Google" costuma bastar.',
    cuidado: 'Não ofereça cupom de desconto em troca da avaliação. É uma prática proibida pelo Google e pode resultar na remoção das avaliações.',
    faq: [['A placa serve para loja dentro de shopping?', 'Sim. Se a loja tiver perfil próprio no Google, a placa leva direto para a avaliação dela.'], ['Posso personalizar a placa com a minha marca?', 'Entre em contato pelo painel para consultar opções de personalização.']],
  },
  {
    slug: 'padaria-e-cafeteria', nome: 'Padaria e cafeteria', art: 'a sua padaria ou cafeteria', plural: 'padarias e cafeterias',
    intro: 'Padaria e cafeteria vivem de recorrência e de gente que passa na frente. A nota no Google decide se um cliente novo entra ou segue em frente, principalmente para café da manhã e lanche.',
    porque: ['O fluxo é grande e rápido, então a avaliação precisa ser feita em poucos segundos, e o NFC ajuda nisso.', 'Avaliações citando o pão, o café e o atendimento ajudam quem busca "café da manhã perto de mim".', 'Cliente frequente é o melhor avaliador: já conhece o produto e confia no lugar.'],
    onde: ['No balcão do caixa, bem à vista da fila.', 'Nas mesas de consumo, em um suporte pequeno.', 'No balcão de entrega de pedidos, junto ao totem de senha.'],
    momento: 'Enquanto o cliente espera o pedido ou toma o café, quando tem alguns segundos livres. Um aviso curto na placa já chama atenção.',
    cuidado: 'Não peça avaliação só de quem elogiou. Pedir a todos é o que mantém a nota real e dentro das regras do Google.',
    faq: [['Posso colocar mais de uma placa?', 'Pode. Muitas padarias usam uma no caixa e outras nas mesas.'], ['Serve para quiosque ou food truck?', 'Sim, desde que o local tenha perfil no Google. A placa é leve e fácil de fixar.']],
  },
  {
    slug: 'farmacia', nome: 'Farmácia', art: 'a sua farmácia', plural: 'farmácias e drogarias',
    intro: 'Farmácia é compra de necessidade, mas o cliente escolhe onde ir pela confiança, pela rapidez e pelo atendimento. A nota no Google ajuda a ser a escolhida na busca por "farmácia perto de mim".',
    porque: ['Atendimento rápido e cordial é o que mais aparece nas avaliações e traz clientes recorrentes.', 'Em bairros com várias farmácias, a nota e a quantidade de avaliações viram critério de desempate.', 'Cliente que foi bem orientado pelo farmacêutico costuma elogiar e indicar.'],
    onde: ['No caixa, junto à maquininha.', 'No balcão de atendimento, ao lado da bancada de manipulação.', 'Na saída, em um suporte pequeno.'],
    momento: 'No pagamento, quando a compra já foi concluída e o atendimento foi bom. Nada de interromper a orientação farmacêutica.',
    cuidado: 'Respeite as normas da vigilância sanitária e do conselho de farmácia sobre divulgação. A placa apenas facilita a avaliação, sem prometer benefícios em troca.',
    faq: [['A placa pode ter informação de produtos?', 'A placa é só para direcionar à avaliação. Evite colocar promessas de produtos ou resultados.'], ['Funciona em rede com várias lojas?', 'Sim, cada loja usa o link de avaliação do seu próprio perfil, e o painel permite gerenciar vários links.']],
  },
  {
    slug: 'lava-jato-e-estetica-automotiva', nome: 'Lava-jato e estética automotiva', art: 'o seu lava-jato ou estética automotiva', plural: 'lava-jatos e centros de estética automotiva',
    intro: 'Quem leva o carro para lavar ou polir quer ver o resultado e confiar no profissional. O cliente decide pelo Google, olhando fotos do antes e depois e o que outras pessoas dizem sobre cuidado e prazo.',
    porque: ['O resultado é visível na hora, o que favorece a avaliação de quem busca valorizar o carro.', 'Avaliações citando a qualidade do polimento e da cristalização atraem clientes com ticket maior.', 'Poucos concorrentes pedem avaliação de forma ativa; quem pede aparece muito à frente.'],
    onde: ['No balcão de entrega das chaves.', 'Na área de espera, perto da vitrine de serviços.', 'Fixada em um suporte na saída do pátio.'],
    momento: 'Na entrega, enquanto o cliente olha o carro limpo e brilhando. Tire uma foto do antes e depois e peça a avaliação em seguida.',
    cuidado: 'Evite pedir avaliação no calor de uma reclamação. Resolva o problema primeiro e depois convide, sem condicionar a nota.',
    faq: [['A placa aguenta ambiente com água e sabão?', 'Ela é de acrílico, mas é melhor fixar longe de respingos diretos, como na recepção ou na área de espera.'], ['Posso apontar o QR Code para o Instagram depois?', 'Sim. O QR Code é dinâmico e o destino pode ser trocado pelo painel.']],
  },
  {
    slug: 'imobiliaria', nome: 'Imobiliária e corretor', art: 'a sua imobiliária', plural: 'imobiliárias e corretores',
    intro: 'Comprar ou alugar um imóvel é uma decisão grande, e o cliente pesquisa a reputação da imobiliária no Google antes de entrar em contato. Avaliações reais pesam mais que qualquer propaganda.',
    porque: ['O ticket é alto e a confiança é decisiva; avaliações de clientes que fecharam negócio têm muito peso.', 'Comentários sobre transparência, agilidade e acompanhamento diferenciam a imobiliária.', 'Poucas imobiliárias pedem avaliação ao fim do processo, então há espaço para se destacar.'],
    onde: ['Na recepção da imobiliária, ao lado da mesa de atendimento.', 'Na sala de assinatura de contratos.', 'Em visitas, o corretor pode levar um cartão com o QR Code.'],
    momento: 'Na entrega das chaves ou na assinatura do contrato, quando o cliente está satisfeito com o desfecho. Nunca antes de fechar.',
    cuidado: 'Siga as normas do CRECI sobre divulgação e não ofereça vantagens por avaliações. A placa só facilita a abertura da tela de avaliação.',
    faq: [['Posso colocar a placa na mesa do corretor?', 'Sim, e cada corretor com perfil próprio pode ter a placa com o seu link.'], ['Funciona para quem atende em plantão de vendas?', 'Sim. A placa é portátil e pode ser levada para o estande ou plantão.']],
  },
  {
    slug: 'escritorio-de-contabilidade-e-advocacia', nome: 'Contabilidade e advocacia', art: 'o seu escritório', plural: 'escritórios de contabilidade e advocacia',
    intro: 'Escritórios de serviços profissionais ganham clientes por indicação e por busca. O potencial cliente pesquisa o nome no Google e quer ver que outras pessoas ficaram satisfeitas com o atendimento e os resultados.',
    porque: ['Confiança e clareza na comunicação são os pontos mais citados e decisivos para quem contrata.', 'Em serviços recorrentes como contabilidade, a satisfação ao longo do tempo gera avaliações de qualidade.', 'Avaliações aumentam a chance de o escritório aparecer em buscas locais como "contador perto de mim".'],
    onde: ['Na recepção do escritório.', 'Na sala de reuniões, ao lado do material de apresentação.', 'No balcão de atendimento, onde o cliente assina ou retira documentos.'],
    momento: 'Depois de um serviço bem entregue, como a abertura de empresa, uma declaração ou uma causa encerrada, quando o cliente reconhece o valor do trabalho.',
    cuidado: 'Advogados devem seguir o Código de Ética da OAB sobre publicidade, e contadores, as normas do CRC. A placa só facilita a avaliação, sem prometer vantagens.',
    faq: [['A placa combina com a imagem de um escritório?', 'Sim, a versão em acrílico é discreta e fica bem em recepções e mesas.'], ['Clientes que atendo remotamente podem avaliar?', 'Podem. Envie o link do Google por mensagem ou e-mail, e use a placa para quem vai ao escritório.']],
  },
  {
    slug: 'dentista', nome: 'Dentista e clínica odontológica', art: 'a sua clínica odontológica', plural: 'dentistas e clínicas odontológicas',
    intro: 'Medo do dentista é comum, e o paciente procura sinais de acolhimento antes de marcar. Avaliações falando de cuidado, ausência de dor e clareza no orçamento ajudam quem está inseguro a dar o primeiro passo.',
    porque: ['O paciente com receio lê avaliações para saber se será bem tratado, e isso pesa muito na marcação.', 'Tratamentos têm ticket alto, e a reputação online influencia a decisão por um orçamento.', 'Pacientes satisfeitos com o resultado costumam avaliar se o convite for simples e rápido.'],
    onde: ['Na recepção, no balcão onde o paciente agenda o retorno.', 'Na sala de espera.', 'No balcão do financeiro, onde o paciente paga a consulta.'],
    momento: 'Ao final do atendimento, na recepção, enquanto o paciente agenda ou paga. Não faça o pedido dentro do consultório, durante o procedimento.',
    cuidado: 'O CFO tem regras sobre publicidade odontológica, incluindo restrições a imagens de antes e depois e a depoimentos em materiais do profissional. Confirme as normas, e nunca ofereça vantagens por avaliações.',
    faq: [['Posso expor a nota do Google na clínica?', 'Verifique as normas do CFO sobre divulgação antes de exibir notas e comentários em material publicitário.'], ['A placa precisa de energia ou bateria?', 'Não. O NFC da placa funciona sem bateria, e o QR Code é impresso.']],
  },
];

const GUIAS = [
  {
    slug: 'como-conseguir-avaliacoes-no-google', titulo: 'Como Conseguir Mais Avaliações no Google (Guia Prático)',
    desc: 'Guia prático para conseguir mais avaliações no Google: quando pedir, o que dizer, como facilitar com NFC e QR Code e o que o Google proíbe.',
    h1: 'Como conseguir mais avaliações no Google para a sua empresa',
    lead: 'A maioria dos clientes satisfeitos nunca avalia, simplesmente porque ninguém pediu e o caminho é complicado. Este guia mostra o passo a passo para mudar isso sem infringir as regras do Google.',
    corpo: () => `
<h2>1. Tenha o Perfil da Empresa no Google configurado</h2><p>Antes de pedir avaliações, confirme que o seu perfil está verificado, com endereço, horário, telefone e fotos atualizados. É nele que as avaliações aparecem, no Google Maps e na busca.</p>
<h2>2. Peça no momento certo</h2><p>A melhor hora é logo depois da experiência positiva: na entrega do serviço, no pagamento ou na saída. Cliente satisfeito e com o celular na mão é o que mais avalia.</p>
<h2>3. Facilite ao máximo</h2><p>Cada passo a mais derruba a taxa de avaliação. Quem precisa procurar a empresa, tocar em "escrever avaliação" e logar tende a desistir. O ideal é levar o cliente direto para a tela de avaliação, com um QR Code ou com NFC.</p>
<h2>4. Use uma frase curta e padronizada</h2><p>Treine a equipe para dizer sempre a mesma coisa, por exemplo: "Se gostou do atendimento, aproxime o celular da plaquinha e deixe sua avaliação, ajuda muito a gente".</p>
<h2>5. Responda todas as avaliações</h2><p>Agradeça as positivas e responda com educação as críticas. Isso mostra cuidado e pode recuperar clientes insatisfeitos.</p>
<h2>O que o Google proíbe</h2><ul><li><b>Oferecer brindes, descontos ou sorteios</b> em troca de avaliação.</li><li><b>Filtrar quem pode avaliar</b>, pedindo só a quem está satisfeito.</li><li><b>Comprar avaliações</b> ou escrever avaliações falsas.</li><li><b>Pedir em massa de forma automática</b> sem critério, com texto sugerido.</li></ul><p>Descumprir essas regras pode levar à remoção de avaliações ou à suspensão do perfil.</p>
<h2>Como a placa NexTap ajuda</h2><p>A placa NexTap leva o cliente direto à tela de avaliação, por NFC ou QR Code, sem aplicativo e sem digitar nada. Fica no balcão, trabalha o dia todo e dispensa a equipe de explicar o caminho.</p>${'${TABELA}'}`,
    faq: [['Quantas avaliações preciso para ranquear melhor?', 'Não existe um número fixo. O Google considera a quantidade, a nota, a recência e o conteúdo das avaliações, junto com a relevância e a distância. O importante é ter um fluxo constante de avaliações novas.'], ['Posso pedir avaliação por WhatsApp?', 'Pode, desde que o pedido seja feito a todos os clientes, sem oferecer vantagem e sem filtrar. Enviar o link direto da avaliação aumenta muito a taxa de resposta.'], ['Quanto tempo leva para as avaliações aparecerem?', 'Em geral, poucos minutos. Alguns comentários podem passar por análise do Google antes de serem publicados.']],
  },
  {
    slug: 'como-gerar-link-de-avaliacao-do-google', titulo: 'Como Gerar o Link de Avaliação do Google (Passo a Passo)',
    desc: 'Aprenda a gerar o link direto de avaliação do Google Meu Negócio e a usar em QR Code, WhatsApp e placas NFC para receber mais avaliações.',
    h1: 'Como gerar o link de avaliação do Google da sua empresa',
    lead: 'O link de avaliação leva o cliente direto à tela para deixar estrelas e comentário. Veja como encontrá-lo no Perfil da Empresa e onde usá-lo.',
    corpo: () => `
<h2>Passo a passo</h2><ol><li>Pesquise o nome da sua empresa no Google, logado na conta que administra o perfil.</li><li>Na caixa do Perfil da Empresa, procure a opção <b>"Pedir avaliações"</b> (ou "Compartilhar formulário de avaliação").</li><li>Copie o link que o Google mostra.</li><li>Teste o link em uma aba anônima ou em outro celular para ver se abre direto na tela de avaliação.</li></ol>
<p class="mut">A opção pode aparecer com nomes ligeiramente diferentes conforme a versão do Google. Se não encontrar, procure por "avaliações" no painel do perfil.</p>
<h2>Onde usar o link</h2><ul><li><b>QR Code</b> impresso em placa, cartão ou sacola.</li><li><b>NFC</b>, gravado em placas e adesivos para aproximação.</li><li><b>WhatsApp e e-mail</b>, enviados após o atendimento.</li><li><b>Assinatura de e-mail</b> e redes sociais.</li></ul>
<h2>Por que um QR Code dinâmico é melhor</h2><p>Se você imprime o link direto em uma placa e ele muda, a placa fica inútil. Com o QR Code dinâmico, a placa aponta para um endereço intermediário que você pode alterar quando quiser pelo painel, sem trocar a placa.</p>
<h2>Como a NexTap usa o link</h2><p>No painel NexTap você cola o link de avaliação do Google, e a placa passa a abrir direto nele, por NFC ou QR Code. Se o link mudar, basta atualizar no painel.</p>${'${TABELA}'}`,
    faq: [['O link de avaliação é o mesmo link do meu perfil?', 'Não. O link de perfil abre a página da empresa; o link de avaliação abre direto a tela para escrever a avaliação.'], ['Preciso de um perfil verificado?', 'Sim, para acessar o painel e pegar o link de avaliação, o perfil precisa estar sob sua administração.'], ['Posso usar o mesmo link em várias placas?', 'Pode. Cada loja ou unidade deve usar o link do próprio perfil.']],
  },
  {
    slug: 'nfc-ou-qr-code-para-avaliacoes', titulo: 'NFC ou QR Code para Avaliações no Google: Qual é Melhor?',
    desc: 'Comparamos NFC e QR Code para pedir avaliações no Google: velocidade, compatibilidade com iPhone e Android, custo e quando usar os dois juntos.',
    h1: 'NFC ou QR Code para avaliações no Google: qual é melhor?',
    lead: 'Os dois levam o cliente à tela de avaliação, mas funcionam de formas diferentes. Veja as diferenças e por que as placas mais completas trazem os dois.',
    corpo: () => `
<h2>Como cada um funciona</h2><p><b>NFC:</b> o cliente aproxima o celular da placa e a tela de avaliação abre sozinha, sem abrir a câmera. <b>QR Code:</b> o cliente abre a câmera, aponta para o código e toca no link que aparece.</p>
<h2>Comparação rápida</h2><table><thead><tr><th>Critério</th><th>NFC</th><th>QR Code</th></tr></thead><tbody><tr><td>Velocidade</td><td>Aproximar e abrir</td><td>Abrir câmera, apontar, tocar</td></tr><tr><td>Compatibilidade</td><td>Android com NFC e iPhones a partir do XS</td><td>Praticamente qualquer celular com câmera</td></tr><tr><td>Precisa de bateria</td><td>Não</td><td>Não</td></tr><tr><td>Custo na placa</td><td>Chip incluído</td><td>Impressão</td></tr></tbody></table>
<h2>O ideal: usar os dois juntos</h2><p>Quem tem NFC resolve em um toque; quem não tem ou prefere a câmera usa o QR Code. Com os dois na mesma placa, você atende todos os clientes sem depender do modelo de celular.</p>
<h2>E o QR Code dinâmico?</h2><p>O QR Code dinâmico aponta para um endereço que você pode alterar depois. Isso evita reimprimir a placa se o link mudar ou se você quiser levar o cliente para outro destino.</p>${'${TABELA}'}`,
    faq: [['Todo iPhone lê NFC?', 'Os iPhones a partir do XS leem tags NFC sem aplicativo. Modelos mais antigos podem não ler, e por isso o QR Code é importante.'], ['A placa NFC precisa de pilha?', 'Não. O chip NFC é passivo e funciona com a energia do celular ao aproximar.'], ['A placa NexTap tem os dois?', 'Sim, todas as placas NexTap vêm com NFC e QR Code dinâmico.']],
  },
];

const cut = (t, n) => t.length <= n ? t : t.slice(0, n - 1).replace(/[\s|,;:-]+\S*$/, '').trim();
const base = (nome, art) => `<h2>Como funciona a placa NexTap em ${art.replace(/^o |^a /, '')}</h2>
<ol><li>Você coloca a placa de acrílico em um ponto visível.</li><li>O cliente aproxima o celular (NFC) ou lê o QR Code com a câmera.</li><li>A tela de avaliação do Google abre direto, sem aplicativo e sem digitar nada.</li></ol>
<p>O QR Code é dinâmico: se o link mudar, você atualiza no painel sem trocar a placa.</p>`;

const { fotos } = require('./seo-fotos.js');
module.exports = function (ctx) {
  const P = {}, ordemSeg = [], ordemGuia = [];
  const hubPath = '/placas-avaliacao-google-por-segmento';
  const outros = slug => SEG.filter(s => s.slug !== slug).slice(0, 5);
  SEG.forEach(s => {
    const path = '/placa-avaliacao-google-para-' + s.slug;
    ordemSeg.push(path);
    P[path] = {
      tipo: 'segmento', hub: hubPath, nomeCurto: s.nome, seg: { slug: s.slug, nome: s.nome, art: s.art, plural: s.plural, intro: s.intro, porque: s.porque, onde: s.onde, momento: s.momento, cuidado: s.cuidado }, rel: outros(s.slug).map(o => ({ path: '/placa-avaliacao-google-para-' + o.slug, nome: o.nome })),
      titulo: cut(`Placa de Avaliação Google para ${s.nome} | NexTap`, 62),
      desc: cut(`Placa NFC e QR Code para ${s.plural}: o cliente aproxima o celular e avalia no Google em segundos. Veja onde colocar e os preços.`, 158),
      h1: `Placa de avaliação Google para ${s.nome.toLowerCase()}`,
      lead: `Aumente as avaliações ${s.art.replace(/^o /, 'do ').replace(/^a /, 'da ')} no Google com uma placa NFC e QR Code dinâmico. O cliente aproxima o celular e avalia em segundos, sem baixar aplicativo.`,
      corpo: () => `<h2>Por que avaliações no Google importam para ${s.art}</h2><p>${s.intro}</p><ul>${s.porque.map(x => `<li>${x}</li>`).join('')}</ul>
<h2>Onde colocar a placa</h2><ul>${s.onde.map(x => `<li>${x}</li>`).join('')}</ul>
<h2>Quando pedir a avaliação</h2><p>${s.momento}</p>
${base(s.nome, s.art)}
<h2>Cuidados importantes</h2><p>${s.cuidado}</p><p>Seguindo as regras do Google, o ideal é pedir a todos os clientes, sem oferecer vantagens e sem escolher quem avalia.</p>
<h2>Preços das placas</h2>${ctx.tabela()}<p class="mut">Valor por placa conforme a quantidade, frete à parte. Pedido mínimo de ${ctx.minimo()} placas. Você também pode comprar para revender a outros ${s.plural}.</p>
<h2>Veja também</h2><ul>${outros(s.slug).map(o => `<li><a href="/placa-avaliacao-google-para-${o.slug}">Placa de avaliação Google para ${o.nome.toLowerCase()}</a></li>`).join('')}<li><a href="/como-conseguir-avaliacoes-no-google">Como conseguir mais avaliações no Google</a></li><li><a href="${hubPath}">Todos os segmentos</a></li></ul>`,
      faq: [...s.faq, ['Como a placa funciona?', 'O cliente aproxima o celular da placa (NFC) ou lê o QR Code com a câmera e a tela de avaliação do Google abre direto. Não é preciso instalar aplicativo.'], ['Qual o pedido mínimo?', `O pedido mínimo é de ${ctx.minimo()} placas, azuis, pretas ou as duas, feito direto no painel.`]],
    };
  });
  GUIAS.forEach(g => {
    const path = '/' + g.slug;
    ordemGuia.push(path);
    P[path] = { tipo: 'guia', hub: hubPath, titulo: g.titulo, desc: g.desc, h1: g.h1, lead: g.lead, faq: g.faq,
      corpo: () => g.corpo().replace('${TABELA}', `<h2>Preços das placas NexTap</h2>${ctx.tabela()}<p class="mut">Valor por placa conforme a quantidade, frete à parte. Pedido mínimo de ${ctx.minimo()} placas.</p>
<h2>Leia também</h2><ul>${GUIAS.filter(x => x.slug !== g.slug).map(x => `<li><a href="/${x.slug}">${x.h1}</a></li>`).join('')}<li><a href="${hubPath}">Placas de avaliação por segmento</a></li></ul>`) };
  });
  P[hubPath] = {
    tipo: 'hub', titulo: 'Placas de Avaliação Google por Segmento | NexTap',
    desc: 'Placas NFC e QR Code para avaliação do Google para restaurantes, clínicas, salões, barbearias, oficinas, hotéis, academias e mais. Escolha o seu segmento.',
    h1: 'Placas de avaliação Google para cada tipo de negócio',
    lead: 'A mesma placa NFC e QR Code funciona em qualquer negócio local, mas o jeito de usar muda de um segmento para outro. Veja onde colocar a placa e quando pedir a avaliação.',
    corpo: () => `<h2>Escolha o seu segmento</h2><div class="cards">${SEG.map(s => `<a class="card lk" href="/placa-avaliacao-google-para-${s.slug}">${fotos(s.slug)[0] ? `<img class="th" loading="lazy" src="${fotos(s.slug)[0]}" alt="${s.nome}">` : ''}<b>${s.nome}</b><span>Avaliações para ${s.plural}</span><i>Ver como funciona →</i></a>`).join('')}</div>
<h2>Guias para conseguir mais avaliações</h2><div class="cards">${GUIAS.map(g => `<a class="card lk" href="/${g.slug}"><b>${g.h1}</b><span>${g.lead.split('. ')[0]}.</span><i>Ler o guia →</i></a>`).join('')}</div>
<h2>Para revendedores</h2><p>Quer vender placas para esses negócios? Veja <a href="/revender-placas-nfc">como revender placas NFC de avaliação do Google</a> e <a href="/fornecedor-placas-nfc-google">o fornecedor NexTap</a>.</p>
<h2>Preços das placas</h2>${ctx.tabela()}<p class="mut">Valor por placa conforme a quantidade, frete à parte. Pedido mínimo de ${ctx.minimo()} placas.</p>`,
    faq: [['A mesma placa serve para qualquer negócio?', 'Sim. A placa leva o cliente à tela de avaliação do perfil do Google da empresa, seja ela um restaurante, uma clínica ou uma loja.'], ['Posso comprar poucas placas para testar?', `Sim, o pedido mínimo é de ${ctx.minimo()} placas.`]],
  };
  return { paginas: P, ordem: [hubPath, ...ordemSeg, ...ordemGuia], hubPath, segmentos: SEG.map(s => ({ path: '/placa-avaliacao-google-para-' + s.slug, nome: s.nome })) };
};
