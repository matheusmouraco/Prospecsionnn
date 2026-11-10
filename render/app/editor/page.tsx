import type { Metadata } from "next";
import { Editor } from "@/components/editor/Editor";

export const metadata: Metadata = { title: "Editor", robots: { index: false, follow: false } };

export default function EditorPage() {
  return <Editor />;
}
