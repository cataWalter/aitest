import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const document = await prisma.document.findUnique({
    where: {
      id: params.documentId,
      userId: session.user.id,
    },
  });

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
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, content, isPublished, icon, coverImage } = await req.json();

  const document = await prisma.document.update({
    where: {
      id: params.documentId,
      userId: session.user.id,
    },
    data: {
      title,
      content,
      isPublished,
      icon,
      coverImage
    },
  });

  return NextResponse.json(document);
}

export async function DELETE(
    req: Request,
    { params }: { params: { documentId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Instead of deleting, we'll archive the document
    const document = await prisma.document.update({
        where: {
            id: params.documentId,
            userId: session.user.id,
        },
        data: {
            isArchived: true,
        },
    });

    return NextResponse.json(document);
}
