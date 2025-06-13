import axios from 'axios';
import Payment from '../../models/Payment.js';
import Enrollment from '../../models/Enrollment.js';
import Transaction from '../../models/Transaction.js';
import Course from '../../models/Course.js';
import User from '../../models/User.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initiatePayment = async (req, res) => {
  const { amount, email, fullName, courseId } = req.body;
  const studentId = req.user?._id; // Grab from authenticated user
  const tx_ref = `FIDELHUB-${Date.now()}`;

  if (!studentId) {
    return res.status(401).json({ error: 'Unauthorized. Student ID missing.' });
  }

  // Validate required fields
  if (!amount || !email || !fullName || !courseId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Validate environment variables
  if (!process.env.BACKEND_URL || !process.env.CHAPA_SECRET_KEY) {
    console.error('Missing required environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Log email for debugging
  console.log('Initiating payment with email:', email);
  console.log('Email length:', email.length);
  console.log('Email content:', email);
  console.log('Chapa callback_url:', `${process.env.BACKEND_URL}/api/payments/webhook`);

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
        // callback_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
        return_url: `${process.env.FRONTEND_URL}/payment-success?course=${courseId}&tx_ref=${tx_ref}`,
        customization: {
          title: 'FidelHub Payment',
          description: 'Payment for Course Enrollment',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
        timeout: 10000, // 10 seconds
      }
    );

    // Step 3: Check if the Chapa API response is successful
    const chapaRes = response.data;
    if (chapaRes.status === 'success') {
      return res.json({ checkoutUrl: chapaRes.data.checkout_url });
    } else {
      console.error('CHAPA Error (status not success):', chapaRes);
      return res.status(400).json({
        error: 'Failed to initialize payment',
        details: chapaRes,
      });
    }
  } catch (error) {
    // Handle any unexpected errors in the request process
    console.error('CHAPA Error Response:', error.response?.data || error.message);
    if (error.response?.data) {
      console.log('Full Chapa Response Data:', error.response.data);
    }
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

export const chapaWebhook = async (req, res) => {
  const { event, data } = req.body;

  console.log('Webhook Received:', {
    headers: req.headers,
    body: JSON.stringify(req.body, null, 2),
  });

  if (event === 'charge.completed' && data.status === 'success') {
    const { tx_ref } = data;

    try {
      // Update payment status
      const payment = await Payment.findOneAndUpdate(
        { tx_ref },
        { status: 'success', chapaData: data },
        { new: true }
      );

      if (!payment) {
        console.error('Payment not found for tx_ref:', tx_ref);
        return res.status(404).send('Payment not found');
      }

       const course = await Course.findById(payment.courseId);
      if (!course) {
        console.error('Course not found for courseId:', payment.courseId);
        return res.status(404).send('Course not found');
      }

      const instructorId = course.instructor;
      if (!instructorId) {
        console.error('Instructor not found for course:', payment.courseId);
        return res.status(404).send('Instructor not found for the course');
      }

       const instructorShare = payment.amount * 0.8;
      const platformShare = payment.amount * 0.2;
      const existingTx = await Transaction.findOne({ paymentId: payment._id });

      if (!existingTx) {
        await Transaction.create({
          studentId: payment.studentId,
          courseId: payment.courseId,
          instructorId,
          paymentId: payment._id,
          amountPaid: payment.amount,
          instructorShare,
          platformShare,
          status: 'completed',
        });
        

        // Update instructor balance
        await User.findByIdAndUpdate(
          instructorId,
          { $inc: { availableBalance: instructorShare } }
        );
        console.log('Instructor balance updated for instructorId:', instructorId);
      } else {
        console.log('Transaction already exists for paymentId:', payment._id);
      }

      // Create enrollment
      const alreadyEnrolled = await Enrollment.findOne({
        studentId: payment.studentId,
        courseId: payment.courseId,
      });

      if (!alreadyEnrolled) {
        await Enrollment.create({
          studentId: payment.studentId,
          courseId: payment.courseId,
          paymentId: payment._id,
        });
        console.log('Enrollment created for studentId:', payment.studentId);
      } else {
        console.log('Student already enrolled for courseId:', payment.courseId);
      }

      return res.status(200).send('Payment, transaction, and enrollment successful');
    } catch (error) {
      console.error('Webhook Processing Error:', error.message, error.stack);
      if (error.response) {
        console.error('Chapa API Error:', error.response.data);
      } else if (error.request) {
        console.error('No response from Chapa API:', error.request);
      }
      return res.status(500).send('Server error');
    }
  }

  console.error('Invalid webhook event or status:', { event, status: data?.status });
  res.status(400).send('Invalid webhook');
};

export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.params;
  const { course_id } = req.query;

  // Log incoming data for debugging
  console.log('Verify Payment - Incoming tx_ref:', tx_ref);
  console.log('Verify Payment - Incoming course_id:', course_id);

  // Validate required data
  if (!tx_ref) {
    console.error('Verify Payment - Missing tx_ref');
    return res.status(400).json({ error: 'Transaction reference (tx_ref) is required' });
  }

  if (!course_id) {
    console.error('Verify Payment - Missing course_id');
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    // Call Chapa to verify transaction
    const chapaResponse = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
        timeout: 10000,
      }
    );

    const chapaData = chapaResponse.data;
    console.log('Verify Payment - Chapa Verification Response:', chapaData);

    // Check Chapa verification response
    if (chapaData.status !== 'success' || chapaData.data.status !== 'success') {
      console.error('Verify Payment - Chapa payment verification failed:', chapaData);
      return res.status(400).json({
        error: 'Payment not successful',
        details: chapaData,
      });
    }

    // Find existing payment
    const existingPayment = await Payment.findOne({ tx_ref: tx_ref.trim() });
    if (!existingPayment) {
      console.error('Verify Payment - No payment found in DB for tx_ref:', tx_ref);
      const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5);
      console.log('Verify Payment - Recent Payment Records:', recentPayments);
      return res.status(404).json({ error: 'Payment record not found in database' });
    }

    // Update payment status
    const updatedPayment = await Payment.findOneAndUpdate(
      { tx_ref: tx_ref.trim() },
      {
        status: 'success',
        courseId: course_id,
        verifiedAt: new Date(),
        chapaData: chapaData,
      },
      { new: true }
    );

    // Fetch course to get instructorId
    const course = await Course.findById(course_id);
    if (!course) {
      console.error('Verify Payment - Course not found for courseId:', course_id);
      return res.status(404).json({ error: 'Course not found' });
    }

    const instructorId = course.instructor;
    if (!instructorId) {
      console.error('Verify Payment - Instructor not found for course:', course_id);
      return res.status(404).json({ error: 'Instructor not found for the course' });
    }

    // Create transaction if it doesn't exist
    const instructorShare = existingPayment.amount * 0.8;
    const platformShare = existingPayment.amount * 0.2;
    const existingTx = await Transaction.findOne({ paymentId: updatedPayment._id });

    if (!existingTx) {
      await Transaction.create({
        studentId: existingPayment.studentId,
        courseId: course_id,
        instructorId,
        paymentId: updatedPayment._id,
        amountPaid: existingPayment.amount,
        instructorShare,
        platformShare,
        status: 'completed',
      });
      console.log('Verify Payment - Transaction created for tx_ref:', tx_ref);

      // Update instructor balance
      await User.findByIdAndUpdate(
        instructorId,
        { $inc: { availableBalance: instructorShare } }
      );
      console.log('Verify Payment - Instructor balance updated for instructorId:', instructorId);
    } else {
      console.log('Verify Payment - Transaction already exists for paymentId:', updatedPayment._id);
    }

    // Create enrollment if not already present
    const alreadyEnrolled = await Enrollment.findOne({
      studentId: existingPayment.studentId,
      courseId: course_id,
    });

    if (!alreadyEnrolled) {
      await Enrollment.create({
        studentId: existingPayment.studentId,
        courseId: course_id,
        paymentId: updatedPayment._id,
      });
      console.log('Verify Payment - Enrollment created for studentId:', existingPayment.studentId);
    } else {
      console.log('Verify Payment - Student already enrolled for courseId:', course_id);
    }

    console.log('Verify Payment - Payment verified, transaction processed, and enrollment created.');

    return res.status(200).json({
      message: 'Payment verified, transaction processed, and user enrolled successfully',
      payment: updatedPayment,
      courseId: course_id,
    });
  } catch (error) {
    console.error('Verify Payment - Error:', error.message, error.stack);
    if (error.response) {
      console.error('Verify Payment - Chapa API Error:', error.response.data);
    } else if (error.request) {
      console.error('Verify Payment - No response from Chapa API:', error.request);
    }
    return res.status(500).json({
      error: 'Payment verification failed',
      details: error.response?.data || error.message,
    });
  }
};

export const generateReceipt = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    if (!tx_ref) {
      return res.status(400).json({ 
        success: false,
        error: 'Transaction reference is required',
      });
    }

    const payment = await Payment.findOne({ tx_ref })
      .populate('studentId', 'name email phone')
      .populate('courseId', 'title description price instructor duration');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment record not found',
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
        Author: 'Your Institution Name',
      },
    });

    doc.on('error', (err) => {
      console.error('PDF stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Error generating PDF',
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
          { label: 'Status', value: payment.status.toUpperCase() },
        ],
      },
      {
        title: 'Student Information',
        rows: [
          { label: 'Full Name', value: payment.studentId?.name || 'N/A' },
          { label: 'Email Address', value: payment.studentId?.email || 'N/A' },
          { label: 'Phone Number', value: payment.studentId?.phone || 'N/A' },
        ],
      },
      {
        title: 'Course Information',
        rows: [
          { label: 'Course Title', value: payment.courseId?.title || 'N/A' },
          { label: 'Instructor', value: payment.courseId?.instructor || 'N/A' },
          { label: 'Duration', value: payment.courseId?.duration || 'N/A' },
          { label: 'Course Price', value: `${payment.courseId?.price?.toLocaleString() || '0'} ETB` },
        ],
      },
    ];

    let currentY = drawConsolidatedTable(doc, tableSections, 50, 130);

    // QR Code (if there's space)
    if (qrCodeImage && currentY < 650) {
      doc.image(qrCodeImage, 400, currentY, { width: 100 });
      doc.fontSize(10)
         .fillColor('#7f8c8d')
         .text('Scan to verify payment', 400, currentY + 110, {
           width: 100,
           align: 'center',
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
        error: 'Internal server error while generating receipt',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
};