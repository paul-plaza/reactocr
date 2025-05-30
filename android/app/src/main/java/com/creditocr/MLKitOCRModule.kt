package com.creditocr

import android.graphics.BitmapFactory
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import java.io.File


class MLKitOCRModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MLKitOCR"
    }

    @ReactMethod
    fun exampleMethod(promise: Promise) {
        try {
            promise.resolve("MLKit OCR is ready")
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun recognizeText(imagePath: String, promise: Promise) {
        try {
            val filePath = imagePath.removePrefix("file://")
            val bitmap = BitmapFactory.decodeFile(filePath)
            val image = InputImage.fromBitmap(bitmap, 0)
            val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

            recognizer.process(image)
                .addOnSuccessListener { visionText ->
                    val fullText = visionText.text
                    promise.resolve(fullText)
                }
                .addOnFailureListener { e ->
                    promise.reject("OCR_FAILED", e.message)
                }
        } catch (e: Exception) {
            promise.reject("OCR_EXCEPTION", e.message)
        }
    }
}
