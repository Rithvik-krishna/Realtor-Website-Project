import { z } from 'zod';

export const PropertyTypeEnum = z.enum([
  'DETACHED',
  'SEMI_DETACHED',
  'TOWNHOUSE',
  'CONDO_APARTMENT',
  'CONDO_TOWNHOUSE',
  'DUPLEX',
  'TRIPLEX',
  'COMMERCIAL',
  'LAND'
]);

export const CreatePropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  propertyType: PropertyTypeEnum,
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  squareFeet: z.number().optional(),
  address: z.string(),
  city: z.string(),
  province: z.string().optional().default('ON'),
  postalCode: z.string(),
  neighborhood: z.string().optional(),
  communityId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  walkScore: z.number().optional(),
  transitScore: z.number().optional(),
  schoolRating: z.number().optional(),
  hasFinishedBasement: z.boolean().optional().default(false),
  lifestyleTags: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    caption: z.string().optional(),
    isPrimary: z.boolean().optional().default(false)
  })).optional()
});

export const ComparePropertiesSchema = z.object({
  propertyIds: z.array(z.string().uuid()).min(2).max(4)
});

export type CreatePropertyDto = z.infer<typeof CreatePropertySchema>;
export type ComparePropertiesDto = z.infer<typeof ComparePropertiesSchema>;
