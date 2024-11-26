import { createClient } from "@supabase/supabase-js";
import BlurImage from "@/components/ui/image-component";

type Image = {
  id: number;
  created_at: string;
  title: string | null;
  href: string | null;
  description: string | null;
  image_src: string | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Gallery() {
  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .order("id");

  console.log("Fetched data:", images);
  console.log("Error if any:", error);

  if (error) {
    console.error("Error fetching images:", error);
    return <div>Failed to load images</div>;
  }

  if (!images || images.length === 0) {
    return <div>No images found</div>;
  }

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images?.map((image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}
