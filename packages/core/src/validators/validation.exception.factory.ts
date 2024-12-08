import { ValidationError } from '@nestjs/common';
import { ValidationException } from '@tsailab/common';

export function validationExceptionFactory(
  errors: ValidationError[],
): ValidationException {
  return new ValidationException(errors ?? []);
}
