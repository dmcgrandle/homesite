import { UserModule } from './user.module';

describe('UsersModule', () => {
    let userModule: UserModule;

    beforeEach(() => {
        userModule = new UserModule();
    });

    it('should create an instance', () => {
        expect(userModule).toBeTruthy();
    });
});
