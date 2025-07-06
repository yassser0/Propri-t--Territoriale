// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract PropertyRegistry {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Certificate {
        string owner;
        string propertyType;
        string location;
        uint256 area;
        string date;
        string certId;
    }

    mapping(string => Certificate) public certificates;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function addCertificate(
        string memory _certId,
        string memory _owner,
        string memory _propertyType,
        string memory _location,
        uint256 _area,
        string memory _date
    ) public onlyAdmin {
        certificates[_certId] = Certificate(_owner, _propertyType, _location, _area, _date, _certId);
    }

    function verifyCertificate(string memory _certId) public view returns (Certificate memory) {
        return certificates[_certId];
    }
}
