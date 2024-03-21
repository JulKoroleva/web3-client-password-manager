/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import Web3 from "../web3.js";
import { dataStorageABI } from "./dataStorageABI_client.js";

import store from "../store/store.js";

const gasLimitForEstimationOperations = 9999999999;

let web3;
let nodeUrl;

export async function connectToNode() {
  nodeUrl = store.getState().items.nodeUrl;
  web3 = new Web3(nodeUrl); 
  const result = await checkNodeConnection();
  return result;
}

export async function checkNodeConnection() {
  try {
    const isListening = await web3.eth.net.isListening();
    return true;
  } catch (error) {
    console.error(`Error checking node connection: ${error.message}`);
    return false;
  }
}
const contractABI = dataStorageABI;

export async function getPureDataSize(data) {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  const paylableDataSize = await dataStorageContract.methods
    .countDataSize(data)
    .call();
  return parseInt(paylableDataSize);
}

export async function getMyBalance() {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  const data = await dataStorageContract.methods
    .getMyBalance()
    .call({ from: store.getState().items.userAddress });
  return parseInt(data);
}
export async function estimateGasSizeOld(newData) {
  const currentCommissionInWei = await dataStorageContract.methods
    .getCommissionInWei()
    .call();

  const paylableDataSize = await await dataStorageContract.methods
    .countDataSize(newData)
    .call();

  const numberWei = paylableDataSize * currentCommissionInWei;
  const weiAmountToSend = web3.utils.toWei(numberWei.toString(), "wei");

  const gasEstimate = await dataStorageContract.methods
    .createOrUpdateData(newData)
    .estimateGas({
      from: store.getState().items.userAddress,
      value: weiAmountToSend,
    });
  return gasEstimate;
}

export async function getPayableDataSize(dataSize) {
  var amountTokens = await getUserTokenAmount();

  var paylableDataSize;
  if (dataSize > amountTokens) {
    paylableDataSize = dataSize - amountTokens;
  } else {
    paylableDataSize = 0;
  }
  return paylableDataSize;
}

export async function estimateGasSize(newData) {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  var currentCommissionInWei = await dataStorageContract.methods
    .getCommissionInWei()
    .call();
  currentCommissionInWei = parseInt(currentCommissionInWei);

  const dataSize = await dataStorageContract.methods
    .countDataSize(newData)
    .call();

  if (dataSize == 0) {
    return 0;
  }

  const payableDataSize = await getPayableDataSize(dataSize);

  const numberWei = payableDataSize * currentCommissionInWei;
  const weiAmountToSend = web3.utils.toWei(numberWei.toString(), "wei");

  const gasEstimate = await dataStorageContract.methods
    .createOrUpdateData(newData)
    .estimateGas({
      from: store.getState().items.userAddress,
      value: weiAmountToSend,
      gas: gasLimitForEstimationOperations,
      value: weiAmountToSend,
    });
  return parseInt(gasEstimate);
}

export async function estimateGasSizeDeleteData(dataForDelete) {
  if (dataForDelete.length === 0) {
    return 0;
  }
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );

  const gasEstimate = await dataStorageContract.methods
    .deleteData(dataForDelete)
    .estimateGas({
      from: store.getState().items.userAddress,
      gas: gasLimitForEstimationOperations,
    });
  return parseInt(gasEstimate);
}

export async function estimateWei(newData) {
  const gasEstimation = await estimateGasSize(newData);
  const gasPrice = await web3.eth.getGasPrice();
  
  const weiCost = gasEstimation * gasPrice;
  return parseInt(weiCost.toString());
}

export async function deleteData(elementsForDeleteFromBlockchain) {
  try {
    const userAddress = store.getState().items.userAddress; 
    const privateKey = store.getState().items.privateKey; 
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = store.getState().items.transactionGasLimit;

    const nonce = await web3.eth.getTransactionCount(userAddress);

    const dataStorageContract = new web3.eth.Contract(
      contractABI,
      store.getState().items.contractAddress
    );
    const txObject = dataStorageContract.methods.deleteData(
      elementsForDeleteFromBlockchain
    );
    const txData = txObject.encodeABI();

    const tx = {
      from: userAddress,
      to: store.getState().items.contractAddress,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: txData,
      nonce: nonce,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    if (!receipt.status) {
      return false;
    } else {
      return true;
    }
  } catch (exception) {
    return false;
  }
}

export async function updateData(newData) {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  try {
    const userAddress = store.getState().items.userAddress; 
    const privateKey = store.getState().items.privateKey; 
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = store.getState().items.transactionGasLimit;

    const nonce = await web3.eth.getTransactionCount(userAddress);

    const txObject = dataStorageContract.methods.createOrUpdateData(newData);
    const txData = txObject.encodeABI();

    const currentCommissionInWei = await dataStorageContract.methods
      .getCommissionInWei()
      .call();
    const paylableDataSize = await await dataStorageContract.methods
      .countDataSize(newData)
      .call();

    const numberWei = paylableDataSize * currentCommissionInWei;
    const weiAmountToSend = web3.utils.toWei(numberWei.toString(), "wei");

    const tx = {
      from: userAddress,
      to: store.getState().items.contractAddress,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: txData,
      nonce: nonce,
      value: weiAmountToSend,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    if (!receipt.status) {
      return false;
    } else {
      return true;
    }
  } catch (exception) {
    return false;
  }
}

export async function updateCommissionSize(newCommissionSize) {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = store.getState().items.transactionGasLimit;

    const nonce = await web3.eth.getTransactionCount(
      store.getState().items.userAddress
    );

    const txObject =
      dataStorageContract.methods.setCommissionInWei(newCommissionSize);
    const txData = txObject.encodeABI();

    const tx = {
      from: store.getState().items.userAddress,
      to: store.getState().items.contractAddress,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: txData,
      nonce: nonce,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      store.getState().items.privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    if (!receipt.status) {
      return false;
    } else {
      return true;
    }
  } catch (exception) {
    return false;
  }
}

export async function updateCommissionRecipientAddress(
  newCommissionRecipientAddress
) {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = store.getState().items.transactionGasLimit; 

    const nonce = await web3.eth.getTransactionCount(
      store.getState().items.userAddress
    );

    const txObject = dataStorageContract.methods.setCommissionRecipientAddress(
      newCommissionRecipientAddress
    );
    const txData = txObject.encodeABI();

    const tx = {
      from: store.getState().items.userAddress,
      to: store.getState().items.contractAddress,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: txData,
      nonce: nonce,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      store.getState().items.privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    if (!receipt.status) {
      return false;
    } else {
      return true;
    }
  } catch (exception) {
    return false;
  }
}

export async function addTokensForUserAddress(
  recipientUserAddress,
  amountTokens
) {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = store.getState().items.transactionGasLimit; 

    const nonce = await web3.eth.getTransactionCount(
      store.getState().items.userAddress
    );

    const txObject =
      dataStorageContract.methods.addTokensForFreeInformationEditing(
        recipientUserAddress,
        amountTokens
      );
    const txData = txObject.encodeABI();

    const tx = {
      from: store.getState().items.userAddress,
      to: store.getState().items.contractAddress,
      gas: gasLimit,
      gasPrice: gasPrice,
      data: txData,
      nonce: nonce,
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      store.getState().items.privateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    if (!receipt.status) {
      return false;
    } else {
      return true;
    }
  } catch (exception) {
    return false;
  }
}

export async function getData() {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  const userAddress = store.getState().items.userAddress; 
  const data = await dataStorageContract.methods
    .getData()
    .call({ from: userAddress });
  return data;
}

export async function getCurrentCommissionSize() {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  const currentCommissionSize = await dataStorageContract.methods
    .getCommissionInWei()
    .call({ from: store.getState().items.userAddress });
  return currentCommissionSize;
}

export async function getUserTokenAmount() {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  const currenttokensAmount = await dataStorageContract.methods
    .getTokensForFreeInformationEditing(store.getState().items.userAddress)
    .call({ from: store.getState().items.userAddress });
  return parseInt(currenttokensAmount);
}

export async function isUserOwnerSmartContract() {
  const ownwer = await getOwnerSmartContractAddress();
  if (ownwer !== "") {
    if (
      store.getState().items.userAddress.toLowerCase() === ownwer.toLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function getOwnerSmartContractAddress() {
  try {
    const dataStorageContract = new web3.eth.Contract(
      contractABI,
      store.getState().items.contractAddress
    );
    const owner = await dataStorageContract.methods.owner().call();
    return owner;
  } catch (error) {
    return "";
  }
}

export function verifyKeyPair(publicKey, privateKey) {
  try {
    const message = "Hello, world!";

    const signature = web3.eth.accounts.sign(message, privateKey).signature;

    const recoveredPublicKey = web3.eth.accounts.recover(message, signature);

    return recoveredPublicKey.toLowerCase() === publicKey.toLowerCase();
  } catch (error) {
    return false;
  }
}

export async function getCommissionRecipientAddress() {
  const dataStorageContract = new web3.eth.Contract(
    contractABI,
    store.getState().items.contractAddress
  );
  try {
    const result = await dataStorageContract.methods
      .commissionRecipientAddress()
      .call();
    return result;
  } catch (error) {
    return "";
  }
}
