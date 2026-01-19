"use client";
import Providers from "@/Provider/Provider";
import "../styles/style.css";
import "../styles/style.scss";
import "../styles/gifts.css";

import store from "@/redux/store";
import { Provider } from "react-redux";
import ThemeInitializer from "@/components/ThemeInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // set the default theme to dark
    <html lang="en">
      <head>
        <title>xHero - Market Place</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem("theme") || "dark";
                  var savedViewMode = localStorage.getItem("view") || "ltr";
                  document.documentElement.setAttribute("theme-color", savedTheme);
                  document.documentElement.setAttribute("view-mode", savedViewMode);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Provider store={store}>
          {/* this second provider is currently used to provide the query client tanstack query and the Toast from sooner */}
          <Providers>
            <ThemeInitializer />
            {children}
          </Providers>
        </Provider>
      </body>
    </html>
  );
}
