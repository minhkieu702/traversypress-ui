import { TankCreateModel } from "./TankCreateModel";

export interface TankProductCreateModel {
    name?: string | null;
    description?: string | null;
    descriptionDetail?: string | null;
    stockQuantity?: number | null; // Assuming int32 means number
    price?: number | null; // Assuming double means number
    originalPrice?: number | null; // Assuming double means number
    imageFiles?: (string | null)[] | null; // Binary data as string
    tankModel: TankCreateModel; // Required field for tank model
    categoriesIds?: (string | null)[] | null; // UUIDs for categories
  };
