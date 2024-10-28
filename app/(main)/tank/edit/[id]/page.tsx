"use client";
import {
  handleGetProductTankByIdAPI,
  hanldePatchProductTankAPI,
} from "@/components/api/products/tank";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BreedType } from "@/types/ResponseModel/BreedType";
import { ProductType } from "@/types/ResponseModel/ProductType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { AxiosError, AxiosResponse } from "axios";
import { handleGetCategoryAPI } from "@/components/api/products/category";
import { CategoryType } from "@/types/ResponseModel/CategoryType";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  descriptionDetail: z.string(),
  stockQuantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Stock must be a positive number")
  ),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(1).positive("Price must be greater than original price")
  ),
  originalPrice: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive()
  ),
  deleteImages: z.array(z.string().uuid()).optional(),
  updateImages: z.array(z.any()).optional(),
  tankModel: z.object({
    size: z.string().min(1, "Size is required"),
    sizeInformation: z.string().min(1, "Size information is required"),
    glassType: z.string().min(1, "Glass type is required"),
    deleteCategories: z.array(z.string().uuid()),
    updateCategories: z.array(z.string().uuid()),
  }),
});

interface EditTankProductPageProps {
  params: {
    id: string;
  };
}

const EditTankProductPage = ({ params }: EditTankProductPageProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [error, setError] = useState<any>();
  const [tank, setTank] = useState<ProductType | null>(null);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues:{
    //     tankModel.updateCategories: [],
    //     tankModel.deleteCategories: [],
    // }
  });

  //   const { fields, append, remove } = useFieldArray({
  //     control: form.control,
  //     name: "tankModel.tankAward",
  //   });

  const { setValue } = form;

  const handleGetCategory = async () => {
    try {
      let response = await handleGetCategoryAPI();
      console.log(response);
      if (response.status === 200) {
        setCategory(response.data as CategoryType[]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetProductTank = async (id: string) => {
    try {
      let response = await handleGetProductTankByIdAPI(id);
      console.log(response);
      
      if (response.status === 200) {
        var data = response as AxiosResponse;
        setTank(data.data.data as ProductType);
        
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

  useEffect(() => {
    handleGetCategory();
    handleGetProductTank(params.id);
  }, []);

  useEffect(() => {
    if (tank) {
      if (tank.name) setValue("name", tank.name);
      if (tank.description) setValue("description", tank.description);
      if (tank.descriptionDetail)
        setValue("descriptionDetail", tank.descriptionDetail);
      if (tank.stockQuantity) setValue("stockQuantity", tank.stockQuantity);
      if (tank.price) setValue("price", tank.price);
      if (tank.originalPrice) setValue("originalPrice", tank.originalPrice);
      if (tank.tank) {
        if (tank.tank.size) setValue("tankModel.size", tank.tank.size);
        if (tank.tank.sizeInformation)
          setValue("tankModel.sizeInformation", tank.tank.sizeInformation);
        if (tank.tank.glassType)
          setValue("tankModel.glassType", tank.tank.glassType);
        if (tank.tank.categories) {
            let categories: string[] = []
            tank.tank.categories.forEach((cat, index) => categories[index] = cat.id)
            setValue("tankModel.updateCategories",categories)
        }
      }
    }
  }, [tank, setValue]);

  useEffect(() => {
    if (category && tank?.tank) {
        let ids: string[] = []
        let i = 0;
        category.forEach((cat, index) => {
            tank.tank?.categories.forEach(picked => {
                if (picked.id !== cat.id) {
                    ids[i] = picked.id
                    i++
                }
            });
        })
        console.log("tankModel.deleteCategories", ids);
        
        setValue("tankModel.deleteCategories", ids)
    }
  }, [category, tank])

  const toggleDeleteImage = (imageId: string) => {
    setDeleteImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...data,
        deleteImages,
      };
      let response = await hanldePatchProductTankAPI(params.id, payload);
      if (response && response.status === 200) {
        toast({
          title: "Editing successful",
          description: `${data.name} production is edited successfully`,
        });
        router.push("/tank");
      }
      if (response && response.status === 401) {
        router.push("/auth");
      }
    } catch (error) { 
        console.error(error)
    }
    
    function isAxiosErrorResponse(response: any): response is { data: { detail: string } } {
        return response && response.data && typeof response.data.detail === 'string'
    }
    
    
  };

  return (
    <>
      <BackButton text="Go Back" link="/" />
      <h3 className="text-2xl mb-4">Edit Tank Product</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <>
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

          <div className="grid grid-cols-3 gap-4">
            {tank &&
              tank.images &&
              tank.images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.link}
                    alt={`Image ${image.id}`}
                    className="w-full h-auto"
                  />
                  <button
                    type="button"
                    onClick={() => toggleDeleteImage(image.id)}
                    className={`absolute top-2 right-2 p-1 rounded ${
                      deleteImages.includes(image.id)
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    } text-white`}
                  >
                    {deleteImages.includes(image.id) ? "Undo" : "Delete"}
                  </button>
                </div>
              ))}
          </div>

          <FormField
            control={form.control}
            name="updateImages"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  New Image{" "}
                </FormLabel>
                <FormControl>
                  <input
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
                  Size information
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter size information"
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
                    placeholder="Enter Glass Type"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </>

          <FormControl>
  <div className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0">
    
    <h4 className="font-bold">Checked Items</h4>
    {category
      .filter((cat) => form.watch("tankModel.updateCategories")?.includes(cat.id))
      .map((cat) => (
        <div key={cat.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.watch("tankModel.updateCategories")?.includes(cat.id)}
            onChange={(e) => {
              const checked = e.target.checked;
              const currentIds = form.getValues("tankModel.updateCategories") || [];
              form.setValue(
                "tankModel.updateCategories",
                checked
                  ? [...currentIds, cat.id]
                  : currentIds.filter((id) => id !== cat.id)
              );
            }}
            className="checkbox-class-name"
          />
          <label className="text-black dark:text-white">
            {cat.tank_type} - {cat.level}
          </label>
        </div>
      ))}

    <h4 className="font-bold mt-4">Unchecked Items</h4>
    {category
      .filter((cat) => !form.watch("tankModel.updateCategories")?.includes(cat.id))
      .map((cat) => (
        <div key={cat.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={false}
            onChange={(e) => {
              const checked = e.target.checked;
              const currentIds = form.getValues("tankModel.updateCategories") || [];
              form.setValue(
                "tankModel.updateCategories",
                checked
                  ? [...currentIds, cat.id]
                  : currentIds.filter((id) => id !== cat.id)
              );
            }}
            className="checkbox-class-name"
          />
          <label className="text-black dark:text-white">
            {cat.tank_type} - {cat.level}
          </label>
        </div>
      ))}
  </div>
</FormControl>


          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default EditTankProductPage;
