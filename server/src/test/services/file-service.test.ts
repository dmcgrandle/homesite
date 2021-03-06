/* ------------------        file-service.test.js          -------------------
  Unit testing for methods in file-service.js
-----------------------------------------------------------------------------*/

import { fileSvc } from 'src/services/file-service';

const dir = '/test/example_data/';

// test(`testing downloadFiles(${dir})`, async (): Promise<void> => {
//     expect.assertions(1);
//     const expectedResult = [
//         { filename: 't1.tst', size: 0 },
//         { filename: 't2.jpg', size: 0 },
//         { filename: 't3.mp4', size: 0 },
//         { filename: 't4.mov', size: 0 }
//     ];
//     const data = await fileSvc.downloadFiles(dir, () => true);
//     expect(data).toEqual(expectedResult);
// });

test(`testing mediaFiles(${dir})`, async (): Promise<void> => {
    expect.assertions(1);
    const expectedResult = ['t2.jpg', 'sub/t2.jpg'];
    const data = await fileSvc.mediaFiles(dir, (s: string): boolean => s === '.jpg');
    expect(data).toEqual(expectedResult);
});

test(`testing mediaDirs(${dir})`, async (): Promise<void> => {
    expect.assertions(1);
    const expectedResult = ['', 'sub'];
    const data = await fileSvc.mediaDirs(dir);
    expect(data).toEqual(expectedResult);
});
