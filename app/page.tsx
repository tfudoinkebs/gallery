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
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/sync-cloudinary`;
    const syncResponse = await fetch(apiUrl);
    const syncData = await syncResponse.json();

    if (!syncResponse.ok) {
      console.error("Sync failed:", syncData);
    }

    // Get images from Supabase
    const { data: images, error } = await supabase
      .from("images")
      .select("*")
      .order("id");

    if (error) {
      console.error("Error fetching images:", error);
      return <div>Failed to load images</div>;
    }

    if (!images || images.length === 0) {
      return (
        <div className="w-full h-screen text-center items-center justify-center">
          No images found
        </div>
      );
    }

    // Sort images chronologically based on the title (mm/dd/yyyy)
    const sortedImages = images.sort((a, b) => {
      const dateA = new Date(a.title!); // Convert title to Date
      const dateB = new Date(b.title!); // Convert title to Date
      return dateA.getTime() - dateB.getTime(); // Compare timestamps
    });

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
          <div className="mx-auto max-w-2xl p-4 md:max-w-7xl">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6">
              {sortedImages.map((image) => (
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
    return (
      <div className="w-full h-screen text-center items-center justify-center">
        Something went wrong
      </div>
    );
  }
}
