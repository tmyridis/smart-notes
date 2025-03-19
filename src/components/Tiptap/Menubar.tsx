import React, { ChangeEvent, useCallback, useState } from "react";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  TextQuote,
  Code,
  Minus,
  Image,
} from "lucide-react";
import { Toggle } from "../ui/toggle";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Menubar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      editor
        .chain()
        .focus()
        .setImage({ src: URL.createObjectURL(event.target.files[0]) })
        .run();
    }
  };

  const headingOptions = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive("strike"),
    },
  ];

  const alignOptions = [
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      preesed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      preesed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      preesed: editor.isActive({ textAlign: "right" }),
    },
  ];

  const options = [
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive("orderedList"),
    },
    {
      icon: <TextQuote className="size-4" />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      preesed: editor.isActive("blockquote"),
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      preesed: editor.isActive("codeBlock"),
    },
    {
      icon: <Minus className="size-4" />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      preesed: editor.isActive("horizontalRule"),
    },
  ];

  return (
    <div className="flex gap-x-2 pl-5 py-1 h-10">
      {headingOptions.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <Separator orientation="vertical" />
      {alignOptions.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <Separator orientation="vertical" />
      {options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.preesed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <Separator orientation="vertical" />
      <DropdownMenu onOpenChange={() => console.log("tyest")}>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <Highlighter className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Toggle
              className="w-full"
              pressed={editor.isActive("highlight", { color: "red" })}
              onPressedChange={() =>
                editor.chain().focus().toggleHighlight({ color: "red" }).run()
              }
            >
              Red
            </Toggle>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Toggle
              className="w-full"
              pressed={editor.isActive("highlight", { color: "yellow" })}
              onPressedChange={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: "yellow" })
                  .run()
              }
            >
              Yellow
            </Toggle>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Toggle
              className="w-full"
              pressed={editor.isActive("highlight", { color: "#74c0fc" })}
              onPressedChange={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: "#74c0fc" })
                  .run()
              }
            >
              Blue
            </Toggle>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className="" variant={"ghost"}>
        <Label htmlFor="picture">
          <Image className="size-4" />
        </Label>
        <input
          id="picture"
          type="file"
          className="sr-only w-0"
          onChange={onImageChange}
        />
      </Button>
    </div>
  );
}
