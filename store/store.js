/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

export const initialState = {
  masterPassword: "",
  loadingStatus: false,
  hasEncryptedPublicPrivetKeysLocalData: false,
  isAuthorized: false,
  userAddress: "",
  privateKey: "",
  contractAddress: "",
  networkName: "",
  nodeUrl: "",
  blockGasLimit: 6721975,
  transactionGasLimit: 5000000,
  data: [
    {
      category: "Social Media",
      categoryName: "Социальные медиа",
      categoryIcon: "chatbubbles-outline",
      categoryIconColor: "#000000",
      items: [],
    },
    {
      category: "Applications",
      categoryName: "Приложения",
      categoryIcon: "rocket-outline",
      categoryIconColor: "#000000",
      items: [],
    },
    {
      category: "Websites",
      categoryName: "Сайты",
      categoryIcon: "globe-outline",
      categoryIconColor: "#000000",
      items: [],
    },
    {
      category: "Bank cards",
      categoryName: "Банковские карты",
      categoryIcon: "cash-outline",
      categoryIconColor: "#000000",
      items: [],
    },
  ],
  defaultData: [
    {
      category: "Social Media",
      categoryName: "Социальные медиа",
      categoryIcon: "chatbubbles-outline",
      categoryIconColor: "#000000",
      items: [],
    },
    {
      category: "Applications",
      categoryName: "Приложения",
      categoryIcon: "rocket-outline",
      categoryIconColor: "#000000",
      items: [],
    },
    {
      category: "Websites",
      categoryName: "Сайты",
      categoryIcon: "globe-outline",
      categoryIconColor: "#000000",
      items: [],
    },
    {
      category: "Bank cards",
      categoryName: "Банковские карты",
      categoryIcon: "cash-outline",
      categoryIconColor: "#000000",
      items: [],
    },
  ],
  walletList: [],
  currentWallet: 0,
  allUserRoutes: [],
  walletErrorStatus: true,
  isAdmin: true,
  userBalance: "",
  userTokens: "",
  currentComission: "",
};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DOWNLOAD_DATA_FROM_BLOCKCHAIN":
      const { blockchainData } = action.payload;
      return {
        ...state,
        data: blockchainData,
      };
    case "ADD":
      const { category, item } = action.payload;
      const newData = state.data.map((categoryData) =>
        categoryData.category === category
          ? { ...categoryData, items: [...categoryData.items, item] }
          : categoryData
      );
      return { ...state, data: newData };
    case "DELETE":
      const { id: deleteItemId } = action.payload;
      const updatedData = state.data.map((categoryData) => ({
        ...categoryData,
        items: categoryData.items.filter((item) => item.id !== deleteItemId),
      }));
      return { ...state, data: updatedData };
    case "EDIT_PASSWORD":
      const { editableData } = action.payload;
      const { id, password, name, login, url, cv, owner, number, date } =
        editableData;

      const newPasswordsData = state.data.map((categoryData) => ({
        ...categoryData,
        items: categoryData.items.map((item) =>
          item.id === id
            ? {
                ...item,
                password: password !== undefined ? password : item.password,
                name: name !== undefined ? name : item.name,
                login: login !== undefined ? login : item.login,
                url: url !== undefined ? url : null,
                cv: cv !== undefined ? cv : null,
                owner: owner !== undefined ? owner : null,
                number: number !== undefined ? number : null,
                date: date !== undefined ? date : null,
              }
            : item
        ),
      }));

      return { ...state, data: newPasswordsData };
    case "IMPORT":
      const { importedData } = action.payload;
      const updatedWebsitesData = state.data.map((categoryData) =>
        categoryData.category === "Websites"
          ? { ...categoryData, items: [...categoryData.items, ...importedData] }
          : categoryData
      );
      return { ...state, data: updatedWebsitesData };
    case "ADD_CATEGORY":
      const { newCategory, categoryIcon, categoryIconColor, items } =
        action.payload;
      const newCategoryData = {
        category: newCategory,
        categoryIcon: categoryIcon,
        categoryIconColor: categoryIconColor,
        items,
      };
      return {
        ...state,
        data: [...state.data, newCategoryData],
      };
    case "CHECK_DATA":
      const { isExisted } = action.payload;
      return {
        ...state,
        hasEncryptedPublicPrivetKeysLocalData: isExisted,
      };
    case "REMOVE_WALLET_LIST":
      return {
        ...state,
        walletList: [],
      };
    case "ADD_NEW_WALLET":
      const newWallet = action.payload;
      return {
        ...state,
        walletList: [...state.walletList, newWallet],
      };
    case "SET_LOCAL_WALLET":
      const localWallet = action.payload;
      return {
        ...state,
        walletList: localWallet,
      };
    case "SET_CURRENT_WALLET_INDEX":
      const index = action.payload;
      return {
        ...state,
        currentWallet: index,
      };
    case "SET_ALL_WALLET":
      const allWalletData = action.payload;
      return {
        ...state,
        allUserRoutes: allWalletData,
      };
    case "SET_LOCAL_DATA":
      const { privateKey, userAddress, contractAddress, networkName, nodeUrl } =
        action.payload;
      return {
        ...state,
        userAddress: userAddress,
        privateKey: privateKey,
        networkName: networkName,
        contractAddress: contractAddress,
        nodeUrl: nodeUrl,
        isAuthorized: true,
      };
    case "SET_MASTER_KEY":
      const { key } = action.payload;
      return {
        ...state,
        masterPassword: key,
      };
    case "SET_NETWORK":
      const { network } = action.payload;
      return {
        ...state,
        currentNetwork: network,
      };
    case "SET_USER_BALANCE":
      const { balance } = action.payload;
      return {
        ...state,
        userBalance: balance,
      };
    case "SET_USER_TOKENS":
      const { tokens } = action.payload;
      return {
        ...state,
        userTokens: tokens,
      };
    case "SET_CURRENT_COMISSION":
      const { comission } = action.payload;
      return {
        ...state,
        currentComission: comission,
      };
    case "LOADING_STATUS":
      const { isLoading } = action.payload;
      return {
        ...state,
        loadingStatus: isLoading,
      };
    case "SET_WALLET_STATUS":
      const walletErrorStatus = action.payload;
      return {
        ...state,
        walletErrorStatus: walletErrorStatus,
      };
    case "SET_ADMIN_STATUS":
      const isAdmin = action.payload;
      return {
        ...state,
        isAdmin: isAdmin,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  items: itemsReducer,
});

const store = createStore(rootReducer);

export default store;
