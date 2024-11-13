import { List } from "postcss/lib/list";
import { CategoryType } from "./TankCategoryType";

export interface TankType {
    id: string;
    product_id?: string;
    size?: string;
    sizeInformation?: string;
    glassType?: string;
    categories: CategoryType[]
}