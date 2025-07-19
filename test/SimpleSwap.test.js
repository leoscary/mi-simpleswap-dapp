const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSwap", function () {
  let SimpleSwap, simpleSwap;
  let LeoscaryTokenA, tokenA;
  let LeoscaryTokenB, tokenB;
  let owner, addr1, addr2;

  // Helper para convertir a unidades de wei (con 18 decimales por defecto)
  const toWei = (amount, decimals = 18) => ethers.parseUnits(amount.toString(), decimals);
  // Helper para convertir de wei a unidades legibles
  const fromWei = (amount, decimals = 18) => ethers.formatUnits(amount.toString(), decimals);

  beforeEach(async function () {
    // Obtener las cuentas de prueba de Hardhat
    [owner, addr1, addr2] = await ethers.getSigners();

    // Desplegar LeoscaryTokenA
    LeoscaryTokenA = await ethers.getContractFactory("LeoscaryTokenA");
    tokenA = await LeoscaryTokenA.deploy();

    // Desplegar LeoscaryTokenB
    LeoscaryTokenB = await ethers.getContractFactory("LeoscaryTokenB");
    tokenB = await LeoscaryTokenB.deploy();

    // Desplegar SimpleSwap con las direcciones de los tokens recién desplegados
    SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    simpleSwap = await SimpleSwap.deploy(tokenA.target, tokenB.target);

    // --- Provisión de Liquidez Inicial para el Swap ---
    // Mintear tokens a la cuenta del owner (ya se hace en el constructor de los tokens)
    // Aprobar que SimpleSwap pueda tomar tokens del owner
    const initialLiquidityAmount = toWei(1000); // 1000 tokens para liquidez inicial

    await tokenA.connect(owner).approve(simpleSwap.target, initialLiquidityAmount);
    await tokenB.connect(owner).approve(simpleSwap.target, initialLiquidityAmount);

    // Añadir liquidez inicial al pool de SimpleSwap
    await simpleSwap.connect(owner).addLiquidity(
      tokenA.target,
      tokenB.target,
      initialLiquidityAmount,
      initialLiquidityAmount,
      initialLiquidityAmount, // amountAMin
      initialLiquidityAmount, // amountBMin
      owner.address,
      Math.floor(Date.now() / 1000) + 60 * 20 // Deadline: 20 minutos en el futuro
    );
  });

  describe("Deployment", function () {
    it("Should set the right token addresses", async function () {
      expect(await simpleSwap.tokenA()).to.equal(tokenA.target);
      expect(await simpleSwap.tokenB()).to.equal(tokenB.target);
    });

    it("Should set the right owner", async function () {
      expect(await simpleSwap.owner()).to.equal(owner.address);
    });
  });

  describe("Liquidity", function () {
    it("Should allow adding liquidity", async function () {
      const amountA = toWei(100);
      const amountB = toWei(100);

      // Aprobar tokens para la adición de liquidez
      await tokenA.connect(addr1).approve(simpleSwap.target, amountA);
      await tokenB.connect(addr1).approve(simpleSwap.target, amountB);

      // Transferir tokens a addr1 para que tenga saldo para añadir liquidez
      await tokenA.transfer(addr1.address, amountA);
      await tokenB.transfer(addr1.address, amountB);

      // Añadir liquidez
      await expect(simpleSwap.connect(addr1).addLiquidity(
        tokenA.target,
        tokenB.target,
        amountA,
        amountB,
        amountA,
        amountB,
        addr1.address,
        Math.floor(Date.now() / 1000) + 60 * 20
      )).to.emit(simpleSwap, "LiquidityAdded"); // Verifica que el evento se emita

      // Verificar que los balances del swap aumentaron
      const reserveA = await tokenA.balanceOf(simpleSwap.target);
      const reserveB = await tokenB.balanceOf(simpleSwap.target);
      // CORRECCIÓN 1: Convertir a número para closeTo
      expect(parseFloat(fromWei(reserveA))).to.be.closeTo(1100, 0.001); // 1000 inicial + 100
      expect(parseFloat(fromWei(reserveB))).to.be.closeTo(1100, 0.001); // 1000 inicial + 100
    });

    it("Should allow removing liquidity by owner", async function () {
      // Obtener las reservas actuales del swap
      const initialReserveA = await tokenA.balanceOf(simpleSwap.target);
      const initialReserveB = await tokenB.balanceOf(simpleSwap.target);

      // Calcular una cantidad de liquidez a remover (simplificado)
      // En un DEX real, esto sería basado en tokens de LP
      const liquidityToRemove = toWei(50); // Remover una pequeña cantidad de liquidez

      // Remover liquidez (solo el owner puede en esta implementación)
      await expect(simpleSwap.connect(owner).removeLiquidity(
        tokenA.target,
        tokenB.target,
        liquidityToRemove,
        toWei(0), // amountAMin
        toWei(0), // amountBMin
        owner.address,
        Math.floor(Date.now() / 1000) + 60 * 20
      )).to.emit(simpleSwap, "LiquidityRemoved"); // Verifica que el evento se emita

      // Verificar que los balances del swap disminuyeron
      const finalReserveA = await tokenA.balanceOf(simpleSwap.target);
      const finalReserveB = await tokenB.balanceOf(simpleSwap.target);
      expect(finalReserveA).to.be.lt(initialReserveA);
      expect(finalReserveB).to.be.lt(initialReserveB);
    });

    it("Should not allow removing liquidity by non-owner", async function () {
      const liquidityToRemove = toWei(10);
      await expect(simpleSwap.connect(addr1).removeLiquidity(
        tokenA.target,
        tokenB.target,
        liquidityToRemove,
        toWei(0),
        toWei(0),
        addr1.address,
        Math.floor(Date.now() / 1000) + 60 * 20
      // CORRECCIÓN 2: Usar revertedWithCustomError para Ownable
      )).to.be.revertedWithCustomError(simpleSwap, "OwnableUnauthorizedAccount");
    });
  });

  describe("Swapping", function () {
    it("Should swap TokenA for TokenB", async function () {
      const swapAmountA = toWei(10);
      const initialBalanceB_addr1 = await tokenB.balanceOf(addr1.address);

      // Transferir tokens A a addr1 para que tenga saldo para el swap
      await tokenA.transfer(addr1.address, swapAmountA);
      // Aprobar que SimpleSwap pueda tomar tokens A de addr1
      await tokenA.connect(addr1).approve(simpleSwap.target, swapAmountA);

      const path = [tokenA.target, tokenB.target];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Obtener la cantidad de salida esperada (para el amountOutMin)
      const reserveA_before_swap = await tokenA.balanceOf(simpleSwap.target);
      const reserveB_before_swap = await tokenB.balanceOf(simpleSwap.target);
      const expectedAmountOut = await simpleSwap.getAmountOut(swapAmountA, reserveA_before_swap, reserveB_before_swap);
      // CORRECCIÓN 3: Usar aritmética de BigInt nativa
      const amountOutMin = (expectedAmountOut * 99n) / 100n; // 1% de slippage permitido

      await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
        swapAmountA,
        amountOutMin,
        path,
        addr1.address, // Destinatario de los tokens
        deadline
      )).to.emit(simpleSwap, "TokensSwapped"); // Verifica que el evento se emita

      const finalBalanceB_addr1 = await tokenB.balanceOf(addr1.address);
      // CORRECCIÓN 6: Comparar la cantidad recibida con la esperada directamente
      expect(finalBalanceB_addr1 - initialBalanceB_addr1).to.be.gte(amountOutMin); // Verificar que la cantidad es al menos la mínima esperada
    });

    it("Should swap TokenB for TokenA", async function () {
      const swapAmountB = toWei(10);
      const initialBalanceA_addr1 = await tokenA.balanceOf(addr1.address);

      // Transferir tokens B a addr1 para que tenga saldo para el swap
      await tokenB.transfer(addr1.address, swapAmountB);
      // Aprobar que SimpleSwap pueda tomar tokens B de addr1
      await tokenB.connect(addr1).approve(simpleSwap.target, swapAmountB);

      const path = [tokenB.target, tokenA.target];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      // Obtener la cantidad de salida esperada (para el amountOutMin)
      const reserveB_before_swap = await tokenB.balanceOf(simpleSwap.target);
      const reserveA_before_swap = await tokenA.balanceOf(simpleSwap.target);
      const expectedAmountOut = await simpleSwap.getAmountOut(swapAmountB, reserveB_before_swap, reserveA_before_swap);
      // CORRECCIÓN 3: Usar aritmética de BigInt nativa
      const amountOutMin = (expectedAmountOut * 99n) / 100n; // 1% de slippage permitido

      await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
        swapAmountB,
        amountOutMin,
        path,
        addr1.address, // Destinatario de los tokens
        deadline
      )).to.emit(simpleSwap, "TokensSwapped"); // Verifica que el evento se emita

      const finalBalanceA_addr1 = await tokenA.balanceOf(addr1.address);
      // CORRECCIÓN 6: Comparar la cantidad recibida con la esperada directamente
      expect(finalBalanceA_addr1 - initialBalanceA_addr1).to.be.gte(amountOutMin); // Verificar que la cantidad es al menos la mínima esperada
    });

    it("Should revert if amountOutMin is not met", async function () {
      const swapAmountA = toWei(10);
      const path = [tokenA.target, tokenB.target];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      await tokenA.transfer(addr1.address, swapAmountA);
      await tokenA.connect(addr1).approve(simpleSwap.target, swapAmountA);

      // Establecer un amountOutMin irrealmente alto para forzar la reversión
      const amountOutMin = toWei(1000000); // Un valor que nunca se alcanzará

      await expect(simpleSwap.connect(addr1).swapExactTokensForTokens(
        swapAmountA,
        amountOutMin,
        path,
        addr1.address,
        deadline
      )).to.be.revertedWith("swapExactTokensForTokens: INSUFFICIENT_OUTPUT_AMOUNT");
    });
  });

  describe("Price and Amount Out Calculation", function () {
    it("Should return correct price of TokenA in terms of TokenB", async function () {
      const reserveA = await tokenA.balanceOf(simpleSwap.target);
      const reserveB = await tokenB.balanceOf(simpleSwap.target);

      // CORRECCIÓN 4: Usar BigInt nativo para potencia
      const expectedPrice = (reserveB * (10n ** 18n)) / reserveA;
      const actualPrice = await simpleSwap.getPrice(tokenA.target, tokenB.target);

      expect(actualPrice).to.be.closeTo(expectedPrice, toWei(0.0001)); // Pequeña tolerancia
    });

    it("Should return 0 price if one reserve is 0", async function () {
      // Desplegar un nuevo SimpleSwap sin liquidez inicial
      const newSimpleSwap = await SimpleSwap.deploy(tokenA.target, tokenB.target);
      
      const price = await newSimpleSwap.getPrice(tokenA.target, tokenB.target);
      expect(price).to.equal(0);
    });

    it("Should return correct amount out", async function () {
      const amountIn = toWei(5);
      const reserveA = await tokenA.balanceOf(simpleSwap.target);
      const reserveB = await tokenB.balanceOf(simpleSwap.target);

      // Calcular manualmente la cantidad de salida esperada con el fee
      // CORRECCIÓN 5: Usar aritmética de BigInt nativa
      const amountInWithFee = amountIn * 997n;
      const numerator = amountInWithFee * reserveB;
      const denominator = (reserveA * 1000n) + amountInWithFee;
      const expectedAmountOut = numerator / denominator;

      const actualAmountOut = await simpleSwap.getAmountOut(amountIn, reserveA, reserveB);
      expect(actualAmountOut).to.equal(expectedAmountOut);
    });

    it("Should revert getAmountOut if amountIn is 0", async function () {
      const reserveA = await tokenA.balanceOf(simpleSwap.target);
      const reserveB = await tokenB.balanceOf(simpleSwap.target);
      await expect(simpleSwap.getAmountOut(0, reserveA, reserveB)).to.be.revertedWith("amountIn must be greater than 0");
    });

    it("Should revert getAmountOut if reserves are 0", async function () {
      await expect(simpleSwap.getAmountOut(toWei(1), toWei(0), toWei(100))).to.be.revertedWith("Reserves must be greater than 0");
      await expect(simpleSwap.getAmountOut(toWei(1), toWei(100), toWei(0))).to.be.revertedWith("Reserves must be greater than 0");
    });
  });
});