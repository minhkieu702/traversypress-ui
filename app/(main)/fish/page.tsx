'use client'
import { handleGetProductFishAPI } from "@/components/api/products/fish";
import BackButton from "@/components/BackButton"
import FishesTable from "@/components/fish/FishsTable";
import HandlePagination from "@/components/Pagination";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { FishType } from "@/types/ResponseModel/FishType";
import { ProductType } from "@/types/ResponseModel/ProductType";
import { Toast } from "@radix-ui/react-toast";
import { useEffect, useState } from "react";

const FishPage = () => {
    const [listProductFishes, setListProductFishes] = useState<ProductType[]>();
    const [pageCount, setPageCount] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    
    useEffect(() => {
        handleGetProduct()
    }, [pageNumber])

    useEffect(() => {
        if (listProductFishes) {
            setPageCount(Math.ceil(listProductFishes?.length/pageNumber))
        }
        else{
            setPageCount(1)
        }
        console.log(pageCount);
        
    }, [listProductFishes])

    const handleGetProduct = async () => {
        try {
            let response = await handleGetProductFishAPI(pageCount + 1, pageNumber, null, null, null, null)
        if (response?.status === 200) {
            let listporudct = response.data as ProductType[]
            console.log("listporudct", listporudct);
            setListProductFishes(listporudct)
            return
        }
        toast({
            title: "No data"
        })
        } catch (error) {
          console.log(error);
            
        }
    }
    const handleChangePage = (opt: number) => {
        setPageNumber(opt);
      };
    return(
        <>
        <BackButton text='Go Back' link='/' />
        {
            listProductFishes && <FishesTable data={listProductFishes} />
        }
        {
            pageCount > 1 && <HandlePagination onPageChange={handleChangePage} pageCount={pageCount}/>
        }
        </>
    )
}

export default FishPage