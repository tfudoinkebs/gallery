import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatImageDate(filename: string): string {
  // Extract date using regex - matches patterns like YYYYMMDD
  const dateMatch = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (!dateMatch) return filename;

  // Format date as MM/DD/YYYY
  const [_, year, month, day] = dateMatch;
  return `${month}/${day}/${year}`;
}

export async function GET() {
  try {
    // Get images from Cloudinary
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      max_results: 500,
    });

    // Format images for Supabase
    const formattedImages = resources.map((resource: any) => {
      const filename = resource.public_id.split("/").pop();
      const formattedDate = formatImageDate(filename);

      return {
        title: formattedDate, // Use the formatted date as the title
        href: resource.secure_url,
        description: filename, // Keep original filename as description if needed
        image_src: resource.secure_url,
        created_at: resource.created_at, // Add created_at from Cloudinary
      };
    });

    // Debug log for formatted images
    // console.log("Formatted images:", formattedImages);

    // Insert into Supabase
    const { error } = await supabase.from("images").upsert(formattedImages, {
      onConflict: "image_src",
      ignoreDuplicates: false,
    });

    if (error) throw error;

    // Fetch sorted data from Supabase
    const { data, error: fetchError } = await supabase
      .from("images")
      .select("*")
      .order("title", { ascending: true }); // Sort by 'title' in ascending order

    if (fetchError) throw fetchError;

    // Return sorted images
    return NextResponse.json({
      success: true,
      count: data.length,
      images: data, // Sorted data
    });
  } catch (error) {
    console.error("Error syncing or fetching sorted images:", error);
    return NextResponse.json(
      { error: "Failed to sync or fetch images" },
      { status: 500 }
    );
  }
}
