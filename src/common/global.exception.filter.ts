import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Handle specific exceptions
    if (exception instanceof MongoError) {
      // Handle the MongoDB error here
      const { message, code } = exception;
      console.log(message, code);

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      });
    }
    // Handle other exceptions or fallback to a generic error response
    response.status(exception.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || 'Internal server error',
    });
  }
}
