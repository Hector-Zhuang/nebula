//
//  NebulaJSIGateway.h
//  SuperApp - Nebula Mini-App Container
//
//  JSI Gateway Header - Exposes __NebulaNativeInvoke to JavaScript
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>

NS_ASSUME_NONNULL_BEGIN

@interface NebulaJSIGateway : NSObject <RCTBridgeModule>

- (instancetype)initWithAppId:(NSString *)appId;

+ (void)installBindingsForBridge:(RCTBridge *)bridge appId:(NSString *)appId;
+ (void)installBindingsForCarrier:(id)carrier appId:(NSString *)appId;
+ (void)installBindingsForFactory:(id)factory appId:(NSString *)appId;

@end

NS_ASSUME_NONNULL_END
