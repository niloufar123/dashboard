'use server';

import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation';
import { UpdateInvoice } from '../ui/invoices/buttons';


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string().nonempty(),
    amount: z.coerce.number().positive(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });


const sql = neon(process.env.POSTGRES_URL!);


export async function createInvoice(formData: FormData) {
    const rawData = {
        customerId: formData.get('customerId')?.toString() ?? '',
        amount: formData.get('amount')?.toString() ?? '',
        status: formData.get('status')?.toString() ?? '',
    };
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: rawData.customerId,
        amount: rawData.amount,
        status: rawData.status,
    });

    const amountInCents = amount * 100;
    const invoiceDate = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${invoiceDate});
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices'); 
 
    console.log("rawFormData ===>", rawData);
}


export async function updateInvoice(id:string,formData: FormData) {

    const UpdateInvoiceSchema = FormSchema.omit({ id: true });

    const {customerId, amount, status, date} = UpdateInvoiceSchema.parse({
        customerId: formData.get('customerId')?.toString() ?? '',
        amount: formData.get('amount')?.toString() ?? '',
        status: formData.get('status')?.toString() ?? '',
        date: formData.get('date')?.toString() ?? new Date().toISOString().split('T')[0],
    });
    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date = ${date}
        WHERE id = ${id};
    `;
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices'); 
}



export async function deleteInvoice(id:string) {
    await sql`
        DELETE FROM invoices WHERE id = ${id};
    `;
    revalidatePath('/dashboard/invoices');
}