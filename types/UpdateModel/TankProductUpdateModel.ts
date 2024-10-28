import { TankUpdateModel } from "./TankUpdateModel";

export interface TankProductUpdateModel {
    name?: string | null;
    description?: string | null;
    descriptionDetail?: string | null;
    stockQuantity?: number | null; // Assuming int32 means number
    price?: number | null; // Assuming double means number
    originalPrice?: number | null; // Assuming double means number
    deleteImages?: (string | null)[] | null; // UUIDs of images to delete
    updateImages?: File[] | null; // Binary data for images to update
    tankModel?: TankUpdateModel | null; // Nullable and optional tank model for update
  };
  