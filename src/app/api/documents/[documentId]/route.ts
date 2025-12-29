import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDocument, updateDocument, archiveDocument } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const document = await getDocument(params.documentId, session.user.id);

  if (!document) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(document);
}

export async function PUT(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, content, isPublished, icon, coverImage } = await req.json();

  const document = await updateDocument(params.documentId, session.user.id, {
    title,
    content,
    is_published: isPublished,
    icon,
    cover_image: coverImage
  });

  return NextResponse.json(document);
}

export async function DELETE(
    req: Request,
    { params }: { params: { documentId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Instead of deleting, we'll archive the document
    const document = await archiveDocument(params.documentId, session.user.id);

    return NextResponse.json(document);
}
