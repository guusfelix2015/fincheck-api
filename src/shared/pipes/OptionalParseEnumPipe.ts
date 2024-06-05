import { ArgumentMetadata, ParseEnumPipe } from '@nestjs/common';

export class OptionalParseEnumPipe extends ParseEnumPipe {
  transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (value === undefined) {
      return Promise.resolve(value);
    }
    return super.transform(value, metadata);
  }
}
