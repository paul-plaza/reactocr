#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (MLKitOCR, NSObject)

RCT_EXTERN_METHOD(recognizeText : (NSString *)base64Image resolver : (
    RCTPromiseResolveBlock)resolve rejecter : (RCTPromiseRejectBlock)reject)

@end
