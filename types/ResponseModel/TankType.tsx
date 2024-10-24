import { List } from "postcss/lib/list";
import { CategoryType } from "./CategoryType";

export interface TankType {
    id: string;
    product_id?: string;
    size?: string;
    size_information?: string;
    glass_type?: string;
    categories: CategoryType[]
}