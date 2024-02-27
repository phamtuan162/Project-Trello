import "./globals.css";
import { Providers } from "./providers";
import ProviderRedux from "@/stores/Providers";
import Header from "@/components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "ProManage ",
  description: "Manage Project",
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
        <ProviderRedux>
          <Providers>
            <Header />
            <main className="bg-background">
              {children}
              <ToastContainer />
            </main>
          </Providers>
        </ProviderRedux>
      </body>
    </html>
  );
}
