package com.example.vms.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVisitorQr(String toEmail, String visitorName, String qrPath) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("yourgmail@gmail.com", "Visitor Management System"); // ⭐ Professional Sender
            helper.setTo(toEmail);
            helper.setSubject("Your Visitor QR Pass - VMS");

            String html = """
            <h2>Hello %s,</h2>
            <p>Your visitor entry has been registered.</p>
            <p>Please find your QR pass attached below.</p>
            <br><b>Thank you!</b><br>
            <b>Visitor Management System</b>
            """.formatted(visitorName);

            helper.setText(html, true);

            FileSystemResource file = new FileSystemResource(new File(qrPath));
            helper.addAttachment("Visitor_QR.png", file);

            mailSender.send(message);

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }

    }
}

