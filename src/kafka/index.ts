import CameraKafkaController from "./controllers/CameraKafkaController";

export default () => {
    const cameraKafkaController = new CameraKafkaController();

    cameraKafkaController.subscribe();
}
