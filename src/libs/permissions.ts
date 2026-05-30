import { AuthSession } from "@/types/types";
import { createAccessControl } from "better-auth/plugins";
import { adminAc } from "better-auth/plugins/admin/access";

const perms = {
  management: ["manage", "ban"],
  user: [...adminAc.statements.user, "suggest"],
  session: [...adminAc.statements.session],
} as const;

const ac = createAccessControl(perms);

const guest = ac.newRole({
  user: ["suggest"],
});

const contributor = ac.newRole({
  user: ["suggest"],
});

const staff = ac.newRole({
  management: ["manage"],
});

const developer = ac.newRole({
  management: ["manage"],
});

const admin = ac.newRole({
  management: ["manage", "ban"],
  ...adminAc.statements,
});

const owner = ac.newRole({
  management: ["manage", "ban"],
  ...adminAc.statements,
});

export const ALLOWED_ROLES: Record<string, boolean> = {
  owner: true,
  admin: true,
  staff: true,
  developer: true
}

function hasManagementAccess(session: AuthSession) {
  if (session && session.data && session.data.user) {
    return session.data.user.role == "admin" || session.data.user.role == "owner"
  }
}

export { perms, guest, staff, contributor, developer, admin, owner, hasManagementAccess };