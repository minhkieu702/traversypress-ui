import { AwardType } from "./AwardType";
import { BreedType } from "./BreedType";

export interface FishType {
    id:string;
    product_id?: string;
    breed: BreedType;
    size?: number;
    age?: number;
    origin?: string;
    sex: string;
    foodAmount?: number;
    weight?: number;
    health?: string;
    date_of_birth?: string;
    awards?:AwardType[]
}