"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Address } from "@/lib/types";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid 6-digit PIN code"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: Address) => void;
  defaultValues?: Partial<Address>;
  submitLabel?: string;
}

export default function AddressForm({
  onSubmit,
  defaultValues,
  submitLabel = "Continue to Payment",
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || { country: "India" },
  });

  const postalCode = watch("postalCode");
  const [isValidatingPin, setIsValidatingPin] = useState(false);
  const lastCheckedPin = useRef<string>("");

  useEffect(() => {
    if (postalCode && /^[1-9][0-9]{5}$/.test(postalCode)) {
      if (postalCode === lastCheckedPin.current) return;

      setIsValidatingPin(true);
      fetch(`https://api.postalpincode.in/pincode/${postalCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setValue("city", postOffice.District || postOffice.Block, {
              shouldValidate: true,
            });
            setValue("state", postOffice.State, { shouldValidate: true });
            setValue("country", "India", { shouldValidate: true });
            lastCheckedPin.current = postalCode;
          }
        })
        .catch(console.error)
        .finally(() => setIsValidatingPin(false));
    }
  }, [postalCode, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>
        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <div className="sm:col-span-2">
          <Input
            label="Address Line 1"
            placeholder="42, MG Road"
            error={errors.address1?.message}
            {...register("address1")}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Address Line 2 (Optional)"
            placeholder="Apartment, suite, unit, etc."
            {...register("address2")}
          />
        </div>
        <div className="relative">
          <Input
            label="PIN Code"
            placeholder="400001"
            maxLength={6}
            error={errors.postalCode?.message}
            {...register("postalCode")}
          />
          {isValidatingPin && (
            <span className="absolute right-3 top-9 text-xs font-medium text-amber-600 dark:text-amber-400 animate-pulse">
              Checking...
            </span>
          )}
        </div>
        <Input
          label="City"
          placeholder="Mumbai"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="State / Province"
          placeholder="MH"
          error={errors.state?.message}
          {...register("state")}
        />
        <div>
          <label className="block text-sm font-medium text-brown-800 mb-1.5">
            Country
          </label>
          <div className="relative">
            <select
              {...register("country")}
              className="w-full px-4 py-2.5 pr-10 appearance-none text-base sm:text-sm border border-brown-300 dark:border-amber-900/30 rounded-lg bg-gray-50 dark:bg-black/20 text-brown-500 dark:text-amber-100/50 focus:outline-none"
            >
              <option value="India">India</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brown-400 dark:text-amber-100/40"
            />
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
