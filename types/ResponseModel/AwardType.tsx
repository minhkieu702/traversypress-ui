import { ImageType } from "./ImageType";

export interface AwardType{
    id: string;
    fishId: string;
    name: string;
    description: string;
    awardDate:string;
    image?:string|null
}