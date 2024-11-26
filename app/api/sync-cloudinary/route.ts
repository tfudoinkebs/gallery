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
  // Extract date using regex - matches patterns like 20231020
  const dateMatch = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (!dateMatch) return filename;

  // Format date with hyphens
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
      };
    });

    console.log("Formatted images:", formattedImages); // Debug log

    // Insert into Supabase
    const { data, error } = await supabase
      .from("images")
      .upsert(formattedImages, {
        onConflict: "image_src",
        ignoreDuplicates: false,
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: formattedImages.length,
      images: formattedImages,
    });
  } catch (error) {
    console.error("Error syncing images:", error);
    return NextResponse.json(
      { error: "Failed to sync images" },
      { status: 500 }
    );
  }
}
