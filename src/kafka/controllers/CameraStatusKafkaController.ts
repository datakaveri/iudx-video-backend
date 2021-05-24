import { Inject } from 'typedi';
import KafkaManager from '../../managers/Kafka';

class CameraStatusKafkaController {
    @Inject('KafkaManager') private kafkaManager: KafkaManager;
    constructor() {}

    async subscribe() {
        this.kafkaManager.subscribe('cameraStatus', this.handleMessage);
    }

    private async handleMessage(err, message) {
        if(err) {
            // do something
        }

        // call service to perform next operations

    }
}

export default CameraStatusKafkaController;
