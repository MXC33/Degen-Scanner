const express = require('express');
const { getTokenHolders, getTokenMetadata } = require('./tokenHolders');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/token-info/:mintAddress', async (req, res) => {
  try {
    const { mintAddress } = req.params;
    console.log(`Fetching info for address: ${mintAddress}`);

    const [holderCount, metadata] = await Promise.all([
      getTokenHolders(process.env.HELIUS_API_KEY, mintAddress),
      getTokenMetadata(process.env.HELIUS_API_KEY, mintAddress),
    ]);

    res.json({
      mintAddress,
      holderCount,
      metadata,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while fetching token information",
      details: error.message,
    });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});