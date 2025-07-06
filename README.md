# 🏡 Certificat de Propriété Territoriale sur Blockchain

Ce projet permet de gérer des certificats de propriété territoriale sur la blockchain Ethereum grâce à un smart contract en Solidity et une interface ReactJS (avec MetaMask). Il comporte deux espaces :
- 👨‍💼 Espace **Administrateur** : Ajouter et modifier des certificats.
- 👥 Espace **Citoyen** : Consulter les certificats liés à un propriétaire.

## 🔧 Technologies utilisées

- **Solidity** – Smart Contract Ethereum
- **React.js** – Interface utilisateur (frontend)
- **Ethers.js** – Interaction avec la blockchain
- **MetaMask** – Authentification & signature des transactions
- **Bootstrap** – Design simple et responsive

## 📦 Structure du projet

📁 frontend/
├── App.js # Composant principal React
├── PropertyRegistry.json # ABI du contrat compilé
├── index.html / index.js
└── ... # Fichiers React / CSS / Bootstrap

📁 contracts/
└── PropertyRegistry.sol # Smart contract Solidity

## 🚀 Fonctionnalités

### 👨‍💼 Admin
- Ajouter un certificat (ID, propriétaire, type, lieu, surface, date).
- Modifier un certificat existant.
- Recherche de certificat par ID.

### 👥 Citoyen
- Rechercher ses certificats en saisissant son nom.

## 🧪 Déploiement local

### 1. Cloner le projet

```bash
git clone https://github.com/yasser0/TON_DEPOT.git
cd TON_DEPOT

2. Smart Contract (Hardhat) 
cd CertificatProprieteBlockchain
npm install
npx hardhat run scripts/deploy.js --network ganache (j ai utiliser Ganache pour le deployment de contract)

3. Frontend (React)
cd frontend
npm install
npm start
Le projet sera accessible à l'adresse : http://localhost:3000 
 
📄 Exemple de certificat 
| Champ        | Valeur               |
| ------------ | -------------------- |
| ID           | CERT-2024-001        |
| Propriétaire | Ahmed Ben Ali        |
| Type         | Terrain              |
| Localisation | Casablanca, Ain Diab |
| Superficie   | 2500 m²              |
| Date         | 2024-01-15           |


🛡️ Sécurité
Seul l'administrateur (créateur du contrat) peut ajouter ou modifier des certificats.
Les citoyens peuvent uniquement consulter leurs propres certificats. 

🙌 Auteur
Projet développé par Mohammed Yasser Rachih, étudiant en Master Big Data & Data Science 
📧rachihyasser@gmail.com 
📍 Casablanca, Maroc