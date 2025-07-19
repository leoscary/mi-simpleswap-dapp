    const hre = require("hardhat");

    async function main() {
      // Desplegar LeoscaryTokenA
      const LeoscaryTokenA = await hre.ethers.getContractFactory("LeoscaryTokenA");
      const tokenA = await LeoscaryTokenA.deploy();
      await tokenA.waitForDeployment(); // Usar waitForDeployment en ethers v6
      console.log(`LeoscaryTokenA desplegado en: ${tokenA.target}`);

      // Desplegar LeoscaryTokenB
      const LeoscaryTokenB = await hre.ethers.getContractFactory("LeoscaryTokenB");
      const tokenB = await LeoscaryTokenB.deploy();
      await tokenB.waitForDeployment(); // Usar waitForDeployment en ethers v6
      console.log(`LeoscaryTokenB desplegado en: ${tokenB.target}`);

      // Desplegar SimpleSwap
      // El constructor de SimpleSwap requiere las direcciones de tokenA y tokenB
      const SimpleSwap = await hre.ethers.getContractFactory("SimpleSwap");
      const simpleSwap = await SimpleSwap.deploy(tokenA.target, tokenB.target);
      await simpleSwap.waitForDeployment(); // Usar waitForDeployment en ethers v6
      console.log(`SimpleSwap desplegado en: ${simpleSwap.target}`);

      console.log("¡Despliegue completado!");
      console.log("-----------------------------------------");
      console.log("Direcciones de Contratos para tu DApp:");
      console.log(`LEOSCARY_TOKEN_A_ADDRESS = "${tokenA.target}"`);
      console.log(`LEOSCARY_TOKEN_B_ADDRESS = "${tokenB.target}"`);
      console.log(`SIMPLE_SWAP_ADDRESS = "${simpleSwap.target}"`);
      console.log("-----------------------------------------");
    }

    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
    