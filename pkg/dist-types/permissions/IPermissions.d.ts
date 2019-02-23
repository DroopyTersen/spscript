export interface BasePermission {
    name: string;
    low: number;
    high: number;
}
export interface RoleMember {
    login: string;
    name: string;
    id: string;
}
export interface RoleDef {
    /** Role definition name */
    name: string;
    description: string;
    /** An array of base permission names */
    basePermissions: string[];
}
export interface RoleAssignment {
    /** User or Group */
    member: RoleMember;
    /** An array of role definitions */
    roles: RoleDef[];
}
export declare var basePermissions: BasePermission[];
