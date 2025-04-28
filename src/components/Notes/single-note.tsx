import { useOutletContext } from "react-router";
import Tiptap from "./Tiptap/Tiptap";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Notes } from "@/types/types";
export default function SingleNote() {
  const [notes]: [Notes[]] = useOutletContext();

  return (
    <div className="sm:w-1/3 md:w-1/2 lg:w-full xl:w-full min-h-screen">
      <Tiptap notes={notes} />
    </div>
  );
}
