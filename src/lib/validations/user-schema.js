// src/lib/validations/user-schema.js
import { z } from "zod";

// Schema común para todos los usuarios
const baseUserSchema = z.object({
  id_highlevel: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone format"),
  extension: z.string().optional(),
  profilePhoto: z.string().url().optional().nullable(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  vText: z.array(z.object({
    email: z.string().email("Invalid vText email"),
    phone: z.string().regex(/^\+?[0-9\s-()]+$/, "Invalid vText phone")
  })).default([]),
  companyId: z.string().min(1, "Company is required"),
});

// Schema específico para Owner
export const ownerSchema = baseUserSchema.extend({
  role: z.literal("owner"),
  globalSettings: z.array(z.any()).default([]),
  metricAccess: z.boolean().default(true)
});

// Schema específico para Manager
export const managerSchema = baseUserSchema.extend({
  role: z.literal("manager"),
  permissions: z.array(z.any()).default([])
});

// Schema específico para Sales
export const salesSchema = baseUserSchema.extend({
  role: z.literal("sale"),
  commissionRate: z.preprocess(
    // Convertir el valor a número si es string
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number()
      .min(0, "Commission rate cannot be negative")
      .max(100, "Commission rate cannot exceed 100%")
      .default(0)
  ),
  managerId: z.string().min(1, "Manager is required")
});

// Schema unificado para validación según rol
export const userSchema = z.discriminatedUnion("role", [
  ownerSchema,
  managerSchema,
  salesSchema
]);