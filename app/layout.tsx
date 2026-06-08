import SideNav from "./ui/dashboard/sidenav";
import { inter, myFont } from "./ui/fonts";
import "./ui/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body
      
    className={myFont.variable}
    // className={`${inter.className} `}
    >
        
        {/* <SideNav /> */}
        {children}

      </body>
    </html>
  );
}
