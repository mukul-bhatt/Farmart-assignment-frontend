"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backend_url } from "@/helper";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
  FileDoneOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { redirect } from "next/navigation";
import { User, UserFile } from "@/types";
import useLogout from "@/hooks/useLogout";

export default function Home() {
  const { toast } = useToast();
  const [uploadFile, setUploadFile] = useState<string | Blob>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [userToken, setUserToken] = useState<User>();
  const [userFiles, setUserFiles] = useState<UserFile[]>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputExists, setInputExists] = useState<string>("");

  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  let user: User;
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        if (!localStorage.getItem("user")) {
          redirect("/login");
        } else {
          // eslint-disable-next-line
          user = JSON.parse(localStorage.getItem("user")!);
          console.log("🔥  file: page.tsx:30  user: ", user);
          setUserToken(user);
        }
      }
    };
    check();

    // fetching user files that he uploaded
    const fetchFiles = async () => {
      const response = await axios.get(`${backend_url}/user/files`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = response.data;
      setUserFiles(data.list);
    };
    fetchFiles();
  }, []);

  // copy link to clipboard
  const copylink = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    toast.call({ open: false }, { duration: 5 });
    if (inputElement.files && inputElement.files.length > 0) {
      setInputExists(inputElement.files?.[0].name);
      if (inputElement.files[0].size > 10000000) {
        toast({
          variant: "destructive",
          title: "File Size is bigger.",
          description: "File size is too big must be less than 10mb.",
          duration: 3000,
        });
        return;
      } else if (
        inputElement.files[0].type.split("/")[0] !== "image" &&
        inputElement.files[0].type.split("/")[0] !== "video" &&
        inputElement.files[0].type !== "application/pdf"
      ) {
        toast({
          variant: "destructive",
          title: "Please upload Image, Video or Pdf.",
          description: "Only Image, Video or Pdf are allowed.",
          duration: 3000,
        });
        return;
      }
      setUploadFile(inputElement.files[0]);
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    console.log("upload file: ", uploadFile);

    if (uploadFile) {
      fetch(`${backend_url}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${userToken?.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setShortUrl(data.shortUrl);
          toast({
            variant: "default",
            title: "File Uploaded Successfully.",
            duration: 2000,
          });
          // updating user files
          const newFiles = [...userFiles!, data.file];
          setUserFiles(newFiles);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          setInputExists("");
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      toast({
        variant: "destructive",
        title: "Please select a file to upload.",
        duration: 1000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    const response = await axios.delete(`${backend_url}/user/file`, {
      data: {
        fileId: id,
      },
      headers: {
        Authorization: `Bearer ${userToken?.token}`,
      },
    });
    const data = response.data;
    console.log(data);
    if (data.success) {
      toast({
        variant: "default",
        title: "File Deleted Successfully.",
        duration: 2000,
      });
      const newFiles = userFiles?.filter((item) => item._id !== id);
      console.log("🔥  file: page.tsx:156  newFiles: ", newFiles);
      setUserFiles(newFiles);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <div className="font-bold text-3xl p-10 text-[#00adb5]">
          UploadShort
        </div>
        <Link
          href={"/login"}
          onClick={handleLogout}
          className="text-2xl p-5 text-white -mt-4"
        >
          <LogoutOutlined className="text-[#00adb5]" />
        </Link>
      </div>
      <div className="flex items-center justify-center flex-col gap-10 text-white pt-20">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {/* <label
            className="block mb-2 text-sm font-medium text-white"
            htmlFor="large_size"
          >
            Upload Picture, Video or PDF File
          </label>
          <input
            className="block w-full text-lg  border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
            id="large_size"
            type="file"
            onChange={handleFileChange}
            ref={inputRef}
          ></input> */}

          <div className="flex items-center justify-center w-full">
            {!inputExists ? (
              <>
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                      Click to Upload File
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG, GIF, PDF, MP4 OR MKV (MAX. 10mb)
                    </p>
                  </div>
                </label>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-black gap-10">
                  <FileDoneOutlined className="text-6xl" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">{inputExists}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleUpload} className="bg-[#00adb5]">
            Upload File
          </Button>
        </div>
        {shortUrl && (
          <div className="flex gap-5 items-center justify-between">
            <Input disabled value={shortUrl} />
            <Button onClick={copylink}>Copy</Button>
            <Link href={`${shortUrl}`}>
              <Button className="bg-[#00adb5] ">Preview</Button>
            </Link>
          </div>
        )}

        {userFiles?.length ? (
          <div className="p-10 pb-20">
            <Table className="overflow-scroll p-10">
              <TableCaption>A list of your uploaded Files</TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[50px]">File Name</TableHead>
                  <TableHead className="max-w-[50px]">Short Url</TableHead>
                </TableRow>
              </TableHeader>

              {userFiles &&
                userFiles.map((item) => (
                  <TableBody key={item._id}>
                    <TableCell className="font-semibold text-base overflow-scroll break-words text-[#00adb5]">
                      {item.originalFileName}
                    </TableCell>
                    <TableCell className="overflow-scroll break-words">
                      <HoverCard>
                        <HoverCardTrigger>{item.shortUrl}</HoverCardTrigger>
                        <HoverCardContent arrowPadding={0}>
                          <div className="flex flex-col gap-3">
                            <div className="break-words">{item.shortUrl}</div>
                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(item.shortUrl);
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>
                      <Link href={`/${item._id}`}>
                        <Button className="bg-[#00adb5]"> Preview </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          handleDelete(item._id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableBody>
                ))}
            </Table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
