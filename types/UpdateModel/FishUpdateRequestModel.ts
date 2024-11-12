import { FishAwardUpdateModel } from "./FishAwardUpdateModel";

export interface FishUpdateRequestModel {
  breedId?: string | null; // Assuming UUID format
  size?: number | null;
  age?: number | null;
  origin?: string | null;
  sex?: string | null;
  foodAmount?: number | null;
  weight?: number | null;
  health?: string | null;
  deleteAward?: (string | null)[] | null;
  fishAward?: FishAwardUpdateModel[] | null | undefined; // Allow null or undefined
}
