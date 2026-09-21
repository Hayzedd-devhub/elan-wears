import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Clients without a CLIENT_ID (all pre-existing deployments) keep uploading to
// the flat "catalog-items" folder they've always used — untouched, no migration.
// A client with CLIENT_ID set gets its own subfolder so new uploads don't mix
// with other clients sharing the same Cloudinary account.
export function getMediaFolder(): string {
  const clientId = process.env.CLIENT_ID;
  return clientId ? `${clientId}/catalog-items` : "catalog-items";
}

export async function uploadMedia(file: string, type: "image" | "video") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: getMediaFolder(),
      resource_type: "auto",
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      type,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Failed to upload media" };
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return { success: false, error: "Failed to delete image" };
  }
}

export function generateSignature(paramsToSign: Record<string, string | number>) {
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );
  return {
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}
