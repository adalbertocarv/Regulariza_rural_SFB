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

export interface Atividade {
  id: number;
  titulo: string;
  descricao?: string;
  insignias: string[];
  valorAlvo?: string;
  rotuloAlvo?: string;
  objetivo?: string;
  urlImagem?: string;
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
