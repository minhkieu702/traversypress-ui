export interface FishUpdateRequestModel {
    breedId?: string | null; // Assuming UUID format
    size?: number | null;
    age?: number | null;
    origin?: string | null;
    sex: boolean;
    foodAmount?: number | null;
    weight?: number | null;
    health?: string | null;
  };
  