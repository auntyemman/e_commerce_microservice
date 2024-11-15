export const emailVerificationTemplate = (
  username: string,
  link: string,
): string => {
  return `
          <!DOCTYPE html>
          <html>
          
          <head>
              <title>Email Verification</title>
              <style>
                  body {
                      font-family: 'Arial', sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
          
                  .container {
                      background-color: #ffffff;
                      max-width: 600px;
                      margin: 20px auto;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
                  }
          
                  .header {
                      text-align: center;
                      padding-bottom: 10px;
                      border-bottom: 2px solid #f2f2f2;
                  }
          
                  .header h1 {
                      color: #333;
                  }
          
                  .content {
                      padding: 20px 0;
                      color: #444;
                  }
          
                  .cta-button {
                      display: inline-block;
                      padding: 10px 20px;
                      margin: 20px 0;
                      background-color: #007bff;
                      color: #fff;
                      text-decoration: none;
                      border-radius: 5px;
                  }
          
                  .cta-button span {
                      color: #0a0000;
                  }
          
                  .footer {
                      color: #666;
                      font-size: 14px;
                  }
              </style>
          </head>
          
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Your Account Verification</h1>
                  </div>
                  <div class="content">
                      <p>Hello ${username},</p>
                      <p>Thank you for joining! To activate your account and access our services, please click the button below:</p>
                      <a href="${link}" class="cta-button"><span>Verify Your Account</span></a>
                      <p>For security reasons, this verification link will expire in 48 hours. After that, please contact support for assistance.</p>
                  </div>
                  <div class="footer">
                      <p>Best regards,</p>
                      <p>Molecules Ltd</p>
                  </div>
              </div>
          </body>
          
          </html>
        `;
};
