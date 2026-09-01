import { demoItems } from '@/lib/demoData'

export async function POST(request: Request) {
  try {
    const { phoneNumber, selectedFlag } = await request.json()

    if (!phoneNumber) {
      return Response.json({ error: 'Phone number required' }, { status: 400 })
    }

    // Filter items by flag if specified
    const items = selectedFlag ? demoItems.filter((item) => item.flag === selectedFlag) : demoItems

    // Group by flag
    const byFlag = {
      ACT: items.filter((item) => item.flag === 'ACT'),
      KNOW: items.filter((item) => item.flag === 'KNOW'),
      NOTE: items.filter((item) => item.flag === 'NOTE'),
    }

    // Format digest message
    let message = '📰 *Advice Monitor Digest*\n\n'

    if (byFlag.ACT.length > 0) {
      message += '🔴 *ACTION REQUIRED*\n'
      byFlag.ACT.forEach((item, idx) => {
        message += `${idx + 1}. ${item.title}\n`
      })
      message += '\n'
    }

    if (byFlag.KNOW.length > 0) {
      message += '🟠 *KNOW*\n'
      byFlag.KNOW.forEach((item, idx) => {
        message += `${idx + 1}. ${item.title}\n`
      })
      message += '\n'
    }

    if (byFlag.NOTE.length > 0) {
      message += '🟢 *REFERENCE*\n'
      byFlag.NOTE.forEach((item, idx) => {
        message += `${idx + 1}. ${item.title}\n`
      })
      message += '\n'
    }

    message += '📊 Total items: ' + items.length + '\n'
    message += '\n✉️ View full digest: https://web-ten-nu-41.vercel.app'

    // Check if Twilio credentials are configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!accountSid || !authToken || !whatsappNumber) {
      // Return mock success for demo - credentials not configured
      return Response.json({
        success: true,
        demo: true,
        message: 'Demo mode: WhatsApp feature requires Twilio credentials. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER env vars.',
        preview: message,
      })
    }

    // Send via Twilio (when configured)
    const formData = new FormData()
    formData.append('From', `whatsapp:${whatsappNumber}`)
    formData.append('To', `whatsapp:${phoneNumber}`)
    formData.append('Body', message)

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message')
    }

    return Response.json({ success: true, message: 'Digest sent to WhatsApp!' })
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return Response.json({ error: 'Failed to send digest' }, { status: 500 })
  }
}
