"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function pageCallback() {
  const query = window.location.search;
  const queryString = new URLSearchParams(query).toString();
  console.log(queryString);

  return <h1>Hello world</h1>;
}
