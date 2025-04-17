const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static('public'));
app.use(express.json());

const RECEBEDOR_ID = 'gomes1551_5842553951';
const TOKEN = 'gomes1551_584255395115833350cb95c397d6d0cf15057644abbb305b5546a7130005f8463caeaea3cf';

app.post('/gerar-pix', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.pixupbr.com/v2/pix/qrcode',
      {
        recebedor: RECEBEDOR_ID,
        valor: 36.9,
        descricao: 'Pagamento Cred Amigo',
        validade: 900, // 15 minutos
        callback: 'https://crediamigofacil.com'
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    const { imagemQrcode, brcode } = response.data;
    res.json({ imagemQrcode, brcode });
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err.response?.data || err.message);
    res.status(500).json({ erro: 'Erro ao gerar QR Code' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
