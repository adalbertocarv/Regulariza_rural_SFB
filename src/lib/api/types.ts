export interface Noticia {
  id: number;
  titulo: string;
  resumo?: string;
  conteudo?: string;
  categoria?: string;
  corCategoria?: string;
  urlImagem?: string;
  criadoEm: string;
}

export interface AtividadeImagem {
  id?: number;
  url: string;
  ordem: number;
  legenda?: string;
}

export interface AtividadePonto {
  id?: number;
  lat: number;
  lng: number;
  rotulo?: string;
  ordem: number;
}

export interface Atividade {
  id: number;
  titulo: string;
  descricao?: string;
  insignias: string[];
  valorAlvo?: string;
  rotuloAlvo?: string;
  objetivo?: string;
  componenteId?: number;
  tipoAcao?: string;
  demandante?: string;
  estados?: string[];
  hectares?: string;
  valorImpacto?: string;
  rotuloImpacto?: string;
  metrica1Valor?: string;
  metrica1Rotulo?: string;
  delineamentoDescricao?: string;
  parceiros?: string[];
  data?: string;
  status: 'publicado' | 'rascunho';
  imagens: AtividadeImagem[];
  pontos: AtividadePonto[];
  criadoEm: string;
}

export interface Depoimento {
  id: number;
  citacao?: string;
  nome?: string;
  cargo?: string;
  urlAvatar?: string;
  criadoEm: string;
}

export interface DocumentoRepositorio {
  id: number;
  titulo: string;
  descricao?: string;
  tipoIcone?: string;
  tamanhoArquivo?: string;
  tipoDocumento?: string;
  urlArquivo?: string;
  criadoEm: string;
}

export interface EstatisticaDashboard {
  id: number;
  nomeChave: string;
  valor?: string;
  unidade?: string;
  classeCor?: string;
}

export interface PerguntaFrequente {
  id: number;
  pergunta?: string;
  resposta?: string;
  ordem?: number;
}
