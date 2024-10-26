export interface FishAwardUpdateModel {
    id: string | null; // Allow null for new awards
    name: string;
    description?: string;
    awardDate: string; // Assuming a date string format
  }
  