// components/PayWithChapa.jsx
import axios from 'axios';

const PayWithChapa = ({ course, user }) => {
  const handlePayment = async () => {
    const res = await axios.post('http://localhost:5000/api/payments/initiate', {
      amount: course.price,
      email: user.email,
      fullName: user.name,
      studentId: user._id,
      courseId: course._id
    });

    window.location.href = res.data.checkoutUrl;
  };

  return (
    <button onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded-lg">
      Enroll with Chapa
    </button>
  );
};

export default PayWithChapa;
