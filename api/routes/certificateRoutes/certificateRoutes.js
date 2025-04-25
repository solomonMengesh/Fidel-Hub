 import express from 'express';
import { generateCertificateForStudent } from '../../controllers/certificateController/certificateController.js';

const router = express.Router();

 router.get('/generate-certificate/:studentId/:courseId', generateCertificateForStudent);

export default router;
