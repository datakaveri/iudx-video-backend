import { Service } from 'typedi';

@Service()
export default class PolicyRepo {
    public removePolicyByCamera: any = jest.fn().mockImplementation((cameraId: string) => {
        return true;
    });
}
