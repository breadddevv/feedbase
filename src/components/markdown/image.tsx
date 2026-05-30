"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

export function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span className="my-5 flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 py-10 text-zinc-600 w-1/2">
        <ImageOff className="w-10 h-10" />
        <span className="text-base my-0">Image unavailable</span>
        <span className="text-xs ">We could not load the image, apologies!</span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={400}
      onError={() => setErrored(true)}
      className="my-5 rounded-xl border border-zinc-800 w-full object-cover"
    />
  );
}