// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    string[] public certIds; // 🆕 Liste des ID de certificats ajoutés

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    // ➕ Ajouter un certificat (admin uniquement)
    function addCertificate(
        string memory _certId,
        string memory _owner,
        string memory _propertyType,
        string memory _location,
        uint256 _area,
        string memory _date
    ) public onlyAdmin {
        certificates[_certId] = Certificate(_owner, _propertyType, _location, _area, _date, _certId);
        certIds.push(_certId); // 🆕 Ajout de l'ID dans la liste
    }

    // 🔍 Vérifier un certificat par ID
    function verifyCertificate(string memory _certId) public view returns (Certificate memory) {
        return certificates[_certId];
    }

    // ✏️ Mettre à jour un certificat existant (admin uniquement)
    function updateCertificate(
        string memory _certId,
        string memory _owner,
        string memory _propertyType,
        string memory _location,
        uint256 _area,
        string memory _date
    ) public onlyAdmin {
        require(bytes(certificates[_certId].owner).length > 0, "Certificat inexistant");
        certificates[_certId] = Certificate(_owner, _propertyType, _location, _area, _date, _certId);
    }

    // 👤 Récupérer l'adresse de l'admin
    function getAdmin() public view returns (address) {
        return admin;
    }

    // 🧾 Récupérer tous les certificats (admin ou pour filtrage côté frontend)
    function getAllCertificates() public view returns (Certificate[] memory) {
        Certificate[] memory result = new Certificate[](certIds.length);
        for (uint i = 0; i < certIds.length; i++) {
            result[i] = certificates[certIds[i]];
        }
        return result;
    }

    // 📦 Récupérer tous les IDs (utile pour debug ou pagination)
    function getAllCertIds() public view returns (string[] memory) {
        return certIds;
    }
}
