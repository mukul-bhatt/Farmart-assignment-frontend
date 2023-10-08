import { useState } from "react";
import axios from "axios";
import { backend_url } from "@/helper";


const useLogin = () => {
  const [error, setError] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = backend_url;

  const logIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    let response = await axios.post(
      `${apiUrl}/user/login`,
      { email, password },
      { validateStatus: () => true }
    );

    if (response.status !== 200) {
      setIsLoading(false);
      setError(response.data.error);
    }
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsLoading(false);
    }
  };
  return { logIn, isLoading, error, setError };
};

export default useLogin;