import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "Trello",
  description: "Clone Trello",
};
export default function RootLayout({ children, params }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="shortcut icon"
          href="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Trello-512.png"
          type="image/x-icon"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="pt-10 bg-background">
            <div className="flex gap-x-7 justify-center">
              <div className="w-64 shrink-0 hidden lg:block">
                <Sidebar />
              </div>
              {children}
            </div>
            <ToastContainer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
