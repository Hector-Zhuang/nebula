#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNInstanceNavigator, NSObject)

RCT_EXTERN_METHOD(openInstance:(NSString *)moduleName
                  props:(NSDictionary *)props)

RCT_EXTERN_METHOD(popInstance)

@end
