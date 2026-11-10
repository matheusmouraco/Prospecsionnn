import { redirect } from "next/navigation";

// The landing page arrives in stage 5; for now the root opens the editor.
export default function Home() {
  redirect("/editor");
}
