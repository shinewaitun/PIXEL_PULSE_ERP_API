import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseArrayQueryPipe implements PipeTransform {
  transform(value: string | string[], metadata: ArgumentMetadata) {
    if (metadata.type === 'query' && metadata.data === 'role') {
      return typeof value === 'string' ? [value] : value;
    }
    return value;
  }
}
