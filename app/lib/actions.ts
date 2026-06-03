'use server';

import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { UpdateInvoice } from '../ui/invoices/buttons';


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "please select a customer"
    }).nonempty(),
    amount: z.coerce.number().positive().gt(0, { message: "Amount must be greater than 0" }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: "please select a status"
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });


const sql = neon(process.env.POSTGRES_URL!);
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {

    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId')?.toString() ?? '',
        amount: formData.get('amount')?.toString() ?? '',
        status: formData.get('status')?.toString() ?? '',
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.flatten().fieldErrors
        }
    }
    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    const invoiceDate = new Date().toISOString().split('T')[0];


    try {


        await sql`
                INSERT INTO invoices (customer_id, amount, status, date)
                VALUES (${customerId}, ${amountInCents}, ${status}, ${invoiceDate});
            `;
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: "Database Error",

        }

    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

    console.log("rawFormData ===>", rawData);
}


export async function updateInvoice(prevState: State, id: string, formData: FormData) {

    const UpdateInvoiceSchema = FormSchema.omit({ id: true });

    const validatedFields = UpdateInvoiceSchema.safeParse({
        customerId: formData.get('customerId')?.toString() ?? '',
        amount: formData.get('amount')?.toString() ?? '',
        status: formData.get('status')?.toString() ?? '',
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            errors: validatedFields.error.flatten().fieldErrors
        }
    }
    const { customerId, amount, status, date } = validatedFields.data;
    const amountInCents = amount * 100;

    try {

        await sql`
                UPDATE invoices
                SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date = ${date}
                WHERE id = ${id};
            `;

    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: "Database Error",

        }
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}



export async function deleteInvoice(id: string) {
    await sql`
        DELETE FROM invoices WHERE id = ${id};
    `;
    revalidatePath('/dashboard/invoices');
}