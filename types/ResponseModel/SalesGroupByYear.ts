export interface SalesGroupByMonth{
    month:number,
    orders:number,
    sales: number
}

export interface SalesPerYear{
    totalSales: number,
    salesGroupByMoth: SalesGroupByMonth[]
}