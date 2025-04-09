import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "../ui/label";
import { Toggle } from "@/components/ui/toggle";
import { NavLink } from "react-router";
import { useNotes } from "@/context/notesContext";
import { SingleNote } from "@/types/types";

export default function Home() {
  const { notesData } = useNotes();
  console.log(notesData);

  const [notesPressed, setNotesPressed] = useState("recent");
  return (
    <div className="w-full">
      <div className="pl-10 pt-10">
        <div className="text-sm font-semibold">Start taking notes...</div>
        <div className="text-xl font-bold">tmyridis's Home</div>
      </div>
      {notesData.length > 0 && (
        <div className="flex justify-center w-full pt-10">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-7xl"
          >
            <div className="flex items-center justify-between">
              <Label className="font-bold text-md">Notes</Label>
              <div className="flex gap-x-5">
                <Toggle
                  size="sm"
                  aria-label=""
                  onPressedChange={(e) => {
                    if (e) {
                      setNotesPressed("recent");
                    } else {
                      setNotesPressed("");
                    }
                  }}
                  pressed={notesPressed === "recent"}
                >
                  Recent
                </Toggle>
                <Toggle
                  size="sm"
                  aria-label=""
                  onPressedChange={(e) => {
                    if (e) {
                      setNotesPressed("suggested");
                    } else {
                      setNotesPressed("");
                    }
                  }}
                  pressed={notesPressed === "suggested"}
                >
                  Suggested
                </Toggle>
              </div>
            </div>
            <CarouselContent>
              {notesData ? (
                notesData[0].items.map((item: SingleNote) => (
                  <CarouselItem
                    key={item.id}
                    className="md:basis-1/2 lg:basis-1/6"
                  >
                    <div className="p-1">
                      <NavLink to={`notes/${item.id}`}>
                        <Card className="rounded-sm h-96 relative">
                          <CardContent className="aspect-square">
                            <div className="text-xl font-semibold">
                              {item.title}
                            </div>
                            <div className="text-sm break-words">
                              {item.content
                                .replace(/(<([^>]+)>)/gi, "")
                                .substring(0, 120)}
                            </div>
                            <div className="absolute text-xs bottom-5 left-5">
                              {item.createdAt}
                            </div>
                          </CardContent>
                        </Card>
                      </NavLink>
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
      )}
      <div>test</div>
    </div>
  );
}
