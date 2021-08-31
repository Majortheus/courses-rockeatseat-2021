export default async function ExitPreview(_, res): Promise<void> {
  res.clearPreviewData();

  res.writeHead(307, { Location: '/' });
  res.end();
}
