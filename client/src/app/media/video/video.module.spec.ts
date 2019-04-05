import { VideoModule } from './video.module';

fdescribe('VideoModule', () => {
    let videoModule: VideoModule;

    beforeEach(() => {
        videoModule = new VideoModule();
    });

    it('should create an instance', () => {
        expect(videoModule).toBeTruthy();
    });
});
