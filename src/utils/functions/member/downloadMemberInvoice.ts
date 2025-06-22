import { fetchSinglePackage } from "@/app/actions/packageManagement";
import { isPackageAssigned } from "@/app/actions/packageMemberAction";
import { fetchSingleTransactionOnMemberId } from "@/app/actions/transactionManagement";
import { fetchUser } from "@/app/actions/userManagement";
import { formatShortDate } from "@/lib/dates";
import { PackagesData, UsersData } from "@/types";
import { generateInvoice } from "@/utils/invoice-generate";

type Transaction = {
  id: number;
  memberId: number;
  transactionTypeId: number;
  amount: number;
  discountAmount: number;
  discountPercentage: number;
  finalAmount: number;
  paymentMethod: string;
  created_at: string;
  lastModified_at: string;
  rowOperation: string;
  remark: string;
  invoiceNumber: string;
};

export const downloadMemberInvoice = async (userId: number) => {
  try {
    const personalData: UsersData | undefined = await fetchUser(userId);
    const latestPackage = await isPackageAssigned(userId);

    let selectedPlan: PackagesData | undefined = undefined;
    if (latestPackage) {
      selectedPlan = await fetchSinglePackage(latestPackage.planId);
    }

    const transaction: Transaction | undefined =
      await fetchSingleTransactionOnMemberId(userId);

    const paymentMethodType = ():
      | "Cash"
      | "Bank Transfer"
      | "Credit/Debit Card" => {
      switch (transaction?.paymentMethod) {
        case "cash":
          return "Cash";
        case "card":
          return "Credit/Debit Card";
        case "bank-transfer":
          return "Bank Transfer";
        default:
          return "Cash";
      }
    };

    const invoiceData = {
      invoiceNumber: `${transaction?.invoiceNumber}`,
      invoiceDate: transaction?.created_at
        ? formatShortDate(new Date(transaction.created_at))
        : "",
      customerName: personalData?.username || "",
      customerPhone: personalData?.phone_number || "",
      serviceName: selectedPlan?.package_name || "Gym Membership",
      serviceDetails: `${
        selectedPlan?.packageTypes?.packageTypeName || "Standard"
      } `,
      serviceTime:
        `Start date: ${latestPackage.startDate} | End date: ${latestPackage.endDate}` ||
        "",
      amount: `${transaction?.amount}` || "",
      paymentMethod: paymentMethodType(),
      paymentAmount: `${transaction?.finalAmount}` || "",
      discountAmount: `${transaction?.discountAmount}` || "-",
    };

    await generateInvoice(invoiceData);
  } catch (error) {
    console.error("Something went wrong", error);
  }
};
