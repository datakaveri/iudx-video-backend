import { Service } from 'typedi';
import Logger from '../common/Logger';

import ServiceError from '../common/Error';
import UUID from '../common/UUID';
import config from '../config';
import PolicyRepo from '../repositories/PolicyRepo';
import UserRepo from '../repositories/UserRepo';

@Service()
export default class PolicyService {
    constructor(private policyRepo: PolicyRepo, private userRepo: UserRepo) {}

    public async create(providerId: string, email: string, streamId: string) {
        try {
            const namespace: string = config.host.type + 'Policy';
            const policyId: string = new UUID().generateUUIDv5(namespace);
            const user = await this.userRepo.findUser({email});
            await this.policyRepo.addPolicy({ policyId, providerId, userId: user.id, streamId });
            return {
                message: 'Created',
            };
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error creating the data');
        }
    }

    public async findAllUserPolicy(userId: string) {
        try {
            const policies = await this.policyRepo.findAllUserPolicy(userId);
            return policies;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    public async delete(email: string, streamId: string) {
        try {
            const user = await this.userRepo.findUser({email});
            await this.policyRepo.removePolicy(user.id, streamId);
            return {
                message: 'Deleted',
            };
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }
}
