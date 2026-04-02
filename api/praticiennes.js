module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const response = await fetch(
    "https://api.notion.com/v1/databases/2f75b2304fce800688c3d8820ce9e928/query",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ page_size: 100 })
    }
  );
  
  const data = await response.json();
  res.status(200).json(data);
}
