"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Add this import
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
    <Link href={image.href ?? "#"} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt={image.title ?? ""}
          src={image.image_src ?? ""}
          layout="fill"
          objectFit="cover"
          className={cn(
            "duration-700 ease-in-out group-hover:opacity-75",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.title}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">
        {image.description}
      </p>
    </Link>
  );
}
