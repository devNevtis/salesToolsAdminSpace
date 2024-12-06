// src/lib/validations/company-schema.js
import { z } from "zod";

export const companySchema = z.object({
  // Basic company information
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phone: z.string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone format"),
  email: z.string()
    .email("Invalid email address"),
    website: z.string()
    .transform(val => {
      if (!val) return '';
      if (val.startsWith('http://') || val.startsWith('https://')) return val;
      return `https://${val}`;
    })
    .optional()
    .nullable(),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters"),
  city: z.string()
    .min(2, "City must be at least 2 characters"),
  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  state: z.string()
    .min(2, "State must be at least 2 characters"),
  postalCode: z.string()
    .regex(/^\d{5}(-\d{4})?$/, "Invalid postal code"),
  country: z.string()
    .min(2, "Country must be at least 2 characters"),

  // PBX Configuration
  pbxUrl: z.object({
    domain_uuid: z.string(),
    domain_parent_uuid: z.string().nullable(),
    domain_name: z.string(),
    domain_enabled: z.boolean(),
    domain_description: z.string().nullable(),
    insert_date: z.string().nullable(),
    insert_user: z.string().nullable(),
    update_date: z.string().nullable(),
    update_user: z.string().nullable(),
    _id: z.string().optional()
  }).nullable(),

  // Theme and stages configuration
  configuration: z.object({
    theme: z.object({
      base1: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
      base2: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
      highlighting: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
      callToAction: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
      logo: z.string().url("Invalid logo URL")
    }),
    stages: z.array(z.object({
      name: z.string().min(1, "Stage name is required"),
      show: z.boolean(),
      order: z.number().min(1, "Order must be greater than 0"),
      _id: z.string().optional()
    }))
  })
});