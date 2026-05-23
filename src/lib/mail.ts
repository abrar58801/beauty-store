import nodemailer from "nodemailer";
const SITE_URL =
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(email: string) {
  await transporter.sendMail({
    from: `"Beauty Luxe" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to Beauty Luxe 💖",
    html: `
      <div style="font-family:Arial;padding:40px;background:#fff8fb;">
        <div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:20px;">
          <h1 style="color:#111;font-size:32px;">
            Welcome to Beauty Luxe 💖
          </h1>

          <p style="color:#666;font-size:16px;line-height:1.8;">
            Thank you for subscribing to our newsletter.
          </p>

          <p style="color:#666;font-size:16px;line-height:1.8;">
            You'll be the first to receive:
          </p>

          <ul style="color:#666;font-size:16px;line-height:2;">
            <li>Exclusive offers</li>
            <li>New product launches</li>
            <li>Beauty tips & updates</li>
            <li>Special discounts</li>
          </ul>

          <a
            href="${SITE_URL}"
            style="
              display:inline-block;
              padding:14px 28px;
              background:black;
              color:white;
              text-decoration:none;
              border-radius:999px;
              margin-top:20px;
            "
          >
            Shop Now
          </a>

          <p style="margin-top:40px;color:#999;">
            — Beauty Luxe Team
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"Beauty Luxe Contact" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    replyTo: data.email,
    subject: `New Contact Message: ${data.subject}`,
    html: `
      <div style="font-family:Arial;padding:40px;background:#fff8fb;">
        <div style="max-width:700px;margin:auto;background:white;padding:40px;border-radius:20px;">
          <h1>New Contact Inquiry</h1>

          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>

          <hr style="margin:20px 0;" />

          <p><strong>Message:</strong></p>
          <p style="line-height:1.8;color:#555;">
            ${data.message}
          </p>
        </div>
      </div>
    `,
  });
}