import { ProductType } from "@/types/ResponseModel/ProductType";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCaption 
} from '@/components/ui/table';
import Link from 'next/link';

interface FishesTableProps {
  data: ProductType[];
}

const FishesTable = ({ data }: FishesTableProps) => {
  return (
    <div className='mt-10'>
      <Table>
        <TableCaption>A list of recent products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className='hidden md:table-cell'>Description</TableHead>
            <TableHead className='hidden md:table-cell'>Stock Quantity</TableHead>
            <TableHead className='hidden md:table-cell'>Price</TableHead>
            <TableHead className='hidden md:table-cell'>Original Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell className='hidden md:table-cell'>{product.description}</TableCell>
              <TableCell className='hidden md:table-cell'>{product.stock_quantity}</TableCell>
              <TableCell className='hidden md:table-cell'>{product.price.toLocaleString('vi-VI')} VND</TableCell>
              <TableCell className='hidden md:table-cell'>{product.original_price.toLocaleString('vi-VI')} VND</TableCell>
              <TableCell>
                <Link href={`/fish/edit/${product.id}`}>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs'>
                    Edit
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default FishesTable;