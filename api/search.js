export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { number, aadhaar } = req.query;

  if (!number && !aadhaar) {
    return res.status(400).json({
      success: false,
      message: "Phone number or Aadhaar required"
    });
  }

  try {
    let apiUrl;
    
    if (number) {
      apiUrl = `https://happy-family-api.vercel.app/api/aggregate?number=${number}`;
    } else {
      apiUrl = `https://happy-family-api.vercel.app/api/aggregate?aadhaar=${aadhaar}`;
    }
    
    console.log('Calling:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      fetched: data,
      search_type: number ? 'phone' : 'aadhaar',
      message: "Data fetched successfully"
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
}
