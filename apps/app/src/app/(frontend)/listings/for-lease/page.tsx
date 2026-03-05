import { redirect } from "next/navigation";

export default function ForLeasePage() {
  redirect("/listings?status=for-lease");
}
