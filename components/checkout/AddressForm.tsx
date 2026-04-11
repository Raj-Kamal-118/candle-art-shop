"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Address } from "@/lib/types";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
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
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || { country: "India" },
  });

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
        <Input
          label="Postal Code"
          placeholder="400001"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
        <div>
          <label className="block text-sm font-medium text-brown-800 mb-1.5">
            Country
          </label>
          <select
            {...register("country")}
            className="w-full px-4 py-2.5 text-sm border border-brown-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
