import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "~/services/firebase";

export function useAuth(): User | null {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    useEffect(() => {
        onAuthStateChanged(auth, (userState) => {
            setUser(userState);
        })
    }, [])

    return user;
}