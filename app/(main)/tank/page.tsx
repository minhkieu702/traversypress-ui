'use client'
import { handleGetProductTankAPI } from "@/components/api/products/tank";
import BackButton from "@/components/BackButton"
import HandlePagination from "@/components/Pagination";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { TankType } from "@/types/ResponseModel/TankType";
import { ProductType } from "@/types/ResponseModel/ProductType";
import { Toast } from "@radix-ui/react-toast";
import { AxiosError, AxiosResponse } from "axios";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductTable from "@/components/fish/FishsTable";

const TankPage = () => {
    const [listProductTankes, setListProductTankes] = useState<ProductType[]>();
    const [pageSize, setPageSize] = useState(9);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalProduct, setTotalProduct] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(1);
    
    const router = useRouter()
    useEffect(() => {
        handleGetProduct()
    }, [pageNumber])

    useEffect(() => {
        setTotalPage(Math.ceil(totalProduct/pageSize))
    }, [totalProduct])

    const handleGetProduct = async () => {
        try {
            console.log("page number", pageNumber);
            
            let response = await handleGetProductTankAPI(pageSize, pageNumber, null, null, null, null)
        if (response?.status === 200) {
            var data = response as AxiosResponse
            let listporudct = data.data as ProductType[]
            console.log("listporudct", listporudct);
            setListProductTankes(listporudct)
            getTotalCount(response)
            return
        }
        else {
            var error = response as AxiosError
            toast({
                title: "Error",
                content: error.response?.data as string
            })
          }
        } catch (error) {
          console.log(error);
            
        }
    }

    const getTotalCount = (response: any) => {
        const paginationHeader = response?.headers["x-pagination"];
        if (paginationHeader) {
          const paginationData = JSON.parse(paginationHeader);
          const totalCount = paginationData.TotalCount;
          setTotalProduct(totalCount);
          console.log("TotalCount:", totalCount);
        }
      };

    const handleChangePage = (opt: number) => {
        console.log(opt);
        
        setPageNumber(opt+1);
      };
    return(
        <>
        <BackButton text='Go Back' link='/' />
        <button onClick={c => router.push('/tank/add')}>Add new product</button>
        {
            listProductTankes && <ProductTable data={listProductTankes} type="tank" />
        }
        {
            totalPage > 0 && <div className='list-pagination flex items-center md:mt-10 mt-7'>
                <HandlePagination onPageChange={handleChangePage} pageCount={totalPage} />
            </div>
        }
        </>
    )
}

export default TankPage