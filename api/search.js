// pages/api/search.js (Next.js) or server.js (Node.js)

export default async function handler(req, res) {
  const { number, aadhaar } = req.query;

  if (!number && !aadhaar) {
    return res.status(400).json({
      success: false,
      message: "Phone number or Aadhaar required"
    });
  }

  try {
    let apiUrl;
    
    // Determine which parameter to use
    if (number) {
      apiUrl = `https://happy-family-api.vercel.app/api/aggregate?number=${number}`;
    } else if (aadhaar) {
      apiUrl = `https://happy-family-api.vercel.app/api/aggregate?aadhaar=${aadhaar}`;
    }
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the data in expected format
    return res.status(200).json({
      success: true,
      fetched: data,
      search_type: number ? 'phone' : 'aadhaar',
      message: "Data fetched successfully"
    });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
}
