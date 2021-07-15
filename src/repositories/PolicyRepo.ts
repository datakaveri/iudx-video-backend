import { Service, Inject } from 'typedi';

@Service()
export default class PolicyRepo {
    @Inject('PolicyModel') private policyModel;

    async addPolicy(policyData: any) {
        await this.policyModel.create(policyData);
    }

    async findPolicy(userId: string, streamId: string): Promise<any> {
        const policy = await this.policyModel.findOne({
            where: {
                userId,
                streamId
            },
        });
        if (!policy) {
            throw new Error();
        }

        return policy;
    }

    async findAllUserPolicy(userId: string): Promise<any> {
        const policies = await this.policyModel.findAll({
            where: {
                userId,
            },
        });
        if (!policies) {
            throw new Error();
        }

        return policies;
    }

    async removePolicy(userId: string, streamId: string) {
        const deleted = await this.policyModel.destroy({
            where: {
                userId,
                streamId,
            },
        });
        if (!deleted) {
            throw new Error();
        }
    }
}
