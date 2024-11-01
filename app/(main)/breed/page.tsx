

"use client";

import {
  handleGetBreedAPI,
  handlePutBreedAPI,
  handlePostBreedAPI,
} from "@/components/api/products/breed";
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
import { z } from "zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AxiosError, AxiosResponse } from "axios";
import { v4 as uuidv4 } from 'uuid';
import { BreedType } from "../../../types/ResponseModel/BreedType";

const formSchema = z.object({
    id:z.string(),
    name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
});
const Page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
  
    const { setValue } = form;
    const [listBreed, setListBreed] = useState<BreedType[]>([]);
    const [pageSize, setPageSize] = useState(9);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalBreeds, setTotalBreeds] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [popup, setPopup] = useState(false);
    const [breed, setBreed] = useState<BreedType | null>(null);
    const router = useRouter();
  
    useEffect(() => {
      handleGetBreeds();
    }, [pageNumber]);
  
    useEffect(() => {
      setTotalPage(Math.ceil(totalBreeds / pageSize));
    }, [totalBreeds, pageSize]);
  
    const handleOpenPopup = (breed?: BreedType) => {
        setPopup(true);
        if (breed) {
          setBreed(breed);
          setValue("id", breed.id);
          setValue("name", breed.name);
          setValue("description", breed.description);
        } else {
          setBreed(null);
          setValue("id", uuidv4()); // Only set a new UUID for new breeds
          form.reset({ id: uuidv4() });
        }
      };      
  
    const handleClosePopup = () => {
      setPopup(false);
      setBreed(null);
      form.reset();
    };
//   const handleDeleteItem = async (id: string) => {
//     try {
//         let response = await handleDeleteBreedAPI(id)
//     if (response.status === 200) {
//         toast({
//             title: "Successful",
//             description: "Breed was deleted successfully",
//           });
//     }          
//     handleGetBreeds();
//     } catch (error) {
//         console.log(error);
        
//     }
//   }
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      try {
        console.log(data);
        
        const response: AxiosResponse = breed
          ? await handlePutBreedAPI(breed.id, data)
          : await handlePostBreedAPI(data);
        if (response.status === 200) {
          toast({
            title: "Successful",
            description: breed
              ? `${breed.name} updated successfully`
              : "New breed added successfully",
          });
          handleClosePopup();
          handleGetBreeds();
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleGetBreeds = async () => {
      try {
        const response = await handleGetBreedAPI();
        if (response?.status === 200) {
          setListBreed(response.data);
          getTotalCount(response);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const getTotalCount = (response: any) => {
      const paginationHeader = response?.headers["x-pagination"];
      if (paginationHeader) {
        const paginationData = JSON.parse(paginationHeader);
        const totalCount = paginationData.TotalCount;
        setTotalBreeds(totalCount);
      }
    };
  
    const handleChangePage = (opt: number) => {
      setPageNumber(opt + 1);
    };
  
    return (
      <>
        <BackButton text="Go Back" link="/" />
        <button onClick={() => handleOpenPopup()}>Add new breed</button>
        {popup && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input type="hidden" {...form.register("id")}/>
          <input
          className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
            placeholder="Enter Name"
            {...form.register("name")}
          />
          <input
          className="uppercase text-xs font-bold text-zinc-500 dark:text-white"
            placeholder="Enter Description"
            {...form.register("description")}
          />
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={handleClosePopup}>
            Cancel
          </Button>
        </form>
      )}
        {listBreed && (
          <div className="mt-10">
            <Table>
              <TableCaption>A list of recent products</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Create At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listBreed.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell break-words">
                      {product.description}
                    </TableCell>
                    <TableCell>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={() => handleOpenPopup(product)}
                      >
                        Edit
                      </button>
                      {/* <button
                        className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={() => handleDeleteItem(product.id)}
                      >
                        Delete
                      </button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {totalPage > 1 && (
          <div className="list-pagination flex items-center md:mt-10 mt-7">
            <HandlePagination onPageChange={handleChangePage} pageCount={totalPage} />
          </div>
        )}
      </>
    );
  };
  
  export default Page;
  