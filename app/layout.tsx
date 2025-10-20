import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideMenu from "@/components/Menu/SideMenu";
import Menu from "@/components/Menu/Menu";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <div className="bg-[#17253E] h-full">
              <Menu />
              <div className="flex flex-col-reverse sm:flex-row sm:h-[calc(100vh-50px)]" >
                <SideMenu />
                <div className="bg-linear-to-b from-[#6756FF] to-[#9DE5FF] w-full sm:rounded-tl-lg p-4 h-[calc(100dvh-100px)] sm:h-full">
                  {children}
                </div>
              </div>
          </div>
      </body>
    </html>
  );
}
