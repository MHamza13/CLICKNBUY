const passport = require("passport");
const nodemailer = require("nodemailer");

const GOOGLE_CLIENT_ID =
  "289465848111-fgpo5o38e6acg3gkdeajfvcbp0d9g2ou.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:8080/auth/google/callback";



exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizaUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
    console.log("Extracted JWT Token:", token);
  }

  // token =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTc1M2Q5MTk2MWY1Mzg0MWZlZTc3ZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM3OTcwNjY1fQ.v1V-Al9c5lvZzyP6ZSowyZOMfUEdcA6qE6n9LwC0LM4";

  return token;
};

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "iamhamza013@gmail.com", // gmail
    pass: process.env.EMAIL_PASSWORD, // pass
  },
});

exports.sendMail = async function ({ to, subject, text, html }) {
  let info = await transporter.sendMail({
    from: '"E-commerce" <iamhamza013@gmail.com>', // sender address
    to,
    subject,
    text,
    html,
  });
  return info;
};

exports.invoiceTemplate = function (order) {
  return `<!DOCTYPE html>
 <html>
 <head>
   <meta charset="utf-8">
   <meta http-equiv="x-ua-compatible" content="ie=edge">
   <title>Email Receipt</title>
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <style type="text/css">
   /**
    * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
    */
   @media screen {
     @font-face {
       font-family: 'Source Sans Pro';
       font-style: normal;
       font-weight: 400;
       src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
     }
     @font-face {
       font-family: 'Source Sans Pro';
       font-style: normal;
       font-weight: 700;
       src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
     }
   }
   /**
    * Avoid browser level font resizing.
    * 1. Windows Mobile
    * 2. iOS / OSX
    */
   body,
   table,
   td,
   a {
     -ms-text-size-adjust: 100%; /* 1 */
     -webkit-text-size-adjust: 100%; /* 2 */
   }
   /**
    * Remove extra space added to tables and cells in Outlook.
    */
   table,
   td {
     mso-table-rspace: 0pt;
     mso-table-lspace: 0pt;
   }
   /**
    * Better fluid images in Internet Explorer.
    */
   img {
     -ms-interpolation-mode: bicubic;
   }
   /**
    * Remove blue links for iOS devices.
    */
   a[x-apple-data-detectors] {
     font-family: inherit !important;
     font-size: inherit !important;
     font-weight: inherit !important;
     line-height: inherit !important;
     color: inherit !important;
     text-decoration: none !important;
   }
   /**
    * Fix centering issues in Android 4.4.
    */
   div[style*="margin: 16px 0;"] {
     margin: 0 !important;
   }
   body {
     width: 100% !important;
     height: 100% !important;
     padding: 0 !important;
     margin: 0 !important;
   }
   /**
    * Collapse table borders to avoid space between cells.
    */
   table {
     border-collapse: collapse !important;
   }
   a {
     color: #1a82e2;
   }
   img {
     height: auto;
     line-height: 100%;
     text-decoration: none;
     border: 0;
     outline: none;
   }
   </style>
 </head>
 <body style="background-color: #3484ac;">
   <!-- start preheader -->
   <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
     A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
   </div>
   <!-- end preheader -->
   <!-- start body -->
   <table border="0" cellpadding="0" cellspacing="0" width="100%">
     <!-- start logo -->
     <tr>
       <td align="center" bgcolor="#3484ac">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <tr>
             <td align="center" valign="top" style="padding: 36px 24px;">
               <a href="https://e-commerence-store-beta.vercel.app" target="_blank" style="display: inline-block;">
               <?xml version="1.0" encoding="UTF-8"?>
                <svg version="1.1" viewBox="0 0 2048 839" width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <path transform="translate(282,344)" d="m0 0h3l-1 9-6 23-4 24-1 13v44l2 22 2 11 1-31 3-29 5-26 7-25 4-11 2 1 3 35 5 28 10 40 12 36 10 23 8 16 9 16 10 14 11 13 9 8 10 6 15 5 6 4 4 5 2 5v11l-3 7-6 8-9 6-10 4-14 3h-24l-12-3-15-6-21-11-11-8-14-12-12-11-31-29-14-9-10-4-13 1-6 3-4 9-2 13-6 9-3 3-6 2h-7l-8-3-9-8-10-15-12-23-7-11-10-6h-7l-5 6-1 3v20l-3 10-4 6-4 4-6 3h-9l-8-4-5-6-5-10-1-4v-16l5-21 8-20 13-30 13-35 6-21 13-75 2-1 72-3zm-110 36-10 3-10 7-6 8-3 8v7l3 9 9 10 9 5 8 3 7 1h9l11-3 10-5 8-7 5-10v-12l-5-10-7-7-9-5-9-2z" fill="#F49538"/>
                <path transform="translate(282,344)" d="m0 0h3l-1 9-6 23-4 24-1 13v44l2 22 2 11 1-31 3-29 5-26 7-25 4-11 2 1 3 35 5 28 10 40 12 36v2l-18 8-11 8-10 8-6 3-21-7-25-8-36-9-41-8-43-7-16-2-4-2v-56l4-16 12-69 2-1 72-3zm-110 36-10 3-10 7-6 8-3 8v7l3 9 9 10 9 5 8 3 7 1h9l11-3 10-5 8-7 5-10v-12l-5-10-7-7-9-5-9-2z" fill="#352D72"/>
                <path transform="translate(197,250)" d="m0 0h16l12 3 9 5 7 8 6 12 4 15 1 13 30-3h5v12l-1 18-1 1-49 3-109 6h-13v-16l1-8 31-2v-7l5-19 8-16 9-11 10-7 11-5zm-2 14-12 4-9 7-7 8-7 15-4 15v2h12l60-6 10-2v-9l-3-13-5-10-7-7-11-4z" fill="#34A5A4"/>
                <path transform="translate(733,349)" d="m0 0h20l14 24 5 9 5-5 10-17 7-10 1-1h17l1 1v76h-18l-1-1v-39l-4 4-15 24-3 1-10-15-7-11-1-3-2 1v39h-19z" fill="#352E73"/>
                <path transform="translate(1835,349)" d="m0 0h17l5 4 10 16 12 17 1-37h18l1 1v76l-2 1h-8l-7-2-10-15-13-20-4-5-2-1 1 4v36l-1 2-15 1-4-2v-18z" fill="#352D72"/>
                <path transform="translate(1197,345)" d="m0 0h13l10 3 11 7 7 8 5 10 1 4v18l-4 10-6 8-9 8-12 5-10 1-12-2-10-5-9-8-6-10-3-10v-13l5-14 7-9 9-6 9-4zm2 19-9 4-6 8-2 5v10l4 8 8 7 7 2 10-1 8-5 4-5 2-5v-13l-3-6-8-7-6-2z" fill="#352D72"/>
                <path transform="translate(1760,345)" d="m0 0h13l10 3 9 5 9 9 6 13 1 6v10l-2 9-5 9-7 8-9 6-9 3h-19l-9-4-6-4-8-8-6-12-2-9 1-13 4-10 8-10 10-7zm3 19-9 4-7 8-2 5v10l4 8 9 7 7 2h7l8-4 5-5 3-5 1-4v-8l-3-8-6-7-8-3z" fill="#352D72"/>
                <path transform="translate(538,349)" d="m0 0h18l1 1 1 26h30l1-27h19v77l-2 1h-11l-7-1v-13l1-17h-32v30l-2 1h-11l-7-1v-71z" fill="#353174"/>
                <path transform="translate(962,348)" d="m0 0 5 1 4 9 21 56 4 10v2l-2 1h-14l-5-2-3-9-3-1h-12l-15 1-2 11-22-1 11-30 13-36 5-10 2-1zm-6 31-3 5-3 10 2 2h7l4-1-1-8-3-7z" fill="#352E72"/>
                <path transform="translate(673,348)" d="m0 0 8 1 4 8 10 28 9 24 6 17-1 1h-12l-7-2-4-9-4-1h-11l-15 1-2 9-2 2h-11l-9-1 7-20 18-48 4-8 1-1zm-3 31-3 5-3 8v3l2 1h7l4-1-1-9-3-6z" fill="#352E73"/>
                <path transform="translate(1423,345)" d="m0 0h48l1 1v18l-29 1v12l25 1 1 1v16l-5 1h-22l1 12 28 1 2 1v16l-1 1h-45l-4-1z" fill="#353073"/>
                <path transform="translate(1532,345)" d="m0 0h13l13 5 8 6 7 8v3l-13 7-5-2-9-6-3-1h-11l-9 6-5 7-1 3v10l3 6 4 5 7 4 4 1h7l7-3 8-7 9 3 7 4-1 5-7 8-10 6-8 3-11 1-12-2-9-5-7-6-6-9-4-9-1-13 3-13 6-10 9-8 12-6z" fill="#352E72"/>
                <path transform="translate(1105,344)" d="m0 0 12 2 14 7 5 4 5 7v3l-12 7-5-1-7-6-6-2h-10l-10 5-5 8-1 3v10l4 8 7 6 7 2h7l7-3 8-7 5 1 11 6 1 2-8 10-9 6-10 4-13 1-12-3-9-6-8-8-6-12-1-3v-18l4-11 8-10 10-7 11-4z" fill="#352E72"/>
                <path transform="translate(1952,344)" d="m0 0 9 1 9 4 6 4 4 5 1 5-6 5-6 3-5-2-5-4h-10l-1 6 6 4 16 6 9 6 5 8 1 3v9l-5 10-8 6-8 3h-16l-11-4-8-7-3-5 2-4 8-6h5l8 6 3 1h9l4-3v-5l-7-4-15-5-9-6-4-5-2-7 1-10 5-8 7-6z" fill="#352E72"/>
                <path transform="translate(1310,490)" d="m0 0h9l3 5 16 40 6 14 2 1 3-12 11-28 8-19 13-1 1 1v73l-1 1h-8l-1-1-2-49-12 29-7 17-4 4-7-1-4-6-12-30-6-14-1 37v12l-3 2-7-1-1-1v-72z" fill="#F4963B"/>
                <path transform="translate(885,345)" d="m0 0h10l1 1v11l-4 10-16 27-9 15h14l15 1v16l-2 1h-15l-37-1 1-13 6-11 12-20 9-16 1-2h-28l-1-1v-15l1-2z" fill="#352E73"/>
                <path transform="translate(1054,489)" d="m0 0 8 1 5 5 33 55v-57l1-2h9l1 1v56l-1 16-3 1h-8l-5-5-17-28-15-25-1-3-1 1v59l-1 2-8-1-1-1v-74z" fill="#F49539"/>
                <path transform="translate(1597,345)" d="m0 0h51l6 1v18l-19 1-1 61-5 1-14-1v-61l-19-1v-18z" fill="#352D72"/>
                <path transform="translate(1524,490)" d="m0 0h36l9 3 6 7 3 7v10l-4 8-5 5 2 5 5 8 3 10 1 10-2 2h-6l-2-1-3-14-5-10-8-5-19-1v29l-3 2h-8zm11 9v26h23l5-3 3-3 1-3v-9l-4-6-4-2z" fill="#F49539"/>
                <path transform="translate(1175,490)" d="m0 0h18l11 4 8 7 1 6-4 2-7-3-8-5-3-1h-12l-10 5-7 8-3 8v17l5 9 8 6 10 3 10-1 10-5 6-6 2-5-25-1v-7l1-2h32l1 1v34l-1 1-7-1-2-4-6 1-5 3-5 1h-17l-9-3-9-7-6-8-4-11v-15l4-12 6-8 8-7z" fill="#F4963B"/>
                <path transform="translate(738,490)" d="m0 0h15l12 4 10 9 6 9 3 9v11l-3 11-6 9-7 7-10 5-4 1h-17l-12-5-7-6-7-11-3-8v-16l5-12 7-8 11-7zm2 9-9 4-7 6-4 8-1 3v17l4 8 7 7 9 4h15l9-5 7-8 3-9v-12l-3-10-6-7-8-5-4-1z" fill="#F4963B"/>
                <path transform="translate(1348,349)" d="m0 0h19v60h19l12 1v16l-4 1h-35l-10-1-1-1z" fill="#352D72"/>
                <path transform="translate(1272,349)" d="m0 0h19v60h19l11 1v16l-22 1h-21l-6-1z" fill="#352D72"/>
                <path transform="translate(610,491)" d="m0 0h11v34h40v-34h11v73l-2 1h-8l-1-1v-30h-40v30l-1 1h-9l-1-2z" fill="#F49539"/>
                <path transform="translate(1448,490)" d="m0 0h12l16 42 11 30-1 3h-7l-4-3-4-11-7-1h-30l-1 5-4 9-1 1h-8l-1-4 11-30 13-34 4-6zm4 15-5 12-8 22 2 2h25l-2-9-7-21-3-6z" fill="#F4973C"/>
                <path transform="translate(819,490)" d="m0 0h37l8 3 7 8 3 7v10l-3 8-5 7-8 4-9 1h-19v25l-3 2-7 1-1-2zm11 9v30h22l7-3 4-6v-12l-4-6-5-3z" fill="#F49539"/>
                <path transform="translate(538,490)" d="m0 0h15l9 3 6 5 3 5v5l-3 2-5-1-8-7-4-2h-10l-8 4-2 4 1 6 5 4 25 8 6 4 5 5 2 5-1 10-6 8-5 4-7 3h-17l-10-4-8-9-1-7 1-1h6l8 7 7 4h12l8-6 1-2v-6l-5-5-27-9-8-6-3-7v-8l5-8 6-5z" fill="#F4963B"/>
                <path transform="translate(914,490)" d="m0 0h34l8 3 7 8 3 8v9l-3 8-8 9-9 3h-25v27h-9l-1-11v-62zm8 9-1 5v24l1 1h22l7-3 4-6v-12l-4-7-3-2z" fill="#F4963B"/>
                <path transform="translate(1681,349)" d="m0 0h18l1 1v76l-14 1-6-2v-32z" fill="#352E73"/>
                <path transform="translate(1617,490)" d="m0 0h53l1 1v7l-8 1h-14v65l-1 1-9 1-1-1v-66h-20l-2-2z" fill="#F49538"/>
                <path transform="translate(1e3 491)" d="m0 0h10v55l-1 19h-8l-1-1z" fill="#F49539"/>
                </svg>
               </a>
             </td>
           </tr>
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end logo -->
     <!-- start hero -->
     <tr>
       <td align="center" bgcolor="#3484ac">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <tr>
             <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
               <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Thank you for your order!</h1>
             </td>
           </tr>
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end hero -->
     <!-- start copy block -->
     <tr>
       <td align="center" bgcolor="#3484ac">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <!-- start copy -->
           <tr>
             <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
               <p style="margin: 0;">Here is a summary of your recent order. If you have any questions or concerns about your order, please <a href="iamhamza013@gmail.com">contact us</a>.</p>
             </td>
           </tr>
           <!-- end copy -->
           <!-- start receipt table -->
           <tr>
             <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
               <table border="0" cellpadding="0" cellspacing="0" width="100%">
                 <tr>
                   <td align="left" bgcolor="#3484ac" width="60%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Order #</strong></td>
                   <td align="left" bgcolor="#3484ac" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong></strong></td>
                   <td align="left" bgcolor="#3484ac" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>${
                     order.id
                   }</strong></td>
                 </tr>
                 ${order.items.map(
                   (item) => `<tr>
                   <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${
                     item.product.title
                   }</td>
                   <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${
                     item.quantity
                   }</td>
                   <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">$${Math.round(
                     item.product.price *
                       (1 - item.product.discountPercentage / 100),
                     2
                   )}</td>
                 </tr>`
                 )}
                
                
                 <tr>
                   <td align="left" width="60%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #3484ac; border-bottom: 2px dashed #3484ac;"><strong>Total</strong></td>
                   <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #3484ac; border-bottom: 2px dashed #3484ac;"><strong>${
                     order.totalItems
                   }</strong></td>
                   <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #3484ac; border-bottom: 2px dashed #3484ac;"><strong>$${
                     order.totalAmount
                   }</strong></td>
                 </tr>
               </table>
             </td>
           </tr>
           <!-- end reeipt table -->
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end copy block -->
     <!-- start receipt address block -->
     <tr>
       <td align="center" bgcolor="#3484ac" valign="top" width="100%">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <tr>
             <td align="center" valign="top" style="font-size: 0; border-bottom: 3px solid #d4dadf">
               <!--[if (gte mso 9)|(IE)]>
               <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
               <tr>
               <td align="left" valign="top" width="300">
               <![endif]-->
               <div style="display: inline-block; width: 100%; max-width: 50%; min-width: 240px; vertical-align: top;">
                 <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px;">
                   <tr>
                     <td align="left" valign="top" style="padding-bottom: 36px; padding-left: 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                       <p><strong>Delivery Address</strong></p>
                       <p>${order.selectedAddress.name}<br>${
    order.selectedAddress.street
  }<br>${order.selectedAddress.city},${order.selectedAddress.state},${
    order.selectedAddress.pinCode
  }</p>
                       <p>${order.selectedAddress.phone}</p>
                       </td>
                   </tr>
                 </table>
               </div>
               <!--[if (gte mso 9)|(IE)]>
               </td>
               <td align="left" valign="top" width="300">
               <![endif]-->
             
               <!--[if (gte mso 9)|(IE)]>
               </td>
               </tr>
               </table>
               <![endif]-->
             </td>
           </tr>
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end receipt address block -->
     <!-- start footer -->
     <tr>
       <td align="center" bgcolor="#3484ac" style="padding: 24px;">
         <!--[if (gte mso 9)|(IE)]>
         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
         <tr>
         <td align="center" valign="top" width="600">
         <![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
           <!-- start permission -->
           <tr>
             <td align="center" bgcolor="#3484ac" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
               <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
             </td>
           </tr>
           <!-- end permission -->
           <!-- start unsubscribe -->
           <tr>
             <td align="center" bgcolor="#3484ac" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
               <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
               <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
             </td>
           </tr>
           <!-- end unsubscribe -->
         </table>
         <!--[if (gte mso 9)|(IE)]>
         </td>
         </tr>
         </table>
         <![endif]-->
       </td>
     </tr>
     <!-- end footer -->
   </table>
   <!-- end body -->
 </body>
 </html>`;
};
