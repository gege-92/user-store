import { Validators } from "../../../config";




export class CreateProductDto {

    //private constructor: para que esta creacion no se vaya a usar fuera de esta clase
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, // ID de mongo
        public readonly category: string // ID de mongo
    ){}

    static create( object: {[ key: string ]: any } ): [ string?, CreateProductDto? ]{

        const { name, available, price = 0, description, user, category } = object;
        let availableBoolean = available;

        if(!name) return ['Name is required', undefined];
        if( typeof available !== 'boolean'){
            availableBoolean = ( available === 'true');
        }
        if(isNaN( Number( price ))) return ['Price must be a number', undefined];

        if(!user) return ['User is required', undefined];
        if( !Validators.isMongoId( user )) return ['User must be a valid Mongo ID', undefined];

        if(!category) return ['Category is required', undefined];
        if( !Validators.isMongoId( category )) return ['Category must be a valid Mongo ID', undefined];

        return [ undefined, new CreateProductDto(name, availableBoolean, price, description, user, category) ];
    }

}