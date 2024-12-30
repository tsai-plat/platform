import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { iterate } from 'iterare';
import { ErrorCodeEnum } from './error.code.enum';
import { APIResponse } from '@tsailab/core-types';

export class ValidationException extends HttpException {
  constructor(validErrors: ValidationError[], options?: HttpExceptionOptions) {
    const { httpExceptionOptions } =
      HttpException.extractDescriptionAndOptionsFrom(options);

    const errors = flattenValidationErrors(validErrors);

    const body: APIResponse = {
      code: ErrorCodeEnum.PARAMS_INVALID,
      message: `Request parameters invalid.`,
      error: errors,
    };

    super(
      HttpException.createBody(body),
      HttpStatus.BAD_REQUEST,
      httpExceptionOptions,
    );
  }
}

function flattenValidationErrors(
  validationErrors: ValidationError[],
): string[] {
  return iterate(validationErrors)
    .map((error) => mapChildrenToValidationErrors(error))
    .flatten()
    .filter((item) => !!item.constraints)
    .map((item) => Object.values(item.constraints))
    .flatten()
    .toArray();
}

function mapChildrenToValidationErrors(
  error: ValidationError,
  parentPath?: string,
): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }

  const validationErrors = [];
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(
        ...this.mapChildrenToValidationErrors(item, parentPath),
      );
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }

  return validationErrors;
}

function prependConstraintsWithParentProp(
  parentPath: string,
  error: ValidationError,
): ValidationError {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }

  return {
    ...error,
    constraints,
  };
}
