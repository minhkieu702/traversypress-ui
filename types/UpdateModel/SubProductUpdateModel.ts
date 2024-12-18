export interface SubProductUpdateModel {
    name?: string | null;
    description?: string | null;
    descriptionDetail?: string | null;
    stockQuantity?: number | null; // Assuming int32 means number
    price?: number | null; // Assuming double means number
    originalPrice?: number | null; // Assuming double means number
    type: string,
    deleteCategories?: (string | null)[] | null; // UUIDs of categories to be deleted
    updateCategories?: (string | null)[] | null; 
    deleteImages?: (string | null)[] | null; // UUIDs of images to delete
    updateImages?: File[] | null; // Binary data for images to update
  };
  