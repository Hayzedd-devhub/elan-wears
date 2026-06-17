import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Item } from "@/models/Item";
import { deleteImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const item = await Item.findById(id).lean();

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const { name, description, price, media, category } = body;

    const oldItem = await Item.findById(id);
    if (!oldItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Check for removed media and delete from Cloudinary
    if (media !== undefined) {
      const newUrls = new Set(media.map((m: { url: string }) => m.url));
      const removedMedia = oldItem.media.filter((m) => !newUrls.has(m.url));

      for (const m of removedMedia) {
        try {
          const publicId = m.publicId || m.url.split("/").pop()?.split(".")[0];
          if (publicId) {
            const fullPublicId = m.publicId ? publicId : `catalog-items/${publicId}`;
            await deleteImage(fullPublicId);
          }
        } catch (err) {
          console.error("Error deleting removed media:", err);
        }
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (media !== undefined) updateData.media = media;
    if (category !== undefined) updateData.category = category;

    const item = await Item.findByIdAndUpdate(id, updateData, { new: true });

    revalidatePath("/");

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete media safely from Cloudinary
    try {
      await Promise.all(
        item.media.map(async ({ url, publicId }) => {
          const pid = publicId || url.split("/").pop()?.split(".")[0];
          if (pid) {
            const fullPublicId = publicId ? pid : `catalog-items/${pid}`;
            return deleteImage(fullPublicId);
          }
        }),
      );
    } catch (error) {
      console.error("Error deleting media from Cloudinary:", error);
    }

    // Delete item from database

    await Item.findByIdAndDelete(id);

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
