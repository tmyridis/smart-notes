// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Menubar from "./Menubar";

const content = "";

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all);

// This is only an example, all supported languages are already loaded above
// but you can also register only specific languages to reduce bundle-size
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside ms-8",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside ms-8",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-1 border-gray-400 ml-5 pl-2",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "mt-2",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-zinc-700",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "border-1 border-zinc-300 h-full min-h-screen dark:border-zinc-700 prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl  focus:outline-none p-2",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
    },
  });

  return (
    <>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
