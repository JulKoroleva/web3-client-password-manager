/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import CryptoJS from "rn-crypto-js";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export function convertStringToFormatForSmartContract(sourceString) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(sourceString);
  const hexString = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  const finalHexString = "0x" + hexString;
  return finalHexString;
}

export function convertStringSmartContractFormatToSimpleString(sourceString) {
  const hexStringWithoutPrefix = sourceString.startsWith("0x")
    ? sourceString.slice(2)
    : sourceString;
  const bytes = new Uint8Array(
    hexStringWithoutPrefix.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const decoder = new TextDecoder();
  const decodedString = decoder.decode(bytes);
  return decodedString;
}

export function getRemovedEmptyNameFields(obj) {
  const notEmptyNamesCategories = {
    categories: [],
  };
  for (const category of obj.categories) {
    if (category.name !== "") {
      const notEmptyInstances = [];
      for (const instance of category.instances) {
        if (instance.name !== "") {
          notEmptyInstances.push({
            name: instance.name,
            credentialsData: instance.credentialsData,
          });
        }
      }

      if (category.instances.length === 0) {
        notEmptyNamesCategories.categories.push({
          name: category.name,
          instances: notEmptyInstances,
        });
      }

      if (notEmptyInstances.length > 0) {
        notEmptyNamesCategories.categories.push({
          name: category.name,
          instances: notEmptyInstances,
        });
      }
    }
  }
  if (obj.flag) {
    notEmptyNamesCategories.flag = obj.flag;
  }
  return notEmptyNamesCategories;
}

function findChangedCategories(obj1, obj2) {
  const changedCategories = {
    categories: [],
  };

  for (const category1 of obj1.categories) {
    const category2 = obj2.categories.find(
      (cat) => cat.name === category1.name
    );
    if (category2) {
      const changedInstances = [];
      for (const instance1 of category1.instances) {
        const instance2 = category2.instances.find(
          (inst) => inst.name === instance1.name
        );
        if (
          instance2 &&
          JSON.stringify(instance1.credentialsData) !==
            JSON.stringify(instance2.credentialsData)
        ) {
          changedInstances.push({
            name: instance1.name,
            credentialsData: instance2.credentialsData,
          });
        }
      }

      if (changedInstances.length > 0) {
        changedCategories.categories.push({
          name: category1.name,
          instances: changedInstances,
        });
      }
    }
  }

  return changedCategories;
}

function findNewCategoriesAndInstances(obj1, obj2) {
  const newCategoriesAndInstances = {
    categories: [],
  };

  for (const category2 of obj2.categories) {
    const category1 = obj1.categories.find(
      (cat) => cat.name === category2.name
    );
    if (!category1) {
      newCategoriesAndInstances.categories.push(category2);
    } else {
      const newInstancesInCategory = [];
      for (const instance2 of category2.instances) {
        const instance1 = category1.instances.find(
          (inst) => inst.name === instance2.name
        );
        if (!instance1) {
          newInstancesInCategory.push(instance2);
        }
      }

      if (category2.instances.length === 0) {
        newCategoriesAndInstances.categories.push({
          name: category2.name,
          instances: newInstancesInCategory,
        });
      }

      if (newInstancesInCategory.length > 0) {
        newCategoriesAndInstances.categories.push({
          name: category2.name,
          instances: newInstancesInCategory,
        });
      }
    }
  }

  return newCategoriesAndInstances;
}

function findMissingFields(obj1, obj2) {
  const missingFields = {
    categories: [],
  };

  for (const category1 of obj1.categories) {
    const category2 = obj2.categories.find(
      (cat) => cat.name === category1.name
    );
    if (!category2) {
      missingFields.categories.push(category1);
    } else {
      const missingInstances = [];
      for (const instance1 of category1.instances) {
        const instance2 = category2.instances.find(
          (inst) => inst.name === instance1.name
        );
        if (!instance2) {
          missingInstances.push(instance1);
        }
      }
      if (missingInstances.length > 0) {
        missingFields.categories.push({
          name: category1.name,
          instances: missingInstances,
        });
      }
    }
  }

  return missingFields;
}

function findIdenticalFields(obj1, obj2) {
  const identicalFields = {
    categories: [],
  };

  for (const category1 of obj1.categories) {
    const category2 = obj2.categories.find(
      (cat) => cat.name === category1.name
    );
    if (category2) {
      const identicalInstances = [];
      for (const instance1 of category1.instances) {
        const instance2 = category2.instances.find(
          (inst) => inst.name === instance1.name
        );
        if (
          instance2 &&
          JSON.stringify(instance1.credentialsData) ===
            JSON.stringify(instance2.credentialsData)
        ) {
          identicalInstances.push(instance1);
        }
      }

      if (category1.instances.length === 0) {
        identicalFields.categories.push({
          name: category1.name,
          instances: identicalInstances,
        });
      }

      if (identicalInstances.length > 0) {
        identicalFields.categories.push({
          name: category1.name,
          instances: identicalInstances,
        });
      }
    }
  }

  return identicalFields;
}

export function getStructuredDateWithOnlyNewFieldsOld(newData, oldData) {
  let dataWithOnlyNewFields = {};
  dataWithOnlyNewFields.flag = oldData.flag;
  dataWithOnlyNewFields.categories = [];
  for (let i = 0; i < newData.categories.length; i++) {
    let isExistSameCategories = false;
    let sameCategoryIndexInOldData = -1;
    for (let j = 0; j < oldData.categories.length; j++) {
      if (newData.categories[i].name === oldData.categories[j].name) {
        isExistSameCategories = true;
        sameCategoryIndexInOldData = j;
        break;
      }
    }
    if (!isExistSameCategories) {
      let category = {
        name: newData.categories[i].name,
        instances: newData.categories[i].instances,
      };
      dataWithOnlyNewFields.categories.push(category);
    } else {
      let tmpCategory = {
        name: newData.categories[i].name,
        instances: [],
      };
      for (let i2 = 0; i2 < newData.categories[i].instances.length; i2++) {
        let isExistSameInstances = false;
        let sameInstanceIndexInOldData = -1;
        for (
          let j2 = 0;
          j2 < oldData.categories[sameCategoryIndexInOldData].instances.length;
          j2++
        ) {
          if (
            newData.categories[i].instances[i2].name ==
            oldData.categories[sameCategoryIndexInOldData].instances[j2].name
          ) {
            isExistSameInstances = true;
            sameInstanceIndexInOldData = j2;
            break;
          }
        }
        if (!isExistSameInstances) {
          let instance = {
            name: newData.categories[i].instances[i2].name,
            credentialsData:
              newData.categories[i].instances[i2].credentialsData,
          };
          tmpCategory.instances.push(instance);
        } else {
          const newInstance = newData.categories[i].instances[i2];
          const oldInstance =
            oldData.categories[sameCategoryIndexInOldData].instances[
              sameInstanceIndexInOldData
            ];
          if (
            !(
              newInstance.name === oldInstance.name &&
              newInstance.credentialsData.login ===
                oldInstance.credentialsData.login &&
              newInstance.credentialsData.password ===
                oldInstance.credentialsData.password &&
              newInstance.credentialsData.additionalInfo ===
                oldInstance.credentialsData.additionalInfo
            )
          ) {
            let instance = {
              name: newData.categories[i].instances[i2].name,
              credentialsData:
                newData.categories[i].instances[i2].credentialsData,
            };
            tmpCategory.instances.push(instance);
          }
        }
      }
      if (tmpCategory.instances.length !== 0) {
        dataWithOnlyNewFields.categories.push(tmpCategory);
      }
    }
  }
  return dataWithOnlyNewFields;
}

export function encryptEditedData(
  encryptedOldObj,
  decryptedOldObj,
  editedData,
  _key,
  _salt
) {
  const encryptedEditedData = {
    categories: [],
  };

  for (const category of decryptedOldObj.categories) {
    const encryptedCategory = encryptedOldObj.categories.find(
      (cat) => decryptCategoryName(cat.name, _key, _salt) === category.name
    );
    if (encryptedCategory) {
      const editedInstances = [];
      for (const instance of editedData.categories.find(
        (cat) => cat.name === category.name
      )?.instances || []) {
        const encryptedInstance = encryptedCategory.instances.find(
          (inst) =>
            decryptInstanceName(inst.name, _key, _salt) === instance.name
        );
        if (encryptedInstance) {
          const encryptedCredentialsData = {
            login: encryptFieldValue(
              instance.credentialsData.login,
              _key,
              _salt
            ),
            password: encryptFieldValue(
              instance.credentialsData.password,
              _key,
              _salt
            ),
            additionalInfo: encryptFieldValue(
              instance.credentialsData.additionalInfo,
              _key,
              _salt
            ),
          };
          editedInstances.push({
            name: encryptedInstance.name,
            credentialsData: encryptedCredentialsData,
          });
        }
      }
      if (encryptedCategory.instances.length === 0) {
        encryptedEditedData.categories.push({
          name: encryptedCategory.name,
          instances: editedInstances,
        });
      }

      if (editedInstances.length > 0) {
        encryptedEditedData.categories.push({
          name: encryptedCategory.name,
          instances: editedInstances,
        });
      }
    }
  }

  return encryptedEditedData;
}

export function decryptCategoryName(encryptedName, key, salt) {
  const delimiter = "|";
  let parts = encryptedName.split(delimiter);
  const categoryName = parts[0];
  let iv_Base64 = parts[1];
  let iv = CryptoJS.enc.Base64.parse(iv_Base64);
  const decryptedName = CryptoJS.AES.decrypt(
    categoryName,
    CryptoJS.SHA512(key),
    {
      iv: iv,
      salt: CryptoJS.enc.Utf8.parse(salt),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8);
  return decryptedName;
}

export function decryptInstanceName(encryptedName, key, salt) {
  const delimiter = "|";
  let parts = encryptedName.split(delimiter);
  const instanceName = parts[0];
  let iv_Base64 = parts[1];
  let iv = CryptoJS.enc.Base64.parse(iv_Base64);
  const decryptedName = CryptoJS.AES.decrypt(
    instanceName,
    CryptoJS.SHA512(key),
    {
      iv: iv,
      salt: CryptoJS.enc.Utf8.parse(salt),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8);
  return decryptedName;
}

export function encryptFieldValue(value, key, salt) {
  const delimiter = "|";
  const iv = CryptoJS.lib.WordArray.random(16);
  const encryptedValue = CryptoJS.AES.encrypt(value, CryptoJS.SHA512(key), {
    iv: iv,
    salt: CryptoJS.enc.Utf8.parse(salt),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  let ivBase64 = encryptedValue.iv.toString(CryptoJS.enc.Base64);
  const encryptedFieldValue = encryptedValue.toString() + delimiter + ivBase64;
  return encryptedFieldValue;
}

export function mergeEncryptedData(encryptedEditedData, encryptedNewData) {
  const unionEncryptedData = {
    categories: [],
  };

  const categoryMap = {};

  for (const category of encryptedEditedData.categories) {
    categoryMap[category.name] = category;
  }

  for (const category of encryptedNewData.categories) {
    if (!categoryMap[category.name]) {
      categoryMap[category.name] = category;
    } else {
      for (const instance of category.instances) {
        if (
          !categoryMap[category.name].instances.find(
            (inst) => inst.name === instance.name
          )
        ) {
          categoryMap[category.name].instances.push(instance);
        }
      }
    }
  }

  for (const categoryName in categoryMap) {
    unionEncryptedData.categories.push(categoryMap[categoryName]);
  }

  return unionEncryptedData;
}

export function getEncryptionView(encObj, plainObj, key, salt) {
  const encryptionView = {
    categories: [],
  };

  const encCategoryMap = {};
  for (const encCategory of encObj.categories) {
    encCategoryMap[decryptCategoryName(encCategory.name, key, salt)] =
      encCategory;
  }

  for (const plainCategory of plainObj.categories) {
    const encCategory = encCategoryMap[plainCategory.name];
    if (encCategory) {
      const encryptedInstances = [];
      for (const plainInstance of plainCategory.instances) {
        const encInstance = encCategory.instances.find(
          (inst) =>
            decryptInstanceName(inst.name, key, salt) === plainInstance.name
        );
        if (encInstance) {
          const encryptedLogin = CryptoJS.AES.encrypt(
            plainInstance.credentialsData.login,
            key,
            { iv: salt, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
          ).toString();
          const encryptedPassword = CryptoJS.AES.encrypt(
            plainInstance.credentialsData.password,
            key,
            { iv: salt, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
          ).toString();
          const encryptedAdditionalInfo = CryptoJS.AES.encrypt(
            plainInstance.credentialsData.additionalInfo,
            key,
            { iv: salt, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
          ).toString();

          const encryptedInstance = {
            name: encInstance.name,
            credentialsData: {
              login: encryptedLogin,
              password: encryptedPassword,
              additionalInfo: encryptedAdditionalInfo,
            },
          };
          encryptedInstances.push(encryptedInstance);
        }
      }
      
      const encryptedCategory = {
        name: encCategory.name,
        instances: encryptedInstances,
      };
      encryptionView.categories.push(encryptedCategory);
    }
  }

  return encryptionView;
}

export function processEncryptedData(
  encryptedOldObj,
  decryptedOldObj,
  newData,
  _key,
  _salt
) {

  const resultChanged = findChangedCategories(decryptedOldObj, newData);
  const encryptedEditedData = encryptEditedData(
    encryptedOldObj,
    decryptedOldObj,
    resultChanged,
    _key,
    _salt
  );
  
  const resultNew = findNewCategoriesAndInstances(decryptedOldObj, newData);
  
  resultNew.flag = "evrica!";
  
  const encryptedNewData = encryptNewStructuredData(
    encryptedOldObj,
    resultNew,
    _key,
    _salt
  );
  
  const unionEncryptedData = mergeEncryptedData(
    encryptedEditedData,
    encryptedNewData
  );

  if (!encryptedOldObj.flag) {
    const delimiter = "|";
    const key = CryptoJS.SHA512(_key);
    const encMode = CryptoJS.mode.CBC;
    let iv_ = CryptoJS.lib.WordArray.random(16);
    let salt = null;
    if (_salt !== null) {
      salt = CryptoJS.enc.Utf8.parse(_salt);
    }
    const cipherOptions = {
      iv: iv_,
      salt: salt,
      mode: encMode,
      padding: CryptoJS.pad.Pkcs7,
    };
    const encryptedFlagObj = CryptoJS.AES.encrypt(
      decryptedOldObj.flag,
      key,
      cipherOptions
    );

    ivBase64 = encryptedFlagObj.iv.toString(CryptoJS.enc.Base64);
    const encryptedFlag = encryptedFlagObj.toString() + delimiter + ivBase64;
    unionEncryptedData.flag = encryptedFlag;
  } else {
    unionEncryptedData.flag = encryptedOldObj.flag;
  }

  return unionEncryptedData;
}

export function getFullCurrentNewStorageState(
  encryptedOldObj,
  decryptedOldObj,
  newObj,
  key,
  salt
) {
  const processedData = processEncryptedData(
    encryptedOldObj,
    decryptedOldObj,
    newObj,
    key,
    salt
  );
  const resultIdentical = findIdenticalFields(decryptedOldObj, newObj);
  const encryptedViewIdenticalFields = getEncryptionView(
    encryptedOldObj,
    resultIdentical,
    key,
    salt
  );
  const unionEncryptedData = mergeEncryptedData(
    encryptedViewIdenticalFields,
    processedData
  );
  return unionEncryptedData;
}

export function getElementsForDelete(dataWithOnlyNewFields, oldData) {
  const elementsForDelete = [];
  for (let i = 0; i < oldData.categories.length; i++) {
    if (oldData.categories[i].name == "") {
      continue;
    }
    let isExistSameCategories = false;
    let sameCategoryIndexInDataWithOnlyNewFieldsData = -1;
    for (let j = 0; j < dataWithOnlyNewFields.categories.length; j++) {
      if (
        oldData.categories[i].name == dataWithOnlyNewFields.categories[j].name
      ) {
        isExistSameCategories = true;
        sameCategoryIndexInDataWithOnlyNewFieldsData = j;
        break;
      }
    }
    if (!isExistSameCategories) {
      elementsForDelete.push({
        category: oldData.categories[i].name,
        instance: "",
      });
    } else {
      for (let i2 = 0; i2 < oldData.categories[i].instances.length; i2++) {
        if (oldData.categories[i].instances[i2].name == "") {
          continue;
        }
        let isExistSameInstances = false;
        let sameInstanceIndexInDataWithOnlyNewFieldsData = -1;
        for (
          let j2 = 0;
          j2 <
          dataWithOnlyNewFields.categories[
            sameCategoryIndexInDataWithOnlyNewFieldsData
          ].instances.length;
          j2++
        ) {
          if (
            dataWithOnlyNewFields.categories[
              sameCategoryIndexInDataWithOnlyNewFieldsData
            ].instances[j2].name == ""
          ) {
            continue;
          }
          if (
            oldData.categories[i].instances[i2].name ==
            dataWithOnlyNewFields.categories[
              sameCategoryIndexInDataWithOnlyNewFieldsData
            ].instances[j2].name
          ) {
            isExistSameInstances = true;
            sameInstanceIndexInDataWithOnlyNewFieldsData = j2;
            break;
          }
        }
        if (!isExistSameInstances) {
          elementsForDelete.push({
            category: oldData.categories[i].name,
            instance: oldData.categories[i].instances[i2].name,
          });
        }
      }
    }
  }
  return elementsForDelete;
}

export function convertToViewFormat(inputJsonObject) {
  const categoriesObject = [];
  for (let i = 0; i < inputJsonObject.categories.length; i++) {
    if (inputJsonObject.categories[i].name === "") {
      continue;
    }
    let categoryObject = JSON.parse(inputJsonObject.categories[i].name);
    categoryObject.items = [];
    for (let j = 0; j < inputJsonObject.categories[i].instances.length; j++) {
      if (inputJsonObject.categories[i].instances[j].name === "") {
        continue;
      }
      const instanceObject = JSON.parse(
        inputJsonObject.categories[i].instances[j].credentialsData
          .additionalInfo
      );
      
      instanceObject.name = inputJsonObject.categories[i].instances[j].name;
      instanceObject.login =
        inputJsonObject.categories[i].instances[j].credentialsData.login;
      instanceObject.password =
        inputJsonObject.categories[i].instances[j].credentialsData.password;
      categoryObject.items.push(instanceObject);
    }
    categoriesObject.push(categoryObject);
  }
  return categoriesObject;
}

export function convertFromViewFormat(inputJsonObject) {
  let outputJsonObject = {};
  outputJsonObject.flag = "evrica!"; 
  outputJsonObject.categories = [];
  for (let i = 0; i < inputJsonObject.length; i++) {
    let categoryJsonObject = {};
    let tmpJsonCategoryObject = {};
    tmpJsonCategoryObject.category = inputJsonObject[i].category;
    tmpJsonCategoryObject.categoryName = inputJsonObject[i].categoryName;
    tmpJsonCategoryObject.categoryIcon = inputJsonObject[i].categoryIcon;
    tmpJsonCategoryObject.categoryIconColor =
      inputJsonObject[i].categoryIconColor;
    const stringifiedTmpJsonObject = JSON.stringify(tmpJsonCategoryObject);
    let instancesArr = [];
    for (let j = 0; j < inputJsonObject[i].items.length; j++) {
      let tmpJsonInstanceObject = {};
      tmpJsonInstanceObject.credentialsData = {};
      if (inputJsonObject[i].items[j].name !== "") {
        tmpJsonInstanceObject.name = inputJsonObject[i].items[j].name;
      } else {
        tmpJsonInstanceObject.name = inputJsonObject[i].items[j].itemName;

        inputJsonObject[i].items[j].name = "";
      }
      tmpJsonInstanceObject.credentialsData.login =
        inputJsonObject[i].items[j].login;
      tmpJsonInstanceObject.credentialsData.password =
        inputJsonObject[i].items[j].password;
        
      inputJsonObject[i].items[j].login = "";
      inputJsonObject[i].items[j].password = "";
      tmpJsonInstanceObject.credentialsData.additionalInfo = JSON.stringify(
        inputJsonObject[i].items[j]
      );
      instancesArr.push(tmpJsonInstanceObject);

      inputJsonObject[i].items[j].name = tmpJsonInstanceObject.name;
      inputJsonObject[i].items[j].login =
        tmpJsonInstanceObject.credentialsData.login;
      inputJsonObject[i].items[j].password =
        tmpJsonInstanceObject.credentialsData.password;
    }
    categoryJsonObject.name = stringifiedTmpJsonObject;
    categoryJsonObject.instances = instancesArr;
    outputJsonObject.categories.push(categoryJsonObject);
  }
  return outputJsonObject;
}

export function prettyPrint(obj) {
  console.log(JSON.stringify(obj, null, 4));
}

function encryptNewStructuredData(
  encryptedOldData,
  structuredData,
  _key,
  _salt
) {
  const delimiter = "|";
  const key = CryptoJS.SHA512(_key);
  const encMode = CryptoJS.mode.CBC;
  let iv_ = CryptoJS.lib.WordArray.random(16); 
  let salt = null;
  if (_salt !== null) {
    salt = CryptoJS.enc.Utf8.parse(_salt);
  }
  const cipherOptions = {
    iv: iv_,
    salt: salt,
    mode: encMode,
    padding: CryptoJS.pad.Pkcs7,
  };
  const arrCategories = structuredData.categories;
  let encryptedCategories = [];
  for (let i = 0; i < arrCategories.length; i++) {
    let encryptedCategoryName;
    const categoryFinded = encryptedOldData.categories.find(
      (cat) =>
        decryptInstanceName(cat.name, _key, _salt) === arrCategories[i].name
    );
    if (categoryFinded) {
      encryptedCategoryName = categoryFinded.name;
    } else {
      const encryptedCategoryNameObj = CryptoJS.AES.encrypt(
        arrCategories[i].name,
        key,
        cipherOptions
      );
      let ivBase64 = encryptedCategoryNameObj.iv.toString(CryptoJS.enc.Base64);
      encryptedCategoryName =
        encryptedCategoryNameObj.toString() + delimiter + ivBase64;
    }

    let instances = [];
    for (let j = 0; j < arrCategories[i].instances.length; j++) {
      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceNameObj = CryptoJS.AES.encrypt(
        arrCategories[i].instances[j].name,
        key,
        cipherOptions
      );
      let ivBase64 = encryptedInstanceNameObj.iv.toString(CryptoJS.enc.Base64);
      const encryptedInstanceName =
        encryptedInstanceNameObj.toString() + delimiter + ivBase64;

      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceCredentialsDataLoginObj = CryptoJS.AES.encrypt(
        arrCategories[i].instances[j].credentialsData.login,
        key,
        cipherOptions
      );
      ivBase64 = encryptedInstanceCredentialsDataLoginObj.iv.toString(
        CryptoJS.enc.Base64
      );
      const encryptedInstanceCredentialsDataLogin =
        encryptedInstanceCredentialsDataLoginObj.toString() +
        delimiter +
        ivBase64;

      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceCredentialsDataPasswordObj = CryptoJS.AES.encrypt(
        arrCategories[i].instances[j].credentialsData.password,
        key,
        cipherOptions
      );
      ivBase64 = encryptedInstanceCredentialsDataPasswordObj.iv.toString(
        CryptoJS.enc.Base64
      );
      const encryptedInstanceCredentialsDataPassword =
        encryptedInstanceCredentialsDataPasswordObj.toString() +
        delimiter +
        ivBase64;

      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceCredentialsDataAdditionalInfoObj =
        CryptoJS.AES.encrypt(
          arrCategories[i].instances[j].credentialsData.additionalInfo,
          key,
          cipherOptions
        );
      ivBase64 = encryptedInstanceCredentialsDataAdditionalInfoObj.iv.toString(
        CryptoJS.enc.Base64
      );
      const encryptedInstanceCredentialsDataAdditionalInfo =
        encryptedInstanceCredentialsDataAdditionalInfoObj.toString() +
        delimiter +
        ivBase64;

      const currentInstance = {
        name: encryptedInstanceName,
        credentialsData: {
          login: encryptedInstanceCredentialsDataLogin,
          password: encryptedInstanceCredentialsDataPassword,
          additionalInfo: encryptedInstanceCredentialsDataAdditionalInfo,
        },
      };
      instances.push(currentInstance);
    }
    const currentCategory = {
      name: encryptedCategoryName,
      instances: instances,
    };
    encryptedCategories.push(currentCategory);
  }
  iv_ = CryptoJS.lib.WordArray.random(16);
  cipherOptions.iv = iv_;
  const encryptedFlagObj = CryptoJS.AES.encrypt(
    structuredData.flag,
    key,
    cipherOptions
  );

  ivBase64 = encryptedFlagObj.iv.toString(CryptoJS.enc.Base64);
  const encryptedFlag = encryptedFlagObj.toString() + delimiter + ivBase64;

  const encryptedStructuredData = {
    categories: encryptedCategories,
    flag: encryptedFlag,
  };
  return encryptedStructuredData;
}

export function encryptStructuredData(structuredData, _key, _salt) {
  const delimiter = "|";
  const key = CryptoJS.SHA512(_key);
  const encMode = CryptoJS.mode.CBC;
  let iv_ = CryptoJS.lib.WordArray.random(16); 
  let salt = null;
  if (_salt !== null) {
    salt = CryptoJS.enc.Utf8.parse(_salt);
  }
  const cipherOptions = {
    iv: iv_,
    salt: salt,
    mode: encMode,
    padding: CryptoJS.pad.Pkcs7,
  };
  const arrCategories = structuredData.categories;
  let encryptedCategories = [];
  for (let i = 0; i < arrCategories.length; i++) {
    const encryptedCategoryNameObj = CryptoJS.AES.encrypt(
      arrCategories[i].name,
      key,
      cipherOptions
    );
    let ivBase64 = encryptedCategoryNameObj.iv.toString(CryptoJS.enc.Base64);
    const encryptedCategoryName =
      encryptedCategoryNameObj.toString() + delimiter + ivBase64;

    let instances = [];
    for (let j = 0; j < arrCategories[i].instances.length; j++) {
      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceNameObj = CryptoJS.AES.encrypt(
        arrCategories[i].instances[j].name,
        key,
        cipherOptions
      );
      let ivBase64 = encryptedInstanceNameObj.iv.toString(CryptoJS.enc.Base64);
      const encryptedInstanceName =
        encryptedInstanceNameObj.toString() + delimiter + ivBase64;

      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceCredentialsDataLoginObj = CryptoJS.AES.encrypt(
        arrCategories[i].instances[j].credentialsData.login,
        key,
        cipherOptions
      );
      ivBase64 = encryptedInstanceCredentialsDataLoginObj.iv.toString(
        CryptoJS.enc.Base64
      );
      const encryptedInstanceCredentialsDataLogin =
        encryptedInstanceCredentialsDataLoginObj.toString() +
        delimiter +
        ivBase64;

      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceCredentialsDataPasswordObj = CryptoJS.AES.encrypt(
        arrCategories[i].instances[j].credentialsData.password,
        key,
        cipherOptions
      );
      ivBase64 = encryptedInstanceCredentialsDataPasswordObj.iv.toString(
        CryptoJS.enc.Base64
      );
      const encryptedInstanceCredentialsDataPassword =
        encryptedInstanceCredentialsDataPasswordObj.toString() +
        delimiter +
        ivBase64;

      iv_ = CryptoJS.lib.WordArray.random(16);
      cipherOptions.iv = iv_;
      const encryptedInstanceCredentialsDataAdditionalInfoObj =
        CryptoJS.AES.encrypt(
          arrCategories[i].instances[j].credentialsData.additionalInfo,
          key,
          cipherOptions
        );
      ivBase64 = encryptedInstanceCredentialsDataAdditionalInfoObj.iv.toString(
        CryptoJS.enc.Base64
      );
      const encryptedInstanceCredentialsDataAdditionalInfo =
        encryptedInstanceCredentialsDataAdditionalInfoObj.toString() +
        delimiter +
        ivBase64;

      const currentInstance = {
        name: encryptedInstanceName,
        credentialsData: {
          login: encryptedInstanceCredentialsDataLogin,
          password: encryptedInstanceCredentialsDataPassword,
          additionalInfo: encryptedInstanceCredentialsDataAdditionalInfo,
        },
      };
      instances.push(currentInstance);
    }
    const currentCategory = {
      name: encryptedCategoryName,
      instances: instances,
    };
    encryptedCategories.push(currentCategory);
  }
  iv_ = CryptoJS.lib.WordArray.random(16);
  cipherOptions.iv = iv_;
  const encryptedFlagObj = CryptoJS.AES.encrypt(
    structuredData.flag,
    key,
    cipherOptions
  );

  ivBase64 = encryptedFlagObj.iv.toString(CryptoJS.enc.Base64);
  const encryptedFlag = encryptedFlagObj.toString() + delimiter + ivBase64;

  const encryptedStructuredData = {
    categories: encryptedCategories,
    flag: encryptedFlag,
  };
  return encryptedStructuredData;
}

export function decryptStructuredData(encryptedStructuredData, _key, _salt) {
  const delimiter = "|";
  const key = CryptoJS.SHA512(_key);
  const encMode = CryptoJS.mode.CBC;
  let salt = null;
  if (_salt !== null) {
    salt = CryptoJS.enc.Utf8.parse(_salt);
  }
  const cipherOptions = {
    salt: salt,
    mode: encMode,
    padding: CryptoJS.pad.Pkcs7,
  };
  const arrEncryptedCategories = encryptedStructuredData.categories;
  let decryptedCategories = [];
  for (let i = 0; i < arrEncryptedCategories.length; i++) {
    let parts = arrEncryptedCategories[i].name.split(delimiter);
    const arrEncryptedCategories_name = parts[0];
    let iv_Base64 = parts[1];
    let iv_ = CryptoJS.enc.Base64.parse(iv_Base64);
    cipherOptions.iv = iv_;
    let decryptedCategoryName = CryptoJS.AES.decrypt(
      arrEncryptedCategories_name,
      key,
      cipherOptions
    ).toString(CryptoJS.enc.Utf8);

    let instances = [];
    for (let j = 0; j < arrEncryptedCategories[i].instances.length; j++) {
      let parts = arrEncryptedCategories[i].instances[j].name.split(delimiter);
      const arrEncryptedCategories_instances_name = parts[0];
      let iv_Base64 = parts[1];
      let iv_ = CryptoJS.enc.Base64.parse(iv_Base64);
      cipherOptions.iv = iv_;
      const decryptedInstanceName = CryptoJS.AES.decrypt(
        arrEncryptedCategories_instances_name,
        key,
        cipherOptions
      ).toString(CryptoJS.enc.Utf8);

      parts =
        arrEncryptedCategories[i].instances[j].credentialsData.login.split(
          delimiter
        );
      const arrEncryptedCategories_instances_cred_data_login = parts[0];
      iv_Base64 = parts[1];
      iv_ = CryptoJS.enc.Base64.parse(iv_Base64);
      cipherOptions.iv = iv_;
      const decryptedInstanceCredentialsDataLogin = CryptoJS.AES.decrypt(
        arrEncryptedCategories_instances_cred_data_login,
        key,
        cipherOptions
      ).toString(CryptoJS.enc.Utf8);

      parts =
        arrEncryptedCategories[i].instances[j].credentialsData.password.split(
          delimiter
        );
      const arrEncryptedCategories_instances_cred_data_password = parts[0];
      iv_Base64 = parts[1];
      iv_ = CryptoJS.enc.Base64.parse(iv_Base64);
      cipherOptions.iv = iv_;
      const decryptedInstanceCredentialsDataPassword = CryptoJS.AES.decrypt(
        arrEncryptedCategories_instances_cred_data_password,
        key,
        cipherOptions
      ).toString(CryptoJS.enc.Utf8);

      parts =
        arrEncryptedCategories[i].instances[
          j
        ].credentialsData.additionalInfo.split(delimiter);
      const arrEncryptedCategories_instances_cred_data_additionalInfo =
        parts[0];
      iv_Base64 = parts[1];
      iv_ = CryptoJS.enc.Base64.parse(iv_Base64);
      cipherOptions.iv = iv_;
      const decryptedInstanceCredentialsDataAdditionalInfo =
        CryptoJS.AES.decrypt(
          arrEncryptedCategories_instances_cred_data_additionalInfo,
          key,
          cipherOptions
        ).toString(CryptoJS.enc.Utf8);

      const currentInstance = {
        name: decryptedInstanceName,
        credentialsData: {
          login: decryptedInstanceCredentialsDataLogin,
          password: decryptedInstanceCredentialsDataPassword,
          additionalInfo: decryptedInstanceCredentialsDataAdditionalInfo,
        },
      };
      instances.push(currentInstance);
    }
    const currentCategory = {
      name: decryptedCategoryName,
      instances: instances,
    };
    decryptedCategories.push(currentCategory);
  }

  let decryptedFlag = "evrica!";
  if (encryptedStructuredData.flag) {
    parts = encryptedStructuredData.flag.split(delimiter);
    const encryptedStructuredData_flag = parts[0];
    iv_Base64 = parts[1];
    iv_ = CryptoJS.enc.Base64.parse(iv_Base64);
    cipherOptions.iv = iv_;

    decryptedFlag = CryptoJS.AES.decrypt(
      encryptedStructuredData_flag,
      key,
      cipherOptions
    ).toString(CryptoJS.enc.Utf8);
  }

  const decryptedStructuredData = {
    categories: decryptedCategories,
    flag: decryptedFlag,
  };

  return decryptedStructuredData;
}
export async function downloadBlob(content, filename) {
  const fileUri = FileSystem.documentDirectory + filename;
  try {
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/octet-stream",
      dialogTitle: "Save CSV File",
    });
  } catch (error) {
  }
}
