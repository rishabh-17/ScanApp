require('react-native-gesture-handler/jestSetup');
const { jest: jestObject } = require('@jest/globals');

jestObject.mock('@react-native-documents/picker', () => {
  const types = {
    allFiles: 'public.item',
    images: 'public.image',
    pdf: 'com.adobe.pdf',
  };

  const errorCodes = {
    IN_PROGRESS: 'ASYNC_OP_IN_PROGRESS',
    NULL_PRESENTER: 'NULL_PRESENTER',
    OPERATION_CANCELED: 'OPERATION_CANCELED',
    UNABLE_TO_OPEN_FILE_TYPE: 'UNABLE_TO_OPEN_FILE_TYPE',
  };

  return {
    __esModule: true,
    pick: jestObject.fn(() => Promise.resolve([{ name: 'document.pdf', uri: 'file:///document.pdf', type: 'application/pdf', size: 1234, hasRequestedType: true }])),
    types,
    errorCodes,
    isErrorWithCode: () => true,
  };
});
