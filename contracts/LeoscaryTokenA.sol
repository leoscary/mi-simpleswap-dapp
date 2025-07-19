// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LeoscaryTokenA is ERC20 {
    constructor() ERC20("LeoscaryTokenA", "LTA") {
        // Este constructor mintea 1 millón de tokens a quien despliega el contrato.
        // Ajusta la cantidad si se desea una cantidad diferente.
        _mint(msg.sender, 1000000 * 10 ** decimals()); // 1 millón de tokens con 18 decimales
    }
}