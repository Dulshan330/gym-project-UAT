"use server";
import { DeleteTransaction, Transaction, UpdateTransaction } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function addNewTransaction(input: Transaction) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .insert(input)
    .select("*");
  if (error) {
    console.error("Error adding transaction:", error);
  }
  return data;
}

export async function fetchTransactions(
  rowOperation: string,
  startDate?: string,
  endDate?: string
) {
  const supabase = await createClient();
  let query = supabase.from("transactions").select(
    `*,transactionType (
        id,
        name,
        description
      ),
      users(
        id,
        username
      )`
  );

  if (startDate) {
    query = query.gt("created_at", startDate);
  }
  if (endDate) {
    query = query.lt("created_at", endDate);
  }

  switch (rowOperation) {
    case "All":
      query = query;
      break;
    case "Available":
      query = query.in("rowOperation", ["I", "U"]);
      break;
    case "Updated":
      query = query.eq("rowOperation", "U");
      break;
    case "Deleted":
      query = query.eq("rowOperation", "D");
      break;
    default:
      break;
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching transactions:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function fetchSingleTransaction(transactionId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(`*`)
    .eq("id", transactionId)
    .single();
  if (error) {
    console.error("Error fetching transaction:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function deleteTransaction(
  transactionId: number,
  input: DeleteTransaction
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", transactionId)
    .select("*");

  if (error) {
    console.error("Error deleting transaction:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updateTransaction(
  transactionId: number,
  input: UpdateTransaction
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", transactionId)
    .select("*");

  if (error) {
    console.error("Error updating transaction:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function addInvoiceNumber(id: number, invoiceNumber: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .update({ invoiceNumber: invoiceNumber })
    .eq("id", id)
    .select("*");

  if (error) {
    console.error("Error updating transaction:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function fetchSingleTransactionOnMemberId(memberId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("memberId", memberId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    console.error("Error updating transaction:", error);
  }

  return data;
}
