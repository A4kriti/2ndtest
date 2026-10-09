"use client";

import { useState } from "react";

type Picture = {
  id: number;
  src: string;
  title: string;
  span: string;
};

// Afno pictures yaha halnu. `span` le bento ko size decide garcha.
// Grid 4 column ko hunchha, har row 180px.
const pictures: Picture[] = [
  { id: 1, src: "https://picsum.photos/id/1015/1000/800", title: "River valley", span: "col-span-2 row-span-2" },
  { id: 2, src: "https://picsum.photos/id/1025/600/600", title: "Pug", span: "col-span-1 row-span-1" },
  { id: 3, src: "https://picsum.photos/id/1035/600/600", title: "Waterfall", span: "col-span-1 row-span-1" },
  { id: 4, src: "https://picsum.photos/id/1043/600/900", title: "Forest road", span: "col-span-1 row-span-2" },
  { id: 5, src: "https://picsum.photos/id/1050/900/600", title: "Mountains", span: "col-span-2 row-span-1" },
  { id: 6, src: "https://picsum.photos/id/1062/600/600", title: "Portrait", span: "col-span-1 row-span-1" },
  { id: 7, src: "https://picsum.photos/id/1074/900/600", title: "Wildlife", span: "col-span-2 row-span-1" },
  { id: 8, src: "https://picsum.photos/id/1084/600/600", title: "Glacier", span: "col-span-1 row-span-1" },
];

export default function PictureGrid() {
  const [active, setActive] = useState<Picture | null>(null);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Pictures</h1>
        
      </div>

      {/* Bento grid */}
      <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
        {pictures.map((pic) => (
          <button
            key={pic.id}
            onClick={() => setActive(pic)}
            className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${pic.span}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pic.src}
              alt={pic.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-medium text-white">{pic.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Click garda thulo dekhaune preview */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-full max-w-4xl overflow-hidden rounded-xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.src} alt={active.title} className="max-h-[75vh] w-full object-contain" />
            <div className="flex items-center justify-between p-4">
              <span className="font-medium text-gray-900">{active.title}</span>
              <div className="flex gap-4 text-sm">
                <button className="text-red-600 hover:underline">Delete</button>
                <button className="text-gray-600 hover:underline" onClick={() => setActive(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}