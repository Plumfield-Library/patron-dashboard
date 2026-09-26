import { z } from "zod"

const MembershipStatus = z.enum(["active", "inactive", "on_hold"])

/**
 * Zod Model for the User Object.
 */
export const UserModel = z.object({
  email: z.email(),
  name: z.string(),
  membership_status: MembershipStatus,
  stripe_id: z.string(),
  classes: z.boolean(), // can the user register for classes
  visit: z.boolean(), // can the user come in for a visit
})