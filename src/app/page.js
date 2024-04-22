"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import "./style.css";
import { sendImage } from "./util/fetchAzure";

export default function Home() {
  const fileInput = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleIconClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewSrc(objectUrl);

      const formData = new FormData();
      formData.append("image", file);
      console.log(formData);
      console.log(process.env.NEXT_PUBLIC_AZURE_ENDPOINT);
      console.log(process.env.NEXT_PUBLIC_AZURE_KEY);
      const res = await sendImage(formData, process.env.NEXT_PUBLIC_AZURE_ENDPOINT, process.env.NEXT_PUBLIC_AZURE_KEY);
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);

      setPreviewSrc(imageObjectURL);
    
    }
  };


  return (
    <>
      <head>
        <title>NutriVision</title>
        <meta name="description" content="My first Next.js app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>
          <div>
            <div className="header">
              <h1 className="titulo">Remove Background</h1>
            </div>
            <div className=" grid grid-cols-2 gap-2 " >
              <div id="mainBox">
               
                  {previewSrc ? (
                    <img src={previewSrc} alt="Preview" className="image" />
                  ) : (



                  <svg
                    id="iconoGal"
                    onClick={handleIconClick}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-20 h-20"
                    color="white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  )}
                
              </div>


              <div className=" grid grid-rows-4 " >
                <input
                  type="file"
                  ref={fileInput}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button className="btn" onClick={handleIconClick}>
                  Upload Image
                </button>

                <button className="btn" onClick={handleIconClick}>
                  Remove Background
                </button>

                <button className="btn" onClick={handleIconClick}>
                  Upload Background
                </button>

                <button className="btn" onClick={handleIconClick}>
                  Select Background Color
                </button>
              </div>
            </div>
          </div>
        </main>
      </body>
    </>
  );
}
