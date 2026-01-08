import { ReactNode } from "react";



export default function Layout({ children }) {
    return (
        <div className="grid grid-cols-12 ">
            <main className=" col-span-12">{children}</main>
        </div>
    );
}