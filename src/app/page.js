//src/app/page.js
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export default function Home() {
  const token = Cookies.get("token");

  if (!token) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
