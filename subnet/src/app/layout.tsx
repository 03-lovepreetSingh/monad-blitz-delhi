import React from "react";
import "./globals.css";

export const metadata = {
  title: "Monad Subnet Dashboard",
  description:
    "A dashboard for managing and interacting with Monad subnets and blockchains.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Monad Subnet Dashboard</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Monad Subnet Project</p>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
