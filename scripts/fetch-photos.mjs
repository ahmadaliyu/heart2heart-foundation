import fs from 'node:fs/promises';
const photos = [['school','VC6MGt9ZoBA'],['support','JYQrknAbFNM'],['confidence','rEBd3_2M-FU'],['reflection','7jYqEcvPL7E'],['family','DvEPn8j0xTo'],['couple','BuoeH1riMyg'],['conversation','WL6YGVTF4Bk']];
const records = await Promise.all(photos.map(async ([name,id])=> {
  const page = await fetch(`https://unsplash.com/photos/${id}`);
  if(!page.ok) throw new Error(`${id}: ${page.status}`);
  const html=await page.text();
  const match=html.match(/<meta property="og:image" content="([^"?]+)/);
  if(!match) throw new Error(`Missing photo ${id}`);
  const url=match[1]+'?auto=format&fit=crop&w=1400&q=85';
  const response=await fetch(url);
  if(!response.ok) throw new Error(`${name}: ${response.status}`);
  await fs.writeFile(`public/images/${name}.jpg`,Buffer.from(await response.arrayBuffer()));
  console.log(`Saved ${name}`);
  return `- ${name}.jpg: https://unsplash.com/photos/${id} (Unsplash License).`;
}));
await fs.copyFile('public/images/women-community.jpg','public/images/connection.jpg');
await fs.copyFile('public/images/community.jpg','public/images/calm.jpg');
await fs.writeFile('docs/assets.md','# Photography\n\n'+records.join('\n')+'\n\nConnection and calm reuse the existing women-community and community assets. Each article has a distinct photograph. Images are illustrative, not portraits of staff or service users.\n\nYouTube thumbnails link to the corresponding TED videos; these are third-party educational resources.\n');
