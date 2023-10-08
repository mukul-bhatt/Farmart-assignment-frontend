"use client";
import { Button } from "@/components/ui/button";
import { backend_url } from "@/helper";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
// import PdfViewer from "@/components/PdfViewer";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

const File: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [fileContentUrl, setfileContentUrl] = useState("");
  const [fileOriginalName, setFileOriginalName] = useState("");
  const [fileType, setFileType] = useState("");

  let user: User;
  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        if (!localStorage.getItem("user")) {
          // router.push("/login", { scroll: false });
          redirect("/login");
        } else {
          // eslint-disable-next-line
          user = JSON.parse(localStorage.getItem("user")!);
          console.log("🔥  file: page.tsx:30  user: ", user);
        }
      }
    };
    check();
    const fetchFile = async () => {
      try {
        const response = await axios.get(`${backend_url}/file/${params.id}`, {
          responseType: "arraybuffer", // Specify responseType as 'arraybuffer'
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        console.log("🔥  file: page.tsx:35  response: ", response);

        const blob = new Blob([response.data]);
        const dataUrl = URL.createObjectURL(blob);

        setfileContentUrl(dataUrl);
        setFileType(response.headers["file-type"].split("/")[0]);
        setFileOriginalName(response.headers["original-name"]);
      } catch (err) {
        console.log("🔥  file: page.tsx:35  err: ", err);
        toast({
          variant: "destructive",
          title: "File Doesn't Exists.",
          duration: 5000,
        });
      }
    };
    fetchFile();
  }, []);

  console.log("fileType : ", fileType);
  console.log("fileContentUrl : ", fileContentUrl);

  return (
    <div>
      <a href={fileContentUrl} download={`${fileOriginalName}`}>
        <Button className="absolute right-0 top-0 m-5 bg-[#00adb5] text-white">
          Download
        </Button>
      </a>
      <div className="flex flex-col w-full justify-center items-center mt-10">
        <div className="font-semibold text-3xl text-white"> Preview </div>
        <div className="p-10 text-center max-w-[90%]">
          {fileType === "image" ? (
            <Image
              width={1000}
              height={1000}
              src={fileContentUrl}
              alt="file-preview"
            ></Image>
          ) : null}
          {fileType === "video" ? (
            <video width="750" height="500" controls>
              <source src={fileContentUrl} type="video/mp4" />
            </video>
          ) : null}
          {/* {fileType === "application" ? (
            <PdfViewer url={fileContentUrl} />
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

export default File;
