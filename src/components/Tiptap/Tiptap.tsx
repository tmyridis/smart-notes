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
import FileHandler from "@tiptap-pro/extension-file-handler";
import Placeholder from "@tiptap/extension-placeholder";
import ImageResize from "tiptap-extension-resize-image";
import { Notes, SingleNote } from "@/types/types";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all);

// This is only an example, all supported languages are already loaded above
// but you can also register only specific languages to reduce bundle-size
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const Tiptap = ({ notes }: { notes: Notes[] }) => {
  const { id } = useParams();
  const location = useLocation();

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
      Highlight.configure({ multicolor: true }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-zinc-700",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your notes here ...",
      }),
      ImageResize,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent); // eslint-disable-line no-console
              return false;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "border-1 border-zinc-300 h-full min-h-screen dark:border-zinc-700 prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl  focus:outline-none p-2",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      updateNote(editor.getHTML());
    },
  });

  const updateContent = () => {
    if (!notes) {
      editor?.commands.setContent("");
      return "";
    }

    var folder = notes.find((obj: Notes) => {
      return obj.items.some((note: SingleNote) => {
        return note.id === Number(id);
      });
    });

    var content = folder?.items.filter(
      (note: SingleNote) => note.id === Number(id)
    )[0];

    if (content) {
      editor?.commands.setContent(content.content);
    } else {
      editor?.commands.setContent("");
    }
  };

  const updateNote = (newContent: string) => {
    if (!notes) {
      return "";
    }

    // get folder based on url id (note id)
    // which folder contains the note with id === id
    var folder = notes.find((obj: Notes) => {
      return obj.items.some((note: SingleNote) => {
        return note.id === Number(id);
      });
    });

    if (folder) {
      console.log(folder);

      // get the note from the items of the folder
      var note = folder?.items.filter(
        (note: SingleNote) => note.id === Number(id)
      )[0];

      console.log(note);

      // change the content
      if (note) {
        note.content = newContent;

        // get index of the note inside the items array
        //and update it
        var ind = folder?.items.findIndex((obj) => obj.id === note?.id);
        folder.items[ind] = note;

        console.log(folder);
      }
    }
  };

  useEffect(() => {
    updateContent();
  }, [location]);

  return (
    <>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
