import axios from 'axios';
import Payment from '../../models/Payment.js';
import Enrollment from '../../models/Enrollment.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode'; // Import QRCode library for generating QR codes
import path from 'path';
import { fileURLToPath } from 'url';
export const initiatePayment = async (req, res) => {
  const { amount, email, fullName, courseId } = req.body;

  const studentId = req.user?._id; //  Grab from authenticated user
  const tx_ref = `FIDELHUB-${Date.now()}`;

  if (!studentId) {
    return res.status(401).json({ error: "Unauthorized. Student ID missing." });
  }

  // Logging email and checking for issues with invisible characters
  console.log("Initiating payment with email:", email);
  console.log("Email length:", email.length);
  console.log("Email content:", email);

  try {
    // Step 1: Create a payment record in the database with 'pending' status
    await Payment.create({ studentId, courseId, amount, tx_ref, status: 'pending' });

    // Step 2: Call Chapa API to initialize the transaction
    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount,
        currency: 'ETB',
        email,
        first_name: fullName,
        tx_ref,
        callback_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
        // return_url: `${process.env.FRONTEND_URL}/payment-success?course=${courseId}&tx_ref=${tx_ref}`,
        customization: {
          title: "FidelHub Payment",  
          description: "Payment for Course Enrollment",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    // Step 3: Check if the Chapa API response is successful
    const chapaRes = response.data;
    if (chapaRes.status === 'success') {
      return res.json({ checkoutUrl: chapaRes.data.checkout_url });
    } else {
      console.error("CHAPA Error (status not success):", chapaRes);
      return res.status(400).json({
        error: "Failed to initialize payment",
        details: chapaRes,
      });
    }
  } catch (error) {
    // Handle any unexpected errors in the request process
    console.error("CHAPA Error Response:", error.response?.data || error.message);
    if (error.response?.data) {
      console.log("Full Chapa Response Data:", error.response.data);
    }
    res.status(500).json({ error: "Payment initiation failed" });
  }
};




export const chapaWebhook = async (req, res) => {
  const { event, data } = req.body;

  if (event === "charge.completed" && data.status === "success") {
    const { tx_ref } = data;

    try {
      const payment = await Payment.findOneAndUpdate(
        { tx_ref },
        { status: 'success', chapaData: data },
        { new: true }
      );

      if (!payment) return res.status(404).send("Payment not found");

      await Enrollment.create({
        studentId: payment.studentId,
        courseId: payment.courseId,
        paymentId: payment._id,
      });

      return res.status(200).send("Payment and enrollment successful");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  }

  res.status(400).send("Invalid webhook");
};




export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.params;
  const { course_id } = req.query;

  // Log incoming data
  console.log("Incoming tx_ref:", tx_ref);
  console.log("Incoming course_id:", course_id);

  // Validate required data
  if (!tx_ref) {
    return res.status(400).json({ error: "Transaction reference (tx_ref) is required" });
  }

  if (!course_id) {
    return res.status(400).json({ error: "Course ID is required" });
  }

  try {
    // Call Chapa to verify transaction
    const chapaResponse = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const chapaData = chapaResponse.data;

    // Check chapa verification response
    if (chapaData.status !== 'success') {
      console.log("Chapa payment verification failed:", chapaData);
      return res.status(400).json({
        error: "Payment not successful",
        details: chapaData
      });
    }

    // Debug: Find payment before update
    const existingPayment = await Payment.findOne({ tx_ref: tx_ref.trim() });
    if (!existingPayment) {
      console.log(" No payment found in DB for tx_ref:", tx_ref);
      const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5);
      console.log("📦 Recent Payment Records:", recentPayments);

      return res.status(404).json({ error: "Payment record not found in database" });
    }

    // Update the payment as successful
    const updatedPayment = await Payment.findOneAndUpdate(
      { tx_ref: tx_ref.trim() },
      {
        status: 'success',
        courseId: course_id,
        verifiedAt: new Date(),
        chapaData: chapaData
      },
      { new: true }
    );

    // Create enrollment
    await Enrollment.create({
      studentId: existingPayment.studentId, 
      courseId: course_id,
      paymentId: updatedPayment._id
    });
    

    console.log("  Payment verified & enrollment created.");

    return res.status(200).json({
      message: "Payment verified and user enrolled successfully",
      payment: updatedPayment,
      courseId: course_id
    });

  } catch (error) {
    console.error(" Error verifying payment:", error.message);
    return res.status(500).json({
      error: "Payment verification failed",
      details: error.response?.data || error.message
    });
  }
};



// In your payment controller
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const drawConsolidatedTable = (doc, sections, x, y) => {
  const rowHeight = 25;
  const colWidth = [180, 320];
  const tableWidth = colWidth[0] + colWidth[1];
  let currentY = y;

  sections.forEach(section => {
    // Section header
    doc.fontSize(14)
       .fillColor('#3498db')
       .text(section.title.toUpperCase(), x, currentY, { underline: true });
    currentY += 30;

    // Section rows
    section.rows.forEach((row, i) => {
      const rowY = currentY + (i * rowHeight);
      
      // Alternate row colors
      if (i % 2 === 0) {
        doc.rect(x, rowY, tableWidth, rowHeight)
           .fill('#f8f9fa');
      }

      doc.rect(x, rowY, tableWidth, rowHeight)
         .stroke('#e0e0e0');

      doc.font(i === 0 ? 'Helvetica-Bold' : 'Helvetica')
         .fontSize(10)
         .fillColor(row.highlight ? '#e74c3c' : '#2C3E50')
         .text(row.label, x + 10, rowY + 8)
         .text(row.value, x + colWidth[0] + 10, rowY + 8, {
           width: colWidth[1] - 20
         });
    });

    currentY += (section.rows.length * rowHeight) + 20;
    
    // Add space between sections
    if (section !== sections[sections.length - 1]) {
      currentY += 10;
    }
  });

  return currentY;
};

export const generateReceipt = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    if (!tx_ref) {
      return res.status(400).json({ 
        success: false,
        error: "Transaction reference is required" 
      });
    }

    const payment = await Payment.findOne({ tx_ref })
      .populate('studentId', 'name email phone')
      .populate('courseId', 'title description price instructor duration');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment record not found"
      });
    }

    // Generate QR code
    let qrCodeImage;
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-payment/${tx_ref}`;
      qrCodeImage = await QRCode.toDataURL(verificationUrl);
    } catch (qrError) {
      console.warn('QR code generation failed:', qrError);
    }

    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 40,
      info: {
        Title: `Payment Receipt - ${tx_ref}`,
        Author: 'Your Institution Name'
      }
    });

    doc.on('error', (err) => {
      console.error('PDF stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "Error generating PDF"
        });
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Payment-Receipt-${tx_ref}.pdf`);
    doc.pipe(res);

    // Header with logo
    try {
      const logoPath = path.join(__dirname, '../../../client/src/assets/logo.png');
      doc.image(logoPath, 50, 40, { width: 80 });
      doc.fontSize(20)
         .fillColor('#2C3E50')
         .text('PAYMENT RECEIPT', 150, 60);
    } catch (logoError) {
      doc.fontSize(20)
         .fillColor('#2C3E50')
         .text('YOUR INSTITUTION', 50, 50);
    }

    doc.fontSize(10)
       .fillColor('#7f8c8d')
       .text('OFFICIAL PAYMENT RECEIPT', 50, 90);

    doc.moveTo(50, 105)
       .lineTo(550, 105)
       .stroke('#3498db')
       .lineWidth(1);

    // Consolidated table with all information
    const tableSections = [
      {
        title: 'Payment Information',
        rows: [
          { label: 'Receipt Number', value: tx_ref },
          { label: 'Date', value: new Date(payment.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
          { label: 'Amount Paid', value: `${payment.amount.toLocaleString()} ETB`, highlight: true },
          { label: 'Payment Method', value: payment.chapaData?.data?.method || 'Online Payment' },
          { label: 'Status', value: payment.status.toUpperCase() }
        ]
      },
      {
        title: 'Student Information',
        rows: [
          { label: 'Full Name', value: payment.studentId?.name || 'N/A' },
          { label: 'Email Address', value: payment.studentId?.email || 'N/A' },
          { label: 'Phone Number', value: payment.studentId?.phone || 'N/A' }
        ]
      },
      {
        title: 'Course Information',
        rows: [
          { label: 'Course Title', value: payment.courseId?.title || 'N/A' },
          { label: 'Instructor', value: payment.courseId?.instructor || 'N/A' },
          { label: 'Duration', value: payment.courseId?.duration || 'N/A' },
          { label: 'Course Price', value: `${payment.courseId?.price?.toLocaleString() || '0'} ETB` }
        ]
      }
    ];

    let currentY = drawConsolidatedTable(doc, tableSections, 50, 130);

    // QR Code (if there's space)
    if (qrCodeImage && currentY < 650) {
      doc.image(qrCodeImage, 400, currentY, { width: 100 });
      doc.fontSize(10)
         .fillColor('#7f8c8d')
         .text('Scan to verify payment', 400, currentY + 110, {
           width: 100,
           align: 'center'
         });
      currentY += 130;
    }

    // Footer
    doc.moveTo(50, currentY)
       .lineTo(550, currentY)
       .stroke('#3498db')
       .lineWidth(1);

    doc.fontSize(10)
       .fillColor('#7f8c8d')
       .text('Thank you for your payment!', 50, currentY + 20)
       .text('For any inquiries, please contact support@fidelhub.com', 50, currentY + 35)
       .text(`Generated on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 50, currentY + 50);


    doc.end();
  } catch (error) {
    console.error('Receipt generation failed:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Internal server error while generating receipt",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};
