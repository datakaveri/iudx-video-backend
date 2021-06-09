import {
    v4 as uuidv4,
    v5 as uuidv5,
    NIL as NIL_UUID
} from 'uuid';

export default class UUID {
    constructor() { }

    public generateUUIDv5(namespace: string): string {
        const NAMESPACE = uuidv5(namespace, NIL_UUID);

        return uuidv5(uuidv4(), NAMESPACE);
    }

}
