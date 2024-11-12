import { ProductType } from "@/types/ResponseModel/ProductType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductTableProps {
  data: ProductType[];
  type: string;
}

const ProductTable = ({ data, type }: ProductTableProps) => {
  const router = useRouter();
  const handleOpenEditPage = (data: ProductType) => {
    if (type === "fish") {
      if (data.fish?.date_of_birth) {
        router.push(`/fish/editKoi/${data.id}`);
      } else {
        router.push(`/fish/editOther/${data.id}`);
      }
    } else {
      router.push(`/tank/edit/${data.id}`);
    }
  };
  return (
    <div className="mt-10">
      <Table>
        <TableCaption>A list of recent products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">
              Stock Quantity
            </TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">
              Original Price
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {product.description}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.stockQuantity}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.price.toLocaleString("vi-VI")} VND
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {product.originalPrice?.toLocaleString("vi-VI")} VND
              </TableCell>
              <TableCell>
                <button className="bg-black text-white font-bold py-2 px-4 rounded text-xs" onClick={() => handleOpenEditPage(product)}>
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
