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
    $service_type = filter_var(trim($_POST['serviceType']), FILTER_SANITIZE_STRING);
    $preferred_date = filter_var(trim($_POST['preferredDate']), FILTER_SANITIZE_STRING);
    $additional_info = filter_var(trim($_POST['additionalInfo']), FILTER_SANITIZE_STRING);
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($service_type) || empty($preferred_date)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Please provide a valid email address.']);
        exit;
    }
    
    // Calculate estimated price
    $estimated_price = calculateEstimatedPrice($_POST);
    
    // Prepare email content
    $to = "info@glittersandsparkles.com"; // Replace with your email
    $subject = "New Quote Request from $name";
    
    $email_body = "
    <html>
    <head>
        <title>New Quote Request</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 15px; border-radius: 5px; }
            .content { margin: 20px 0; }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; }
            .price { font-size: 1.2em; color: #4a6ee0; font-weight: bold; }
            .section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Quote Request</h2>
                <p>From your website quote form</p>
            </div>
            <div class='content'>
                <div class='field'><span class='field-label'>Name:</span> $name</div>
                <div class='field'><span class='field-label'>Email:</span> $email</div>
                <div class='field'><span class='field-label'>Phone:</span> " . (!empty($phone) ? $phone : 'Not provided') . "</div>
                <div class='field'><span class='field-label'>Service Type:</span> " . ucfirst(str_replace('-', ' ', $service_type)) . "</div>
                <div class='field'><span class='field-label'>Preferred Date:</span> $preferred_date</div>
                <div class='field'><span class='field-label'>Estimated Price:</span> <span class='price'>£$estimated_price</span></div>
                
                <div class='section'>
                    <h3>Service Details</h3>
    ";
    
    // Add service-specific details
    if ($service_type == 'deep-cleaning') {
        $email_body .= "<div class='field'><span class='field-label'>Main Rooms:</span> " . $_POST['deep-main-rooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Bathrooms/Shower Rooms:</span> " . $_POST['deep-bathrooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Bedrooms/Box Rooms:</span> " . $_POST['deep-bedrooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Kitchen:</span> " . $_POST['deep-kitchen'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Toilet (No bath or Shower):</span> " . $_POST['deep-toilet'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Utility Rooms:</span> " . $_POST['deep-utility'] . "</div>";
    } 
    elseif ($service_type == 'regular-cleaning') {
        if (!empty($_POST['regular-1bed'])) $email_body .= "<div class='field'><span class='field-label'>1 Bedroom Home:</span> " . $_POST['regular-1bed'] . "</div>";
        if (!empty($_POST['regular-2bed'])) $email_body .= "<div class='field'><span class='field-label'>2 Bedroom Home:</span> " . $_POST['regular-2bed'] . "</div>";
        if (!empty($_POST['regular-3bed'])) $email_body .= "<div class='field'><span class='field-label'>3 Bedroom Home:</span> " . $_POST['regular-3bed'] . "</div>";
        if (!empty($_POST['regular-4bed'])) $email_body .= "<div class='field'><span class='field-label'>4 Bedroom Home:</span> " . $_POST['regular-4bed'] . "</div>";
        if (!empty($_POST['regular-5bed'])) $email_body .= "<div class='field'><span class='field-label'>5 Bedroom Home:</span> " . $_POST['regular-5bed'] . "</div>";
        if (!empty($_POST['regular-6bed'])) $email_body .= "<div class='field'><span class='field-label'>6 Bedroom Home:</span> " . $_POST['regular-6bed'] . "</div>";
    }
    elseif ($service_type == 'end-of-tenancy') {
        $email_body .= "<div class='field'><span class='field-label'>Main Rooms:</span> " . $_POST['tenancy-main-rooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Bathrooms/Shower Rooms:</span> " . $_POST['tenancy-bathrooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Bedrooms/Box Rooms:</span> " . $_POST['tenancy-bedrooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Kitchen:</span> " . $_POST['tenancy-kitchen'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Toilet (No bath or Shower):</span> " . $_POST['tenancy-toilet'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Utility Rooms:</span> " . $_POST['tenancy-utility'] . "</div>";
    }
    elseif ($service_type == 'after-builder') {
        $email_body .= "<div class='field'><span class='field-label'>Rooms:</span> " . $_POST['builder-rooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Bathrooms and Shower:</span> " . $_POST['builder-bathrooms'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Kitchen:</span> " . $_POST['builder-kitchen'] . "</div>";
        $email_body .= "<div class='field'><span class='field-label'>Toilets and WC:</span> " . $_POST['builder-toilets'] . "</div>";
    }
    
    // Add extras if any
    if (isset($_POST['extras']) && is_array($_POST['extras'])) {
        $email_body .= "<div class='section'><h3>Extra Services</h3>";
        foreach ($_POST['extras'] as $extra) {
            $email_body .= "<div class='field'>" . htmlspecialchars($extra) . "</div>";
        }
        $email_body .= "</div>";
    }
    
    // Add additional info
    $email_body .= "
                </div>
                
                <div class='section'>
                    <h3>Additional Information</h3>
                    <div class='field'>" . (!empty($additional_info) ? nl2br($additional_info) : 'No additional information provided') . "</div>
                </div>
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
        $customer_subject = "Thank you for your quote request - Glitters and Sparkles Cleaning";
        $customer_message = "
        <html>
        <head>
            <title>Quote Request Confirmation</title>
        </head>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4a6ee0;'>Thank you for your quote request!</h2>
                <p>We have received your cleaning service quote request and will contact you within 24 hours with a personalized estimate.</p>
                <p><strong>Your estimated price:</strong> £$estimated_price</p>
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
        
        echo json_encode(['status' => 'success', 'message' => 'Thank you! Your quote request has been submitted. We will contact you within 24 hours.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Sorry, there was an error submitting your request. Please try again or call us directly.']);
    }
} else {
    // Not a POST request
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

// Function to calculate estimated price based on form inputs
function calculateEstimatedPrice($formData) {
    $total = 0;
    $service_type = $formData['serviceType'];
    
    if ($service_type == 'deep-cleaning') {
        $total += intval($formData['deep-main-rooms']) * 23;
        $total += intval($formData['deep-bathrooms']) * 33;
        $total += intval($formData['deep-bedrooms']) * 22;
        $total += intval($formData['deep-kitchen']) * 76;
        $total += intval($formData['deep-toilet']) * 22;
        $total += intval($formData['deep-utility']) * 13;
    } 
    elseif ($service_type == 'regular-cleaning') {
        if (!empty($formData['regular-1bed'])) $total += 52;
        if (!empty($formData['regular-2bed'])) $total += 59;
        if (!empty($formData['regular-3bed'])) $total += 62;
        if (!empty($formData['regular-4bed'])) $total += 73;
        if (!empty($formData['regular-5bed'])) $total += 84;
        if (!empty($formData['regular-6bed'])) $total += 94;
    }
    elseif ($service_type == 'end-of-tenancy') {
        $total += intval($formData['tenancy-main-rooms']) * 18;
        $total += intval($formData['tenancy-bathrooms']) * 27;
        $total += intval($formData['tenancy-bedrooms']) * 15.5;
        $total += intval($formData['tenancy-kitchen']) * 67;
        $total += intval($formData['tenancy-toilet']) * 16.5;
        $total += intval($formData['tenancy-utility']) * 12;
    }
    elseif ($service_type == 'after-builder') {
        $total += intval($formData['builder-rooms']) * 28;
        $total += intval($formData['builder-bathrooms']) * 37;
        $total += intval($formData['builder-kitchen']) * 95;
        $total += intval($formData['builder-toilets']) * 28;
    }
    
    // Add extras
    if (isset($formData['extras']) && is_array($formData['extras'])) {
        foreach ($formData['extras'] as $extra) {
            // Extract price from the value (format: "Service Name - £XX")
            if (preg_match('/£(\d+)/', $extra, $matches)) {
                $total += intval($matches[1]);
            }
        }
    }
    
    return $total;
}
?>