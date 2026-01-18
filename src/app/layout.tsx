"use client";
import Providers from "@/Provider/Provider";
import "../styles/style.css";
import "../styles/style.scss";
import "../styles/gifts.css";

import store from "@/redux/store";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // set the default them to white
    <html lang="en" theme-color="light">
      <head>
        <title>xHero - Market Place</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Provider store={store}>
          {/* this second provider is currently used to provide the query client tanstack query and the Toast from sooner */}
          <Providers>{children}</Providers>
        </Provider>
      </body>
    </html>
  );
}
