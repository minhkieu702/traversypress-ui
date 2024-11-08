import { CustomerType } from "./CustomerType";

export interface CustomersGroupByYear {
    month: number,
    customerCount: number,
    customers: CustomerType[]
}

export interface CustomersPerYear {
  totalCustomes: number;
  customersGroupByYear: CustomersGroupByYear[];
}