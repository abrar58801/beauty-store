import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function PATCH(req: Request) {
    try {
        const admin = await isAdmin();

        if (!admin) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const body = await req.json();

        const { orderId, status } = body;

        const order = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json(
            { error: "Update failed" },
            { status: 500 }
        );
    }
}