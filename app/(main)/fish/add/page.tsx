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
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handlePostProductFishAPI } from "@/components/api/products/fish";
import { BreedType } from "@/types/ResponseModel/BreedType";
import { handleGetBreedAPI } from "@/components/api/products/breed";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"), // Tên cá, yêu cầu bắt buộc
  description: z.string().min(1, "Description is required"), // Mô tả
  descriptionDetail: z.string().optional(), // Mô tả chi tiết, có thể không bắt buộc
  stockQuantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Stock must be a positive number")
  ), // chuyển chuỗi thành số
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(1).positive("Price must be greater than 0")
  ),
  originalPrice: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  imageFiles: z.array(z.any()).optional(), // Ảnh sản phẩm, có thể là tệp upload
  fishModel: z.object({
    breedId: z.string().min(1, "Breed ID is required"), // Mã giống cá
    size: z.preprocess(
      (val) => Number(val),
      z.number().positive("Size must be greater than 0")
    ),
    age: z.preprocess(
      (val) => Number(val),
      z.number().min(0, "Age must be a positive number")
    ),
    origin: z.string().min(1, "Origin is required"), // Nguồn gốc của cá
    sex: z.boolean(), // Giới tính của cá
    foodAmount: z.preprocess(
      (val) => Number(val),
      z.number().positive("Food amount must be positive")
    ),
    weight: z.preprocess(
      (val) => Number(val),
      z.number().positive("Weight must be positive")
    ),
    health: z.string().min(1, "Health status is required"), // Tình trạng sức khỏe
    dateOfBirth: z.string().min(1, "Date of birth is required"), // Ngày sinh
  }),
  fishAward: z
    .array(
      z.object({
        name: z.string().min(1, "Award name is required"), // Tên giải thưởng
        description: z.string().optional(), // Mô tả giải thưởng
        awardDate: z.string().min(1, "Award date is required"), // Ngày nhận giải thưởng
      })
    )
    .optional(), // Có thể không bắt buộc (nếu sản phẩm chưa nhận giải)
});

const AddProductFishPage = () => {
  const router = useRouter();
  const [breed, setBreed] = useState<BreedType[]>();

  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control, // use the control from useForm
    name: "fishAward", // the name of the field array in the schema
  });

  useEffect(() => {
    const handleGetBreed = async () => {
      try {
        let response = await handleGetBreedAPI();
        console.log(response);
        if (response.status === 200) {
          setBreed(response.data as BreedType[]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleGetBreed();
  }, []);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      let response = await handlePostProductFishAPI(data);
      if (response.status !== 200) {
        setError("Your action is failed, please try again");
        return;
      }
      toast({
        title: "Adding successful",
        description: `${data.name} production is added successfully`,
      });
      router.push("/fish");
    } catch (error) {
      setError("Your action is failed, please try again");
      console.log(error);
      return;
    }
  };

  return (
    <>
      <BackButton text="Danh mục sản phẩm cá" link="/fish" />
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
                    type="text"
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
                    value={field.value ? "true" : "false"}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <option>Sex</option>
                    <option value="true">Male</option>
                    <option value="false">Female</option>
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

          <FormField
            control={form.control}
            name="fishModel.dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Date of Birth
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
              Fish Awards
            </FormLabel>

            {fields.map((item, index) => (
              <div key={item.id} className="space-y-4 mb-4">
                {/* Award Name Field */}
                <FormField
                  control={form.control}
                  name={`fishAward.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                        Award Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white"
                          placeholder="Enter Award Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Award Description Field */}
                <FormField
                  control={form.control}
                  name={`fishAward.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                        Award Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white"
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
                  name={`fishAward.${index}.awardDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                        Award Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500"
                >
                  Remove Award
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={() => append({ name: "", awardDate: "" })}
            >
              Add Award
            </Button>
          </FormItem>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddProductFishPage;
