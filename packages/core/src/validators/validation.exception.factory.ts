import { ValidationError } from '@nestjs/common';
import { ValidationException } from '@tsai-platform/common';

export function validationExceptionFactory(
  errors: ValidationError[],
): ValidationException {
  return new ValidationException(errors ?? []);
}
