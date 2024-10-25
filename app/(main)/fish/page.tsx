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
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FishPage = () => {
    const [listProductFishes, setListProductFishes] = useState<ProductType[]>();
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
            
            let response = await handleGetProductFishAPI(pageSize, pageNumber, null, null, null, null)
        if (response?.status === 200) {
            let listporudct = response.data as ProductType[]
            console.log("listporudct", listporudct);
            setListProductFishes(listporudct)
            getTotalCount(response)
            response.headers
            return
        }
        toast({
            title: "No data"
        })
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
        <button onClick={c => router.push('/fish/add')}>Add new product</button>
        {
            listProductFishes && <FishesTable data={listProductFishes} />
        }
        {
            totalPage > 0 && <div className='list-pagination flex items-center md:mt-10 mt-7'>
                <HandlePagination onPageChange={handleChangePage} pageCount={totalPage}/>
            </div>
        }
        </>
    )
}

export default FishPage