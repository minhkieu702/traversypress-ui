"use client";
import { handleGetProductFishAPI } from "@/components/api/products/fish";
import BackButton from "@/components/BackButton";
import ProductTable from "@/components/fish/FishsTable";
import HandlePagination from "@/components/Pagination";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "@/components/ui/use-toast";
import { getTotalCount } from "@/helpers/helpers";
import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const FishPage = () => {
  const [listProductFishes, setListProductFishes] = useState<ProductType[]>();
  const [pageSize, setPageSize] = useState(9);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isKoi, setIsKoi] = useState(true);

  const router = useRouter();
  useEffect(() => {
    handleGetProduct();
  }, [pageNumber]);

  useEffect(() => {
    setTotalPage(Math.ceil(totalProduct / pageSize));
  }, [totalProduct]);

  const handleGetProduct = async () => {
    setLoading(true);
    try {
      let response = await handleGetProductFishAPI(
        pageSize,
        pageNumber,
        null,
        null,
        null,
        null
      );
      if (response?.status === 200) {
        var data = response as AxiosResponse;
        let listporudct = data.data as ProductType[];
        setListProductFishes(listporudct);
        setTotalProduct(getTotalCount(response));
        setLoading(false);
        return;
      } else {
        var error = response as AxiosError;
        toast({
          title: "Error",
          content: error.response?.data as string,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (opt: number) => {
    setPageNumber(opt + 1);
  };

  const handleOpenAddPage = () => {
    if (isKoi) {
      router.push("/fish/addKoi")
    }else{
      router.push("/fish/addOther")
    }
  }
  return (
    <>
      {loading ? (
        <><div className="flex items-center justify-center h-screen">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#000000"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          />
        </div></>
      ) : (
        <>
          <BackButton text="Go Back" link="/" />
          <select
                      id="select-filter"
                      name="select-filter"
                      className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-gray-300"
                      onChange={(e) => {
                        setIsKoi(e.target.value === 'koi');
                      }}
                    >
                      <option value='koi'>Cá Koi</option>
                      <option value='other'>Khác</option>
                    </select>
          <button onClick={() => handleOpenAddPage()} className="bg-black text-white font-bold py-2 px-4 rounded text-xs">
            Add new product
          </button>
          {listProductFishes && (
            <ProductTable data={listProductFishes} type="fish" />
          )}
          {totalPage > 1 && (
            <div className="list-pagination flex items-center md:mt-10 mt-7">
              <HandlePagination
                onPageChange={handleChangePage}
                pageCount={totalPage}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FishPage;