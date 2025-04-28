import { FolderPen, Trash2, Pencil } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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

import { NavLink, Outlet } from "react-router";
import { useEffect, useState } from "react";

import { Button } from "../../ui/button";
import { ScrollArea } from "../../ui/scroll-area";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";
import { useTasks } from "@/context/tasksContext";
import { TasksFolder } from "@/types/types";
import { toast } from "sonner";

export default function TaskSidebar() {
  const {
    tasksData,
    setTasksData,
    status,
    createFolder,
    deleteFolder,
    renameFolder,
    createTask,
    deleteTask,
    editTask,
  } = useTasks();

  const [tasks, setTasks] = useState<TasksFolder[]>(tasksData);
  const [folderRename, setFolderRename] = useState("");
  const [folderAdd, setFolderAdd] = useState("");
  const [emojiIcon, setEmojiIcon] = useState("");
  const { isMobile } = useSidebar();

  useEffect(() => {
    console.log(tasksData);
    setTasks(tasksData);
  }, [tasksData]);

  return (
    <>
      {true && (
        <ScrollArea className="bg-zinc-200 dark:bg-zinc-800 w-auto md:w-80 h-screen flex-none">
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-md flex justify-between mb-2">
              Tasks
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"ghost"}>
                    <FolderPen className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent
                  className="sm:max-w-[425px]"
                  onEscapeKeyDown={() => {
                    setFolderAdd("");
                    setEmojiIcon("");
                  }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create new folder</AlertDialogTitle>
                    <AlertDialogDescription>
                      Add your folder's title. Click create when you're done.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="folder" className="text-right">
                        Folder name
                      </Label>
                      <Input
                        id="folder"
                        value={folderAdd}
                        onChange={(e) => {
                          setFolderAdd(e.target.value);
                        }}
                        className="col-span-3"
                      />
                      <Label htmlFor="note" className="text-left grid">
                        <div>Folder icon</div>
                        <div className="text-xl">
                          {emojiIcon ? emojiIcon : <></>}
                        </div>
                      </Label>
                      <EmojiPicker
                        className="font-['Lato'] w-[300px] border-none"
                        emojisPerRow={5}
                        emojiSize={36}
                        onEmojiSelect={(e) => {
                          setEmojiIcon(e);
                        }}
                      >
                        <EmojiPicker.Header>
                          <EmojiPicker.Input
                            placeholder="Search all emoji"
                            className="h-[36px] bg-white dark:bg-zinc-800 border border-zinc-700 dark:border-zinc-600 w-full rounded-[8px] text-[15px] mb-1 mr-4 -ml-2"
                            hideIcon
                          />
                        </EmojiPicker.Header>
                        <EmojiPicker.Group>
                          <EmojiPicker.List containerHeight={220} />
                        </EmojiPicker.Group>
                      </EmojiPicker>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        setEmojiIcon("");
                        setFolderAdd("");
                      }}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        type="submit"
                        disabled={folderAdd === ""}
                        onClick={() => {
                          createFolder(folderAdd, emojiIcon);
                          toast.success("Folder creation", {
                            description: `Folder: ${emojiIcon} ${folderAdd} created successfully`,
                          });
                          setEmojiIcon("");
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
              {tasks &&
                tasks.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <NavLink to={item.id.toString()} key={item.id}>
                          {({ isActive }) => (
                            <SidebarMenuButton
                              tooltip={item.folder}
                              className={
                                isActive
                                  ? "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-md px-5 py-2 cursor-pointer"
                                  : "hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-md px-5 py-2 cursor-pointer"
                              }
                            >
                              <div className="flex justify-between w-full px-2">
                                <div className="flex gap-x-2">
                                  <div>{item.icon}</div>
                                  <div className="text-md font-semibold">
                                    {item.folder}
                                  </div>
                                </div>
                                <div>{item?.items?.length}</div>
                              </div>
                            </SidebarMenuButton>
                          )}
                        </NavLink>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-64">
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
                              <AlertDialogCancel
                                onClick={() => {
                                  setFolderRename("");
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  type="submit"
                                  disabled={folderRename === ""}
                                  onClick={() => {
                                    renameFolder(item.id, folderRename);
                                    toast.info("Folder renamed");
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
                                Do you wish to delete folder named:{" "}
                                {item.folder}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete all tasks from folder:{" "}
                                {item.folder}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => {
                                  deleteFolder(item.id);
                                  toast.success("Folder deleted successfully");
                                }}
                              >
                                Delete folder
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </ContextMenuContent>
                    </ContextMenu>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      )}
      <Outlet context={[tasks, createTask, editTask, deleteTask]} />
    </>
  );
}
