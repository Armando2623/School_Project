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
}
