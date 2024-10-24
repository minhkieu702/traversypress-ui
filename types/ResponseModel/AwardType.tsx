import { ImageType } from "./ImageType";

export interface AwardType{
    id: string;
    fish_id: string;
    name: string;
    description: string;
    award_date:string;
    image?:string|null
}