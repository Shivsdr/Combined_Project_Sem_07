import Web3 from "web3";
const web3 = new Web3("http://localhost:8545");

// geth --http --http.corsdomain="*" --http.api web3,eth,debug,personal,net --dev
// gas: 2000000

let ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "searchedTerm",
        type: "string",
      },
    ],
    name: "SearchAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "searchedTerm",
        type: "string",
      },
    ],
    name: "SearchDeleted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_searchedTerm",
        type: "string",
      },
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "nextUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "price",
            type: "string",
          },
          {
            internalType: "string",
            name: "link",
            type: "string",
          },
          {
            internalType: "string",
            name: "image_url",
            type: "string",
          },
        ],
        internalType: "struct ProductSearchStorage.Product[]",
        name: "_products",
        type: "tuple[]",
      },
    ],
    name: "addSearchResults",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "expirationTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_searchedTerm",
        type: "string",
      },
    ],
    name: "getSearchResults",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "nextUrl",
            type: "string",
          },
          {
            internalType: "string",
            name: "price",
            type: "string",
          },
          {
            internalType: "string",
            name: "link",
            type: "string",
          },
          {
            internalType: "string",
            name: "image_url",
            type: "string",
          },
        ],
        internalType: "struct ProductSearchStorage.Product[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "searchResults",
    outputs: [
      {
        internalType: "string",
        name: "searchedTerm",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_searchedTerm",
        type: "string",
      },
    ],
    name: "searchTermExists",
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
];

let userAddress = "0x2CfdB62eC00c622a4aC637613e94459f6E5E2B7E";
let contractAddress = "0x94E6555e760ebAC0886a636D424AA21C2a8305c4";

const contract = new web3.eth.Contract(ABI, contractAddress);

// Interact with smart contract
async function addProductDetails(searchedTerm, products) {
  try {
    const gasEstimate = await contract.methods
      .addSearchResults(searchedTerm, products)
      .estimateGas({ from: userAddress });

    console.log("Estimated gas:", gasEstimate);

    const tx = await contract.methods
      .addSearchResults(searchedTerm, products)
      .send({ from: userAddress });

    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
}

async function getProductDetails(searchedTerm) {
  try {
    const products = await contract.methods
      .getSearchResults(searchedTerm)
      .call();
    return products;
  } catch (e) {
    console.log(e);

    return e;
  }
}

async function check(searchedTerm) {
  try {
    const exists = await contract.methods.searchTermExists(searchedTerm).call();

    return exists;
  } catch (e) {
    console.log(e);

    return e;
  }
}

const exampleProducts = [
  {
    title: "Sample Laptop 1",
    nextUrl: "https://example.com/laptop1",
    reviews: [
      { reviewText: "Great performance!" },
      { reviewText: "Value for money." },
    ],
    price: "1,000",
    link: "https://example.com/laptop1",
    image_url: "https://example.com/images/laptop1.jpg",
  },
  {
    title: "Sample Laptop 2",
    nextUrl: "https://example.com/laptop2",
    reviews: [
      { reviewText: "Good battery life." },
      { reviewText: "Lightweight and portable." },
    ],
    price: "1,200",
    link: "https://example.com/laptop2",
    image_url: "https://example.com/images/laptop2.jpg",
  },
];

// await check("mobile", exampleProducts);

export default { check, addProductDetails, getProductDetails };
