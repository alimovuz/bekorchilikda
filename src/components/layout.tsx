import { FC, ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {  
  return (
    <div className=" pt-[60px] pb-[56px] bg-zinc-950 min-h-screen flex flex-col">
      <Header/>
      <div className="max-w-md mx-auto w-full" style={{ height: "calc(100vh - 118px)" }}>{children}</div>
      <Footer/>
    </div>
  );
};

export default Layout;