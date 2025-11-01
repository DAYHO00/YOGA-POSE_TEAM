"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, logout, nickname } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/home");
  };

  return (
    <nav className='flex items-center justify-between px-20 py-4'>
      <Link href='/home' className='cursor-pointer'>
        <Image src='/images/logo.svg' alt='Samadhi' width='155' height='50' />
      </Link>

      <div className='flex items-center space-x-2'>
        {isLoggedIn ? (
          <>
            <span className='text-base font-medium'>{nickname}님</span>
            <Button
              variant='ghost'
              className='text-base font-normal h-9'
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Link href='/auth/login'>
              <Button variant='ghost' className='text-base font-normal h-9'>
                로그인
              </Button>
            </Link>
            <Link href='/auth/signup'>
              <Button variant='ghost' className='text-base font-normal h-9'>
                회원가입
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
