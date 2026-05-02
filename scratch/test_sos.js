const testSOS = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/sos/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        location: {
          latitude: 18.5204,
          longitude: 73.8567
        },
        impactForce: 3.5,
        status: 'CRITICAL'
      })
    });
    const data = await response.json();
    console.log('SOS Success:', data);
  } catch (error) {
    console.error('SOS Error:', error.message);
  }
};

testSOS();
