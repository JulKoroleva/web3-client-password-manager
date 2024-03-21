/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import {
  checkNodeConnection,
  updateData,
  updateCommissionSize,
  getData,
  getCurrentCommissionSize,
} from "./dataStorageSmartContractInterface";
import { TextEncoder, TextDecoder } from "text-encoding";
function synchronousTimeout(milliseconds) {
  const startTime = new Date().getTime();
  let currentTime = startTime;

  while (currentTime - startTime < milliseconds) {
    currentTime = new Date().getTime();
  }
}

export async function testFunction() {
  synchronousTimeout(1);
  await checkNodeConnection();

  let data = await getData();
  let newData = "0xabcdef";
  let ok = await updateData(newData);
  if (ok) {
  } else {
  }

  data = await getData();

  const finalHexString = "0x48656c6c6f2c20776f726c6421";
  
  const bytes = new Uint8Array(
    finalHexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );

  const decoder = new TextDecoder();
  const decodedString = decoder.decode(bytes);

  newData = "0xaaaa77"; 
  ok = await updateData(decodedString);
  if (ok) {
  } else {
  }

  data = await getData();

  let commitionSize = await getCurrentCommissionSize();

  ok = await updateCommissionSize(newCommitionSize);
  if (ok) {
  } else {
  }

  commitionSize = await getCurrentCommissionSize();
}

