import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  Newspaper,
  Folders,
  CreditCard,
  Settings,
  User,
  Fish,
  RectangleHorizontal,
  PersonStanding,
} from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <Command className='bg-secondary rounded-none'>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Suggestions'>
          <CommandItem>
            <LayoutDashboard className='mr-2 h-4 w-4' />
            <Link href='/'>Dashboard</Link>
          </CommandItem>
          <CommandItem>
            <PersonStanding className='mr-2 h-4 w-4'/>
            <Link href='/staff'>Nhân Viên</Link>
          </CommandItem>
          <CommandItem>
            <Fish className='mr-2 h-4 w-4' />
            <Link href='/fish'>Cá Cảnh</Link>
          </CommandItem>
          <CommandItem>
            <RectangleHorizontal className='mr-2 h-4 w-4' />
            <Link href='/subProduct'>Sản Phẩm Phụ</Link>
          </CommandItem>
          <CommandItem>
            <RectangleHorizontal className='mr-2 h-4 w-4' />
            <Link href='/tank'>Hồ Cá</Link>
          </CommandItem>
          <CommandItem>
            <Newspaper className='mr-2 h-4 w-4' />
            <Link href='/posts'>Bài Đăng</Link>
          </CommandItem>
          <CommandItem>
            <Folders className='mr-2 h-4 w-4' />
            <Link href='/category'>Loại Hồ Cá</Link>
          </CommandItem>
          <CommandItem>
            <Folders className='mr-2 h-4 w-4' />
            <Link href='/breed'>Giống Cá</Link>
          </CommandItem>
          <CommandItem>
            <PersonStanding className='mr-2 h-4 w-4'/>
            <Link href='/feedback'>Bình Luận</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Settings'>
          <CommandItem>
            <User className='mr-2 h-4 w-4' />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard className='mr-2 h-4 w-4' />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className='mr-2 h-4 w-4' />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
