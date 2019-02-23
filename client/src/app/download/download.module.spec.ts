import { DownloadModule } from './download.module';

xdescribe('DownloadModule', () => {
  let downloadModule: DownloadModule;

  beforeEach(() => {
    downloadModule = new DownloadModule();
  });

  it('should create an instance', () => {
    expect(downloadModule).toBeTruthy();
  });
});
