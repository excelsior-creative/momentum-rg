import { redirect } from "next/navigation";

export default function ForSalePage() {
  redirect("/listings?status=for-sale");
}
