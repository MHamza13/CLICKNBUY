const { Contact } = require("../modle/contact");
const { sendMail } = require("../server/Common");

exports.createContact = async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, message } = req.body;

  try {
    const newContact = new Contact({
      message,
      name,
      email,
      phone,
      user: userId,
    });

    const savedContact = await newContact.save();

    const emailDetails = {
      to: "recipient@example.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
      html: `<p>You have a new contact form submission:</p>
                 <p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Phone:</strong> ${phone}</p>
                 <p><strong>Message:</strong> ${message}</p>`,
    };

    // Send the email
    await sendMail(emailDetails);

    res.status(201).json({
      contact: savedContact,
    });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(400).json({
      message: "Failed to save contact",
      error: err.message,
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({
      contacts,
    });
  } catch (err) {
    console.error("Error retrieving contacts:", err);
    res.status(500).json({
      message: "Failed to retrieve contacts",
      error: err.message,
    });
  }
};
