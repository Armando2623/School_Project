package com.ortiz.Proyecto.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

/**
 * Servicio para generar imágenes QR en formato PNG.
 * Usa la librería ZXing (Google) para la codificación.
 */
@Service
public class QrService {

    private static final int QR_SIZE = 250; // píxeles

    /**
     * Genera una imagen QR PNG a partir de un texto (UUID del alumno).
     *
     * @param contenido El texto a codificar (codigoQr del alumno)
     * @return byte[] con la imagen PNG del QR
     */
    public byte[] generarQrPng(String contenido) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = Map.of(
                    EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M,
                    EncodeHintType.MARGIN, 1
            );
            BitMatrix matrix = writer.encode(contenido, BarcodeFormat.QR_CODE, QR_SIZE, QR_SIZE, hints);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
            return baos.toByteArray();

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error generando imagen QR: " + e.getMessage(), e);
        }
    }

    /**
     * Genera una imagen de código de barras CODE_128 en formato PNG.
     *
     * @param contenido El texto a codificar en el código de barras
     * @return byte[] con la imagen PNG
     */
    public byte[] generarBarcodePng(String contenido) {
        try {
            com.google.zxing.oned.Code128Writer writer = new com.google.zxing.oned.Code128Writer();
            BitMatrix matrix = writer.encode(contenido, BarcodeFormat.CODE_128, 300, 80);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
            return baos.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error generando código de barras: " + e.getMessage(), e);
        }
    }
}
