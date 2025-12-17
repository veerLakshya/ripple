import { getAuth } from '../config/clerk'
import {Router} from 'express';
import {z} from 'zod';
import { toUserProfileResponse, UserProfile, UserProfileResponse } from '../modules/users/user.types';
import { UnauthorizedError } from '../lib/error';
import { getUserFromClerk } from '../modules/users/user.service';

export const userRouter = Router();

// user update schema
const UserProfileUpdateSchema = z.object({
    displayName: z.string().trim().max(50).optional(),
    handle: z.string().trim().max(30).optional(),
    bio: z.string().trim().max(500).optional(),
    avatarUrl: z.url('Avatar must be valid image url').optional(),
})

function toResponse(profile: UserProfile) : UserProfileResponse{
    return toUserProfileResponse(profile)
}

// get      - /api/me
userRouter.get('/', async (req, res, next)=>{
    try{
        const auth = getAuth(req);
        if(!auth.userId){
            throw new UnauthorizedError("Unauthorized");
        }

        const profile = await getUserFromClerk(auth.userId);
        const response = toResponse(profile);

        res.json({data: response})

    } catch(err){

    }
})


// patch    - /api/me