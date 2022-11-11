//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract Greeter is AxelarExecutable {
    IAxelarGasService public immutable gasReceiver;
    string public message = "Hello Cross-chain!";
    string public sourceChain;

    constructor(
        address gateway_,
        address gasReceiver_,
        string memory _sourceChain
    ) AxelarExecutable(gateway_) {
        sourceChain = _sourceChain;
        gasReceiver = IAxelarGasService(gasReceiver_);
    }

    event MessageChanged(string message, string sourceChain, address caller);

    function setGreeting(
        string memory destinationChain,
        string memory destinationAddress,
        string memory _message
    ) external payable {
        bytes memory payload = abi.encode(_message, sourceChain, msg.sender);
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function _execute(
        string calldata,
        string calldata,
        bytes calldata payload
    ) internal override {
        (
            string memory _message,
            string memory _sourceChain,
            address sender
        ) = abi.decode(payload, (string, string, address));
        message = _message;
        emit MessageChanged(_message, _sourceChain, sender);
    }
}
