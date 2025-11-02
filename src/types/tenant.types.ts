export interface Tenant {
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

export interface UpdateTenant {
  name: string | null;
  email: string;
  logo: File | null;
  color: string;
}

export interface TenantState {
  tenant: any | null;
  isFetchingTenant: boolean;
  actions: {
    setTenant: (tenant: any) => Promise<void>;
  };
}

export interface TenantSetFunction {
  (
    state: Partial<TenantState> | ((state: TenantState) => Partial<TenantState>)
  ): void;
}
