export const IgnoreTransformPropertyName = Symbol('PROPS_IGNORE_TRANSFORM_API');

/**
 *
 * will ignore transform response
 */
export function IgnoreTransformAPI() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value[IgnoreTransformPropertyName] = true;
  };
}
