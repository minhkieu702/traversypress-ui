import { FeedbackType } from "./FeedbackType";
import { FishType } from "./FishType";
import { ImageType } from "./ImageType";
import { TankType } from "./TankType";

export interface ProductType {
    id:string,
    name?: string,
    slug?: string,
    description?: string,
    description_detail?: string,
    type?:string
    supplier_id?:string|null,
    stock_quantity: number,
    sold?:boolean|null,
    price: number,
    original_price: number,
    feedbacks:FeedbackType[]
    images: ImageType[]
    fish?: FishType,
    tank?: TankType,
    quantityPurchase: number
}