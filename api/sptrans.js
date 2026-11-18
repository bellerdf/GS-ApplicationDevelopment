export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const TOKEN = "87e2eabd59625aaab31a4b2f33e6e4717ca31c8b766ebef5d52122a941fc4b69";
  const BASE_URL = "https://api.olhovivo.sptrans.com.br/v2.1";
  const { acao, termo, codigoParada } = req.query;

  try {
    // 1. Autenticação na API Olho Vivo
    const authRes = await fetch(`${BASE_URL}/Login/Autenticar?token=${TOKEN}`, {
      method: "POST"
    });
    
    const authText = await authRes.text();
    if (authText !== "true") {
      return res.status(401).json({ erro: "Token inválido ou não autorizado pela SPTrans." });
    }

    // Captura o cookie de sessão gerado no header
    const cookies = authRes.headers.get("set-cookie") || "";

    // 2. Define a rota com base na ação solicitada
    let endpoint = "";
    if (acao === "buscarParada") {
      endpoint = `/Parada/Buscar?termosBusca=${encodeURIComponent(termo)}`;
    } else if (acao === "previsaoParada") {
      endpoint = `/Previsao/Parada?codigoParada=${encodeURIComponent(codigoParada)}`;
    } else {
      return res.status(400).json({ erro: "Ação não especificada." });
    }

    // 3. Consulta os dados usando o cookie de sessão autenticado
    const dataRes = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Cookie": cookies
      }
    });

    const data = await dataRes.json();
    return.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ erro: "Erro interno ao processar requisição da SPTrans." });
  }
}
