import React from "react";
import Navbar from "./components/Navbar";
import "./css/Layout.css";

export default function Layout({ children }) {
  return (
    <>
      <main className="main">
        {children}
      </main>
    </>
  );
}
