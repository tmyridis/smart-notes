import { useOutletContext } from "react-router";
import Tiptap from "../Tiptap/Tiptap";

export default function SingleNote() {
  const notes: any = useOutletContext();
  return (
    <div className="w-full min-h-screen">
      <Tiptap />
    </div>
  );
}
