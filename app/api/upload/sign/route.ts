import { NextRequest, NextResponse } from "next/server";
import { generateSignature, getMediaFolder } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json({ error: "Missing paramsToSign" }, { status: 400 });
    }

    // The upload folder is decided here, not by the client, so it can't be
    // spoofed and every deployment's uploads land where CLIENT_ID says they should.
    const folder = getMediaFolder();
    const signatureData = generateSignature({ ...paramsToSign, folder });

    return NextResponse.json({ ...signatureData, folder });
  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
