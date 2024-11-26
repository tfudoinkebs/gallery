import { createClient } from "@supabase/supabase-js";
import BlurImage from "@/components/ui/image-component";
import BackgroundGrid from "@/components/magicui/grid";
import Header from "@/components/header";
import Footer from "@/components/footer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Gallery() {
  try {
    // Trigger sync with Cloudinary
    const syncResponse = await fetch(
      "http://localhost:3000/api/sync-cloudinary"
    );
    const syncData = await syncResponse.json();

    if (!syncResponse.ok) {
      console.error("Sync failed:", syncData);
    }

    // Get images from Supabase
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
      <>
        {/* Fixed Background */}
        <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden -z-10">
          <div className="absolute inset-0">
            <BackgroundGrid
              className="h-full w-full opacity-60"
              width={40}
              height={40}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <main className="relative">
          <Header />
          <div className="mx-auto max-w-2xl py-4 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {images?.map((image) => (
                <BlurImage key={image.id} image={image} />
              ))}
            </div>
          </div>
          <Footer />
        </main>
      </>
    );
  } catch (error) {
    console.error("Page error:", error);
    return <div>Something went wrong</div>;
  }
}
