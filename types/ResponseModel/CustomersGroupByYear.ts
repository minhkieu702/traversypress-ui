import { CustomerType } from "./CustomerType";

export interface CustomersGroupByYear {
    month: number,
    customerCount: number,
    customers: CustomerType[]
}