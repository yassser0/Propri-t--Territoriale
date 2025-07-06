import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./PropertyRegistry.json";


const CONTRACT_ADDRESS = "0xe37131413EE74EefF466b52dD3B6845709A96c60"; //  Remplace par ton adresse déployée

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    certId: "",
    owner: "",
    propertyType: "",
    location: "",
    area: "",
    date: "",
  });

  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("🦊 Installez MetaMask !");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      const instance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      setAccount(addr);
      setContract(instance);

      // 🛡️ Vérifie si l'utilisateur est l'admin
      const adminAddress = await instance.getAdmin();
      setIsAdmin(adminAddress.toLowerCase() === addr.toLowerCase());
    };

    init();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      await contract.addCertificate(
        form.certId,
        form.owner,
        form.propertyType,
        form.location,
        parseInt(form.area),
        form.date
      );
      alert("✅ Certificat ajouté !");
      setForm({ certId: "", owner: "", propertyType: "", location: "", area: "", date: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'ajout.");
    }
  };

  const handleSearch = async () => {
    try {
      const cert = await contract.verifyCertificate(searchId);
      if (!cert || cert.owner === "") {
        setResult(null);
        setError("❌ Aucun certificat trouvé.");
      } else {
        setResult(cert);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Erreur de recherche.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>🌍 Certificat de Propriété Territoriale</h2>
      <p><strong>👤 Compte connecté :</strong> {account || "Aucun"}</p>

      <hr />

      {/* Formulaire Admin */}
      <h4>🛠️ Ajout d’un certificat (Admin)</h4>
      {isAdmin ? (
        <form onSubmit={handleAddCertificate}>
          <input className="form-control my-2" name="certId" placeholder="ID du certificat" value={form.certId} onChange={handleFormChange} required />
          <input className="form-control my-2" name="owner" placeholder="Nom propriétaire" value={form.owner} onChange={handleFormChange} required />
          <input className="form-control my-2" name="propertyType" placeholder="Type de bien" value={form.propertyType} onChange={handleFormChange} required />
          <input className="form-control my-2" name="location" placeholder="Localisation" value={form.location} onChange={handleFormChange} required />
          <input className="form-control my-2" name="area" type="number" placeholder="Superficie (m²)" value={form.area} onChange={handleFormChange} required />
          <input className="form-control my-2" name="date" type="date" placeholder="Date" value={form.date} onChange={handleFormChange} required />
          <button className="btn btn-primary">Ajouter</button>
        </form>
      ) : (
        <div className="alert alert-warning">
          🚫 Vous n’êtes pas autorisé à ajouter un certificat. (Réservé à l’administrateur)
        </div>
      )}

      <hr />

      {/* Recherche citoyen */}
      <h4>🔍 Rechercher un certificat</h4>
      <div className="input-group mb-3">
        <input className="form-control" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Entrez ID certificat" />
        <button className="btn btn-secondary" onClick={handleSearch}>Rechercher</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">📄 Certificat trouvé</h5>
            <p><strong>ID :</strong> {result.certId}</p>
            <p><strong>Propriétaire :</strong> {result.owner}</p>
            <p><strong>Type :</strong> {result.propertyType}</p>
            <p><strong>Localisation :</strong> {result.location}</p>
            <p><strong>Superficie :</strong> {result.area} m²</p>
            <p><strong>Date :</strong> {result.date}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
