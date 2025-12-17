
export type UserRow = {
    id: number;
    clerk_user_id: string;
    display_name: string | null;
    handle: string | null;
    bio: string | null;
    avatar_url: string | null;
    created_at: Date;
    updated_at: Date;
}

// schema DB vs what we are going to expose to api layer
export type User = {
    id: number;
    clearUserId: string;
    displayName: string | null;
    handle: string | null;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type UserProfile = {
    user : User;
    clerkEmail: string | null;
    clerkFullName: string | null;
}

export type UserProfileResponse = {
    id: number;
    clearUserId: string;
    email: string | null;
    displayName: string | null;
    handle: string | null;
    bio: string | null;
    avatarUrl: string | null;
}

export function toUserProfileResponse(profile: UserProfile) : UserProfileResponse {
    const {user, clerkEmail, clerkFullName} = profile

    return {
        id: user.id,
        clearUserId: user.clearUserId,
        email: clerkEmail,
        displayName: user.displayName ?? clerkFullName ?? null,
        handle: user.handle,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
    }
}