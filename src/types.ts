export type Pergunta = {
  id: string;
  texto: string;
};

export type Ficha = {
  titulo: string;
  perguntas: Pergunta[];
};

export type AnamneseData = {
  [key: string]: Ficha;
};

export const anamneseData: AnamneseData = {
  cilios: {
    titulo: "Extensão de Cílios",
    perguntas: [
      { id: "alergia_cola", texto: "Possui alergia a adesivos/colas ou cianoacrilato?" },
      { id: "sensibilidade", texto: "Possui sensibilidade ocular, glaucoma ou conjuntivite recorrente?" },
      { id: "lentes", texto: "Usa lentes de contato?" },
      { id: "cirurgia", texto: "Fez cirurgia ocular nos últimos 6 meses?" },
      { id: "atrito", texto: "Costuma dormir de bruços ou esfregar os olhos?" }
    ]
  },
  lash_lifting: {
    titulo: "Lash Lifting",
    perguntas: [
      { id: "alergia_tintura", texto: "Alergia a componentes de tintura ou permanente?" },
      { id: "procedimento_recente", texto: "Fez algum procedimento nos cílios nos últimos 45 dias?" },
      { id: "gestante", texto: "Está gestante ou lactante?" },
      { id: "alopecia", texto: "Possui alopecia ou queda acentuada de fios?" }
    ]
  },
  brow_lamination: {
    titulo: "Brow Lamination",
    perguntas: [
      { id: "alergia_quimica", texto: "Alergia a tinturas ou produtos químicos de alisamento?" },
      { id: "uso_acidos", texto: "Está usando ácidos (Retinol, Glicólico) na região das sobrancelhas?" },
      { id: "micropigmentacao", texto: "Fez micropigmentação nos últimos 30 dias?" },
      { id: "dermatite", texto: "Possui dermatite ou psoríase na região?" }
    ]
  },
  limpeza_pele: {
    titulo: "Limpeza de Pele",
    perguntas: [
      { id: "roacutan", texto: "Fez uso de Roacutan nos últimos 6 meses?" },
      { id: "acidos", texto: "Está usando ácidos ou fazendo algum tratamento dermatológico?" },
      { id: "queloides", texto: "Possui tendência a queloides ou má cicatrização?" },
      { id: "alergia_ativos", texto: "Alergia a algum ativo (Vitamina C, Ácidos, Extratos Vegetais)?" }
    ]
  }
};
