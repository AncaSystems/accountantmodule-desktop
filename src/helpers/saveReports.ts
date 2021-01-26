/* eslint-disable promise/always-return */
import { remote, shell } from 'electron';
import fs from 'fs-extra';
import path from 'path';

const SaveReport = (report, name) => {
  const pathDir = path.join(
    remote.app.getPath('documents'),
    'DMD Remanufacturados'
  );
  fs.ensureDir(pathDir)
    .then(() => {
      const reportPath = path.join(pathDir, name);
      const reader = new FileReader();
      reader.onload = function () {
        const buffer = new Buffer(reader.result);
        fs.writeFile(reportPath, buffer, {}, (err, res) => {
          if (err) {
            console.error(err);
          }
          shell.openPath(reportPath);
        });
      };
      reader.readAsArrayBuffer(report);
      // saveAs(report, name);
    })
    .catch((err) => console.error(err));
};

export default SaveReport;
