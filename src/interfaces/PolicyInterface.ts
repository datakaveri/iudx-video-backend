import { Model } from "sequelize";

export interface PolicyInterface extends Model {
    policyId: string;
    userId: string;
    streamId: string;
    providerId: string;
}
