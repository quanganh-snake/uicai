import "server-only";

import type { AuthUser } from "@/lib/auth/session";

/** Conference administrators: UNETI's user management group "1" (site admins)
 *  or group "73" (AIESI 2027 conference admins). */
const ADMIN_GROUP_IDS = ["1", "73"];

export function isAdminUser(user: AuthUser) {
  return user.HT_GROUPUSER_ID.some((groupId) =>
    ADMIN_GROUP_IDS.includes(groupId),
  );
}
