import { NextRequest, NextResponse } from "next/server";
import { generateSignature } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paramsToSign } = body;

    if (!paramsToSign) {
      return NextResponse.json({ error: "Missing paramsToSign" }, { status: 400 });
    }

    const signatureData = generateSignature(paramsToSign);

    return NextResponse.json(signatureData);
  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}
