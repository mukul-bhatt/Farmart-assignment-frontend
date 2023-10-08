"use client";
import React, { FormEvent, useEffect, useState } from "react";
import useLogin from "../../hooks/useLogin";
import "./Login.css";
import Link from "next/link";

import { redirect } from "next/navigation";
import Image from "next/image";
import { User } from "@/types";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn, isLoading, error, setError } = useLogin();
  const router = useRouter();

  let user: User;
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        if (localStorage.getItem("user")) {
          router.push("/");
        }
      }
    };
    check();
  }, []);

  const closeError = () => {
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await logIn(email, password);
    let user = localStorage.getItem("user");
    if (user) {
      router.push("/");
    }
  };
  return (
    <div className="loginPage">
      <div className="loginLogo">
        <Image
          width={48}
          height={48}
          src="https://res.cloudinary.com/dudoss6ih/image/upload/v1668326337/IMG_20210727_173654_kta1jy.jpg"
          alt="Logo"
        />
      </div>

      <form className="loginForm" onSubmit={handleSubmit}>
        <h1>
          Login to <span>PT</span>
        </h1>
        <div className="loginBody">
          <label htmlFor="">Email address </label>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required={true}
          />
          <label htmlFor="">Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required={true}
          />
          <button className="loginBtn" disabled={isLoading}>
            Login
          </button>
        </div>
        {error && <div className="loginError">{error}</div>}

        <div className="logintoReg">
          <p>
            New to PT?{" "}
            <Link href="/signup" className="hover:text-blue-500">
              Create an account
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
