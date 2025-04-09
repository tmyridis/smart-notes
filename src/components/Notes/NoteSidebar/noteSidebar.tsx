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
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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

import { NavLink, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";

import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { Notes } from "@/types/types";
import { useNotes } from "../../../context/notesContext";
export default function Notes() {
  const {
    notesData,
    setNotesData,
    status,
    createFolder,
    addNote,
    renameFolder,
    deleteNote,
    deleteFolder,
  } = useNotes();

  useEffect(() => {
    setNotes(notesData);
  }, [notesData]);

  const [notes, setNotes] = useState<Notes[]>(notesData);
  const [folderRename, setFolderRename] = useState("");
  const [noteToAdd, setNoteToAdd] = useState("");
  const [folderAdd, setFolderAdd] = useState("");

  return (
    <>
      <ScrollArea className="bg-zinc-200 dark:bg-zinc-800 w-80 min-h-full h-screen flex-none">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-md flex justify-between mb-2">
            My Notes
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"ghost"}>
                  <FolderPen className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Create new folder</AlertDialogTitle>
                  <AlertDialogDescription>
                    Add your folder's title. Click create when you're done.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="note" className="text-right">
                      Folder name
                    </Label>
                    <Input
                      id="note"
                      value={folderAdd}
                      onChange={(e) => {
                        setFolderAdd(e.target.value);
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    <Button
                      type="submit"
                      disabled={folderAdd === ""}
                      onClick={() => {
                        createFolder(folderAdd);
                        setFolderAdd("");
                      }}
                    >
                      Create folder
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SidebarGroupLabel>
          <SidebarMenu>
            {notes.map((item) => (
              <Collapsible key={item.id} asChild className="group/collapsible">
                <SidebarMenuItem>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.folder}>
                          <div className="text-md font-bold">{item.folder}</div>
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
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                              <Button
                                type="submit"
                                disabled={noteToAdd === ""}
                                onClick={() => {
                                  addNote(item.id, noteToAdd);
                                  setNoteToAdd("");
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
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
                                      ? "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-md px-5 py-2 "
                                      : "hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-md px-5 py-2 "
                                  }
                                >
                                  <div className="grid">
                                    <div className="font-bold pb-3">
                                      {subItem.title}
                                    </div>
                                    <p>{`${subItem.content
                                      .replace(/(<([^>]+)>)/gi, "")
                                      .substring(0, 30)}...`}</p>
                                    <div className="text-xs pt-3">
                                      Created at {subItem.createdAt}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </NavLink>
                            <Separator className="bg-zinc-600 mt-1" />
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-64">
                            <AlertDialog>
                              <AlertDialogTrigger className="w-full">
                                <ContextMenuItem
                                  inset
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="text-muted-foreground" />
                                  <span>Delete note</span>
                                </ContextMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Do you wish to delete note named:{" "}
                                    {subItem.title}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this note.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      deleteNote(item.id, subItem.id);
                                    }}
                                  >
                                    Delete note
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
      </ScrollArea>
      <Outlet context={[notes]} />
    </>
  );
}
