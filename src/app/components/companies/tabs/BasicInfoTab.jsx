// src/app/components/companies/tabs/BasicInfoTab.jsx
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const BasicInfoTab = () => {
  const form = useFormContext();
  
  return (
    <div className="grid gap-4">
      {/* Company Name & Email */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Company Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter company name" 
                  {...field} 
                  className="h-8 text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="company@example.com" 
                  type="email" 
                  {...field}
                  className="h-8 text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Phone & Website */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Phone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+1 (555) 000-0000" 
                  {...field}
                  className="h-8 text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Website</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com" 
                  type="url" 
                  {...field}
                  className="h-8 text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-sm">Address</FormLabel>
            <FormControl>
              <Input 
                placeholder="Street address" 
                {...field}
                className="h-8 text-sm"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* City, State & Postal Code */}
      <div className="grid grid-cols-3 gap-3">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">City</FormLabel>
              <FormControl>
                <Input 
                  placeholder="City" 
                  {...field}
                  className="h-8 text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">State</FormLabel>
              <FormControl>
                <Input 
                  placeholder="State" 
                  {...field}
                  className="h-8 text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Postal Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="00000" 
                  {...field}
                  className="h-8 text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      {/* Country */}
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-sm">Country</FormLabel>
            <FormControl>
              <Input 
                placeholder="Country" 
                {...field}
                className="h-8 text-sm"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-sm">Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter company description"
                className="resize-none h-20 text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};