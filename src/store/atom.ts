import { MedicalDataType, PersonalData, UserWithRole } from "@/types";
import { atom } from "jotai";

export const discountAmountAtom = atom<number>();

export const currentStepAtom = atom<number>(1);

export const memberPersonalData = atom<PersonalData>();

export const memberCompleteDataAtom = atom<
  Partial<MedicalDataType> | undefined
>(undefined);

export const isMultipleMemberPackageAtom = atom<boolean>(false);

export const isMemberEditModeAtom = atom<boolean>(false);

export const memberPackageTimeDurationAtom = atom<string>("");

export const transactionIdAtom = atom<number>();

export const userAtom = atom<UserWithRole>({
  id: 0,
  username: "",
  nic: "",
  user_type: "",
  phone_number: "",
  email: "",
  date_of_birth: null,
  joined_of_date: null,
  expire_date: null,
  status: "",
  gender: "",
  address: "",
  authenticationId: "",
  imagePath: "",
  roles: {
    id: 0,
    name: "",
    type: "",
    accessPages: [],
  },
});
