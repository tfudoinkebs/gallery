"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { cn } from "@/lib/utils";

type Image = {
  id: number;
  created_at: string;
  title: string | null;
  href: string | null;
  description: string | null;
  image_src: string | null;
};

export default function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <PhotoProvider>
      <div className="group">
        <PhotoView src={image.image_src ?? ""}>
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 cursor-pointer shadow-xl">
            <Image
              alt={image.title ?? ""}
              src={image.image_src ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover duration-700 ease-in-out group-hover:opacity-75",
                isLoading
                  ? "scale-110 blur-2xl grayscale"
                  : "scale-100 blur-0 grayscale-0"
              )}
              onLoad={() => setLoading(false)}
            />
          </div>
        </PhotoView>
        <h3 className="text-sm md:text-xs font-medium">{image.title}</h3>
        {/* <p className="mt-1 text-lg font-medium text-gray-900">
          {image.description}
        </p> */}
      </div>
    </PhotoProvider>
  );
}
