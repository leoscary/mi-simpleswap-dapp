// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Importa Ownable si quieres control de propietario

contract SimpleSwap is Ownable {
    // Direcciones de los tokens que este contrato puede intercambiar
    IERC20 public tokenA;
    IERC20 public tokenB;

    // Eventos para registrar acciones
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event TokensSwapped(
        address indexed sender,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    // Constructor: Establece las direcciones de los tokens al desplegar el contrato
    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        require(_tokenA != address(0) && _tokenB != address(0), "Direcciones de token invalidas");
        require(_tokenA != _tokenB, "Los tokens deben ser diferentes");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // Función para añadir liquidez al pool
    // Cualquier persona puede añadir liquidez
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        require(block.timestamp <= deadline, "addLiquidity: DEADLINE_EXPIRED");
        require(_tokenA == address(tokenA) && _tokenB == address(tokenB), "addLiquidity: Tokens incorrectos");

        // Obtener las reservas actuales del pool
        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));

        if (reserveA == 0 && reserveB == 0) {
            // Primer proveedor de liquidez
            amountA = amountADesired;
            amountB = amountBDesired;
        } else {
            // Calcular la cantidad de TokenB necesaria para la cantidad deseada de TokenA,
            // manteniendo la proporción actual del pool.
            uint256 amountBExpected = (amountADesired * reserveB) / reserveA;
            if (amountBExpected <= amountBDesired) {
                // Si la cantidad esperada de B es menor o igual a la deseada, usa amountADesired
                require(amountADesired >= amountAMin, "addLiquidity: INSUFFICIENT_A_AMOUNT");
                require(amountBExpected >= amountBMin, "addLiquidity: INSUFFICIENT_B_AMOUNT");
                amountA = amountADesired;
                amountB = amountBExpected;
            } else {
                // Si la cantidad esperada de B es mayor a la deseada, calcula la cantidad de A
                // necesaria para la cantidad deseada de B.
                uint256 amountAExpected = (amountBDesired * reserveA) / reserveB;
                require(amountAExpected >= amountAMin, "addLiquidity: INSUFFICIENT_A_AMOUNT");
                require(amountBDesired >= amountBMin, "addLiquidity: INSUFFICIENT_B_AMOUNT");
                amountA = amountAExpected;
                amountB = amountBDesired;
            }
        }

        // Transferir los tokens al contrato del swap
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        // Lógica de acuñación de tokens de liquidez (simplificada para este ejemplo)
        // En un DEX real, se acuñarían tokens de LP (Liquidity Provider)
        liquidity = amountA + amountB; // Representación simplificada de liquidez

        emit LiquidityAdded(to, amountA, amountB, liquidity);
    }

    // Función para remover liquidez del pool
    // Solo el propietario puede remover liquidez en esta implementación simplificada
    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 liquidity, // Cantidad de "tokens de liquidez" a remover
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external onlyOwner returns (uint256 amountA, uint256 amountB) {
        require(block.timestamp <= deadline, "removeLiquidity: DEADLINE_EXPIRED");
        require(_tokenA == address(tokenA) && _tokenB == address(tokenB), "removeLiquidity: Tokens incorrectos");

        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));

        // Calcular la cantidad de tokens a devolver en proporción a la liquidez removida
        // Esta es una simplificación; en un DEX real se usarían tokens de LP para calcular la proporción
        amountA = (liquidity * reserveA) / (reserveA + reserveB);
        amountB = (liquidity * reserveB) / (reserveA + reserveB);

        require(amountA >= amountAMin, "removeLiquidity: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "removeLiquidity: INSUFFICIENT_B_AMOUNT");

        // Transferir los tokens de vuelta al usuario
        tokenA.transfer(to, amountA);
        tokenB.transfer(to, amountB);

        emit LiquidityRemoved(to, amountA, amountB, liquidity);
    }

    // Función para obtener la cantidad de tokens de salida esperada
    // Utiliza el modelo de producto constante (x * y = k)
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(amountIn > 0, "amountIn must be greater than 0");
        require(reserveIn > 0 && reserveOut > 0, "Reserves must be greater than 0");

        uint256 amountInWithFee = amountIn * 997; // 0.3% de fee
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn * 1000 + amountInWithFee;
        return numerator / denominator;
    }

    // Función para intercambiar un monto exacto de tokens de entrada por tokens de salida
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path, // path[0] = tokenIn, path[1] = tokenOut
        address to,
        uint256 deadline
    ) external {
        require(path.length == 2, "Path debe tener 2 tokens");
        require(block.timestamp <= deadline, "swapExactTokensForTokens: DEADLINE_EXPIRED");

        IERC20 tokenIn = IERC20(path[0]);
        IERC20 tokenOut = IERC20(path[1]);

        require(tokenIn == tokenA || tokenIn == tokenB, "Token de entrada no soportado");
        require(tokenOut == tokenA || tokenOut == tokenB, "Token de salida no soportado");
        require(tokenIn != tokenOut, "Los tokens deben ser diferentes");

        // Transferir tokens de entrada al contrato del swap
        tokenIn.transferFrom(msg.sender, address(this), amountIn);

        // Obtener las reservas actuales después de la transferencia
        uint256 reserveIn = tokenIn.balanceOf(address(this));
        uint256 reserveOut = tokenOut.balanceOf(address(this));

        // Calcular la cantidad de salida esperada
        uint256 amountOut = getAmountOut(amountIn, reserveIn, reserveOut);

        require(amountOut >= amountOutMin, "swapExactTokensForTokens: INSUFFICIENT_OUTPUT_AMOUNT");

        // Transferir tokens de salida al destinatario
        tokenOut.transfer(to, amountOut);

        emit TokensSwapped(msg.sender, address(tokenIn), address(tokenOut), amountIn, amountOut);
    }

    // Función para obtener el precio de un token en términos de otro
    // Retorna el precio de tokenA en unidades de tokenB (multiplicado por 1e18 para decimales)
    function getPrice(address _tokenA, address _tokenB) public view returns (uint256) {
        require(_tokenA == address(tokenA) && _tokenB == address(tokenB), "getPrice: Tokens incorrectos");

        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));

        if (reserveA == 0 || reserveB == 0) {
            return 0; // No hay liquidez para calcular el precio
        }
        // Precio de TokenA en términos de TokenB, escalado por 1e18
        return (reserveB * (10 ** 18)) / reserveA;
    }

    // Funciones para obtener las reservas (balaces) de los tokens en el pool
    function getReserveA() public view returns (uint256) {
        return tokenA.balanceOf(address(this));
    }

    function getReserveB() public view returns (uint256) {
        return tokenB.balanceOf(address(this));
    }
}
