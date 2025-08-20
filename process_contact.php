<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize form data
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = filter_var(trim($_POST['phone']), FILTER_SANITIZE_STRING);
    $service = filter_var(trim($_POST['service']), FILTER_SANITIZE_STRING);
    $message_content = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($service) || empty($message_content)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Please provide a valid email address.']);
        exit;
    }
    
    // Prepare email content
    $to = "info@glittersandsparkles.com"; // Replace with your email
    $subject = "New Contact Form Submission from $name";
    
    $email_body = "
    <html>
    <head>
        <title>New Contact Message</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
            .content { margin: 20px 0; }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
                <p>From your website contact form</p>
            </div>
            <div class='content'>
                <div class='field'><span class='field-label'>Name:</span> $name</div>
                <div class='field'><span class='field-label'>Email:</span> $email</div>
                <div class='field'><span class='field-label'>Phone:</span> " . (!empty($phone) ? $phone : 'Not provided') . "</div>
                <div class='field'><span class='field-label'>Service:</span> $service</div>
                <div class='field'><span class='field-label'>Message:</span><br> $message_content</div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Set headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Glitters and Sparkles Website <noreply@glittersandsparkles.com>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    
    // Send email
    if (mail($to, $subject, $email_body, $headers)) {
        // Send confirmation email to customer
        $customer_subject = "Thank you for contacting Glitters and Sparkles Cleaning";
        $customer_message = "
        <html>
        <head>
            <title>Thank You</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4a6ee0;'>Thank you for your message!</h2>
                <p>We have received your inquiry and will respond within 24 hours.</p>
                <p>If you have any urgent questions, please call us at <strong>+447 7836 202627</strong></p>
                <br>
                <p>Best regards,<br>The Glitters and Sparkles Team</p>
            </div>
        </body>
        </html>
        ";
        
        $customer_headers = "MIME-Version: 1.0" . "\r\n";
        $customer_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $customer_headers .= "From: Glitters and Sparkles Cleaning <info@glittersandsparkles.com>" . "\r\n";
        
        mail($email, $customer_subject, $customer_message, $customer_headers);
        
        echo json_encode(['status' => 'success', 'message' => 'Thank you! Your message has been sent. We will contact you soon.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Sorry, there was an error sending your message. Please try again or call us directly.']);
    }
} else {
    // Not a POST request
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
