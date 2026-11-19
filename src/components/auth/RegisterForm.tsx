"use client";

import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatDobDisplayValue,
  parseDobDisplayValue,
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth";
import { AuthRequestError, registerUser } from "@/lib/api/auth";
import { getFriendlyErrorMessage } from "@/lib/khcn-aiesi/error-messages";
import { RegistrationResultDialog } from "./RegistrationResultDialog";


// Reformats typed digits into dd/mm/yyyy regardless of browser locale.
function formatDobInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(
    Boolean,
  );
  return parts.join("/");
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dobPickerOpen, setDobPickerOpen] = useState(false);
  const dobAnchorRef = useRef<HTMLDivElement>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2000, 0));
  const [syncedDobValue, setSyncedDobValue] = useState("");
  const [registrationResult, setRegistrationResult] = useState<
    | { type: "success" }
    | {
        type: "error";
        message: string;
        reference?: string;
      }
    | null
  >(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      HT_NguoiDungNgoai_NgaySinh: "",
      HT_NguoiDungNgoai_GioiTinh: undefined,
    },
  });

  // Keeps the calendar popup's visible month in sync with whatever has been typed into the field.
  // Adjusted during render (not in an effect) so it takes effect before the popup paints.
  const dobValue = useWatch({ control, name: "HT_NguoiDungNgoai_NgaySinh" }) ?? "";
  if (dobValue !== syncedDobValue) {
    setSyncedDobValue(dobValue);
    const parsed = parseDobDisplayValue(dobValue);
    if (parsed) setCalendarMonth(parsed);
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegistrationResult(null);

    try {
      await registerUser(data);
      reset();
      setRegistrationResult({ type: "success" });
    } catch (error) {
      const known = error instanceof AuthRequestError;

      setRegistrationResult({
        type: "error",
        message: getFriendlyErrorMessage(
          known ? error.message : undefined,
          "Registration failed. Please try again later.",
        ),
        reference: known ? error.reference : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Create an account to register for the AIESI 2027 conference
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="HT_NguoiDungNgoai_HoDem" required>
                Middle and last name
              </Label>
              <Input
                id="HT_NguoiDungNgoai_HoDem"
                placeholder="Nguyen Van"
                {...register("HT_NguoiDungNgoai_HoDem")}
                error={errors.HT_NguoiDungNgoai_HoDem?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="HT_NguoiDungNgoai_Ten" required>
                First name
              </Label>
              <Input
                id="HT_NguoiDungNgoai_Ten"
                placeholder="A"
                {...register("HT_NguoiDungNgoai_Ten")}
                error={errors.HT_NguoiDungNgoai_Ten?.message}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="HT_NguoiDungNgoai_NgaySinh" required>
                Date of birth
              </Label>
              <Controller
                name="HT_NguoiDungNgoai_NgaySinh"
                control={control}
                render={({ field }) => {
                  const selectedDate = parseDobDisplayValue(field.value ?? "");

                  return (
                    <Popover open={dobPickerOpen} onOpenChange={setDobPickerOpen}>
                      <div ref={dobAnchorRef} className="relative">
                        <Input
                          id="HT_NguoiDungNgoai_NgaySinh"
                          placeholder="dd/mm/yyyy"
                          inputMode="numeric"
                          autoComplete="bday"
                          maxLength={10}
                          className="pr-9"
                          ref={field.ref}
                          name={field.name}
                          value={field.value ?? ""}
                          onBlur={field.onBlur}
                          onFocus={() => setDobPickerOpen(true)}
                          onChange={(event) =>
                            field.onChange(formatDobInput(event.target.value))
                          }
                          error={errors.HT_NguoiDungNgoai_NgaySinh?.message}
                        />
                        <button
                          type="button"
                          onClick={() => setDobPickerOpen((open) => !open)}
                          className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                          aria-label="Open date of birth calendar"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <PopoverContent
                        anchor={dobAnchorRef}
                        align="start"
                        className="w-auto p-0"
                        initialFocus={false}
                      >
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          weekStartsOn={1}
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date()}
                          disabled={{ after: new Date() }}
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                          selected={selectedDate ?? undefined}
                          onSelect={(date) => {
                            if (!date) return;
                            field.onChange(formatDobDisplayValue(date));
                            setDobPickerOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  );
                }}
              />
            </div>
            <div className="space-y-2">
              <Label required>Gender</Label>
              <Controller
                name="HT_NguoiDungNgoai_GioiTinh"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        ref={field.ref}
                        type="radio"
                        name={field.name}
                        checked={field.value === true}
                        onBlur={field.onBlur}
                        onChange={() => field.onChange(true)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        checked={field.value === false}
                        onBlur={field.onBlur}
                        onChange={() => field.onChange(false)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Female</span>
                    </label>
                  </div>
                )}
              />
              {errors.HT_NguoiDungNgoai_GioiTinh && (
                <p className="text-sm text-destructive">
                  {errors.HT_NguoiDungNgoai_GioiTinh.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="HT_NguoiDungNgoai_CoQuan" required>
              Organization / Institution
            </Label>
            <Input
              id="HT_NguoiDungNgoai_CoQuan"
              placeholder="Name of your organization, university, company..."
              {...register("HT_NguoiDungNgoai_CoQuan")}
              error={errors.HT_NguoiDungNgoai_CoQuan?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="HT_NguoiDungNgoai_ChucVu" required>
                Position
              </Label>
              <Input
                id="HT_NguoiDungNgoai_ChucVu"
                placeholder="Lecturer, PhD student..."
                {...register("HT_NguoiDungNgoai_ChucVu")}
                error={errors.HT_NguoiDungNgoai_ChucVu?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="HT_NguoiDungNgoai_SoDienThoai" required>
                Phone number
              </Label>
              <Input
                id="HT_NguoiDungNgoai_SoDienThoai"
                type="tel"
                placeholder="0912345678"
                {...register("HT_NguoiDungNgoai_SoDienThoai")}
                error={errors.HT_NguoiDungNgoai_SoDienThoai?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="HT_NguoiDungNgoai_DiaChi">Address</Label>
            <Input
              id="HT_NguoiDungNgoai_DiaChi"
              placeholder="Street address, district, city/province"
              {...register("HT_NguoiDungNgoai_DiaChi")}
              error={errors.HT_NguoiDungNgoai_DiaChi?.message}
            />
          </div>

          <hr className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="HT_NguoiDungNgoai_TenDangNhap" required>
              Username
            </Label>
            <Input
              id="HT_NguoiDungNgoai_TenDangNhap"
              placeholder="username"
              autoComplete="username"
              {...register("HT_NguoiDungNgoai_TenDangNhap")}
              error={errors.HT_NguoiDungNgoai_TenDangNhap?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="HT_NguoiDungNgoai_Email" required>
              Email
            </Label>
            <Input
              id="HT_NguoiDungNgoai_Email"
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              {...register("HT_NguoiDungNgoai_Email")}
              error={errors.HT_NguoiDungNgoai_Email?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="HT_NguoiDungNgoai_MatKhau" required>
              Password
            </Label>
            <div className="relative">
              <Input
                id="HT_NguoiDungNgoai_MatKhau"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("HT_NguoiDungNgoai_MatKhau")}
                error={errors.HT_NguoiDungNgoai_MatKhau?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required>
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign up
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
      {registrationResult !== null && (
        <RegistrationResultDialog
          result={registrationResult}
          onClose={() => setRegistrationResult(null)}
        />
      )}
    </Card>
  );
}
