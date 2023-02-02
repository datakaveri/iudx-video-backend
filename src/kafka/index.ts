import BaseKafkaController from "./controllers/BaseKafkaController";

export default async () => {
    const baseKafkaController = new BaseKafkaController();

    await baseKafkaController.subscribe();
}