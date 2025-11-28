// lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";

export const getAuthUser = async () => {
  const { userId } = await auth();   // <-- FIXED
  
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  return user;
};

export const requireAuth = async () => {   // <-- MUST be async now
  const { userId } = await auth();         // <-- FIXED
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  return userId;
};
