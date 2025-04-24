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
import { Flag, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/authContext";

export default function Home() {
  const { notesData } = useNotes();
  const { tasksData } = useTasks();
  const [presentedNotes, setPresentedNotes] = useState([]);
  const [notesPressed, setNotesPressed] = useState("recent");
  const [recentTasks, setRecentTasks] = useState([]);
  const [scratchPad, setScratchpad] = useState<string>("");
  const { user } = useAuth();
  useEffect(() => {
    console.log(tasksData);
    const top5RecentTasks = tasksData
      .flatMap((folder: TasksFolder) =>
        folder.items.map((item) => ({
          ...item,
          folderId: folder.id,
        }))
      )
      .filter((item: any) => item.status !== "done")
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
        .filter((item: any) => item?.starred === true)
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

  return (
    <div className="w-full">
      <div className="pl-10 pt-10">
        <div className="text-sm font-semibold">Start taking notes...</div>
        <div className="text-xl font-bold">{user?.displayName}'s Home</div>
      </div>

      <div className="flex justify-center w-full pt-10">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-7xl"
        >
          <div className="flex items-center justify-between">
            <div className="font-bold text-md">Notes</div>
            <div className="flex gap-x-5">
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
          <CarouselContent>
            {presentedNotes ? (
              presentedNotes.map((item: SingleNote) => (
                <CarouselItem
                  key={item.id}
                  className="md:basis-1/2 lg:basis-1/6"
                >
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
                            {item.content
                              .replace(/(<([^>]+)>)/gi, "")
                              .substring(0, 120)}
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="px-10 mt-10 flex justify-around gap-x-10">
        <div className="relative">
          <div className="font-bold text-md">Scratch pad</div>
          <div className="absolute bottom-2 right-2">
            {scratchPad.length}/500
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
        <div>
          <div className="font-bold text-md">Calendar</div>
        </div>
        <div>
          <div className="font-bold text-md">My tasks</div>
          <div>
            {recentTasks &&
              recentTasks.map((item: SingleTask) => {
                return (
                  <Link
                    className="p-2"
                    to={`/tasks/${item.folderId}`}
                    key={item.id}
                  >
                    <div className="hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md p-1">
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
                      <div className="">
                        <div className="text-xs font-medium text-zinc-400/80">
                          Due to{" "}
                          {new Date(item.dueTo.seconds * 1000).toLocaleString()}
                        </div>
                      </div>
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
