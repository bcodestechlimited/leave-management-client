// level.types.ts

export interface LevelState {
  levels: Record<string, any>[]; // Array of level records
  isFetching: boolean; // Indicates whether levels are being fetched
  isSubmitting: boolean; // Indicates whether a level request is being submitted
  actions: {
    addLevel: (
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    getLevels: (params?: Record<string, any>) => Promise<void>;
    editLevel: (
      levelId: string,
      data: Record<string, any>,
      onSuccess?: () => void
    ) => Promise<void>;
    deleteLevel: (levelId: string, onSuccess?: () => void) => Promise<void>;
  };
}

export interface LevelSetFunction {
  (
    state: Partial<LevelState> | ((state: LevelState) => Partial<LevelState>)
  ): void;
}
