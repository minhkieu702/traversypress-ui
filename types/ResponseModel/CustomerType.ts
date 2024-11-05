export interface CustomerType {
  id: string;
  username: string;
  name: string;
  gender: string | null;
  birthday: string | null;
  phone: string | null;
  address: string | null;
  loyaltyPoints: number | null;
  registrationDate: string | null;
}
