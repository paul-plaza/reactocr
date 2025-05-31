import Foundation
import MLKitTextRecognition
import MLKitVision

@objc(MLKitOCR)
class MLKitOCR: NSObject {

    @objc
    func recognizeText(
        _ base64Image: String, resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let imageData = Data(base64Encoded: base64Image),
            let uiImage = UIImage(data: imageData)
        else {
            reject("IMAGE_ERROR", "No se pudo decodificar la imagen", nil)
            return
        }

        let visionImage = VisionImage(image: uiImage)
        let textRecognizer = TextRecognizer.textRecognizer()

        textRecognizer.process(visionImage) { result, error in
            if let error = error {
                reject("OCR_ERROR", "Error en reconocimiento: \(error.localizedDescription)", error)
                return
            }
            resolve(result?.text)
        }
    }

}
