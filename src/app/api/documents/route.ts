import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createDocument, getDocuments } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, parentDocumentId } = await req.json();

  const document = await createDocument(session.user.id, title, parentDocumentId);

  return NextResponse.json(document);
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const documents = await getDocuments(session.user.id);

    return NextResponse.json(documents);
}
