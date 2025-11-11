exports.confirmedHtml = (verifyLink, firstName, venueName,date) => {
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

exports.VenueOwnerInvoiceHtml = (invoiceLink, ) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice Notification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              background-color: #2c2c2c;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 80%;
              max-width: 700px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              background-color: #f4f4f4;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              background: #333333;
              padding: 20px;
              text-align: center;
              color: #ffffff;
              border-radius: 10px 10px 0 0;
          }
          .content {
              padding: 20px;
              color: #333333;
          }
          .details {
              background-color: #ffffff;
              border-radius: 8px;
              border: 1px solid #ddd;
              padding: 15px;
              margin-top: 15px;
          }
          .details p {
              margin: 6px 0;
          }
          .button-container {
              text-align: center;
              margin: 30px 0 20px;
          }
          .button {
              display: inline-block;
              background-color: #482188ff;
              color: #ffffff;
              padding: 15px 30px;
              font-size: 16px;
              text-decoration: none;
              border-radius: 6px;
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
              font-size: 0.9em;
              color: #cccccc;
              border-radius: 0 0 10px 10px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>New Invoice Generated 💼</h1>
          </div>
          <div class="content">
              <p>Hello ${ownerName},</p>
              <p>An invoice has been successfully generated for a booking at <strong>${venueName}</strong>.</p>

              <div class="details">
                  <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
                  <p><strong>Client Name:</strong> ${clientName}</p>
                  <p><strong>Booking Date:</strong> ${bookingDate}</p>
                  <p><strong>Total Amount:</strong> ₦${Number(totalAmount).toLocaleString()}</p>
              </div>

              <div class="button-container">
                  <a href="${invoiceLink}" class="button">View Invoice</a>
              </div>

              <p style="text-align:center;">You can view and download this invoice anytime from your Orangefield dashboard.</p>
          </div>

          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Orangefield Team. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};


exports.ClientInvoiceHtml = (invoiceLink,firstName ) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Booking Invoice</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #2c2c2c;
              color: #333;
              margin: 0;
              padding: 0;
          }
          .container {
              width: 80%;
              max-width: 700px;
              margin: 40px auto;
              background-color: #f8f8f8;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              overflow: hidden;
          }
          .header {
              background-color: #333333;
              color: #ffffff;
              text-align: center;
              padding: 25px 10px;
          }
          .header h1 {
              margin: 0;
              font-size: 1.8em;
          }
          .content {
              padding: 25px 30px;
              color: #333333;
          }
          .content h2 {
              color: #482188ff;
              font-size: 1.4em;
          }
          .details {
              margin-top: 15px;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 15px;
              border: 1px solid #ddd;
          }
          .details p {
              margin: 8px 0;
              font-size: 1em;
          }
          .details strong {
              color: #000;
          }
          .button-container {
              text-align: center;
              margin: 30px 0 10px;
          }
          .button {
              display: inline-block;
              background-color: #482188ff;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 30px;
              border-radius: 6px;
              font-size: 16px;
              transition: background-color 0.3s ease;
          }
          .button:hover {
              background-color: #582188ff;
          }
          .footer {
              background-color: #333333;
              color: #cccccc;
              text-align: center;
              font-size: 0.9em;
              padding: 12px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Invoice Generated Successfully</h1>
          </div>
          <div class="content">
              <p>Hello ${firstName},</p>
              <p>Thank you for booking with <strong>Orangefield</strong>! Below are the details of your recent booking invoice.</p>

             

              <div class="button-container">
                  <a href="${invoiceLink}" class="button">View Invoice</a>
              </div>

              <p style="text-align:center;">If you have any questions, feel free to contact our support team.</p>
          </div>

          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Orangefield Team. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};
