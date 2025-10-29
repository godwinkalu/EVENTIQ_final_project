exports.confirmedHtml = (verifyLink, firstName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profile Approved</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  background-color: #2c2c2c; /* Dark background */
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 80%;
                  margin: 20px auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  background-color: #f4f4f4; /* Light grey background */
              }
              .header {
                  background: #333333;
                  padding: 20px;
                  text-align: center;
                  border-bottom: 1px solid #ddd;
                  color: #ffffff;
                  border-radius: 10px 10px 0 0;
              }
              .content {
                  padding: 20px;
                  color: #333333;
              }
              .button-container {
                  text-align: center;
                  margin: 20px 0;
              }
              .button {
                  display: inline-block;
                  background-color: #482188ff; /* Green background */
                  color: #ffffff;
                  padding: 15px 30px;
                  font-size: 18px;
                  text-decoration: none;
                  border-radius: 5px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  transition: background-color 0.3s ease;
              }
              .button:hover {
                  background-color: #582188ff;
              }
              .footer {
                  background: #333333;
                  padding: 10px;
                  text-align: center;
                  border-top: 1px solid #ddd;
                  font-size: 0.9em;
                  color: #cccccc;
                  border-radius: 0 0 10px 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Congratulations! Profile Approved</h1>
              </div>
              <div class="content">
                  <p>Hello ${firstName},</p>
                  <p>We are excited to inform you that your profile has been approved and is now fully functional. You now have full access to perform all necessary operations as instructed by your manager.</p>
                  <p>Please click the button below to proceed with the application:</p>
                  <div class="button-container">
                      <a href="${verifyLink}" class="button">Proceed</a>
                  </div>
                  <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
              </div>
              <div class="footer">
                  <p>&copy; Orangefieldteam. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
  
exports.rejectedHtml = (reasons, firstName) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profile Rejected</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  background-color: #2c2c2c; /* Dark background */
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 80%;
                  margin: 20px auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  background-color: #f4f4f4; /* Light grey background */
              }
              .header {
                  background: #333333;
                  padding: 20px;
                  text-align: center;
                  border-bottom: 1px solid #ddd;
                  color: #ffffff;
                  border-radius: 10px 10px 0 0;
              }
              .content {
                  padding: 20px;
                  color: #333333;
              }
              .button-container {
                  text-align: center;
                  margin: 20px 0;
              }
              h2 {
                  display: inline-block;
                  background-color: #a72828; /* Red background */
                  color: #ffffff;
                  padding: 15px 30px;
                  font-size: 18px;
                  text-decoration: none;
                  border-radius: 5px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  transition: background-color 0.3s ease;
              }
              .button:hover {
                  background-color: #218838;
              }
              .footer {
                  background: #333333;
                  padding: 10px;
                  text-align: center;
                  border-top: 1px solid #ddd;
                  font-size: 0.9em;
                  color: #cccccc;
                  border-radius: 0 0 10px 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Oops! Profile Rejected</h1>
              </div>
              <div class="content">
                  <p>Hi ${firstName},</p>
                  <p>We regret to inform you that your profile was not approved. Please review the reasons below and make the necessary updates before reapplying:</p>
                  <div class="button-container">
                      <h2>${reasons}</h2>
                  </div>
                  <p>If you have any questions or need help with your application, don't hesitate to reach out to our support team. We're here to assist you.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Orangefieldteam. All rights reserved.</p>
              </div>
          </div>
      </body>  
      </html>
    `;
  }