import { CustomerType } from "./CustomerType";

export interface CustomersGroupByWeek{
    week: number,
    customersCount: number,
    days: Day[]
}

export interface Day {
    dayOfWeek: number,
    customerCount: number,
    customers: CustomerType[]
}