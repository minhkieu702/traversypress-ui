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
import { BreedType } from "@/types/ResponseModel/BreedType";
import { handleGetBreedAPI } from "@/components/api/products/breed";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ThreeDots } from "react-loader-spinner";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"), // Tên cá, yêu cầu bắt buộc
    description: z.string().min(1, "Description is required"), // Mô tả
    descriptionDetail: z.string(), // Mô tả chi tiết, có thể không bắt buộc
    stockQuantity: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().min(0, "Stock must be 0 or a positive number")
    ),
    price: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().min(0, "Price must be 0 or greater")
    ),
    originalPrice: z.preprocess(
      (val) => (val === "" ? 0 : Number(val)),
      z.number().optional()
    ),
    imageFiles: z
    .array(z.any())
    .length(3, "Exactly 3 images are required") // Check for exactly 3 images
    .optional(), // Ảnh sản phẩm, có thể là tệp upload
    fishModel: z.object({
      breedId: z.string().min(1, "Breed ID is required"), // Mã giống cá
      size: z.preprocess(
        (val) => (val === "" ? 0 : Number(val)),
        z.number().min(0, "Size must be greater than 0")
      ),
      age: z.preprocess(
        (val) => (val === "" ? 0 : Number(val)),
        z.number().min(0, "Age must be a positive number")
      ),
      origin: z.string().min(1, "Origin is required"), // Nguồn gốc của cá
      sex: z.string(), // Giới tính của cá
      foodAmount: z.preprocess(
        (val) => (val === "" ? 0 : Number(val)),
        z.number().min(0, "Food amount must be positive")
      ),
      weight: z.preprocess(
        (val) => (val === "" ? 0 : Number(val)),
        z.number().min(0, "Weight must be positive")
      ),
      health: z.string(), // Tình trạng sức khỏe
      dateOfBirth: z.string(), // Ngày sinh
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
  })
  .refine(
    (data) => data.price > (data.originalPrice ?? 0), // Ensure price > originalPrice (or 0 if originalPrice is missing)
    {
      message: "Price must be greater than the original price",
      path: ["price"], // Error will be attached to the price field
    }
  );


const AddProductFishPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [breed, setBreed] = useState<BreedType[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control, // use the control from useForm
    name: "fishAward", // the name of the field array in the schema
  });

  useEffect(() => {
    handleGetBreed();
  }, []);

  const handleGetBreed = async () => {
    setLoading(true)
    try {
      let response = await handleGetBreedAPI();
      if (response.status === 200) {
        setBreed(response.data as BreedType[]);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      let response = await handlePostProductFishAPI(data);
      if (response.status !== 200) {
        var error = response as AxiosError
        toast({
          title: "Error",
          content: error.response?.data as string
      })
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
                {/* <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Breed
                </FormLabel> */}
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
                {/* <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Sex
                </FormLabel> */}
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
    )
  }
  </>
  );
};

export default AddProductFishPage;
