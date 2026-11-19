import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create an account | AIESI 2027",
  description:
    "Create an account to join the AIESI 2027 International Conference on Artificial Intelligence",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
