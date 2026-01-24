package com.example.vms.service;

import com.example.vms.model.Visitor;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class QrService {

    @Value("${app.qr.folder}")
    private String qrFolder;

    @PostConstruct
    public void init() throws Exception {
        Path p = Paths.get(qrFolder);
        if (!Files.exists(p)) {
            Files.createDirectories(p);
        }
    }

    public String generateQrForVisitor(Visitor visitor) {
        try {
            QRCodeWriter writer = new QRCodeWriter();

            // SECURE QR FORMAT
            String qrText = "VMS_VISITOR:" + visitor.getId();

            BitMatrix matrix = writer.encode(qrText, BarcodeFormat.QR_CODE, 300, 300);

            String filename = "visitor-" + visitor.getId() + ".png";
            Path file = Paths.get(qrFolder, filename);

            MatrixToImageWriter.writeToPath(matrix, "PNG", file);

            return file.toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR: " + e.getMessage());
        }
    }
}
