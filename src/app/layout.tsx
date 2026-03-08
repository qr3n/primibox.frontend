import { Providers }     from "./providers";
import { Metadata }      from "next";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@widgets/navbar";
import NextTopLoader from 'nextjs-toploader';
import { Toaster as ShadcnToaster } from "@shared/shadcn/components/toaster"
import { blueCar, greenCar, paletteIcon, boxIcon,  } from "@shared/assets";

export const metadata: Metadata = {
  title: "Primi.box",
  description: "Лучший сервис доставки в мире!",
};


import './globals.css'
import { HelpChat } from "@widgets/help-chat/ui/HelpChat";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <head>
          <link
              rel="preload"
              href={blueCar.src}
              as="image"
              imageSrcSet={blueCar.src}
              imageSizes="400px"
          />
          <link
              rel="preload"
              href={greenCar.src}
              as="image"
              imageSrcSet={greenCar.src}
              imageSizes="400px"
          />
          <link
              rel="preload"
              href={paletteIcon.src}
              as="image"
              imageSrcSet={blueCar.src}
              imageSizes="400px"
          />
          <link
              rel="preload"
              href={boxIcon.src}
              as="image"
              imageSrcSet={boxIcon.src}
              imageSizes="400px"
          />
          <link
              rel="preload"
              href={blueCar.src}
              as="image"
              imageSrcSet={blueCar.src}
              imageSizes="400px"
          />

        <title>PrimiBOX</title>
        <meta name="description" content={'PrimiBOX'}/>
        <meta name="generator" content={'PrimiBOX'}/>
        <link rel="manifest" href={"/manifest.json"}/>
          <meta name="keywords" content={["PrimiBOX", "ПримиБОКС", "прими-бокс", "Прими бокс", "маркетплейсы"].join(", ")}/>
        <meta name="theme-color" media={"(prefers-color-scheme: dark)"} content={"#000000"}/>
        <meta name="author" content={"Primibox"}/>
        <meta
            name="viewport"
            content={"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"}
        />
        <link rel={"apple-touch-icon"} href={"/icons/icon-128x128.png"}/>
        <link rel={"icon"} href={"/icons/icon-128x128.png"}/>
      </head>
      <body
          className={`antialiased dark`}
      >
      <HelpChat/>
      <Providers>
        <NextTopLoader showSpinner={false} color={'#1464e6'}/>
        <Navbar/>
        {children}
        <Toaster toastOptions={{
          style: {borderRadius: '100px', backgroundColor: '#222', color: 'white'}
        }}/>
        <ShadcnToaster/>

      </Providers>
      </body>
      </html>
  );
}
