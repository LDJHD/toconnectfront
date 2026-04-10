"use client";

// Utility function used by other components
export const getRegistrationData = () => {
  const data = localStorage.getItem("login_user");
  return data ? JSON.parse(data) : null;
};

// Redirect register to login page (TO CONNECT TV uses email verification)
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
};

export default RegisterPage;
