"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import "./style.css";
import { sendImage } from "./util/fetchAzure";
import Jimp from 'jimp';
import { SketchPicker } from 'react-color';
import { fabric } from 'fabric';



export default function Home() {
  const fileInput = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [color, setColor] = useState('#fff');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const popover = {
    position: 'absolute',
    zIndex: '2',
  }
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColor(color.hex);
    document.getElementById('mainBox').style.background = color.hex;
  };

  const createImageWithBackground = (imageUrl, color) => {
    const canvas = new fabric.Canvas();
  
    fabric.Image.fromURL(imageUrl, (img) => {
      
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);
  
      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: img.width,
        height: img.height,
        fill: color,
      });
  
      canvas.add(rect);
  
      img.set({ left: 0, top: 0 });
      canvas.add(img);
  
      const dataUrl = canvas.toDataURL({ format: 'png' });
      const link = document.createElement('a');
      link.download = 'image_with_background.png';
      link.href = dataUrl;
      link.click();
    });
  };

  const handleIconClick = () => {
    fileInput.current.click();
  };


  
  
  const handleCombineImages = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setBackgroundImage(objectUrl);

      const formData = new FormData();
      formData.append("image", file);
    }
    // Lee las imágenes
    const bgImage = await Jimp.read(backgroundImage);
    console.log(bgImage)
    const fgImage = await Jimp.read(previewSrc);
  
    // Combina las imágenes
    bgImage.composite(fgImage, 0, 0);
  
    // Convierte la imagen combinada a blob
    const combinedImageBlob = await bgImage.getBufferAsync(Jimp.MIME_PNG);

    const combinedImageObjectURL = URL.createObjectURL(combinedImageBlob);
  
    setPreviewSrc(combinedImageObjectURL);
  }
  

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewSrc(objectUrl);

      const formData = new FormData();
      formData.append("image", file);
    }
  };

  const handleRemoveBackground = async (formData) => {

    const res = await sendImage(formData, process.env.NEXT_PUBLIC_AZURE_ENDPOINT, process.env.NEXT_PUBLIC_AZURE_KEY);
    const imageBlob = await res.blob();
    const imageObjectURL = await URL.createObjectURL(imageBlob);

    setPreviewSrc(imageObjectURL);
    console.log(previewSrc)
  }


  return (
    <>
      <head>
        <title>MagicBackgroundAZ</title>
        <meta name="description" content="My first Next.js app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>
          <div>
            <div className="header">
              <h1 className="titulo">MagicBackgroundAZ</h1>
            </div>
            <div className=" grid grid-cols-2 gap-2 " >
              <div id="mainBox" className="h-[60vh]">
                {previewSrc ? (
                  <img src={previewSrc} alt="Preview" className="image" />
                ) : (
                  <svg
                    id="iconoGal"
                    onClick={handleIconClick}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-20 h-20"
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

                <button className="btn" onClick={() => handleRemoveBackground(fileInput.current.files[0])}>
                  Remove Background
                </button>
                  
                
                

                  <button className="btn" onClick={handleClick}>
                    Select Background Color
                  </button>
                  {displayColorPicker ? <div style={ popover }>
                    <div style={ cover } onClick={ handleClose }/>
                    <SketchPicker color={color} onChange={handleChange} />
                  </div> : null }
                
                

                  <button className="btn" onClick={() => createImageWithBackground(previewSrc, color)}>
                    Download Image with Background
                  </button>
              </div>
            </div>
          </div>
        </main>
      </body>
    </>
  );
}
