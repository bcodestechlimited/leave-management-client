export interface Client {
  _id: string;
  name: string;
  email: string;
  logo: string;
}

export interface CreateClient {
  name: string;
  email: string;
  logo: File;
  color: string;
}

export interface UpdateClient {
  name: string | null;
  email: string;
  logo: File | undefined;
  color: string;
}

export interface ClientState {
  client: any | null;
  actions: {
    setClient: (client: any) => Promise<void>;
  };
}

export interface ClientSetFunction {
  (
    state: Partial<ClientState> | ((state: ClientState) => Partial<ClientState>)
  ): void;
}
