exports.confirmedHtml = (verifyLink, firstName, venueName, date) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Approved</title>
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
                  <h1>Congratulations🎉🎉 Your booking has been approved✅</h1>
              </div>
              <div class="content">
                  <p>Hello ${firstName},</p>
                  <p>Congratulations — your request to book ${venueName} on ${date} has been approved by the venue owner. Please proceed to complete your payment to confirm your reservation.</p>
                  <div class="button-container">
                      <a href="${verifyLink}" class="button">Pay Now</a>
                  </div>
                  <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
              </div>
              <div class="footer">
                  <p>&copy; Orangefieldteam. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `
}

exports.rejectedHtml = (reasons, firstName, venueName, date) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking rejected<title>
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
                  <h1>❌ Your booking request has been declined.</h1>
              </div>
              <div class="content">
                  <p>Hi ${firstName},</p>
                  <p>Unfortunately, your booking for ${venueName} on ${date} could not be approved by the hall owner. You may browse other available venues on Eventiq</p>
                  <div class="button-container">
                      <h2>Reason: ${reasons}</h2>
                  </div>
                  <p>If you have any questions or need help with your application, don't hesitate to reach out to our support team. We're here to assist you.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Orangefieldteam. All rights reserved.</p>
              </div>
          </div>
      </body>  
      </html>
    `
}
