import { useOutletContext } from "react-router";

export default function SingleNote() {
  const notes: any = useOutletContext();
  return <>single note {notes[0].id}</>;
}
