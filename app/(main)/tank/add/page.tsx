"use client";
import BackButton from "@/components/BackButton";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handlePostProductFishAPI } from "@/components/api/products/fish";
import { CategoryType } from "@/types/ResponseModel/TankCategoryType";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { handleGetCategoryAPI } from "@/components/api/products/category";
import { handlePostProductTankAPI } from "@/components/api/products/tank";
import { ThreeDots } from "react-loader-spinner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"), // Tên cá, yêu cầu bắt buộc
  description: z.string().min(1, "Description is required"), // Mô tả
  descriptionDetail: z.string().min(1, "Description detail is required"), // Mô tả chi tiết, có thể không bắt buộc
  stockQuantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Stock must be a positive number")
  ), // chuyển chuỗi thành số
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(1).positive("Price must be greater than 0")
  ),
  originalPrice: z.preprocess(
    (val) => Number(val),
    z.number().min(1).positive("Original Price must be greater than 0")
  ),
  imageFiles: z.array(z.any()).min(3, "Please upload at least 3 images").optional(),
  tankModel: z.object({
    size: z.string().min(1, "Size is required"),
    sizeInformation: z.string().min(1, "Size information is required"),
    glassType: z.string().min(1, "Glass type is required"), // Nguồn gốc của cá
  }),
  categoriesIds: z.array(z.string()),
});

const AddProductFishPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [category, setCategory] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoriesIds: [],
    },
  });

  useEffect(() => {
    handleGetCategory();
  }, []);

  const handleGetCategory = async () => {
    setLoading(true)
    try {
      let response = await handleGetCategoryAPI();
      console.log(response);
      if (response.status === 200) {
        setCategory(response.data as CategoryType[]);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      let response = await handlePostProductTankAPI(data);
      if (response.status === 200) {
        toast({
          title: "Adding successful",
          description: `${data.name} production is added successfully`,
        });
        router.push("/tank");
      }
    } catch (error) {
      setError("Your action is failed, please try again");
      console.log(error);
      return;
    }
  };

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
      <BackButton text="Danh sách sản phẩm cá" link="/fish" />
      <h3 className="text-2xl mb-4">Add New Product</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Detail */}
          <FormField
            control={form.control}
            name="descriptionDetail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Description Detail
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Detailed Description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock Quantity */}
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Stock Quantity
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Stock Quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Price
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Original Price */}
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Original Price
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Original Price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Files */}
          <FormField
            control={form.control}
            name="imageFiles"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Image Files
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []); // Convert FileList to array
                      field.onChange(files); // Pass files array to the form state
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormControl>
            <div className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
              {category?.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.watch("categoriesIds").includes(cat.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const currentIds = form.getValues("categoriesIds");
                      form.setValue(
                        "categoriesIds",
                        checked
                          ? [...currentIds, cat.id]
                          : currentIds.filter((id) => id !== cat.id)
                      );
                    }}
                    className="checkbox-class-name" // Apply any additional styles if needed
                  />
                  <label className="text-black dark:text-white">
                    {cat.tankType} - {cat.level}
                  </label>
                </div>
              ))}
            </div>
          </FormControl>

          <FormField
            control={form.control}
            name="tankModel.size"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Size
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Size"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tankModel.sizeInformation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Age
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Size"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tankModel.glassType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Glass type
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Origin"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
      )}</>
  );
};

export default AddProductFishPage;
