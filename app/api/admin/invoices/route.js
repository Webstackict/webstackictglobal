import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import crypto from 'crypto';

export async function POST(req) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { client_name, client_email, amount, due_date, description, status } = body;

        if (!client_name || !client_email || !amount || !due_date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate a random invoice number INV-YYYY-RANDOM
        const year = new Date().getFullYear();
        const randomStr = crypto.randomBytes(2).toString('hex').toUpperCase();
        const invoice_number = `INV-${year}-${randomStr}`;

        const insertQuery = `
            INSERT INTO public.invoices (invoice_number, client_name, client_email, amount, due_date, status, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            invoice_number,
            client_name,
            client_email,
            Number(amount),
            new Date(due_date),
            status || 'Draft',
            description || ''
        ];

        const rawResult = await prisma.$queryRawUnsafe(insertQuery, ...values);

        return NextResponse.json({ success: true, invoice: rawResult[0] }, { status: 201 });
    } catch (error) {
        console.error("Create Invoice POST Error:", error);
        return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }
}
