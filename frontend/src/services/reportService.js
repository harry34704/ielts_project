import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (scores, feedback, transcription) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('IELTS Speaking Assessment Report', 20, 20);
  
  // Add scores table
  doc.autoTable({
    startY: 40,
    head: [['Criterion', 'Band Score']],
    body: Object.entries(scores).map(([criterion, score]) => [
      criterion.charAt(0).toUpperCase() + criterion.slice(1),
      score.toFixed(1)
    ])
  });
  
  // Add feedback sections
  let yPosition = doc.lastAutoTable.finalY + 20;
  
  doc.setFontSize(16);
  doc.text('Detailed Feedback', 20, yPosition);
  
  Object.entries(feedback).forEach(([category, items]) => {
    yPosition += 15;
    doc.setFontSize(12);
    doc.text(category.charAt(0).toUpperCase() + category.slice(1), 20, yPosition);
    
    items.forEach(item => {
      yPosition += 10;
      doc.setFontSize(10);
      doc.text(`• ${item}`, 25, yPosition);
    });
  });
  
  // Add transcription
  yPosition += 20;
  doc.setFontSize(16);
  doc.text('Transcription', 20, yPosition);
  yPosition += 10;
  doc.setFontSize(10);
  doc.text(transcription, 20, yPosition);
  
  // Save the PDF
  doc.save('ielts-speaking-report.pdf');
}; 