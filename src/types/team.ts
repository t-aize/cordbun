import type { User } from "./user.js";

export enum TeamMemberRole {
	Admin = "admin",
	Developer = "developer",
	ReadOnly = "read_only",
}

export enum MembershipState {
	Invited = 1,
	Accepted = 2,
}

export interface TeamMember {
	membership_state: MembershipState;
	team_id: string;
	user: Partial<User>;
	role: TeamMemberRole;
}

export interface Team {
	icon: string | null;
	id: string;
	members: TeamMember[];
	name: string;
	owner_user_id: string;
}
