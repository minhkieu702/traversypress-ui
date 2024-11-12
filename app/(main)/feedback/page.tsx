"use client";
import BackButton from "@/components/BackButton";
import HandlePagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { ThreeDots } from "react-loader-spinner";
import { handleDeleteFeedbackAPI, handleGetFeedbackAPI } from "@/components/api/feedback/feedback";
import { FeedbackType } from "@/types/ResponseModel/FeedbackType";

const Page = () => {
  const [listFeedback, setListFeedback] = useState<FeedbackType[]>([]);
  const [pageSize, setPageSize] = useState(9);
  const [pageNumber, setPageNumber] = useState(1);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    handleGetFeedbacks();
  }, [pageNumber]);

  useEffect(() => {
    setTotalPage(Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const handleDeleteItem = async (id: string) => {
    setLoading(true);
    try {
      let response = await handleDeleteFeedbackAPI(id);
      if (response.status === 200) {
        toast({
          title: "Successful",
          description: `${id} was deleted successfully`,
        });
      }
      handleGetFeedbacks();
    } catch (error) {
      console.log(error);
    } finally{
        setLoading(false);
    }
  };

  const handleGetFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await handleGetFeedbackAPI(pageSize, pageNumber);
      if (response?.status === 200) {
        setListFeedback(response.data);
        getTotalCount(response);
      }      
    } catch (error) {
      console.error(error);
    } finally{
        setLoading(false);
    }
  };

  const getTotalCount = (response: any) => {
    const paginationHeader = response?.headers["x-pagination"];
    if (paginationHeader) {
      const paginationData = JSON.parse(paginationHeader);
      const totalCount = paginationData.TotalCount;
      setTotal(totalCount);
    }
  };

  const handleChangePage = (opt: number) => {
    setPageNumber(opt + 1);
  };

  return (
    <>
      {loading ? (
        <>
          <div className="flex items-center justify-center h-screen">
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
          </div>
        </>
      ) : (
        <>
          <BackButton text="Go Back" link="/" />
          
          {listFeedback && (
            <div className="mt-10">
              <Table>
                <TableCaption>A list of recent products</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ProductId</TableHead>
                    <TableHead>UserId</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Content</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listFeedback.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.productId}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.userId}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.rate}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.content}
                      </TableCell>
                      <TableCell>
                        <button
                          className="bg-black text-white font-bold py-2 px-4 rounded text-xs"
                          onClick={() => handleDeleteItem( product.id)}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

export default Page;