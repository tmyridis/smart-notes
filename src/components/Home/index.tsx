import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Toggle } from "@/components/ui/toggle";
import { Link } from "react-router";
import { useNotes } from "@/context/notesContext";
import { Notes, SingleNote, SingleTask, TasksFolder } from "@/types/types";
import { useTasks } from "@/context/tasksContext";
import { CirclePlus, Flag, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/authContext";
import { useSidebar } from "../ui/sidebar";
import { useDebounce } from "use-debounce";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { stripAndSpaceElements } from "@/lib/utils";

export default function Home() {
  const { notesData } = useNotes();
  const { tasksData } = useTasks();
  const [presentedNotes, setPresentedNotes] = useState([]);
  const [notesPressed, setNotesPressed] = useState("recent");
  const [recentTasks, setRecentTasks] = useState([]);
  const [scratchPad, setScratchpad] = useState<string | null>(
    localStorage.getItem("scratchpad")
      ? localStorage.getItem("scratchpad")
      : null
  );

  const [debouncedEditor] = useDebounce(scratchPad, 2000);
  const [debouncedEditorFirebase] = useDebounce(scratchPad, 5000);

  const syncPad = async () => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
      const ref = doc(db, "users", uid);

      await updateDoc(ref, { scratchPad: scratchPad });
    }
  };

  useEffect(() => {
    if (debouncedEditor) {
      if (scratchPad !== null) {
        localStorage.setItem("scratchpad", scratchPad);
      }
    }
  }, [debouncedEditor]);

  useEffect(() => {
    if (debouncedEditorFirebase) {
      if (scratchPad !== null) {
        console.log("saving to firebase scratch pad");
        syncPad();
      }
    }
  }, [debouncedEditorFirebase]);

  const { user } = useAuth();

  const fetchPad = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  useEffect(() => {
    const getPad = async () => {
      if (user) {
        console.log(user);
        const pad = localStorage.getItem("scratchpad");
        if (pad !== null) {
          setScratchpad(pad);
        } else {
          await fetchPad(user.uid).then((result) => {
            console.log(result);
            if (result) {
              localStorage.setItem("scratchpad", result.scratchPad);
              setScratchpad(result.scratchPad);
            }
          });
        }
      }
    };

    getPad();
  }, [user]);

  useEffect(() => {
    console.log(tasksData);
    const top5RecentTasks = tasksData
      .flatMap((folder: TasksFolder) =>
        folder.items.map((item) => ({
          ...item,
          folderId: folder.id,
        }))
      )
      .filter((item: any) => item.status !== "done" && item.dueTo !== undefined)
      .sort(
        (a: SingleTask, b: SingleTask) =>
          new Date(b.dueTo.seconds * 1000).valueOf() -
          new Date(a.dueTo.seconds * 1000).valueOf()
      )
      .slice(0, 5);
    console.log(top5RecentTasks);
    setRecentTasks(top5RecentTasks);
    if (notesPressed === "recent") {
      const top10RecentItems = notesData
        .flatMap((folder: Notes) => folder.items)
        .filter((item) => item.updatedAt !== undefined)
        .sort(
          (a: SingleNote, b: SingleNote) =>
            new Date(b.updatedAt.seconds * 1000).valueOf() -
            new Date(a.updatedAt.seconds * 1000).valueOf()
        )
        .slice(0, 10);

      console.log(top10RecentItems);
      setPresentedNotes(top10RecentItems);
    } else {
      const top10StarredItems = notesData
        .flatMap((folder: Notes) => folder.items)
        .filter(
          (item: any) => item?.starred === true && item.updatedAt !== undefined
        )
        .sort(
          (a: SingleNote, b: SingleNote) =>
            new Date(b.updatedAt.seconds * 1000).valueOf() -
            new Date(a.updatedAt.seconds * 1000).valueOf()
        )
        .slice(0, 10);

      console.log(top10StarredItems);
      setPresentedNotes(top10StarredItems);
    }
  }, [notesPressed, notesData]);

  const { isMobile } = useSidebar();
  return (
    <div className={`${isMobile ? "w-77" : "w-full"} pb-5`}>
      <div className={`${isMobile ? "flex justify-center" : ""}`}>
        <div className="pl-10 pt-10">
          <div className="text-sm font-semibold">Express yourself...</div>
          <div className="text-xl font-bold">{user?.displayName}'s Home</div>
        </div>
      </div>

      <div className="flex justify-center w-full pt-10">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-7xl"
        >
          <div
            className={`${
              isMobile ? "pl-2 pb-2" : "flex items-center justify-between"
            }`}
          >
            <div className="flex justify-center font-bold text-md">Notes</div>
            <div
              className={`${
                isMobile ? "pt-2" : ""
              } flex justify-center gap-x-5`}
            >
              <Toggle
                variant="outline"
                size="sm"
                aria-label="recent"
                className="p-3"
                onPressedChange={(e) => {
                  if (e) {
                    setNotesPressed("recent");
                  } else {
                    setNotesPressed("starred");
                  }
                }}
                pressed={notesPressed === "recent"}
              >
                Recent
              </Toggle>
              <Toggle
                variant="outline"
                size="sm"
                aria-label="starred"
                className="p-3"
                onPressedChange={(e) => {
                  if (e) {
                    setNotesPressed("starred");
                  } else {
                    setNotesPressed("recent");
                  }
                }}
                pressed={notesPressed === "starred"}
              >
                Starred
              </Toggle>
            </div>
          </div>
          <CarouselContent
            className={`${isMobile && "ml-2 flex justify-center"}`}
          >
            {presentedNotes.length > 0 ? (
              presentedNotes.map((item: SingleNote) => (
                <CarouselItem key={item.id} className="basis-1/2 lg:basis-1/6">
                  <div className="p-1">
                    <Link to={`/notes/${item.id}`}>
                      <Card className="rounded-sm h-96 relative">
                        <CardContent className="aspect-square">
                          <div className=" flex justify-between">
                            <span className="text-xl font-semibold">
                              {item.title}
                            </span>
                            <Star
                              size={20}
                              className={`${
                                item.starred
                                  ? "fill-yellow-400 text-yellow-400"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="text-sm break-words">
                            {stripAndSpaceElements(item.content).substring(
                              0,
                              120
                            )}
                          </div>
                          <div className="absolute text-xs bottom-5 left-5">
                            {item.updatedAt
                              ? new Date(
                                  item.updatedAt.seconds * 1000
                                ).toLocaleString()
                              : new Date(
                                  item.createdAt.seconds * 1000
                                ).toDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <></>
            )}
          </CarouselContent>
          {presentedNotes.length == 0 && notesPressed === "recent" && (
            <div className="text-sm font-semibold flex justify-center w-full gap-x-2 items-center">
              <span>No notes yet. You can add notes by clicking here </span>
              <Link to="/notes">
                <CirclePlus />
              </Link>
            </div>
          )}
          {presentedNotes.length == 0 && notesPressed === "starred" && (
            <div className="text-sm font-semibold flex justify-center w-full items-center">
              <span>You dont have any starred notes yet. </span>
            </div>
          )}
          {!isMobile && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>

      <div
        className={`${
          isMobile
            ? "grid gap-y-3 pl-3 pt-2"
            : "flex justify-around gap-x-10 mx-10 mt-10"
        }  `}
      >
        <div className="relative">
          <div className="font-bold text-md">Scratch pad</div>
          <div className="absolute bottom-2 right-2">
            {scratchPad?.length}/500
          </div>
          <Textarea
            maxLength={500}
            className="w-[300px] h-[300px] mt-2"
            value={scratchPad}
            onChange={(e) => {
              setScratchpad(e.target.value);
            }}
          />
        </div>
        {/* <div>
          <div className="font-bold text-md">Calendar</div>
        </div> */}
        <div>
          <div className="font-bold text-md">My tasks</div>
          <div>
            {recentTasks &&
              recentTasks.map((item: any) => {
                return (
                  <Link
                    className="p-2"
                    to={`/tasks/${item.folderId}`}
                    key={item.id}
                  >
                    <div className="hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md py-1 px-10">
                      <div className="flex justify-between items-center gap-x-2">
                        <div>{item.task.substring(0, 50)}</div>
                        <Flag
                          size={15}
                          strokeWidth={3}
                          color={`${
                            item.priority === "high"
                              ? "red"
                              : item.priority === "medium"
                              ? "orange"
                              : "yellow"
                          }`}
                          fill={`${
                            item.priority === "high"
                              ? "red"
                              : item.priority === "medium"
                              ? "orange"
                              : "yellow"
                          }`}
                        />
                      </div>
                      {item.dueTo && (
                        <div className="">
                          <div className="text-xs font-medium text-zinc-400/80">
                            Due to{" "}
                            {new Date(
                              item.dueTo.seconds * 1000
                            ).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
