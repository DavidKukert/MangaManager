import crypto from "crypto";

function generateSalt(length: number) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, 16);
};

function sha512(password: string, salt: string) {
    let hash: string | crypto.Hmac = crypto.createHmac('sha512', salt);
    hash.update(password);
    hash = hash.digest('hex');
    return {
        salt,
        hash,
    };
};

export function generatePass(password: string) {
    const salt = generateSalt(16); // Vamos gerar o salt
    return sha512(password, salt); // Pegamos a senha e o salt
}

export function verifyPass(password: string, passwordInDb: string, saltInDb: string) {
    const { hash, salt } = sha512(password, saltInDb)
    return hash === passwordInDb;
}