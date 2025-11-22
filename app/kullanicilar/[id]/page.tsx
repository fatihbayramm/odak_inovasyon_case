"use client";
import { getUser } from "@/services/userService";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getUser(Number(id))
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  return <div>User Detail Page !</div>;
}
