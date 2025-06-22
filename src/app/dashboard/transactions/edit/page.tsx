"use client";
import {
  fetchSingleTransaction,
  updateTransaction,
} from "@/app/actions/transactionManagement";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { transactionSchema } from "@/lib/z-schema";
import { UpdateTransaction } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const TransactionEditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trans = searchParams.get("trans");

  const [loading, setLoading] = useState<boolean>(false);

  const transactionForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      discountAmount: 0,
      discountPercentage: 0,
      finalAmount: 0,
      paymentMethod: "",
      remark: "",
    },
  });

  useEffect(() => {
    const retrieveTransaction = async () => {
      setLoading(true);
      const { data } = await fetchSingleTransaction(Number(trans));
      transactionForm.reset({
        amount: data.amount || 0,
        discountAmount: data.discountAmount || 0,
        discountPercentage: data.discountPercentage || 0,
        finalAmount: data.finalAmount || 0,
        paymentMethod: data.paymentMethod || "",
      });
      setLoading(false);
    };
    retrieveTransaction();
  }, [trans]);

  const handleSubmit = async (values: z.infer<typeof transactionSchema>) => {
    const transactionData: UpdateTransaction = {
      amount: values.amount,
      discountAmount: values.discountAmount,
      discountPercentage: values.discountPercentage,
      finalAmount: values.finalAmount,
      paymentMethod: values.paymentMethod,
      remark: values.remark,
      rowOperation: "U",
      lastModified_at: new Date().toISOString(),
    };

    const { data } = await updateTransaction(Number(trans), transactionData);
    if (data) {
      toast.success("Transaction updated successfully!", {
        style: { backgroundColor: "green", color: "white" },
      });
      router.push("/dashboard/transactions");
    } else {
      console.error("Failed to update transaction");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-5 w-full flex justify-center">
      <div className="w-full">
        <p className="text-2xl font-semibold">Edit Transaction</p>
        <Form {...transactionForm}>
          <form onSubmit={transactionForm.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-2 gap-5 my-10">
              <FormField
                control={transactionForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-1-2">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter member's name"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={transactionForm.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem className="space-1-2">
                    <FormLabel>Discount Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter discount amount"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={transactionForm.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem className="space-1-2">
                    <FormLabel>Discount Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter discount percentage"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={transactionForm.control}
                name="finalAmount"
                render={({ field }) => (
                  <FormItem className="space-1-2">
                    <FormLabel>Final Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter final amount"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={transactionForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-1-2">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter payment method" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={transactionForm.control}
                name="remark"
                render={({ field }) => (
                  <FormItem className="space-1-2">
                    <FormLabel>Remark</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Why update this transaction .."
                        maxLength={60}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-5">
              <Button
                variant={"outline"}
                className="w-2xs"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button className="w-2xs" type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TransactionEditPage;
