import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Cookies from "js-cookie";

export const useLoginCheck = () => {
  const router = useRouter();

  const getCookieSafe = useCallback((name) => {
    try {
      const value = Cookies.get(name);
      if (!value) {
        throw new Error("ارتباط با سرور برقرار نشد یا ورود شما معتبر نیست.");
      }
      return value;
    } catch (error) {
      Cookies.remove(name);
    //   alert(error.message);
      router.push("/");
      return null;
    }
  }, [router]);

  return { getCookieSafe };
};
