/* eslint-disable promise/always-return */
import { remote } from 'electron';
import { saveAs } from 'file-saver';
import fs from 'fs-extra';
import path from 'path';

const SaveReport = (report, name) => {
  const pathDir = path.join(
    remote.app.getPath('documents'),
    'DMD Remanufacturados'
  );
  fs.ensureDir(pathDir)
    .then(() => {
      saveAs(report, name);
    })
    .catch((err) => console.error(err));
};

export default SaveReport;
