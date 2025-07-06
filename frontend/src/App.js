import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./PropertyRegistry.json";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";

const CONTRACT_ADDRESS = "0x184b933B2e4E2ed21002494213D012427eEe4487";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formAdd, setFormAdd] = useState({
    certId: "",
    owner: "",
    propertyType: "",
    location: "",
    area: "",
    date: "",
  });

  const [formEdit, setFormEdit] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Styles CSS intégrés avec animations et effets modernes
  const styles = {
    globalBackground: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '2rem 0',
      position: 'relative'
    },
    floatingElements: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      width: '100px',
      height: '100px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      animation: 'float 6s ease-in-out infinite'
    },
    mainContainer: {
      maxWidth: '1400px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '25px',
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    },
    headerGradient: {
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite',
      padding: '3rem 2rem',
      borderRadius: '25px 25px 0 0',
      position: 'relative',
      overflow: 'hidden'
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(0,0,0,0.1), transparent)',
      borderRadius: '25px 25px 0 0'
    },
    glassCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '2rem',
      margin: '1.5rem 0',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    neonButton: {
      background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      border: 'none',
      borderRadius: '50px',
      padding: '1rem 2rem',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px rgba(255, 107, 107, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    },
    modernInput: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid transparent',
      borderRadius: '15px',
      padding: '1rem 1.5rem',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
      backdropFilter: 'blur(10px)'
    },
    resultCard: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
      backdropFilter: 'blur(20px)',
      borderRadius: '25px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      padding: '2.5rem',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    },
    statusBadge: {
      background: 'linear-gradient(45deg, #00d4aa, #00b894)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
      border: 'none',
      boxShadow: '0 5px 15px rgba(0, 212, 170, 0.3)'
    },
    pulseEffect: {
      animation: 'pulse 2s infinite'
    },
    hoverEffect: {
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }
  };

  // Ajout du CSS d'animation via style element
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .slide-in { animation: slideIn 0.6s ease-out; }
      
      .glass-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
      
      .neon-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(255, 107, 107, 0.4);
      }
      
      .modern-input:focus {
        border-color: #4ecdc4;
        box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
        transform: scale(1.02);
      }
      
      .floating-element {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 6s ease-in-out infinite;
      }
      
      .floating-element:nth-child(1) {
        top: 10%;
        left: 10%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      
      .floating-element:nth-child(2) {
        top: 20%;
        right: 10%;
        width: 60px;
        height: 60px;
        animation-delay: 2s;
      }
      
      .floating-element:nth-child(3) {
        bottom: 20%;
        left: 20%;
        width: 40px;
        height: 40px;
        animation-delay: 4s;
      }
      
      .cert-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      }
    `;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

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

      const adminAddress = await instance.getAdmin();
      setIsAdmin(adminAddress.toLowerCase() === addr.toLowerCase());
    };

    init();
  }, []);

  const handleAddChange = (e) => setFormAdd({ ...formAdd, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await contract.addCertificate(
        formAdd.certId,
        formAdd.owner,
        formAdd.propertyType,
        formAdd.location,
        parseInt(formAdd.area),
        formAdd.date
      );
      alert("✅ Certificat ajouté !");
      setFormAdd({ certId: "", owner: "", propertyType: "", location: "", area: "", date: "" });
    } catch (err) {
      alert("❌ Erreur lors de l'ajout.");
    }
  };

  const handleEditChange = (e) => setFormEdit({ ...formEdit, [e.target.name]: e.target.value });

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await contract.updateCertificate(
        formEdit.certId,
        formEdit.owner,
        formEdit.propertyType,
        formEdit.location,
        parseInt(formEdit.area),
        formEdit.date
      );
      alert("✏️ Certificat modifié avec succès !");
      setFormEdit(null);
    } catch (err) {
      alert("❌ Erreur lors de la modification.");
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
      setError("❌ Erreur de recherche.");
    }
  };

  const generatePDF = (data) => {
  const doc = new jsPDF();
  
  // Configuration des couleurs
  const primaryColor = [41, 128, 185];    // Bleu professionnel
  const secondaryColor = [52, 73, 94];    // Gris foncé
  const accentColor = [231, 76, 60];      // Rouge accent
  const lightGray = [236, 240, 241];      // Gris clair
  
  // Dimensions de la page
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // === HEADER AVEC BORDURE DÉCORATIVE ===
  // Bordure supérieure colorée
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 15, 'F');
  
  // Bordure inférieure colorée
  doc.setFillColor(...primaryColor);
  doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
  
  // === TITRE PRINCIPAL ===
  doc.setFontSize(28);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  const title = "CERTIFICAT DE PROPRIÉTÉ";
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, 35);
  
  // Ligne décorative sous le titre
  doc.setLineWidth(2);
  doc.setDrawColor(...accentColor);
  doc.line(40, 45, pageWidth - 40, 45);
  
  // === NUMÉRO DE CERTIFICAT (Mise en évidence) ===
  doc.setFillColor(...lightGray);
  doc.roundedRect(20, 55, pageWidth - 40, 25, 5, 5, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor(...accentColor);
  doc.setFont("helvetica", "bold");
  doc.text("N° CERTIFICAT:", 30, 70);
  
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "normal");
  doc.text(data.certId, 30, 75);
  
  // === INFORMATIONS PRINCIPALES ===
  let yPosition = 100;
  const lineHeight = 20;
  const leftMargin = 30;
  
  // Style pour les labels
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  
  // Style pour les valeurs
  const valueStyle = () => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(11);
  };
  
  // Propriétaire
  doc.text("PROPRIÉTAIRE:", leftMargin, yPosition);
  valueStyle();
  doc.text(data.owner, leftMargin + 50, yPosition);
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.setDrawColor(...lightGray);
  doc.line(leftMargin, yPosition + 5, pageWidth - 30, yPosition + 5);
  
  yPosition += lineHeight;
  
  // Type de propriété
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("TYPE DE BIEN:", leftMargin, yPosition);
  valueStyle();
  doc.text(data.propertyType, leftMargin + 50, yPosition);
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.setDrawColor(...lightGray);
  doc.line(leftMargin, yPosition + 5, pageWidth - 30, yPosition + 5);
  
  yPosition += lineHeight;
  
  // Localisation
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("LOCALISATION:", leftMargin, yPosition);
  valueStyle();
  doc.text(data.location, leftMargin + 50, yPosition);
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.setDrawColor(...lightGray);
  doc.line(leftMargin, yPosition + 5, pageWidth - 30, yPosition + 5);
  
  yPosition += lineHeight;
  
  // Superficie
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("SUPERFICIE:", leftMargin, yPosition);
  valueStyle();
  doc.text(`${data.area} m²`, leftMargin + 50, yPosition);
  
  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.setDrawColor(...lightGray);
  doc.line(leftMargin, yPosition + 5, pageWidth - 30, yPosition + 5);
  
  yPosition += lineHeight;
  
  // Date d'émission
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("DATE D'ÉMISSION:", leftMargin, yPosition);
  valueStyle();
  doc.text(data.date, leftMargin + 50, yPosition);
  
  // === SECTION VALIDATION ===
  yPosition += 40;
  
  // Cadre de validation
  doc.setLineWidth(1);
  doc.setDrawColor(...primaryColor);
  doc.rect(20, yPosition, pageWidth - 40, 50);
  
  // Titre de validation
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("VALIDATION OFFICIELLE", 30, yPosition + 15);
  
  // Texte de validation
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);
  doc.text("Ce certificat atteste de la propriété du bien immobilier", 30, yPosition + 25);
  doc.text("désigné ci-dessus conformément aux registres officiels.", 30, yPosition + 35);
  
  // === FOOTER ===
  const footerY = pageHeight - 30;
  
  // Ligne décorative
  doc.setLineWidth(1);
  doc.setDrawColor(...primaryColor);
  doc.line(20, footerY, pageWidth - 20, footerY);
  
  // Texte du footer
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.setFont("helvetica", "italic");
  const footerText = "Document généré automatiquement - Validité sous réserve de vérification";
  const footerWidth = doc.getTextWidth(footerText);
  doc.text(footerText, (pageWidth - footerWidth) / 2, footerY + 10);
  
  // === FILIGRANE (optionnel) ===
  doc.setFontSize(50);
  doc.setTextColor(240, 240, 240); // Très clair
  doc.setFont("helvetica", "bold");
  
  // Rotation du texte pour le filigrane
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  doc.text("CERTIFIÉ", centerX, centerY, {
    angle: 45,
    align: 'center'
  });
  
  // Sauvegarde du PDF
  doc.save(`Certificat-Propriete-${data.certId}.pdf`);
};



  
    return (
      <div style={styles.globalBackground}>
        {/* Éléments flottants */}
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        
        <div className="container" style={styles.mainContainer}>
          {/* Header avec animation gradient */}
          <div style={styles.headerGradient}>
            <div style={styles.headerOverlay}></div>
            <div className="text-center text-white position-relative">
              <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                🏛️ PropertyChain
              </h1>
              <p className="lead mb-0" style={{ fontSize: '1.3rem', opacity: '0.9' }}>
                Système de Certification Blockchain Immobilière
              </p>
            </div>
          </div>
  
          <div className="p-4">
            {/* Status Account */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <div className="me-3" style={{ width: '15px', height: '15px', borderRadius: '50%', background: account ? '#00d4aa' : '#ff6b6b', ...styles.pulseEffect }}></div>
                <span className="fw-bold">
                  {account ? `🔗 ${account.slice(0, 6)}...${account.slice(-4)}` : "⚠️ Non connecté"}
                </span>
              </div>
              {isAdmin && (
                <span style={styles.statusBadge} className="slide-in">
                  👑 ADMINISTRATEUR
                </span>
              )}
            </div>
  
            {/* Section Admin */}
            {isAdmin && (
              <div className="glass-card slide-in" style={styles.glassCard}>
                <div className="d-flex align-items-center mb-4">
                  <div className="me-3" style={{ width: '4px', height: '40px', background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', borderRadius: '2px' }}></div>
                  <h3 className="mb-0 fw-bold">📝 Nouveau Certificat</h3>
                </div>
                
                <form onSubmit={handleAdd}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="certId"
                        placeholder="🆔 ID du certificat"
                        value={formAdd.certId}
                        onChange={handleAddChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="owner"
                        placeholder="👤 Propriétaire"
                        value={formAdd.owner}
                        onChange={handleAddChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="propertyType"
                        placeholder="🏠 Type de propriété"
                        value={formAdd.propertyType}
                        onChange={handleAddChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="location"
                        placeholder="📍 Localisation"
                        value={formAdd.location}
                        onChange={handleAddChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="area"
                        type="number"
                        placeholder="📐 Superficie (m²)"
                        value={formAdd.area}
                        onChange={handleAddChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="date"
                        type="date"
                        value={formAdd.date}
                        onChange={handleAddChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" className="neon-button" style={styles.neonButton}>
                      ✨ Créer le Certificat
                    </button>
                  </div>
                </form>
              </div>
            )}
  
            {/* Section Recherche */}
            <div className="glass-card slide-in" style={styles.glassCard}>
              <div className="d-flex align-items-center mb-4">
                <div className="me-3" style={{ width: '4px', height: '40px', background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)', borderRadius: '2px' }}></div>
                <h3 className="mb-0 fw-bold">🔍 Recherche de Certificat</h3>
              </div>
              
              <div className="row g-3">
                <div className="col-md-8">
                  <input
                    className="form-control modern-input"
                    style={styles.modernInput}
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="🔍 Entrez l'ID du certificat (ex: CERT-001)"
                  />
                </div>
                <div className="col-md-4">
                  <button
                    className="neon-button w-100"
                    style={{...styles.neonButton, background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)'}}
                    onClick={handleSearch}
                  >
                    🚀 Rechercher
                  </button>
                </div>
              </div>
            </div>
  
            {/* Erreur */}
            {error && (
              <div className="alert alert-danger slide-in" style={{ 
                borderRadius: '15px', 
                border: 'none', 
                background: 'linear-gradient(45deg, #ff6b6b, #ff5252)', 
                color: 'white',
                boxShadow: '0 10px 25px rgba(255, 107, 107, 0.3)'
              }}>
                <strong>{error}</strong>
              </div>
            )}
  
            {/* Résultat */}
            {result && (
              <div className="slide-in" style={styles.resultCard}>
                <div className="text-center mb-4">
                  <div className="d-inline-block p-3 rounded-circle mb-3" style={{ background: 'linear-gradient(45deg, #00d4aa, #00b894)' }}>
                    <i className="text-white" style={{ fontSize: '2rem' }}>📄</i>
                  </div>
                  <h2 className="fw-bold mb-3">Certificat Vérifié</h2>
                  <div className="d-inline-block px-3 py-2 rounded-pill" style={{ background: 'linear-gradient(45deg, #00d4aa, #00b894)', color: 'white' }}>
                    ✅ Authentifié sur Blockchain
                  </div>
                </div>
  
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(78, 205, 196, 0.1)' }}>
                      <h6 className="fw-bold text-muted mb-2">🆔 IDENTIFIANT</h6>
                      <p className="h5 mb-0 text-primary">{result.certId}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(69, 183, 209, 0.1)' }}>
                      <h6 className="fw-bold text-muted mb-2">👤 PROPRIÉTAIRE</h6>
                      <p className="h5 mb-0 text-info">{result.owner}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
                      <h6 className="fw-bold text-muted mb-2">🏠 TYPE</h6>
                      <p className="h5 mb-0 text-danger">{result.propertyType}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(156, 39, 176, 0.1)' }}>
                      <h6 className="fw-bold text-muted mb-2">📍 LOCALISATION</h6>
                      <p className="h5 mb-0" style={{ color: '#9c27b0' }}>{result.location}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                      <h6 className="fw-bold text-muted mb-2">📐 SUPERFICIE</h6>
                      <p className="h5 mb-0 text-warning">{result.area} m²</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                      <h6 className="fw-bold text-muted mb-2">📅 DATE</h6>
                      <p className="h5 mb-0 text-success">{result.date}</p>
                    </div>
                  </div>
                </div>
  
                <div className="text-center mt-4">
                  <button
                    className="neon-button me-3"
                    style={{...styles.neonButton, background: 'linear-gradient(45deg, #00d4aa, #00b894)'}}
                    onClick={() => generatePDF(result)}
                  >
                    📊 Télécharger PDF
                  </button>
                  {isAdmin && (
                    <button
                      className="neon-button"
                      style={{...styles.neonButton, background: 'linear-gradient(45deg, #ffc107, #ff9800)'}}
                      onClick={() => setFormEdit(result)}
                    >
                      ✏️ Modifier
                    </button>
                  )}
                </div>
              </div>
            )}
  
            {/* Formulaire de modification */}
            {formEdit && isAdmin && (
              <div className="glass-card slide-in" style={{...styles.glassCard, background: 'rgba(255, 193, 7, 0.1)'}}>
                <div className="d-flex align-items-center mb-4">
                  <div className="me-3" style={{ width: '4px', height: '40px', background: 'linear-gradient(45deg, #ffc107, #ff9800)', borderRadius: '2px' }}></div>
                  <h3 className="mb-0 fw-bold">✏️ Modification du Certificat</h3>
                </div>
                
                <form onSubmit={handleEdit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        style={{...styles.modernInput, background: 'rgba(255, 255, 255, 0.5)'}}
                        name="certId"
                        value={formEdit.certId}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="owner"
                        value={formEdit.owner}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="propertyType"
                        value={formEdit.propertyType}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="location"
                        value={formEdit.location}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="area"
                        type="number"
                        value={formEdit.area}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control modern-input"
                        style={styles.modernInput}
                        name="date"
                        type="date"
                        value={formEdit.date}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="neon-button me-3"
                      style={{...styles.neonButton, background: 'linear-gradient(45deg, #ffc107, #ff9800)'}}
                    >
                      💾 Sauvegarder
                    </button>
                    <button
                      type="button"
                      className="neon-button"
                      style={{...styles.neonButton, background: 'linear-gradient(45deg, #6c757d, #495057)'}}
                      onClick={() => setFormEdit(null)}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default App;