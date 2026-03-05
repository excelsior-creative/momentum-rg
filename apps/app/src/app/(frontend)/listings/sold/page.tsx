import { redirect } from "next/navigation";

export default function SoldPage() {
  redirect("/listings?status=sold");
}
