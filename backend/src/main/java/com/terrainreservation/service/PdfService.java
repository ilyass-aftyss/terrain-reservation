package com.terrainreservation.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.image.ImageDataFactory;
import com.terrainreservation.entity.Reservation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    @Autowired
    private QrCodeService qrCodeService;

    @Value("${pdf.storage.path:./generated-pdfs}")
    private String pdfStoragePath;

    public byte[] generateReservationPdf(Reservation reservation) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            document.setMargins(40, 40, 40, 40);

            DeviceRgb primaryColor = new DeviceRgb(34, 139, 34);
            DeviceRgb headerBg = new DeviceRgb(245, 245, 245);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            // Titre
            document.add(new Paragraph("⚽ TERRAIN RESERVATION")
                    .setFontSize(24)
                    .setBold()
                    .setFontColor(primaryColor)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(5));

            document.add(new Paragraph("Confirmation de Réservation")
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(20));

            // Ligne séparatrice
            document.add(new Paragraph("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                    .setFontColor(primaryColor)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(15));

            // Tableau d'informations
            Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .setWidth(UnitValue.createPercentValue(100));

            addRow(table, "N° Réservation", reservation.getNumeroReservation(), headerBg);
            addRow(table, "Joueur", reservation.getUser().getNom() + " " + reservation.getUser().getPrenom(), null);
            addRow(table, "Email", reservation.getUser().getEmail(), headerBg);
            addRow(table, "Terrain", reservation.getTerrain().getNom(), null);
            addRow(table, "Localisation", reservation.getTerrain().getLocalisation(), headerBg);
            addRow(table, "Type", reservation.getType().toString().replace("TYPE_", ""), null);
            addRow(table, "Date début", reservation.getDateDebut().format(formatter), headerBg);
            addRow(table, "Date fin", reservation.getDateFin().format(formatter), null);
            addRow(table, "Montant", reservation.getMontant() + " MAD", headerBg);
            addRow(table, "Statut", reservation.getStatut().toString(), null);

            document.add(table);
            document.add(new Paragraph("\n"));

            // QR Code
            String qrContent = String.format("RES:%s|TERRAIN:%s|DATE:%s|USER:%s",
                    reservation.getNumeroReservation(),
                    reservation.getTerrain().getNom(),
                    reservation.getDateDebut().format(formatter),
                    reservation.getUser().getEmail());

            byte[] qrBytes = qrCodeService.generateQrCodeBytes(qrContent);
            Image qrImage = new Image(ImageDataFactory.create(qrBytes))
                    .setWidth(150)
                    .setHeight(150);

            document.add(new Paragraph("Scannez le QR Code à l'entrée du terrain")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(11)
                    .setFontColor(ColorConstants.GRAY)
                    .setMarginBottom(10));

            Paragraph qrParagraph = new Paragraph().add(qrImage).setTextAlignment(TextAlignment.CENTER);
            document.add(qrParagraph);

            // Footer
            document.add(new Paragraph("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                    .setFontColor(primaryColor)
                    .setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Plateforme SaaS de Réservation de Terrains ⚽")
                    .setFontSize(9)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PDF", e);
        }
    }

    public String saveReservationPdf(Reservation reservation) {
        byte[] pdfBytes = generateReservationPdf(reservation);
        String fileName = "reservation_" + reservation.getNumeroReservation() + ".pdf";
        String filePath = pdfStoragePath + File.separator + fileName;

        try {
            File dir = new File(pdfStoragePath);
            if (!dir.exists()) dir.mkdirs();

            try (FileOutputStream fos = new FileOutputStream(filePath)) {
                fos.write(pdfBytes);
            }
            return filePath;
        } catch (IOException e) {
            throw new RuntimeException("Erreur sauvegarde PDF", e);
        }
    }

    private void addRow(Table table, String label, String value, DeviceRgb bgColor) {
        Cell labelCell = new Cell()
                .add(new Paragraph(label).setBold().setFontSize(11))
                .setBorder(Border.NO_BORDER)
                .setPadding(8);

        Cell valueCell = new Cell()
                .add(new Paragraph(value != null ? value : "N/A").setFontSize(11))
                .setBorder(Border.NO_BORDER)
                .setPadding(8);

        if (bgColor != null) {
            labelCell.setBackgroundColor(bgColor);
            valueCell.setBackgroundColor(bgColor);
        }

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
