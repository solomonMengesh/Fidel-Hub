// server/utils/certificateGenerator.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Jump lines utility
function jumpLine(doc, lines) {
  for (let i = 0; i < lines; i++) {
    doc.moveDown();
  }
}

export const generateCertificate = async (studentId, courseId, studentName, courseTitle) => {
  return new Promise((resolve, reject) => {
    try {
      const certificateFileName = `${studentId}-${courseId}-certificate.pdf`;
      const outputPath = path.join(__dirname, '../certificates', certificateFileName);

      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Border styling
      const margin = 18;
      doc
        .fillAndStroke('#0e8cc3')
        .lineWidth(20)
        .lineJoin('round')
        .rect(margin, margin, doc.page.width - margin * 2, doc.page.height - margin * 2)
        .stroke();

      // Add Logo
      const logoPath = path.join(__dirname, './assets/logo.png');
      doc.image(logoPath, doc.page.width / 2 - 70, 60, { fit: [140, 70], align: 'center' });

      jumpLine(doc, 5);

      doc
        .font(path.join(__dirname, './fonts/NotoSansJP-Light.otf'))
        .fontSize(10)
        .fill('#021c27')
        .text(courseTitle || 'Fidel Hub Course', { align: 'center' });

      jumpLine(doc, 2);

      doc
        .font(path.join(__dirname, './fonts/NotoSansJP-Regular.otf'))
        .fontSize(16)
        .fill('#021c27')
        .text('CERTIFICATE OF COMPLETION', { align: 'center' });

      jumpLine(doc, 1);

      doc
        .font(path.join(__dirname, './fonts/NotoSansJP-Light.otf'))
        .fontSize(10)
        .fill('#021c27')
        .text('Presented to', { align: 'center' });

      jumpLine(doc, 2);

      doc
        .font(path.join(__dirname, './fonts/NotoSansJP-Bold.otf'))
        .fontSize(24)
        .fill('#021c27')
        .text(studentName || 'STUDENT NAME', { align: 'center' });

      jumpLine(doc, 1);

      doc
        .font(path.join(__dirname, './fonts/NotoSansJP-Light.otf'))
        .fontSize(10)
        .fill('#021c27')
        .text(`Successfully completed the course.`, { align: 'center' });

      jumpLine(doc, 7);

      // Signature placeholders
      const lineSize = 174;
      const signatureHeight = 390;
      const startLine1 = 128;
      const startLine2 = startLine1 + lineSize + 32;
      const startLine3 = startLine2 + lineSize + 32;

      doc.fillAndStroke('#021c27').strokeOpacity(0.2);

      [startLine1, startLine2, startLine3].forEach(start => {
        doc.moveTo(start, signatureHeight).lineTo(start + lineSize, signatureHeight).stroke();
      });

      doc
        .font(path.join(__dirname, './fonts/NotoSansJP-Bold.otf'))
        .fontSize(10)
        .fill('#021c27')
        .text('John Doe', startLine1, signatureHeight + 10, { align: 'center', width: lineSize })
        .text(studentName, startLine2, signatureHeight + 10, { align: 'center', width: lineSize })
        .text('Jane Doe', startLine3, signatureHeight + 10, { align: 'center', width: lineSize });

      doc
        .font(path.join(__dirname, './fonts/NotoSansJP-Light.otf'))
        .text('Instructor', startLine1, signatureHeight + 25, { align: 'center', width: lineSize })
        .text('Student', startLine2, signatureHeight + 25, { align: 'center', width: lineSize })
        .text('Director', startLine3, signatureHeight + 25, { align: 'center', width: lineSize });

      jumpLine(doc, 4);

      // Link + QR Code
      const link = `https://fidelhub.com/verify/${studentId}-${courseId}`;
      const linkWidth = doc.widthOfString(link);
      const linkHeight = doc.currentLineHeight();

      doc
        .underline(doc.page.width / 2 - linkWidth / 2, 448, linkWidth, linkHeight, { color: '#021c27' })
        .link(doc.page.width / 2 - linkWidth / 2, 448, linkWidth, linkHeight, link)
        .font(path.join(__dirname, './fonts/NotoSansJP-Light.otf'))
        .text(link, doc.page.width / 2 - linkWidth / 2, 448, { width: linkWidth });

      const qrPath = path.join(__dirname, './assets/qr.png');
      doc.image(qrPath, doc.page.width / 2 - 30, doc.page.height - 100, { fit: [60, 60] });

      doc.end();

      writeStream.on('finish', () => {
        resolve(`/certificates/${certificateFileName}`);
      });
    } catch (err) {
      reject(err);
    }
  });
};
