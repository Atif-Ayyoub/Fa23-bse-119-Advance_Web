async function run() {
  const base = 'http://localhost:5000'
  try {
    console.log('GET /api/v1/health')
    let r = await fetch(`${base}/api/v1/health`)
    console.log('health status', r.status)
    console.log(await r.json())
  } catch (e) { console.error('health error', e.message) }

  async function post(path, body) {
    try {
      console.log('\nPOST', path)
      let r = await fetch(`${base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const text = await r.text()
      console.log('status', r.status)
      try { console.log(JSON.parse(text)) } catch { console.log(text) }
    } catch (e) { console.error('request error', e.message) }
  }

  await post('/api/v1/forms/contact', { name: 'Automated Test', email: 'test@example.com', message: 'hello', recaptchaToken: 'test' })
  await post('/api/v1/forms/enroll', { name: 'Automated Test', email: 'test@example.com', phone: '1234567890', course: 'Sample', recaptchaToken: 'test' })
  await post('/api/v1/forms/workshop', { name: 'Automated Test', email: 'test@example.com', phone: '1234567890', workshop: 'Sample', recaptchaToken: 'test' })
}

run()
  .then(()=>process.exit(0))
  .catch(err=>{ console.error(err); process.exit(1) })
