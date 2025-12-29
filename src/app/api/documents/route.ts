import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, parentDocumentId } = await req.json();

  const document = await prisma.document.create({
    data: {
      title,
      parentDocumentId,
      userId: session.user.id,
    },
  });

  return NextResponse.json(document);
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const documents = await prisma.document.findMany({
        where: {
            userId: session.user.id,
            isArchived: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(documents);
}
