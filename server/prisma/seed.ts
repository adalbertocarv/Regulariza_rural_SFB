import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // --- Admin User ---
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@regularizarural.org' },
    update: {},
    create: {
      email: 'admin@regularizarural.org',
      passwordHash,
      name: 'Administrador',
    },
  });
  console.log('✅ Usuário admin criado: admin@regularizarural.org / admin123');

  // --- News ---
  await prisma.news.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Nova parceria impulsiona reflorestamento no Cerrado',
        excerpt: 'A iniciativa visa recuperar mais de 500 hectares de áreas degradadas nos próximos dois anos, unindo produtores e tecnologia.',
        content: 'A iniciativa visa recuperar mais de 500 hectares de áreas degradadas nos próximos dois anos, unindo produtores e tecnologia avançada de monitoramento.',
        category: 'SUSTENTABILIDADE',
        categoryColor: 'bg-blue-100 text-blue-700',
        imageUrl: 'https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Novo sistema de monitoramento via satélite ativado',
        excerpt: 'Plataforma atualizada permite detecção de desmatamento em tempo real com precisão sub-métrica em todas as áreas cadastradas.',
        content: 'A nova plataforma de monitoramento via satélite representa um avanço significativo na detecção de desmatamento em tempo real.',
        category: 'TECNOLOGIA',
        categoryColor: 'bg-green-100 text-green-700',
        imageUrl: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Aprovada nova regulamentação para o CAR no Sul',
        excerpt: 'As mudanças facilitam o processo de regularização para pequenas propriedades familiares, simplificando as exigências documentais.',
        content: 'As novas regulamentações aprovadas para o CAR na região Sul do Brasil visam simplificar o processo para pequenos produtores.',
        category: 'LEGISLAÇÃO',
        categoryColor: 'bg-yellow-100 text-yellow-700',
        imageUrl: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Novo Decreto Simplifica Regularização de Pequenas Propriedades',
        excerpt: 'Medida visa acelerar o processo para agricultores familiares, garantindo segurança jurídica.',
        content: 'O novo decreto simplifica os processos burocráticos para regularização de pequenas propriedades rurais.',
        category: 'LEGISLAÇÃO',
        categoryColor: 'bg-green-100 text-green-700',
        imageUrl: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Boas Práticas: Rotação de Culturas e Preservação do Solo',
        excerpt: 'Aprenda técnicas comprovadas para aumentar a produtividade enquanto mantêm a saúde do solo.',
        content: 'A rotação de culturas é uma das técnicas mais eficazes para preservar a saúde do solo e aumentar a produtividade.',
        category: 'CAMPO',
        categoryColor: 'bg-blue-100 text-blue-700',
        imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Drones na Gestão de Reservas Legais',
        excerpt: 'Como o monitoramento aéreo está transformando a fiscalização e preservação de áreas protegidas.',
        content: 'O uso de drones tem revolucionado o monitoramento de reservas legais, permitindo uma fiscalização mais eficiente e precisa.',
        category: 'TECNOLOGIA',
        categoryColor: 'bg-orange-100 text-orange-700',
        imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Créditos de Carbono: Oportunidades para o Produtor',
        excerpt: 'O mercado voluntário de carbono como fonte de renda extra para propriedades rurais sustentáveis.',
        content: 'O mercado de créditos de carbono oferece uma oportunidade única para produtores rurais obterem renda extra por meio de práticas sustentáveis.',
        category: 'MERCADO',
        categoryColor: 'bg-purple-100 text-purple-700',
        imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Cooperativismo e Regularização Fundiária',
        excerpt: 'Como a união de pequenos produtores facilita o acesso à documentação da terra e créditos.',
        content: 'O cooperativismo tem se mostrado uma ferramenta poderosa para pequenos produtores acessarem programas de regularização fundiária.',
        category: 'SOCIAL',
        categoryColor: 'bg-red-100 text-red-700',
        imageUrl: 'https://images.pexels.com/photos/3755517/pexels-photo-3755517.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
      {
        title: 'Restaurando APP: Guia Prático para o Produtor',
        excerpt: 'Passo a passo para a recuperação de Áreas de Preservação Permanente em diferentes biomas.',
        content: 'Este guia prático orienta produtores rurais no processo de recuperação de Áreas de Preservação Permanente.',
        category: 'BIODIVERSIDADE',
        categoryColor: 'bg-green-100 text-green-700',
        imageUrl: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=600',
      },
    ],
  });
  console.log('✅ Notícias criadas');

  // --- Activities ---
  await prisma.activity.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'CAR 2024 - Inscrição e Regularização Ambiental',
        description: 'Apoio técnico para inscrição e retificação do Cadastro Ambiental Rural de 85 pequenas propriedades da agricultura familiar.',
        badges: ['RECUPERAÇÃO', 'MATA ATLÂNTICA'],
        targetValue: '85 Famílias',
        targetLabel: 'PÚBLICO',
        objective: 'Regularização Jurídica',
        imageUrl: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        title: 'Monitoramento Extensar de Regeneração',
        description: 'Uso de imagens de alta resolução para validação de áreas em processo de regeneração natural assistida em propriedades parceiras.',
        badges: ['CERCAMENTO', 'CERRADO'],
        targetValue: '1.200 Hectares',
        targetLabel: 'ÁREA',
        objective: 'Validação Técnica',
        imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        title: 'Ação Comunitária em Propriedades Familiares',
        description: 'Mobilização de comunidades locais para atividades de recomposição florestal em áreas de importância ambiental regional.',
        badges: ['RECUPERAÇÃO'],
        targetValue: '120 Produtores',
        targetLabel: 'PÚBLICO',
        objective: 'Engajamento Comunitário',
        imageUrl: 'https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        title: 'Monitoramento de Áreas de Proteção',
        description: 'Fiscalização e proteção de reservas legais e áreas de preservação permanente em biomas semiáridos.',
        badges: ['CERCAMENTO', 'SEMIARID'],
        targetValue: '850 Hectares',
        targetLabel: 'ÁREA',
        objective: 'Proteção Ambiental',
        imageUrl: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        title: 'Restauração de Florestas Degradadas',
        description: 'Projeto de grande escala para restauração de áreas degradadas na região amazônica através de plantio de espécies nativas.',
        badges: ['RECUPERAÇÃO', 'AMAZÔNIA'],
        targetValue: '250 Famílias',
        targetLabel: 'PÚBLICO',
        objective: 'Restauração Florestal',
        imageUrl: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
      {
        title: 'Mapeamento Aerofotogramétrico de Limites',
        description: 'Utilização de drones e tecnologia de mapeamento para definição precisa de limites e verificação de conformidade ambiental.',
        badges: ['CERCAMENTO', 'CAATINGA'],
        targetValue: '2.150 Hectares',
        targetLabel: 'ÁREA',
        objective: 'Demarcação Técnica',
        imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=700',
      },
    ],
  });
  console.log('✅ Atividades criadas');

  // --- Testimonials ---
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      {
        quote: '"O Regulariza Rural trouxe a tranquilidade que minha família precisava para produzir sem medo do amanhã. Técnica e ética andam juntas aqui."',
        name: 'João Silva',
        role: 'Produtor - Minas Gerais',
        avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80',
      },
      {
        quote: '"Trabalhar com dados precisos é o que faz a diferença na conservação. O projeto é um marco tecnológico para o setor."',
        name: 'Dra. Beatriz Costa',
        role: 'Eng. Ambiental',
        avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80',
      },
      {
        quote: '"A regularização não é apenas papel; é o reconhecimento do nosso compromisso com a terra que nos sustenta há gerações."',
        name: 'Carlos Andrade',
        role: 'Produtor Rural - Goiás',
        avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80',
      },
    ],
  });
  console.log('✅ Depoimentos criados');

  // --- Repository Documents ---
  await prisma.repositoryDocument.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Guia de Regularização Fundiária 2024',
        description: 'Manual completo com as novas diretrizes jurídicas para pequenos produtores rurais da região.',
        iconType: 'pdf',
        fileSize: '2.4 MB',
        docType: 'DOWNLOAD',
        fileUrl: '#',
      },
      {
        title: 'Modelo de Requerimento Administrativo',
        description: 'Template oficial para solicitações de vistoria técnica junto aos órgãos estaduais.',
        iconType: 'docx',
        fileSize: '1.1 MB',
        docType: 'DOWNLOAD',
        fileUrl: '#',
      },
      {
        title: 'Brandbook Regulariza Rural',
        description: 'Manual de identidade visual, logotipos e diretrizes de comunicação do projeto.',
        iconType: 'zip',
        fileSize: '15 MB',
        docType: 'DOWNLOAD',
        fileUrl: '#',
      },
      {
        title: 'Relatório de Impacto Ambiental 2023',
        description: 'Análise detalhada sobre a preservação de matas ciliares após o processo de regularização.',
        iconType: 'pdf',
        fileSize: '4.8 MB',
        docType: 'DOWNLOAD',
        fileUrl: '#',
      },
      {
        title: 'Avanços na Governança de Terras',
        description: 'Matéria publicada no Portal do Agronegócio sobre os resultados do Regulariza Rural.',
        iconType: 'artigo',
        fileSize: 'ARTIGO · WEB',
        docType: 'LINK',
        fileUrl: '#',
      },
      {
        title: 'Webinar: Direitos do Posseiro',
        description: 'Gravação completa do seminário online realizado com especialistas em direito agrário.',
        iconType: 'video',
        fileSize: '128 MB',
        docType: 'WATCH',
        fileUrl: '#',
      },
    ],
  });
  console.log('✅ Documentos do repositório criados');

  // --- Dashboard Stats ---
  const statsData = [
    { keyName: 'hectares_preservados', value: '500k+', unit: '', colorClass: 'text-green-700' },
    { keyName: 'produtores_atendidos', value: '10k+', unit: '', colorClass: 'text-green-700' },
    { keyName: 'indice_regularidade', value: '85%', unit: '', colorClass: 'text-green-700' },
    { keyName: 'car_processados', value: '2.4k', unit: '', colorClass: 'text-blue-600' },
    { keyName: 'areas_mapeadas', value: '12.450', unit: 'ha', colorClass: 'text-green-700' },
    { keyName: 'processos_ativos', value: '842', unit: '', colorClass: 'text-blue-600' },
    { keyName: 'municipios_atendidos', value: '15', unit: '', colorClass: 'text-blue-600' },
  ];

  for (const stat of statsData) {
    await prisma.dashboardStat.upsert({
      where: { keyName: stat.keyName },
      update: { value: stat.value, unit: stat.unit, colorClass: stat.colorClass },
      create: stat,
    });
  }
  console.log('✅ Métricas do dashboard criadas');

  // --- FAQs ---
  await prisma.faq.createMany({
    skipDuplicates: true,
    data: [
      {
        question: 'Qual a frequência de atualização dos mapas?',
        answer: 'Os mapas são atualizados mensalmente com os dados coletados através de satélites e visitas de campo.',
        orderNum: 1,
      },
      {
        question: 'Os dados possuem valor legal para georreferenciamento?',
        answer: 'Os dados no painel são para fins informativos e de transparência. Para fins legais, deve-se utilizar os documentos oficiais emitidos e assinados pelo responsável técnico via sistema SIGEF.',
        orderNum: 2,
      },
      {
        question: 'Como os municípios são selecionados para o projeto?',
        answer: 'A seleção é realizada através de critérios técnicos baseados na concentração de áreas a regularizar e interesse dos gestores municipais em apoiar a iniciativa.',
        orderNum: 3,
      },
      {
        question: 'Posso integrar esses dados em meu próprio GIS?',
        answer: 'Sim, todos os dados estão disponíveis para download em formatos compatíveis com GIS, como shapefile e GeoJSON. Consulte a seção de exportação.',
        orderNum: 4,
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
