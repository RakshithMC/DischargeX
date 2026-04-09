import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Share2, 
  RefreshCw, 
  User, 
  Hospital, 
  Calendar, 
  Stethoscope, 
  Pill,
  Signature as SignatureIcon,
  CheckCircle2,
  AlertCircle,
  Lock,
  CreditCard
} from 'lucide-react';
import { VoiceInput } from '@/src/components/VoiceInput';
import { parseVoiceInput, generateProfessionalSummary, PatientData } from '@/src/services/gemini';
import { jsPDF } from 'jspdf';
import { startPayment, checkPaymentStatus } from '@/src/services/payment';

export const DashboardPage = () => {
  const [formData, setFormData] = useState<PatientData>({
    patientName: '',
    age: '',
    gender: '',
    diagnosis: '',
    treatmentGiven: '',
    medications: '',
    doctorName: '',
    hospitalName: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsPaid(checkPaymentStatus());
  }, []);

  const handleSubscribe = () => {
    startPayment({
      amount: 499,
      currency: "INR",
      name: "DischargeX",
      description: "Monthly Subscription",
      onSuccess: () => {
        alert("Payment successful!");
      },
      onFailure: () => {
        alert("Payment failed. Please try again.");
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTranscript = React.useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const parsedData = await parseVoiceInput(text);
      // Only update fields that have non-empty values to avoid clearing existing data
      setFormData(prev => {
        const newData = { ...prev };
        (Object.keys(parsedData) as Array<keyof PatientData>).forEach(key => {
          if (parsedData[key] && parsedData[key].trim() !== '') {
            newData[key] = parsedData[key];
          }
        });
        return newData;
      });
    } catch (error) {
      console.error("Error processing transcript:", error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const generatedSummary = await generateProfessionalSummary(formData);
    setSummary(generatedSummary);
    setShowPreview(true);
    setIsGenerating(false);
  };

  const generateDischargePDF = (): Blob => {
    console.log("Generating PDF with form data:", formData);
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.setFont("helvetica", "bold");
    doc.text(formData.hospitalName || "HOSPITAL NAME", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.setFont("helvetica", "italic");
    doc.text("Advanced Healthcare & Research Center", 105, 27, { align: "center" });
    
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.line(20, 32, 190, 32);
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("DISCHARGE SUMMARY", 105, 45, { align: "center" });
    
    // Patient Info Box
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.1);
    doc.rect(20, 52, 170, 25);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Name:", 25, 60);
    doc.setFont("helvetica", "normal");
    doc.text(formData.patientName, 55, 60);
    
    doc.setFont("helvetica", "bold");
    doc.text("Age / Gender:", 120, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${formData.age} / ${formData.gender}`, 150, 60);
    
    doc.setFont("helvetica", "bold");
    doc.text("Discharge Date:", 25, 70);
    doc.setFont("helvetica", "normal");
    doc.text(formData.date, 55, 70);
    
    doc.setFont("helvetica", "bold");
    doc.text("Ref No:", 120, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`DX-${Math.floor(Math.random() * 100000)}`, 150, 70);
    
    // Diagnosis
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DIAGNOSIS", 20, 90);
    doc.setLineWidth(0.2);
    doc.line(20, 92, 50, 92);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const diagnosisLines = doc.splitTextToSize(formData.diagnosis || "No diagnosis provided.", 170);
    doc.text(diagnosisLines, 20, 98);
    
    let currentY = 98 + (diagnosisLines.length * 6);
    
    // Treatment
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("CLINICAL SUMMARY & TREATMENT", 20, currentY + 10);
    doc.line(20, currentY + 12, 95, currentY + 12);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const treatmentLines = doc.splitTextToSize(formData.treatmentGiven || "No treatment details provided.", 170);
    doc.text(treatmentLines, 20, currentY + 18);
    
    currentY = currentY + 18 + (treatmentLines.length * 6);
    
    // Medications
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("MEDICATIONS & INSTRUCTIONS", 20, currentY + 10);
    doc.line(20, currentY + 12, 85, currentY + 12);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setFillColor(248, 250, 252); // Slate-50
    const medicationsLines = doc.splitTextToSize(formData.medications || "No medications listed.", 160);
    const rectHeight = (medicationsLines.length * 6) + 10;
    doc.rect(20, currentY + 15, 170, rectHeight, "F");
    doc.text(medicationsLines, 25, currentY + 22);
    
    currentY = currentY + 22 + (medicationsLines.length * 6) + 10;
    
    // Follow up
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("FOLLOW-UP ADVICE", 20, currentY + 10);
    doc.line(20, currentY + 12, 65, currentY + 12);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const followUp = "Patient is advised to follow up in the OPD after 7 days or immediately in case of emergency (fever, severe pain, or bleeding).";
    const followUpLines = doc.splitTextToSize(followUp, 170);
    doc.text(followUpLines, 20, currentY + 18);
    
    // Signature
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Authorized Signatory", 150, 265, { align: "center" });
    
    doc.setFont("helvetica", "italic");
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(14);
    doc.text(formData.doctorName ? `Dr. ${formData.doctorName}` : "Doctor Signature", 150, 258, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(formData.hospitalName || "Hospital Name", 150, 270, { align: "center" });
    
    const pdfBlob = doc.output("blob");
    console.log("PDF Blob generated successfully:", pdfBlob);
    return pdfBlob;
  };

  const downloadPDF = async () => {
    console.log("Download button clicked");
    if (!isPaid) {
      alert("Please subscribe to unlock the download feature.");
      handleSubscribe();
      return;
    }
    if (!formData.patientName || !formData.diagnosis) {
      alert("Please fill patient details first");
      return;
    }
    
    try {
      setIsGenerating(true);
      const pdfBlob = generateDischargePDF();
      
      if (!pdfBlob) {
        throw new Error("Blob generation failed");
      }
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `discharge-summary-${formData.patientName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("PDF download triggered successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const shareWhatsApp = async () => {
    console.log("WhatsApp button clicked");
    if (!isPaid) {
      alert("Please subscribe to unlock the WhatsApp sharing feature.");
      handleSubscribe();
      return;
    }
    if (!formData.patientName || !formData.diagnosis) {
      alert("Please fill patient details first");
      return;
    }
    
    try {
      setIsGenerating(true);
      const pdfBlob = generateDischargePDF();
      
      if (!pdfBlob) {
        throw new Error("Blob generation failed");
      }

      const fileName = `Discharge_Summary_${formData.patientName.replace(/\s+/g, '_') || 'Patient'}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      // Check if Web Share API is available and can share files
      // This is the ONLY way to share a file directly from a web browser to an app like WhatsApp.
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        console.log("Using Web Share API to share PDF file directly...");
        try {
          await navigator.share({
            files: [file],
            title: 'Discharge Summary',
            text: `Discharge summary for ${formData.patientName}`,
          });
          console.log("PDF shared successfully via Web Share API");
        } catch (shareError: any) {
          if (shareError.name !== 'AbortError') {
            console.error("Web Share API error:", shareError);
            alert("Sharing failed. Please ensure your browser supports file sharing.");
          }
        }
      } else {
        // Direct file sharing not supported (common on desktop browsers)
        console.log("Web Share API not supported for files on this device.");
        alert("Direct PDF sharing is supported on mobile devices. On desktop, please use the 'Download' button and send the file manually via WhatsApp.");
      }
    } catch (error) {
      console.error("Error generating PDF for WhatsApp:", error);
      alert("Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Patient Discharge Dashboard</h1>
            <p className="text-slate-500 text-sm">Create, preview, and share discharge summaries instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            {!isPaid && (
              <button
                onClick={handleSubscribe}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 shadow-md transition-all"
              >
                <CreditCard className="h-4 w-4" /> Subscribe Now (₹499)
              </button>
            )}
            <button 
              onClick={() => setFormData({
                patientName: '', age: '', gender: '', diagnosis: '', treatmentGiven: '', medications: '', doctorName: '', hospitalName: '', date: new Date().toISOString().split('T')[0]
              })}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Reset Form
            </button>
          </div>
        </div>

        {!isPaid && (
          <div className="mb-8 rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Premium Features Locked</p>
                <p className="text-xs text-blue-700">Subscribe for ₹499/month to unlock PDF downloads and WhatsApp sharing.</p>
              </div>
            </div>
            <button
              onClick={handleSubscribe}
              className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all"
            >
              Unlock Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="mb-6">
                <VoiceInput onTranscript={handleTranscript} isProcessing={isProcessing} />
                <p className="mt-4 text-[10px] text-center text-slate-400">
                  Tip: If the microphone is blocked, click the lock icon in your browser's address bar to allow permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Patient Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 45"
                    className="w-full rounded-lg border border-slate-200 py-2 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-200 py-2 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Diagnosis</label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Primary diagnosis details..."
                      className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Treatment Given</label>
                  <textarea
                    name="treatmentGiven"
                    value={formData.treatmentGiven}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Details of surgery, procedures, or therapy..."
                    className="w-full rounded-lg border border-slate-200 py-2 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Medications</label>
                  <div className="relative">
                    <Pill className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="List of prescribed medicines..."
                      className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    placeholder="Dr. Smith"
                    className="w-full rounded-lg border border-slate-200 py-2 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Hospital Name</label>
                  <div className="relative">
                    <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      placeholder="City General Hospital"
                      className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Discharge Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.patientName || !isPaid}
                className="mt-8 w-full rounded-xl bg-blue-600 py-4 text-base sm:text-lg font-bold text-white shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" /> Generating Summary...
                  </>
                ) : (
                  <>
                    {isPaid ? <FileText className="h-5 w-5" /> : <Lock className="h-5 w-5" />} 
                    {isPaid ? 'Generate Discharge Summary' : 'Subscribe to Unlock Generation'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {showPreview ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h2 className="font-bold text-slate-900">Document Preview</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadPDF}
                      disabled={isGenerating}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isPaid ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-400'
                      }`}
                    >
                      {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : (isPaid ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />)} 
                      {isPaid ? 'Download' : 'Unlock Download'}
                    </button>
                    <button
                      onClick={shareWhatsApp}
                      disabled={isGenerating}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isPaid ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-400'
                      }`}
                    >
                      {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : (isPaid ? <Share2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />)} 
                      {isPaid ? 'WhatsApp' : 'Unlock Share'}
                    </button>
                  </div>
                </div>

                <div 
                  ref={previewRef}
                  className="bg-white p-12 shadow-xl border border-slate-200 min-h-[800px] text-slate-800 font-serif w-[800px] mx-auto overflow-hidden"
                >
                  {/* Hospital Header - Fixed layout to prevent overlap */}
                  <div className="border-b-2 border-blue-600 pb-6 mb-8 grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-8">
                      <h2 className="text-3xl font-bold text-blue-600 uppercase tracking-tight break-words leading-tight">
                        {formData.hospitalName || 'HOSPITAL NAME'}
                      </h2>
                      <p className="text-sm text-slate-500 italic mt-1">Advanced Healthcare & Research Center</p>
                    </div>
                    <div className="col-span-4 text-right text-sm">
                      <p className="font-bold whitespace-nowrap">Date: {formData.date}</p>
                      <p className="text-slate-500">Ref No: DX-{Math.floor(Math.random() * 100000)}</p>
                    </div>
                  </div>

                  <h1 className="text-center text-2xl font-bold underline mb-8">DISCHARGE SUMMARY</h1>

                  <div className="grid grid-cols-2 gap-y-4 mb-8 text-sm">
                    <p><span className="font-bold">Patient Name:</span> {formData.patientName}</p>
                    <p><span className="font-bold">Age / Gender:</span> {formData.age} / {formData.gender}</p>
                    <p className="col-span-2"><span className="font-bold">Diagnosis:</span> {formData.diagnosis}</p>
                  </div>

                  <div className="space-y-6 text-sm leading-relaxed">
                    <section>
                      <h3 className="font-bold border-b border-slate-200 pb-1 mb-2">CLINICAL SUMMARY & TREATMENT</h3>
                      <p>{formData.treatmentGiven || 'No treatment details provided.'}</p>
                    </section>

                    <section>
                      <h3 className="font-bold border-b border-slate-200 pb-1 mb-2">MEDICATIONS & INSTRUCTIONS</h3>
                      <div className="whitespace-pre-line bg-slate-50 p-4 rounded border border-slate-100 italic">
                        {formData.medications || 'No medications listed.'}
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="font-bold border-b border-slate-200 pb-1 mb-2">FOLLOW-UP ADVICE</h3>
                      <p>Patient is advised to follow up in the OPD after 7 days or immediately in case of emergency (fever, severe pain, or bleeding).</p>
                    </section>
                  </div>

                  {/* Signature Section */}
                  <div className="mt-20 flex justify-end">
                    <div className="text-center border-t border-slate-400 pt-2 min-w-[200px]">
                      <div className="h-12 flex items-center justify-center italic text-blue-600 font-bold">
                        {formData.doctorName ? `Dr. ${formData.doctorName}` : 'Doctor Signature'}
                      </div>
                      <p className="text-xs font-bold uppercase">Authorized Signatory</p>
                      <p className="text-[10px] text-slate-500">{formData.hospitalName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400 p-8 text-center">
                <div className="rounded-full bg-slate-100 p-4 mb-4">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-600">No Preview Available</h3>
                <p className="max-w-xs mt-2">Fill in the patient details and click "Generate" to see the professional discharge summary here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
