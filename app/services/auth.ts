import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "./firebase";

export async function signInUser(email: string) {
    if (isSignInWithEmailLink(auth, location.href)) {
        return await signInWithEmailLink(auth, email);
    }
}