import React, { useState } from "react";
import axios from "axios";

function App() {
  const [opinionLetter, setOpinionLetter] = useState(null);
  const [adoptionAgreement, setAdoptionAgreement] = useState(null);
  const [automaticEnrollment, setAutomaticEnrollment] = useState(null);
  const [loanProgram, setLoanProgram] = useState(null);

  const [status, setStatus] = useState("");

  const handleUpload = async (type, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const result = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData
      );
      setStatus("Upload successful : " + type.toUpperCase());
    } catch (error) {
      setStatus("Upload failed : " + type.toUpperCase());
    }
  };

  const handleOpinionLetterUpload = async (e) => {
    e.preventDefault();
    handleUpload("opinionLetter", opinionLetter);
  };
  const handleAdoptionAgreementUpload = async (e) => {
    e.preventDefault();
    handleUpload("adoptionAgreement", adoptionAgreement);
  };
  const handleAutomaticEnrollmentUpload = async (e) => {
    e.preventDefault();
    handleUpload("automaticEnrollment", automaticEnrollment);
  };
  const handleLoanProgramUpload = async (e) => {
    e.preventDefault();
    handleUpload("loanProgram", loanProgram);
  };
  const handleExcelGenerate = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:5000/api/actions/excelGenerate"
      );
      setStatus("Generation Success");
    } catch (error) {
      setStatus("Generation Failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Upload PDF Document</h2>
      <form onSubmit={handleOpinionLetterUpload}>
        <h4>Opinion Letter</h4>
        <input
          type="file"
          onChange={(e) => setOpinionLetter(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={handleAdoptionAgreementUpload}>
        <h4>Adoption Agreement</h4>
        <input
          type="file"
          onChange={(e) => setAdoptionAgreement(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={handleAutomaticEnrollmentUpload}>
        <h4>Automatic Enrollment Provisions</h4>
        <input
          type="file"
          onChange={(e) => setAutomaticEnrollment(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <form onSubmit={handleLoanProgramUpload}>
        <h4>Loan Program</h4>
        <input
          type="file"
          onChange={(e) => setLoanProgram(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
      <div></div>
      <form onSubmit={handleExcelGenerate}>
        <button type="submit">
          <h4>Excel Gen</h4>
        </button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default App;
