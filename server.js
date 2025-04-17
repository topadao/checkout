const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

app.post('/gerar-pix', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.pixupbr.com/v2/pix/qrcode',
      {
        recebedor: process.env.PIXUP_RECEBEDOR,
        valor: process.env.PIXUP_VALOR,
        tipo: "DYNAMIC",
        expiracao: 900,
        identificador: "cred-amigo-checkout",
        callback: "https://webhook.site/teste"
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PIXUP_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ erro: 'Erro ao gerar QR Code' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});