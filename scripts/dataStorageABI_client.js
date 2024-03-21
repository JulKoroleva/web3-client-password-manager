export const dataStorageABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_commissionRecipientAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_commissionInWei",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "DataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "commissionInWei",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "commissionRecipientAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "isOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "structuredDataStorage",
    outputs: [
      {
        internalType: "string",
        name: "flag",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userTokensForFreeInformationEditing",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    components: [
                      {
                        internalType: "string",
                        name: "login",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "password",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "additionalInfo",
                        type: "string",
                      },
                    ],
                    internalType: "struct DataStorage.CredentialsData",
                    name: "credentialsData",
                    type: "tuple",
                  },
                ],
                internalType: "struct DataStorage.Instances[]",
                name: "instances",
                type: "tuple[]",
              },
            ],
            internalType: "struct DataStorage.Categories[]",
            name: "categories",
            type: "tuple[]",
          },
          {
            internalType: "string",
            name: "flag",
            type: "string",
          },
        ],
        internalType: "struct DataStorage.StructedData",
        name: "_structedData",
        type: "tuple",
      },
    ],
    name: "countDataSize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    components: [
                      {
                        internalType: "string",
                        name: "login",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "password",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "additionalInfo",
                        type: "string",
                      },
                    ],
                    internalType: "struct DataStorage.CredentialsData",
                    name: "credentialsData",
                    type: "tuple",
                  },
                ],
                internalType: "struct DataStorage.Instances[]",
                name: "instances",
                type: "tuple[]",
              },
            ],
            internalType: "struct DataStorage.Categories[]",
            name: "categories",
            type: "tuple[]",
          },
          {
            internalType: "string",
            name: "flag",
            type: "string",
          },
        ],
        internalType: "struct DataStorage.StructedData",
        name: "_structedData",
        type: "tuple",
      },
    ],
    name: "createOrUpdateData",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "instance",
            type: "string",
          },
        ],
        internalType: "struct DataStorage.DeleteData[]",
        name: "_elementsForDeleteFromBlockchain",
        type: "tuple[]",
      },
    ],
    name: "deleteData",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deleteAllEmptyElements",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getData",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    components: [
                      {
                        internalType: "string",
                        name: "login",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "password",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "additionalInfo",
                        type: "string",
                      },
                    ],
                    internalType: "struct DataStorage.CredentialsData",
                    name: "credentialsData",
                    type: "tuple",
                  },
                ],
                internalType: "struct DataStorage.Instances[]",
                name: "instances",
                type: "tuple[]",
              },
            ],
            internalType: "struct DataStorage.Categories[]",
            name: "categories",
            type: "tuple[]",
          },
          {
            internalType: "string",
            name: "flag",
            type: "string",
          },
        ],
        internalType: "struct DataStorage.StructedData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "addTokensForFreeInformationEditing",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "setCommissionRecipientAddress",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newCommissionInWeiValue",
        type: "uint256",
      },
    ],
    name: "setCommissionInWei",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCommissionInWei",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getTokensForFreeInformationEditing",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getBalanceUser",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getMyBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
