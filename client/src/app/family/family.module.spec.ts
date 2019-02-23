import { FamilyModule } from './family.module';

xdescribe('FamilyModule', () => {
  let familyModule: FamilyModule;

  beforeEach(() => {
    familyModule = new FamilyModule();
  });

  it('should create an instance', () => {
    expect(familyModule).toBeTruthy();
  });
});
