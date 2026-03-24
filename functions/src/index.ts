import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { nanoid } from "nanoid";

initializeApp();

export const createProject = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Must be logged in to create a project.");
  }

  // Check if user already has a project key
  const user = await getAuth().getUser(uid);
  if (user.customClaims?.projectKey) {
    return { projectKey: user.customClaims.projectKey };
  }

  // Generate nanoid project key and set as custom claim
  const projectKey = nanoid();
  await getAuth().setCustomUserClaims(uid, {
    ...user.customClaims,
    projectKey,
  });

  return { projectKey };
});
