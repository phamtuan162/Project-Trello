import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header/Header";
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
          <main className="bg-background">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
