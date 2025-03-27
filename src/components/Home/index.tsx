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
  const DUMMY_NOTES = [
    {
      folder: "test folder 1",
      id: 1,
      items: [
        {
          title: "test notes title",
          content: "lore12151",
          id: 11,
          createdAt: "13/3/2025",
        },
        {
          title: "test notes title",
          content: "lore2515161",
          id: 12,
          createdAt: "test",
        },
      ],
    },
    {
      folder: "test folder2",
      id: 2,
      items: [
        {
          title: "test notes title",
          content: "lore3161261",
          id: 21,
          createdAt: "test",
        },
        {
          title: "test notes title",
          content: "lore41612561",
          id: 22,
          createdAt: "test",
        },
      ],
    },
    {
      folder: "test folder2",
      id: 3,
      items: [
        {
          title: "test notes title",
          content: "lore512612",
          id: 31,
          createdAt: "test",
        },
        {
          title: "test notes title",
          content: "lore612712",
          id: 32,
          createdAt: "test",
        },
      ],
    },
    {
      folder: "test folder2",
      id: 4,
      items: [
        {
          title: "test notes title",
          content: "712681",
          id: 41,
          createdAt: "test",
        },
        {
          title: "test notes title",
          content: "712517",
          id: 42,
          createdAt: "test",
        },
      ],
    },
    {
      folder: "test folder2",
      id: 5,
      items: [
        {
          title: "test notes title",
          content: "81251612",
          id: 51,
          createdAt: "test",
        },
        {
          title: "test notes title",
          content: "66521612",
          id: 52,
          createdAt: "test",
        },
      ],
    },
    {
      folder: "test folder2",
      id: 6,
      items: [
        {
          title: "test notes title",
          content: "241612",
          id: 61,
          createdAt: "test",
        },
        {
          title: "test notes title",
          content: "1261712",
          id: 62,
          createdAt: "test",
        },
      ],
    },
    {
      folder: "test folder2",
      id: 7,
      items: [
        {
          title: "test notes title",
          content: "8675432",
          id: 71,
          createdAt: "test",
        },
        {
          title: "test notes title",
          content: "sdghasd",
          id: 72,
          createdAt: "test",
        },
      ],
    },
  ];
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
                        <Card className="rounded-sm">
                          <CardContent className="aspect-square">
                            <div className="text-xl font-semibold">
                              {item.title}
                            </div>
                            <div className="text-sm pt-6">{item.content}</div>
                            <div className="text-xs mt-30">
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
