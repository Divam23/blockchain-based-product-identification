import { ethers } from "ethers";
import ProductRegistryABI from "../client/src/abi/ProductRegistry.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; 
const productRegistry = new ethers.Contract(contractAddress, ProductRegistryABI.abi, signer);

export { provider, signer, productRegistry };
