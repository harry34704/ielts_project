import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add header
  doc.setFontSize(20);
  doc.text('IELTS Practice Report', pageWidth / 2, 20, { align: 'center' });

  // Add date
  doc.setFontSize(12);
  doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 20, 30);
  doc.text(`Task Type: ${data.type.toUpperCase()}`, 20, 40);

  // Add scores
  doc.setFontSize(16);
  doc.text('Scores', 20, 60);

  const scores = Object.entries(data.score).filter(([key]) => 
    typeof data.score[key] === 'number'
  );

  doc.autoTable({
    startY: 70,
    head: [['Criterion', 'Score']],
    body: scores.map(([criterion, score]) => [
      criterion.charAt(0).toUpperCase() + criterion.slice(1),
      `${score}%`
    ])
  });

  // Add feedback section
  if (data.feedback) {
    doc.text('Feedback & Recommendations', 20, doc.lastAutoTable.finalY + 20);
    
    doc.setFontSize(12);
    const feedback = Object.entries(data.feedback);
    let yPos = doc.lastAutoTable.finalY + 30;

    feedback.forEach(([category, text]) => {
      doc.text(`${category}:`, 20, yPos);
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(text, pageWidth - 40);
      doc.text(lines, 20, yPos + 5);
      yPos += 10 + (lines.length * 5);
      doc.setFontSize(12);
    });
  }

  // Add improvement tips
  if (data.tips) {
    const yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 120;
    doc.setFontSize(16);
    doc.text('Improvement Tips', 20, yPos);

    doc.setFontSize(12);
    let tipYPos = yPos + 10;
    data.tips.forEach((tip, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${tip}`, pageWidth - 40);
      doc.text(lines, 20, tipYPos);
      tipYPos += lines.length * 7;
    });
  }

  // Save the PDF
  doc.save(`IELTS_Report_${data.type}_${new Date().toISOString().split('T')[0]}.pdf`);
}; 