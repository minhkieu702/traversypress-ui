"use client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
interface CustomJwtPayload extends JwtPayload {
  role: string;
}
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/auth");
      return;
    }
    const decoded = jwtDecode<CustomJwtPayload>(token);
    console.log(decoded);
    
    if (decoded.role !== "Admin" && decoded.role !== "Staff") {
      router.push("/auth");
    }
    const now = new Date();
    if (decoded.exp && now.getTime() >= decoded.exp * 1000) {
      router.push("/auth");
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="hidden md:block h-[100vh] w-[300px]">
          <Sidebar />
        </div>
        <div className="p-5 w-full md:max-w-[1140px]">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
