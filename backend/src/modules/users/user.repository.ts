import { query } from "../../db/db";
import { User, UserRow } from "./user.types";


function hydrateUser(row: UserRow): User {
    return {
        id: row.id,
        clearUserId: row.clerk_user_id,
        displayName: row.display_name,
        handle: row.handle,
        bio: row.bio,
        avatarUrl: row.avatar_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}


export async function upsertUserFromClerkProfile(params: {
    clerkUserId: string;
    displayName: string | null;
    avatarUrl: string | null;
}):Promise<User>{

    const {clerkUserId, displayName, avatarUrl} = params;

    const result = await query<UserRow>(
        `
        INSERT INTO users (clerk_user_id, display_name, avatar_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (clerk_user_id)
        DO UPDATE SET
            display_name = EXCLUDED.display_name,
            avatar_url   = EXCLUDED.avatar_url,
            updated_at   = NOW()
        RETURNING
            id,
            clerk_user_id,
            display_name,
            handle,
            bio,
            avatar_url,
            created_at,
            updated_at
        `,
        [clerkUserId, displayName, avatarUrl]
    );

    return hydrateUser(result.rows[0]);
}

export async function repoUpdateUserProfile(params:{
    clerkUserId: string;
    displayName: string | null;
    handle: string | null;
    bio: string | null;
    avatarUrl: string | null;
}) : Promise<User> {
    const {clerkUserId, displayName, handle, bio, avatarUrl} = params;

    const setClauses: string[] = [];

    const values: unknown[] = [clerkUserId]; // $1 is always clerkUserId
    let idx = 2;

    // push a column=$index -> string -> push into setClauses
    // push the actual values into this values array
    if(typeof displayName !== 'undefined'){
        setClauses.push(`display_name = $${idx}`);
        values.push(displayName);
        idx++;
    }

    if(typeof handle !== 'undefined'){
        setClauses.push(`handle = $${idx}`);
        values.push(handle);
        idx++;
    }

    if(typeof bio !== 'undefined'){
        setClauses.push(`bio = $${idx}`);
        values.push(bio);
        idx++;
    }

    if(typeof avatarUrl !== 'undefined'){
        setClauses.push(`avatar_url = $${idx}`);
        values.push(avatarUrl);
        idx++;
    }

    setClauses.push(`updated_at = NOW()`); // always update updated_at

    const result = await query<UserRow>(
        `
        UPDATE users
        SET ${setClauses.join(', ')}
        WHERE clerk_user_id = $1
        RETURNING
            id,
            clerk_user_id,
            display_name,
            handle,
            bio,
            avatar_url,
            created_at,
            updated_at
        `,
        values
    );

    if (result.rows.length === 0){
        throw new Error("User not found for clerkUserId: " + clerkUserId);
    }

    return hydrateUser(result.rows[0]);
}