import fs from 'fs';
import path from 'path';

export default filePath => ({
  type: path.extname(filePath),
  data: fs.readFileSync(filePath, 'utf8'),
});
