"use client";

import { handleGetBreedAPI } from "@/components/api/products/breed";
import {
  handleGetProductFishByIdAPI,
  hanldePatchProductFishAPI,
} from "@/components/api/products/fish";
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
import { AwardType } from "@/types/ResponseModel/AwardType";

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
  imageFiles: z.array(z.any()).optional(), // Ảnh sản phẩm, có thể là tệp upload
  deleteImages: z.array(z.string().uuid()).optional(),
  updateImages: z.array(z.any()).optional(),
  fishModel: z.object({
    breedId: z.string(),
    size: z.preprocess(
      (val) => Number(val),
      z.number().positive("Size must be greater than 0")
    ),
    age: z.preprocess(
      (val) => Number(val),
      z.number().min(0, "Age must be a positive number")
    ),
    origin: z.string().min(1, "Origin is required"),
    sex: z.string(),
    foodAmount: z.preprocess(
      (val) => Number(val),
      z.number().positive("Food amount must be positive")
    ),
    weight: z.preprocess(
      (val) => Number(val),
      z.number().positive("Weight must be positive")
    ),
    health: z.string().min(1, "Health status is required"),
    deleteAward: z.array(z.string().uuid()).optional(),
    fishAward: z
      .array(
        z.object({
          id: z.string().nullable(),
          name: z.string().min(1, "Award name is required"),
          description: z.string().optional(),
          awardDate: z.string().min(1, "Award date is required"),
        })
      )
      .optional(),
  }),
});

interface EditFishProductPageProps {
  params: {
    id: string;
  };
}

const EditFishProductPage = ({ params }: EditFishProductPageProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [breed, setBreed] = useState<BreedType[]>([]);
  const [error, setError] = useState<any>();
  const [fish, setFish] = useState<ProductType | null>(null);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);
  const [deleteAward, setDeleteAward] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fishModel.fishAward",
  });

  const { setValue } = form;

  const handleGetBreed = async () => {
    try {
      let response = await handleGetBreedAPI();
      if (response.status === 200) {
        setBreed(response.data as BreedType[]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetProductFish = async (id: string) => {
    try {
      let response = await handleGetProductFishByIdAPI(id);
      if (response.status === 200) {
        var data = response as AxiosResponse;
        setFish(data.data.data as ProductType);
        // Populate initial awards for editing
        const awards = data.data.data.fish?.awards.map((award: AwardType) => ({
          id: award.id,
          name: award.name,
          description: award.description,
          awardDate: award.awardDate,
        }));
        console.log(awards);

        setValue("fishModel.fishAward", awards || []);
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
    handleGetBreed();
    handleGetProductFish(params.id);
  }, []);

  useEffect(() => {
    if (fish) {
      if (fish.name) setValue("name", fish.name);
      if (fish.description) setValue("description", fish.description);
      if (fish.descriptionDetail)
        setValue("descriptionDetail", fish.descriptionDetail);
      if (fish.stockQuantity) setValue("stockQuantity", fish.stockQuantity);
      if (fish.price) setValue("price", fish.price);
      if (fish.originalPrice) setValue("originalPrice", fish.originalPrice);
      if (fish.fish) {
        if (fish.fish.breed.id)
          setValue("fishModel.breedId", fish.fish.breed.id);
        if (fish.fish.size) setValue("fishModel.size", fish.fish.size);
        if (fish.fish.age) setValue("fishModel.age", fish.fish.age);
        if (fish.fish.origin) setValue("fishModel.origin", fish.fish.origin);
        if (fish.fish.sex) setValue("fishModel.sex", fish.fish.sex);
        if (fish.fish.foodAmount)
          setValue("fishModel.foodAmount", fish.fish.foodAmount);
        if (fish.fish.weight) setValue("fishModel.weight", fish.fish.weight);
        if (fish.fish.health) setValue("fishModel.health", fish.fish.health);
      }
    }
  }, [fish, setValue]);

  const toggleDeleteImage = (imageId: string) => {
    setDeleteImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleRemoveAward = (index: number) => {
    let fishAwards = form.getValues("fishModel.fishAward");
    console.log("fishAwards", fishAwards);
    if (fishAwards) {
      let awardId = fishAwards[index].id;
      console.log("handleRemoveAward", awardId);
      if (awardId) {
        setDeleteAward((prev) => [...prev, awardId]);
      }
    }
    remove(index);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...data,
        deleteImages,
        fishModel: {
          ...data.fishModel,
          deleteAward,
          fishAward:
            data &&
            data.fishModel &&
            data.fishModel.fishAward &&
            data.fishModel.fishAward.filter(
              (award) => award.id === null || !deleteAward.includes(award.id)
            ),
        },
      };
      let response = await hanldePatchProductFishAPI(params.id, payload);
      if (response && response.status === 200) {
        toast({
          title: "Editing successful",
          description: `${data.name} production is edited successfully`,
        });
        router.push("/fish");
      }
      if (response && response.status === 401) {
        router.push("/auth");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <BackButton text="Go Back" link="/" />
      <h3 className="text-2xl mb-4">Edit Fish Product</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            {fish &&
              fish.images &&
              fish.images.map((image) => (
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

          {/* Fish Model */}
          <FormField
            control={form.control}
            name="fishModel.breedId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Breed
                </FormLabel>
                <FormControl>
                  <select
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    {...field}
                  >
                    <option>Breed</option>
                    {breed?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fishModel.size"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Size
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
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
            name="fishModel.age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Age
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Age"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fishModel.origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Origin
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

          <FormField
            control={form.control}
            name="fishModel.sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Sex
                </FormLabel>
                <FormControl>
                  <select
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    {...field}
                  >
                    <option>Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fishModel.foodAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Food Amount (grams/day)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Food Amount in grams/day"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fishModel.weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Weight (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Weight in kg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fishModel.health"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Health Status
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Health Status"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Fish Awards</FormLabel>
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-4 mb-4">
                {/* Award Name Field */}
                <FormField
                  control={form.control}
                  name={`fishModel.fishAward.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Award Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Award Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Award Description Field */}
                <FormField
                  control={form.control}
                  name={`fishModel.fishAward.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Award Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter Award Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Award Date Field */}
                <FormField
                  control={form.control}
                  name={`fishModel.fishAward.${index}.awardDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Award Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={() => handleRemoveAward(index)}
                  className="text-red-500"
                >
                  Remove Award
                </Button>
              </div>
            ))}
            <Button
              onClick={() => append({ id: null, name: "", awardDate: "" })}
            >
              Add Award
            </Button>
          </FormItem>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default EditFishProductPage;
