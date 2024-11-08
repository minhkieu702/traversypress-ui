
export interface SalesPerMonth {
    totalSales: number,
    sales: SaleByWeek[]
}

export interface SaleByWeek{
    week: number,
    sales: number,
    days: SaleByDay[]
}

export interface SaleByDay{
    dayOfWeek: number,
    sales: number
}