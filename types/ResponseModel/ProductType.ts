import { CategoryType } from "./CategoryType";
import { FeedbackType } from "./FeedbackType";
import { FishType } from "./FishType";
import { ImageType } from "./ImageType";
import { TankType } from "./TankType";

export interface ProductType {
    id:string,
    name?: string,
    slug?: string,
    description?: string,
    descriptionDetail?: string,
    type?:string
    supplierId?:string|null,
    stockQuantity: number,
    sold?:boolean|null,
    price: number,
    originalPrice: number,
    feedbacks:FeedbackType[]
    images: ImageType[]
    fish?: FishType,
    tank?: TankType,
    quantityPurchase: number,
    categories: CategoryType[]
}