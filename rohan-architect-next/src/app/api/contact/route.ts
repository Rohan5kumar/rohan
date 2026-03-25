import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the environment variable (ensure this is set in Netlify)
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback');

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required to establish a connection.' },
        { status: 400 }
      );
    }

    // Dispatch the handshake confirmation email to the user
    // The "from" address must be a verified domain in your Resend account (e.g., hello@rohan.fouralpha.org or contact@explyra.com)
    const { data, error } = await resend.emails.send({
      from: 'System Architect <system@explyra.com>', // Update this to your verified domain
      to: email,
      subject: '[ REQUEST_RECEIVED ] Acknowledging Your Transmission',
      html: `
        <div style="font-family: monospace; background-color: #000; color: #00f3ff; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #333;">
          <h2 style="margin-top: 0; color: #fff;">>> SYSTEM Acknowledgment <<</h2>
          <p>Handshake confirmed. Your transmission has been successfully routed to my personal server.</p>
          <div style="background-color: #111; padding: 16px; margin: 24px 0; border-left: 4px solid #00f3ff;">
            <p style="margin: 0; color: #888;">Attached Payload:</p>
            <p style="margin-top: 8px; color: #fff;">"${message || 'No additional message payload provided.'}"</p>
          </div>
          <p>I will review your inquiry and follow up shortly.</p>
          <hr style="border-color: #333; margin: 24px 0;" />
          <p style="color: #666; font-size: 12px; margin-bottom: 0;">
            Rohan Krishnagoudar | System Architect & Co-Founder @ Explyra<br/>
            <em>"Efficiency is the only true currency."</em>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Success
    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error during transaction.' },
      { status: 500 }
    );
  }
}
