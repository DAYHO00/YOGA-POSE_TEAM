import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className='flex items-center justify-between px-20 py-4'>
      <Link href='/' className='cursor-pointer'>
        <Image src='/images/logo.svg' alt='Samadhi' width='155' height='50' />
      </Link>

      <div className='flex items-center space-x-1'>
        <Button variant='ghost' className='text-base font-normal h-9'>
          로그인
        </Button>

        <Button variant='ghost' className='text-base font-normal h-9'>
          회원가입
        </Button>
      </div>
    </nav>
  );
}
