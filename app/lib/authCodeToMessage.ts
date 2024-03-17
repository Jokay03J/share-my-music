export function authCodeToMessage(code: string) {
    switch (code) {
        case "auth/invalid-credential":
            return "Identifiant invalide !"
            break;

        default:
            return "Une erreur est survenue, veuillez réessayer plus tard."
            break;
    }
}