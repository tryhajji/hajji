const createPaymentIntent = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any other necessary headers like Authorization if needed
      },
      credentials: 'include', // if you're using cookies
      body: JSON.stringify({
        // your payment data
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}; 