export interface FishCreateRequestModel {
    breedId: string; // Assuming UUID format
    size?: number | null;
    age?: number | null;
    origin?: string | null;
    sex: string;
    foodAmount?: number | null;
    weight?: number | null;
    health?: string | null;
    dateOfBirth?: string | null; // Assuming it's in ISO 8601 date-time format
  };