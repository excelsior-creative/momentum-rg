import type { CollectionConfig } from 'payload'

function generateEmailHTML({
  name,
  email,
  phone,
  inquiryType,
  message,
}: {
  name: string
  email: string
  phone?: string | null
  inquiryType?: string | null
  message: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: #FF5722; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                Contact Inquiry
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 5px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      From
                    </p>
                    <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                      ${name}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 5px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      Email
                    </p>
                    <p style="margin: 0;">
                      <a href="mailto:${email}" style="color: #1a1a1a; font-size: 16px; text-decoration: none;">
                        ${email}
                      </a>
                    </p>
                  </td>
                </tr>
                ${
                  inquiryType
                    ? `<tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 5px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      Inquiry Type
                    </p>
                    <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.7;">
                      ${inquiryType}
                    </p>
                  </td>
                </tr>`
                    : ''
                }
                ${
                  phone
                    ? `<tr>
                  <td style="padding: 20px 0; border-bottom: 1px solid #eee;">
                    <p style="margin: 0 0 5px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      Phone
                    </p>
                    <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.7;">
                      ${phone}
                    </p>
                  </td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="padding-top: 20px;">
                    <p style="margin: 0 0 10px 0; color: #FF5722; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                      Message
                    </p>
                    <div style="background-color: #f9f9f9; border-left: 4px solid #FF5722; padding: 20px; border-radius: 0 4px 4px 0;">
                      <p style="margin: 0; color: #333; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
${message}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  custom: {
    recaptcha: [
      {
        name: 'create',
        action: 'contact_form',
      },
    ],
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') {
          return doc
        }

        await req.payload.sendEmail({
          to: process.env.CONTACT_EMAIL || 'admin@example.com',
          from: process.env.FROM_EMAIL || 'noreply@example.com',
          replyTo: doc.email,
          subject: `New Contact: ${doc.name}`,
          html: generateEmailHTML({
            name: doc.name,
            email: doc.email,
            phone: doc.phone,
            inquiryType: doc.inquiryType,
            message: doc.message,
          }),
        })

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'inquiryType',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
      ],
      required: true,
    },
  ],
}
