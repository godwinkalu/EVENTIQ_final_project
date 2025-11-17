exports.confirmedHtml = (verifyLink, firstName, venueName,mydate) => {
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
                  <p>Congratulations — your request to book ${venueName} on ${mydate} has been approved by the venue owner. Please proceed to complete your payment to confirm your reservation.</p>
                  <div class="button-container">
                      <a href="${verifyLink}" class="button">Pay Now</a>
                  </div>
                  <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
              </div>
              <div class="footer">
                  <p>&copy;  All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `
}

exports.rejectedHtml = (reasons, firstName, venueName, mydate) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking rejected</title>
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
            <p>Unfortunately, your booking for <b>${venueName}</b> on <b>${mydate}</b> could not be approved by the hall owner. You may browse other available venues on Eventiq.</p>

            <div class="button-container">
                <h2>Reason: ${reasons}</h2>
            </div>

            <p>If you have any questions or need help with your application, don't hesitate to reach out to our support team. We're here to assist you.</p>
        </div>

        <div class="footer">
            <p>&copy; All rights reserved.</p>
        </div>
    </div>
</body>

</html>

    `
}


exports.ClientInvoiceHtml = (invoiceLink, firstName, venue) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Invoice</title>
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
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #f4f4f4;
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
        a.invoice-btn {
            display: inline-block;
            background-color: #a72828;
            color: #ffffff !important;
            padding: 15px 30px;
            font-size: 18px;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        }
        a.invoice-btn:hover {
            background-color: #8b1f1f;
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
            <h1>Your Booking Invoice is Ready</h1>
        </div>

        <div class="content">
            <p>Hi ${firstName},</p>
            <p>Your invoice for <b>${venue}</b> is now available. Please click the button below to view it.</p>

            <div class="button-container">
                <a class="invoice-btn" href="${invoiceLink}" target="_blank">
                    View Invoice
                </a>
            </div>

            <p>If you have any questions or need assistance, our support team is here to help.</p>
        </div>

        <div class="footer">
            <p>&copy;  All rights reserved.</p>
        </div>
    </div>
</body>

</html>
  `;
};


exports.venueVerification = (firstName, venueName) =>{
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Venue Verified</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        padding: 0;
        margin: 0;
      }

      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 30px auto;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
      }

      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
      }

      .header h2 {
        color: #1a73e8;
        margin: 0;
        font-size: 24px;
      }

      .message {
        margin-top: 20px;
        font-size: 16px;
        color: #444;
        line-height: 1.6;
      }

      .btn {
        display: inline-block;
        padding: 12px 22px;
        margin-top: 25px;
        background-color: #1a73e8;
        color: white !important;
        text-decoration: none;
        font-size: 16px;
        border-radius: 6px;
      }

      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="container">

      <div class="header">
        <h2>Your Venue is Now Verified 🎉</h2>
      </div>

      <div class="message">
        <p>Hello <b>${firstName}</b>,</p>

        <p>Great news! Your venue <strong>${venueName}</strong> has been officially verified by the Eventiq Admin Team.</p>

        <p>
          You can now receive bookings from clients, manage your venue dashboard,
          and enjoy full access to all Eventiq features.
        </p>

        <a href="https://eventiq.app/dashboard" class="btn">Go to Dashboard</a>

        <p style="margin-top: 20px;">
          If you have any questions, feel free to reply to this email or contact support.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Eventiq. All Rights Reserved.
      </div>

    </div>
  </body>
  </html>
  `;
};


exports.venueUnverifiedTemplate = (firstName, venueName, reason) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Venue Unverified</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        background: #ffffff;
        margin: 25px auto;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
      }

      .header {
        text-align: center;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }

      .header h2 {
        color: #e63946;
        margin: 0;
        font-size: 24px;
      }

      .content {
        margin-top: 20px;
        font-size: 16px;
        color: #444;
        line-height: 1.7;
      }

      .reason-box {
        background: #ffe5e5;
        border-left: 4px solid #e63946;
        padding: 12px;
        margin-top: 15px;
        color: #222;
        border-radius: 5px;
      }

      .btn {
        display: inline-block;
        padding: 12px 22px;
        margin-top: 25px;
        background-color: #1a73e8;
        color: #fff !important;
        text-decoration: none;
        border-radius: 6px;
        font-size: 16px;
      }

      .footer {
        margin-top: 30px;
        text-align: center;
        color: #777;
        font-size: 13px;
      }
    </style>
  </head>

  <body>
    <div class="container">

      <div class="header">
        <h2>Your Venue Could Not Be Verified</h2>
      </div>

      <div class="content">
        <p>Hello <b>${firstName}</b>,</p>

        <p>
          We reviewed your venue <strong>${venueName}</strong>, but unfortunately,
          we could not verify it at this time.
        </p>

        <p>Below is the reason provided by our review team:</p>

        <div class="reason-box">
          <strong>Reason:</strong><br/>
          ${reason}
        </div>

        <p style="margin-top: 20px;">
          You can update your venue details and submit for verification again.
        </p>

        <a href="https://eventiq.app/dashboard" class="btn">Update Venue</a>

        <p style="margin-top: 20px;">
          If you need more clarification, please reply to this message or contact support.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Eventiq. All Rights Reserved.
      </div>

    </div>
  </body>
  </html>
  `;
};
