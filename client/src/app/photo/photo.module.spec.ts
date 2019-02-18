import { PhotoModule } from './photo.module';

xdescribe('PhotoModule', () => {
  let photoModule: PhotoModule;

  beforeEach(() => {
    photoModule = new PhotoModule();
  });

  it('should create an instance', () => {
    expect(photoModule).toBeTruthy();
  });
});
