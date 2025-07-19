import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const LEOSCARY_TOKEN_A_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const LEOSCARY_TOKEN_B_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const SIMPLE_SWAP_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenA",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_tokenB",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }
        ],
        "name": "LiquidityAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }
        ],
        "name": "LiquidityRemoved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "tokenIn",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "tokenOut",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }
        ],
        "name": "TokensSwapped",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenA",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_tokenB",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amountADesired",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountBDesired",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountAMin",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountBMin",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "addLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reserveOut",
                "type": "uint256"
            }
        ],
        "name": "getAmountOut",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenA",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_tokenB",
                "type": "address"
            }
        ],
        "name": "getPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getReserveA",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getReserveB",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenA",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_tokenB",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "liquidity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountAMin",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountBMin",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "removeLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountB",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amountOutMin",
                "type": "uint256"
            },
            {
                "internalType": "address[]",
                "name": "path",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenA",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenB",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const LEOSCARY_TOKEN_A_ADDRESS = "0x6aa23b520F62bedBAf17543199011F70e4bcAf22";
const LEOSCARY_TOKEN_B_ADDRESS = "0x8118486Dfd922bd3D17451364a5AEE3D8C856d60";
const SIMPLE_SWAP_ADDRESS = "0x337757ba1aC09FAC8fe0C012E69751471a7bd675";


function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [tokenAContract, setTokenAContract] = useState(null);
    const [tokenBContract, setTokenBContract] = useState(null);
    const [simpleSwapContract, setSimpleSwapContract] = useState(null);

    const [tokenABalance, setTokenABalance] = useState('0');
    const [tokenBBalance, setTokenBBalance] = useState('0');
    const [swapTokenAAmount, setSwapTokenAAmount] = useState('');
    const [swapTokenBAmount, setSwapTokenBAmount] = useState('');
    const [liquidityTokenAAmount, setLiquidityTokenAAmount] = useState('');
    const [liquidityTokenBAmount, setLiquidityTokenBAmount] = useState('');
    const [swapPrice, setSwapPrice] = useState('0');
    const [reserveA, setReserveA] = useState('0');
    const [reserveB, setReserveB] = useState('0');
    const [message, setMessage] = useState('');

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);
                const signer = await provider.getSigner();
                setSigner(signer);
                const address = await signer.getAddress();
                setUserAddress(address);
                setMessage('Billetera conectada exitosamente.');

                const tokenA = new ethers.Contract(LEOSCARY_TOKEN_A_ADDRESS, LEOSCARY_TOKEN_A_ABI, signer);
                const tokenB = new ethers.Contract(LEOSCARY_TOKEN_B_ADDRESS, LEOSCARY_TOKEN_B_ABI, signer);
                const swap = new ethers.Contract(SIMPLE_SWAP_ADDRESS, SIMPLE_SWAP_ABI, signer);
                setTokenAContract(tokenA);
                setTokenBContract(tokenB);
                setSimpleSwapContract(swap);

                await fetchBalancesAndReserves(tokenA, tokenB, swap, address);

                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        setUserAddress(accounts[0]);
                        fetchBalancesAndReserves(tokenA, tokenB, swap, accounts[0]);
                    } else {
                        setUserAddress('');
                        setMessage('Billetera desconectada.');
                    }
                });

                window.ethereum.on('chainChanged', (chainId) => {
                    window.location.reload();
                });

            } catch (error) {
                console.error("Error al conectar la billetera:", error);
                setMessage(`Error al conectar la billetera: ${error.message}`);
            }
        } else {
            setMessage('MetaMask no detectado. Por favor, instala MetaMask.');
        }
    };

    const fetchBalancesAndReserves = async (tokenA, tokenB, swap, address) => {
        if (!tokenA || !tokenB || !swap || !address) return;
        try {
            const balanceA = await tokenA.balanceOf(address);
            setTokenABalance(ethers.formatUnits(balanceA, 18));

            const balanceB = await tokenB.balanceOf(address);
            setTokenBBalance(ethers.formatUnits(balanceB, 18));

            const reserveA = await swap.getReserveA();
            setReserveA(ethers.formatUnits(reserveA, 18));

            const reserveB = await swap.getReserveB();
            setReserveB(ethers.formatUnits(reserveB, 18));

            if (reserveA > 0 && reserveB > 0) {
                const price = await swap.getPrice(tokenA.target, tokenB.target);
                setSwapPrice(ethers.formatUnits(price, 18));
            } else {
                setSwapPrice('0');
            }

        } catch (error) {
            console.error("Error al obtener balances/reservas:", error);
            setMessage(`Error al cargar datos: ${error.message}`);
        }
    };

    useEffect(() => {
        if (tokenAContract && tokenBContract && simpleSwapContract && userAddress) {
            fetchBalancesAndReserves(tokenAContract, tokenBContract, simpleSwapContract, userAddress);
        }
    }, [tokenAContract, tokenBContract, simpleSwapContract, userAddress]);


    const handleAddLiquidity = async () => {
        if (!signer || !tokenAContract || !tokenBContract || !simpleSwapContract) {
            setMessage('Por favor, conecta tu billetera primero.');
            return;
        }
        if (!liquidityTokenAAmount || parseFloat(liquidityTokenAAmount) <= 0 || parseFloat(liquidityTokenBAmount) <= 0) {
            setMessage('Ingresa cantidades válidas para añadir liquidez.');
            return;
        }

        setMessage('Añadiendo liquidez...');
        try {
            const amountA = ethers.parseUnits(liquidityTokenAAmount, 18);
            const amountB = ethers.parseUnits(liquidityTokenBAmount, 18);
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

            const approveTxA = await tokenAContract.approve(simpleSwapContract.target, amountA);
            await approveTxA.wait();
            setMessage(`Aprobación de TokenA enviada: ${approveTxA.hash}`);

            const approveTxB = await tokenBContract.approve(simpleSwapContract.target, amountB);
            await approveTxB.wait();
            setMessage(`Aprobación de TokenB enviada: ${approveTxB.hash}`);

            const addLiquidityTx = await simpleSwapContract.addLiquidity(
                tokenAContract.target,
                tokenBContract.target,
                amountA,
                amountB,
                0,
                0,
                userAddress,
                deadline
            );
            await addLiquidityTx.wait();
            setMessage(`Liquidez añadida exitosamente: ${addLiquidityTx.hash}`);
            await fetchBalancesAndReserves(tokenAContract, tokenBContract, simpleSwapContract, userAddress);
            setLiquidityTokenAAmount('');
            setLiquidityTokenBAmount('');
        } catch (error) {
            console.error("Error al añadir liquidez:", error);
            setMessage(`Error al añadir liquidez: ${error.message}`);
        }
    };

    const handleSwap = async (tokenInSymbol) => {
        if (!signer || !tokenAContract || !tokenBContract || !simpleSwapContract) {
            setMessage('Por favor, conecta tu billetera primero.');
            return;
        }

        let amountIn;
        let tokenInContract;
        let tokenOutContract;

        if (tokenInSymbol === 'LTA') {
            if (!swapTokenAAmount || parseFloat(swapTokenAAmount) <= 0) {
                setMessage('Ingresa una cantidad válida de TokenA para el swap.');
                return;
            }
            amountIn = ethers.parseUnits(swapTokenAAmount, 18);
            tokenInContract = tokenAContract;
            tokenOutContract = tokenBContract;
        } else {
            if (!swapTokenBAmount || parseFloat(swapTokenBAmount) <= 0) {
                setMessage('Ingresa una cantidad válida de TokenB para el swap.');
                return;
            }
            amountIn = ethers.parseUnits(swapTokenBAmount, 18);
            tokenInContract = tokenBContract;
            tokenOutContract = tokenAContract;
        }

        setMessage(`Realizando swap de ${tokenInSymbol}...`);
        try {
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
            const path = [tokenInContract.target, tokenOutContract.target];

            const approveTx = await tokenInContract.approve(simpleSwapContract.target, amountIn);
            await approveTx.wait();
            setMessage(`Aprobación de ${tokenInSymbol} enviada: ${approveTx.hash}`);

            const estimatedAmountOut = await simpleSwapContract.getAmountOut(
                amountIn,
                await tokenInContract.balanceOf(simpleSwapContract.target),
                await tokenOutContract.balanceOf(simpleSwapContract.target)
            );
            const amountOutMin = (estimatedAmountOut * BigInt(95)) / BigInt(100);

            const swapTx = await simpleSwapContract.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                userAddress,
                deadline
            );
            await swapTx.wait();
            setMessage(`Swap exitoso: ${swapTx.hash}`);
            await fetchBalancesAndReserves(tokenAContract, tokenBContract, simpleSwapContract, userAddress);
            setSwapTokenAAmount('');
            setSwapTokenBAmount('');
        } catch (error) {
            console.error("Error al realizar el swap:", error);
            setMessage(`Error al realizar el swap: ${error.message}`);
        }
    };

    const copyAddressToClipboard = () => {
        if (userAddress) {
            document.execCommand('copy');
            navigator.clipboard.writeText(userAddress).then(() => {
                setMessage('Dirección copiada al portapapeles.');
            }).catch(err => {
                console.error('Error al copiar:', err);
                setMessage('Error al copiar la dirección.');
            });
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-800 to-blue-900 text-white font-inter flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl font-extrabold mb-8 text-center drop-shadow-lg">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-400">
                    SimpleSwap DEX
                </span>
            </h1>

            {!userAddress ? (
                <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Conectar Billetera
                </button>
            ) : (
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8 w-full max-w-md border border-purple-700">
                    <p className="text-lg mb-2 flex items-center justify-between">
                        <span className="font-semibold">Billetera Conectada:</span>
                        <span className="flex items-center">
                            {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                            <button
                                onClick={copyAddressToClipboard}
                                className="ml-2 p-1 rounded-full hover:bg-gray-700 transition duration-200"
                                title="Copiar dirección"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6zM5 9a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                </svg>
                            </button>
                        </span>
                    </p>
                    <p className="text-lg flex items-center justify-between">
                        <span className="font-semibold">Balance TokenA:</span>
                        <span className="text-green-400">{tokenABalance} LTA</span>
                    </p>
                    <p className="text-lg flex items-center justify-between">
                        <span className="font-semibold">Balance TokenB:</span>
                        <span className="text-green-400">{tokenBBalance} LTB</span>
                    </p>
                </div>
            )}

            {message && (
                <div className="bg-yellow-600 text-white p-3 rounded-lg shadow-md mb-6 w-full max-w-md text-center">
                    {message}
                </div>
            )}

            {userAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-blue-700">
                        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Intercambiar Tokens</h2>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="swapA">
                                Cantidad de TokenA
                            </label>
                            <input
                                type="number"
                                id="swapA"
                                value={swapTokenAAmount}
                                onChange={(e) => setSwapTokenAAmount(e.target.value)}
                                placeholder="0.0"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <button
                            onClick={() => handleSwap('LTA')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 mb-4"
                        >
                            Swap TokenA por TokenB
                        </button>

                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="swapB">
                                Cantidad de TokenB
                            </label>
                            <input
                                type="number"
                                id="swapB"
                                value={swapTokenBAmount}
                                onChange={(e) => setSwapTokenBAmount(e.target.value)}
                                placeholder="0.0"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <button
                            onClick={() => handleSwap('LTB')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Swap TokenB por TokenA
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-xl font-semibold text-pink-400">
                                Precio Actual (LTA/LTB): {parseFloat(swapPrice).toFixed(6)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-green-700">
                        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Añadir Liquidez</h2>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="liquidityA">
                                Cantidad de TokenA
                            </label>
                            <input
                                type="number"
                                id="liquidityA"
                                value={liquidityTokenAAmount}
                                onChange={(e) => setLiquidityTokenAAmount(e.target.value)}
                                placeholder="0.0"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="liquidityB">
                                Cantidad de TokenB
                            </label>
                            <input
                                type="number"
                                id="liquidityB"
                                value={liquidityTokenBAmount}
                                onChange={(e) => setLiquidityTokenBAmount(e.target.value)}
                                placeholder="0.0"
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <button
                            onClick={handleAddLiquidity}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                        >
                            Añadir Liquidez
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-xl font-semibold text-yellow-400">
                                Reserva TokenA: {parseFloat(reserveA).toFixed(2)} LTA
                            </p>
                            <p className="text-xl font-semibold text-yellow-400">
                                Reserva TokenB: {parseFloat(reserveB).toFixed(2)} LTB
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-12 text-gray-400 text-sm text-center">
                <p>&copy; 2025 SimpleSwap DEX. Todos los derechos reservados.</p>
                <p>Construido con React, Tailwind CSS y Ethers.js</p>
            </footer>
        </div>
    );
}

export default App;
