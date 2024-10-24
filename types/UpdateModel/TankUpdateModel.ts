export interface TankUpdateModel {
    size?: string | null;
    sizeInformation?: string | null;
    glassType?: string | null;
    deleteCategories?: (string | null)[] | null; // UUIDs of categories to be deleted
    updateCategories?: (string | null)[] | null; // UUIDs of categories to be updated
  };
  