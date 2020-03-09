/* eslint-disable */

import path from "path";
import { fileURLToPath } from "url";

const dirName = path.dirname(import.meta.url);
export default fileURLToPath(dirName);
