import { ParseUUIDPipe, NotAcceptableException } from '@nestjs/common';

export class StrictUUIDPipe extends ParseUUIDPipe {
  constructor() {
    super({
      errorHttpStatusCode: 406,
      exceptionFactory: () => {
        return new NotAcceptableException(
          'Invalid identifier format. UUID expected.',
        );
      },
    });
  }
}
