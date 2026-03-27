import { z } from "zod";

export const CompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  package: z.string().min(1, "Package is required"),
  criteria: z.coerce.number().min(0).max(10, "CGPA criteria must be between 0 and 10"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  deadline: z.string().or(z.date()).pipe(z.coerce.date()),
  requiredSkills: z.string().optional().default(""),
});

export const StudentProfileSchema = z.object({
  rollNumber: z.string().min(1, "Roll number is required"),
  branch: z.string().min(1, "Branch is required"),
  cgpa: z.coerce.number().min(0).max(10, "CGPA must be between 0 and 10"),
  year: z.coerce.number().int().min(1).max(5),
  gender: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  batchYear: z.string().optional(),
  skills: z.string().min(1, "Skills are required"),
  resumeUrl: z.string().url("Please provide a valid resume URL"),
  contact: z.string().min(10, "Contact number must be at least 10 digits"),
});

export const ApplicationSchema = z.object({
  companyId: z.string().cuid(),
});

export const InterviewScheduleSchema = z.object({
  applicationId: z.string().cuid(),
  dateTime: z.string().or(z.date()).pipe(z.coerce.date()),
  location: z.string().min(2, "Location is required"),
});
