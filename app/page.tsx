"use client";
import { ROUTES } from "@/utils/routes";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then(console.log);
  }, []);
  return <div>Home Page!</div>;
}
