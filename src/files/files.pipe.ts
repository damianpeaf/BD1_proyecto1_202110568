import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidNamePipe implements PipeTransform {
  constructor(private readonly validOriginalNames: string[]) {}

  transform(value: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    this.validOriginalNames.forEach((name) => {
      const isPresent = value.some((file) => {
        if (file.originalname === name) {
          return true;
        }
      });

      if (!isPresent) {
        throw new BadRequestException(`File ${name} is required`);
      }
    });

    return value;
  }
}
