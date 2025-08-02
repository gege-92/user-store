import { compareSync, genSaltSync, hashSync } from "bcryptjs";



export class BcryptAdapter {

    public static hash( password: string ){

        const salt = genSaltSync();
        const hash = hashSync( password, salt );

        return hash;

    }

    public static compare( password: string, hashPassword: string ){

        return compareSync( password, hashPassword );

    }

}