import { Service, Inject } from 'typedi';
import { Op } from 'sequelize';

@Service()
export default class PolicyRepo {
    @Inject('PolicyModel') private policyModel;

    async addPolicy(policyData: any) {
        await this.policyModel.create(policyData);
    }

    async findPolicy(userId: string, cameraId: string): Promise<any> {
        const policy = await this.policyModel.findOne({
            where: {
                userId,
                cameraId
            },
        });
        if (!policy) {
            throw new Error();
        }

        return policy;
    }

    async findPolicyByConstraints(userId: string, cameraId: string, accessType): Promise<any> {
        const policy = await this.policyModel.findOne({
            where: {
                userId,
                cameraId,
                constraints: {
                    [Op.contains]: {
                        accessType: [accessType]
                    }
                }
            },
        });

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

    async removePolicy(userId: string, cameraId: string) {
        const deleted = await this.policyModel.destroy({
            where: {
                userId,
                cameraId,
            },
        });
        if (!deleted) {
            throw new Error();
        }
    }

    async removePolicyByCamera(cameraId: string) {
        await this.policyModel.destroy({
            where: {
                cameraId,
            }
        });
    }
}
