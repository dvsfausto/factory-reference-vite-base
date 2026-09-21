export async function load(url, context, next) {
  if (/\.(png|jpe?g|webp|svg|gif|avif|mp4|woff2?)(\?.*)?$/.test(url)) return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(new URL(url).pathname)}` }
  if (/\.css(\?.*)?$/.test(url)) return { format: 'module', shortCircuit: true, source: 'export default ""' }
  return next(url, context)
}
