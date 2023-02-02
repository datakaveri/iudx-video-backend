import {
    v4 as uuidv4,
    v5 as uuidv5,
} from 'uuid';

import config from '../config';

export default class UUID {
    constructor() { }

    public generateUUIDv5(namespace: string): string {
        const NAMESPACE = uuidv5(namespace, config.serverId);

        return uuidv5(uuidv4(), NAMESPACE);
    }

}
