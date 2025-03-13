import {
  ChevronRight,
  FolderPen,
  Trash2,
  Pencil,
  CirclePlus,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { NavLink, Outlet } from "react-router";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { rename } from "fs";
export default function Notes() {
  const DUMMY_NOTES = [
    {
      folder: "test folder 1",
      id: 12512516,
      items: [
        {
          title: "test notes title",
          content: "test notes content lirum gua",
          id: 589121,
          createdAt: "13/3/2025",
        },
        {
          title: "test notes title",
          content: "test notes content lirum gua",
          id: 5821515129121,
          createdAt: "test",
        },
      ],
    },
    {
      folder: "test folder2",
      id: 25661,
      items: [
        {
          title: "test notes title",
          content: "test notes content lirum gua",
          id: 2223,
          createdAt: "test",
        },
        {
          title: "test notes title",
          content: "test notes content lirum gua",
          id: 5526,
          createdAt: "test",
        },
      ],
    },
  ];

  const [notes, setNotes] = useState(DUMMY_NOTES);
  const [folderRename, setFolderRename] = useState("");
  const [noteToAdd, setNoteToAdd] = useState("");
  const [closeContext, setCloseContext] = useState(false);

  const deleteFolder = (id: number) => {
    setCloseContext(false);
    var tempNotes = notes;
    tempNotes = tempNotes.filter((folder) => folder.id !== id);
    console.log(tempNotes);
    setNotes(tempNotes);
    setCloseContext(true);
  };

  const renameFolder = (id: number, newName: string) => {
    setCloseContext(false);
    var tempNotes = notes;
    var renamed = tempNotes.map((obj) => {
      if (obj.id === id) {
        return { ...obj, folder: newName };
      }
      return obj;
    });

    setNotes(renamed);
    setCloseContext(true);
  };

  const addNote = (folderId: number, title: string) => {
    setCloseContext(false);
    var tempNotes = notes;
    var newNote = {
      title: title,
      content: "",
      createdAt: "13/3/2023",
      id: 16126712,
    };

    tempNotes
      .filter((folder) => folder.id === folderId)[0]
      ["items"].push(newNote);

    console.log(tempNotes);

    setNoteToAdd("");
    setCloseContext(true);
  };

  return (
    <>
      <div className="bg-zinc-800 w-1/6 h-screen">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-md flex justify-between mb-2">
            <h1>My Notes</h1>
            <div>
              <FolderPen className="w-4" />
            </div>
          </SidebarGroupLabel>
          <SidebarMenu>
            {notes.map((item) => (
              <Collapsible
                key={item.folder}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.folder}>
                          <h1 className="text-md font-semibold">
                            {item.folder}
                          </h1>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-64">
                      <AlertDialog>
                        <AlertDialogTrigger className="w-full">
                          <ContextMenuItem
                            inset
                            onSelect={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <CirclePlus className="text-muted-foreground" />
                            <span>Add note</span>
                          </ContextMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Add note to folder: {item.folder}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Add your note's title. Click add when you're done.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="note" className="text-right">
                                Note title
                              </Label>
                              <Input
                                id="note"
                                value={noteToAdd}
                                onChange={(e) => {
                                  setNoteToAdd(e.target.value);
                                }}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogAction>
                              <Button
                                type="submit"
                                disabled={noteToAdd === ""}
                                onClick={() => {
                                  addNote(item.id, noteToAdd);
                                }}
                              >
                                Add note
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger className="w-full">
                          <ContextMenuItem
                            inset
                            onSelect={(e) => {
                              e.preventDefault();
                              setFolderRename(item.folder);
                            }}
                          >
                            <Pencil className="text-muted-foreground" />
                            <span>Rename folder</span>
                          </ContextMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="sm:max-w-[425px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Rename folder</AlertDialogTitle>
                            <AlertDialogDescription>
                              Rename your folder here. Click save when you're
                              done.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="folder" className="text-right">
                                Folder name
                              </Label>
                              <Input
                                id="folder"
                                value={folderRename}
                                onChange={(e) => {
                                  setFolderRename(e.target.value);
                                }}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogAction>
                              <Button
                                type="submit"
                                disabled={folderRename === ""}
                                onClick={() => {
                                  renameFolder(item.id, folderRename);
                                }}
                              >
                                Save changes
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Separator className="bg-zinc-600 mt-1" />
                      <AlertDialog>
                        <AlertDialogTrigger className="w-full">
                          <ContextMenuItem
                            inset
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="text-muted-foreground" />
                            <span>Delete folder</span>
                          </ContextMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Do you wish to delete folder named: {item.folder}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete all notes from folder:{" "}
                              {item.folder}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                deleteFolder(item.id);
                              }}
                            >
                              Delete folder
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </ContextMenuContent>
                  </ContextMenu>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <ContextMenu key={subItem.id}>
                          <ContextMenuTrigger>
                            <NavLink
                              key={subItem.id}
                              to={subItem.id.toString()}
                            >
                              {({ isActive }) => (
                                <div
                                  className={
                                    isActive
                                      ? "bg-zinc-700 group hover:bg-zinc-700 rounded-md px-5 py-2"
                                      : "group hover:bg-zinc-700 rounded-md px-5 py-2"
                                  }
                                >
                                  <div className="grid">
                                    <h1 className="font-bold pb-3">
                                      {subItem.title}
                                    </h1>
                                    <p>{`${subItem.content.substring(
                                      0,
                                      30
                                    )}...`}</p>
                                    <h5 className="text-xs pt-3">
                                      Created at {subItem.createdAt}
                                    </h5>
                                  </div>
                                </div>
                              )}
                            </NavLink>
                            <Separator className="bg-zinc-600 mt-1" />
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-64">
                            <ContextMenuItem inset>
                              <Pencil className="text-muted-foreground" />
                              <span>Rename note</span>
                            </ContextMenuItem>
                            <Separator className="bg-zinc-600 mt-1" />
                            <ContextMenuItem inset>
                              <Trash2 className="text-muted-foreground" />
                              <span>Delete note</span>
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </div>
      <Outlet />
    </>
  );
}
