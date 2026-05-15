import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  increment, 
  serverTimestamp,
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";


export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {}, // Autenticação desativada por enquanto
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Interfaces
export interface ClienteFidelidade {
  id?: string;
  nome: string;
  telefone: string;
  saldo_pontos: number;
  saldo_cashback: number;
  tier_vip: string;
  ultima_visita?: any;
}

export interface ConfiguracoesEstudio {
  porcentagem_cashback: number;
  meta_pontos_premio: number;
}

// Services
export const loyaltyService = {
  // Get all customers
  async getClientes(): Promise<ClienteFidelidade[]> {
    const path = "clientes_fidelidade";
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClienteFidelidade));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  // Get customer by phone
  async getClienteByTelefone(telefone: string): Promise<ClienteFidelidade | null> {
    const path = "clientes_fidelidade";
    try {
      const q = query(collection(db, path), where("telefone", "==", telefone));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ClienteFidelidade;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  // Add Sale and Calculate Cashback/Points
  async registrarVenda(clienteId: string, valorVenda: number) {
    const path = `clientes_fidelidade/${clienteId}`;
    try {
      // Get config first (or use defaults)
      const configRef = doc(db, "configuracoes_estudio", "global");
      const configSnap = await getDoc(configRef);
      const config = configSnap.exists() 
        ? configSnap.data() as ConfiguracoesEstudio 
        : { porcentagem_cashback: 10, meta_pontos_premio: 10 };

      const cashbackGanho = (valorVenda * config.porcentagem_cashback) / 100;
      const pontosGanhos = Math.floor(valorVenda / 20); // Ex: 1 point every R$20

      await updateDoc(doc(db, "clientes_fidelidade", clienteId), {
        saldo_cashback: increment(cashbackGanho),
        saldo_pontos: increment(pontosGanhos),
        ultima_visita: serverTimestamp(),
      });

      return { cashbackGanho, pontosGanhos };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Redeem points for a prize
  async resgatarPremio(clienteId: string, custoPontos: number) {
    const path = `clientes_fidelidade/${clienteId}`;
    try {
      await updateDoc(doc(db, "clientes_fidelidade", clienteId), {
        saldo_pontos: increment(-custoPontos)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Marketing Campaigns
  async getCampanhasAtivas() {
    const path = "campanhas_marketing";
    try {
      const q = query(collection(db, path), where("ativa", "==", true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

 async criarCampanha(titulo: string, desconto: string) {
    const path = "campanhas_marketing";
    try {
      await addDoc(collection(db, path), {
        titulo,
        desconto,
        ativa: true,
        validade: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // --- NOVAS FUNÇÕES DE SAAS / MULTI-TENANT ---

  async loginComGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Erro no login:", error);
      return null;
    }
  },

  async logout() {
    await signOut(auth);
  },

  async salvarConfigSite(userId: string, config: any) {
    const path = "configuracoes_site";
    try {
      await setDoc(doc(db, path, userId), config, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getConfigSite(userId: string) {
    const path = "configuracoes_site";
    try {
      const snap = await getDoc(doc(db, path, userId));
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  }
};