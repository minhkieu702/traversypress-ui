export interface SubProductCreateModel {
    name?: string | null;
    description?: string | null;
    descriptionDetail?: string | null;
    stockQuantity?: number | null; // Assuming int32 means number
    price?: number | null; // Assuming double means number
    originalPrice?: number | null; // Assuming double means number
    type: string,
    imageFiles?: File[] | null; // Binary data as string
    categoriesIds?: string[] | null; // UUIDs for categories
  };
