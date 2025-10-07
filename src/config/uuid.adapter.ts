import { v4 as uuidv4 } from 'uuid';


//generamos uuid
export class UuidAdapter {

    // static v4 = () => uuidv4();
    public static v4(){

        return uuidv4();
    }
}