import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // --- Admin User ---
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@regularizarural.org' },
    update: {},
    create: {
      email: 'admin@regularizarural.org',
      senhaHash: passwordHash,
      nome: 'Administrador',
    },
  });
  console.log('✅ Usuário admin criado: admin@regularizarural.org / admin123');

  // --- News ---
  await prisma.noticia.createMany({
    skipDuplicates: true,
    data: [
      {
        titulo: 'Nova parceria impulsiona reflorestamento no Cerrado',
        resumo: 'A iniciativa visa recuperar mais de 500 hectares de áreas degradadas nos próximos dois anos, unindo produtores e tecnologia.',
        conteudo: 'A iniciativa visa recuperar mais de 500 hectares de áreas degradadas nos próximos dois anos, unindo produtores e tecnologia avançada de monitoramento.',
        categoria: 'SUSTENTABILIDADE',
        corCategoria: 'bg-blue-100 text-blue-700',
        urlImagem: 'https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Novo sistema de monitoramento via satélite ativado',
        resumo: 'Plataforma atualizada permite detecção de desmatamento em tempo real com precisão sub-métrica em todas as áreas cadastradas.',
        conteudo: 'A nova plataforma de monitoramento via satélite representa um avanço significativo na detecção de desmatamento em tempo real.',
        categoria: 'TECNOLOGIA',
        corCategoria: 'bg-green-100 text-green-700',
        urlImagem: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Aprovada nova regulamentação para o CAR no Sul',
        resumo: 'As mudanças facilitam o processo de regularização para pequenas propriedades familiares, simplificando as exigências documentais.',
        conteudo: 'As novas regulamentações aprovadas para o CAR na região Sul do Brasil visam simplificar o processo para pequenos produtores.',
        categoria: 'LEGISLAÇÃO',
        corCategoria: 'bg-yellow-100 text-yellow-700',
        urlImagem: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Novo Decreto Simplifica Regularização de Pequenas Propriedades',
        resumo: 'Medida visa acelerar o processo para agricultores familiares, garantindo segurança jurídica.',
        conteudo: 'O novo decreto simplifica os processos burocráticos para regularização de pequenas propriedades rurais.',
        categoria: 'LEGISLAÇÃO',
        corCategoria: 'bg-green-100 text-green-700',
        urlImagem: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Boas Práticas: Rotação de Culturas e Preservação do Solo',
        resumo: 'Aprenda técnicas comprovadas para aumentar a produtividade enquanto mantêm a saúde do solo.',
        conteudo: 'A rotação de culturas é uma das técnicas mais eficazes para preservar a saúde do solo e aumentar a produtividade.',
        categoria: 'CAMPO',
        corCategoria: 'bg-blue-100 text-blue-700',
        urlImagem: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Drones na Gestão de Reservas Legais',
        resumo: 'Como o monitoramento aéreo está transformando a fiscalização e preservação de áreas protegidas.',
        conteudo: 'O uso de drones tem revolucionado o monitoramento de reservas legais, permitindo uma fiscalização mais eficiente e precisa.',
        categoria: 'TECNOLOGIA',
        corCategoria: 'bg-orange-100 text-orange-700',
        urlImagem: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Créditos de Carbono: Oportunidades para o Produtor',
        resumo: 'O mercado voluntário de carbono como fonte de renda extra para propriedades rurais sustentáveis.',
        conteudo: 'O mercado de créditos de carbono oferece uma oportunidade única para produtores rurais obterem renda extra por meio de práticas sustentáveis.',
        categoria: 'MERCADO',
        corCategoria: 'bg-purple-100 text-purple-700',
        urlImagem: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Cooperativismo e Regularização Fundiária',
        resumo: 'Como a união de pequenos produtores facilita o acesso à documentação da terra e créditos.',
        conteudo: 'O cooperativismo tem se mostrado uma ferramenta poderosa para pequenos produtores acessarem programas de regularização fundiária.',
        categoria: 'SOCIAL',
        corCategoria: 'bg-red-100 text-red-700',
        urlImagem: 'https://images.pexels.com/photos/3755517/pexels-photo-3755517.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        titulo: 'Restaurando APP: Guia Prático para o Produtor',
        resumo: 'Passo a passo para a recuperação de Áreas de Preservação Permanente em diferentes biomas.',
        conteudo: 'Este guia prático orienta produtores rurais no processo de recuperação de Áreas de Preservação Permanente.',
        categoria: 'BIODIVERSIDADE',
        corCategoria: 'bg-green-100 text-green-700',
        urlImagem: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
  });
  console.log('✅ Notícias criadas');

  // --- Activities ---
  await prisma.atividade.createMany({
    skipDuplicates: true,
    data: [
      {
        titulo: 'CAR 2024 - Inscrição e Regularização Ambiental',
        descricao: 'Apoio técnico para inscrição e retificação do Cadastro Ambiental Rural de 85 pequenas propriedades da agricultura familiar.',
        insignias: ['RECUPERAÇÃO', 'MATA ATLÂNTICA'],
        valorAlvo: '85 Famílias',
        rotuloAlvo: 'PÚBLICO',
        objetivo: 'Regularização Jurídica',
        urlImagem: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        titulo: 'Monitoramento Extensar de Regeneração',
        descricao: 'Uso de imagens de alta resolução para validação de áreas em processo de regeneração natural assistida em propriedades parceiras.',
        insignias: ['CERCAMENTO', 'CERRADO'],
        valorAlvo: '1.200 Hectares',
        rotuloAlvo: 'ÁREA',
        objetivo: 'Validação Técnica',
        urlImagem: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        titulo: 'Ação Comunitária em Propriedades Familiares',
        descricao: 'Mobilização de comunidades locais para atividades de recomposição florestal em áreas de importância ambiental regional.',
        insignias: ['RECUPERAÇÃO'],
        valorAlvo: '120 Produtores',
        rotuloAlvo: 'PÚBLICO',
        objetivo: 'Engajamento Comunitário',
        urlImagem: 'https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        titulo: 'Monitoramento de Áreas de Proteção',
        descricao: 'Fiscalização e proteção de reservas legais e áreas de preservação permanente em biomas semiáridos.',
        insignias: ['CERCAMENTO', 'SEMIARID'],
        valorAlvo: '850 Hectares',
        rotuloAlvo: 'ÁREA',
        objetivo: 'Proteção Ambiental',
        urlImagem: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        titulo: 'Restauração de Florestas Degradadas',
        descricao: 'Projeto de grande escala para restauração de áreas degradadas na região amazônica através de plantio de espécies nativas.',
        insignias: ['RECUPERAÇÃO', 'AMAZÔNIA'],
        valorAlvo: '250 Famílias',
        rotuloAlvo: 'PÚBLICO',
        objetivo: 'Restauração Florestal',
        urlImagem: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        titulo: 'Mapeamento Aerofotogramétrico de Limites',
        descricao: 'Utilização de drones e tecnologia de mapeamento para definição precisa de limites e verificação de conformidade ambiental.',
        insignias: ['CERCAMENTO', 'CAATINGA'],
        valorAlvo: '2.150 Hectares',
        rotuloAlvo: 'ÁREA',
        objetivo: 'Demarcação Técnica',
        urlImagem: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
    ],
  });
  console.log('✅ Atividades criadas');

  // --- Testimonials ---
  await prisma.depoimento.createMany({
    skipDuplicates: true,
    data: [
      {
        citacao: '"O Regulariza Rural trouxe a tranquilidade que minha família precisava para produzir sem medo do amanhã. Técnica e ética andam juntas aqui."',
        nome: 'João Silva',
        cargo: 'Produtor - Minas Gerais',
        urlAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80',
      },
      {
        citacao: '"Trabalhar com dados precisos é o que faz a diferença na conservação. O projeto é um marco tecnológico para o setor."',
        nome: 'Dra. Beatriz Costa',
        cargo: 'Eng. Ambiental',
        urlAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80',
      },
      {
        citacao: '"A regularização não é apenas papel; é o reconhecimento do nosso compromisso com a terra que nos sustenta há gerações."',
        nome: 'Carlos Andrade',
        cargo: 'Produtor Rural - Goiás',
        urlAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80',
      },
    ],
  });
  console.log('✅ Depoimentos criados');

  // --- Repository Documents ---
  await prisma.documentoRepositorio.createMany({
    skipDuplicates: true,
    data: [
      {
        titulo: 'Guia de Regularização Fundiária 2024',
        descricao: 'Manual completo com as novas diretrizes jurídicas para pequenos produtores rurais da região.',
        tipoIcone: 'pdf',
        tamanhoArquivo: '2.4 MB',
        tipoDocumento: 'DOWNLOAD',
        urlArquivo: '#',
      },
      {
        titulo: 'Modelo de Requerimento Administrativo',
        descricao: 'Template oficial para solicitações de vistoria técnica junto aos órgãos estaduais.',
        tipoIcone: 'docx',
        tamanhoArquivo: '1.1 MB',
        tipoDocumento: 'DOWNLOAD',
        urlArquivo: '#',
      },
      {
        titulo: 'Brandbook Regulariza Rural',
        descricao: 'Manual de identidade visual, logotipos e diretrizes de comunicação do projeto.',
        tipoIcone: 'zip',
        tamanhoArquivo: '15 MB',
        tipoDocumento: 'DOWNLOAD',
        urlArquivo: '#',
      },
      {
        titulo: 'Relatório de Impacto Ambiental 2023',
        descricao: 'Análise detalhada sobre a preservação de matas ciliares após o processo de regularização.',
        tipoIcone: 'pdf',
        tamanhoArquivo: '4.8 MB',
        tipoDocumento: 'DOWNLOAD',
        urlArquivo: '#',
      },
      {
        titulo: 'Avanços na Governança de Terras',
        descricao: 'Matéria publicada no Portal do Agronegócio sobre os resultados do Regulariza Rural.',
        tipoIcone: 'artigo',
        tamanhoArquivo: 'ARTIGO · WEB',
        tipoDocumento: 'LINK',
        urlArquivo: '#',
      },
      {
        titulo: 'Webinar: Direitos do Posseiro',
        descricao: 'Gravação completa do seminário online realizado com especialistas em direito agrário.',
        tipoIcone: 'video',
        tamanhoArquivo: '128 MB',
        tipoDocumento: 'WATCH',
        urlArquivo: '#',
      },
    ],
  });
  console.log('✅ Documentos do repositório criados');

  // --- Dashboard Stats ---
  const statsData = [
    { nomeChave: 'hectares_preservados', valor: '500k+', unidade: '', classeCor: 'text-green-700' },
    { nomeChave: 'produtores_atendidos', valor: '10k+', unidade: '', classeCor: 'text-green-700' },
    { nomeChave: 'indice_regularidade', valor: '85%', unidade: '', classeCor: 'text-green-700' },
    { nomeChave: 'car_processados', valor: '2.4k', unidade: '', classeCor: 'text-blue-600' },
    { nomeChave: 'areas_mapeadas', valor: '12.450', unidade: 'ha', classeCor: 'text-green-700' },
    { nomeChave: 'processos_ativos', valor: '842', unidade: '', classeCor: 'text-blue-600' },
    { nomeChave: 'municipios_atendidos', valor: '15', unidade: '', classeCor: 'text-blue-600' },
  ];

  for (const stat of statsData) {
    await prisma.estatisticaDashboard.upsert({
      where: { nomeChave: stat.nomeChave },
      update: { valor: stat.valor, unidade: stat.unidade, classeCor: stat.classeCor },
      create: stat,
    });
  }
  console.log('✅ Métricas do dashboard criadas');

  // --- FAQs ---
  await prisma.perguntaFrequente.createMany({
    skipDuplicates: true,
    data: [
      {
        pergunta: 'Qual a frequência de atualização dos mapas?',
        resposta: 'Os mapas são atualizados mensalmente com os dados coletados através de satélites e visitas de campo.',
        ordem: 1,
      },
      {
        pergunta: 'Os dados possuem valor legal para georreferenciamento?',
        resposta: 'Os dados no painel são para fins informativos e de transparência. Para fins legais, deve-se utilizar os documentos oficiais emitidos e assinados pelo responsável técnico via sistema SIGEF.',
        ordem: 2,
      },
      {
        pergunta: 'Como os municípios são selecionados para o projeto?',
        resposta: 'A seleção é realizada através de critérios técnicos baseados na concentração de áreas a regularizar e interesse dos gestores municipais em apoiar a iniciativa.',
        ordem: 3,
      },
      {
        pergunta: 'Posso integrar esses dados em meu próprio GIS?',
        resposta: 'Sim, todos os dados estão disponíveis para download em formatos compatíveis com GIS, como shapefile e GeoJSON. Consulte a seção de exportação.',
        ordem: 4,
      },
    ],
  });
  console.log('✅ FAQs criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📧 Login admin: admin@regularizarural.org');
  console.log('🔑 Senha admin: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
