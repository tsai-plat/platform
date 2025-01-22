import {
  isEmail,
  isMobilePhone,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidAccount', async: false })
export class IsVerificationAccountConstraint
  implements ValidatorConstraintInterface
{
  validate(
    value: string,
    _validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (isEmail(value) || isMobilePhone(value, 'zh-CN')) return true;
    return false;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw `${validationArguments.property} must be a email or phone number format.`;
  }
}

export function IsValidAccount(validationOptions?: ValidationOptions) {
  return function (obj: object, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsVerificationAccountConstraint,
    });
  };
}
