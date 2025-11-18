import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ErrorType } from '../../entities/error-log.entity';

@Controller('customer-service')
@UseGuards(JwtAuthGuard)
export class CustomerServiceController {
  constructor(private customerServiceService: CustomerServiceService) {}

  @Post('log-error')
  async logError(
    @Body('orderId') orderId: string,
    @Body('errorType') errorType: ErrorType,
    @Body('description') description: string,
    @Body('packerId') packerId?: string,
  ) {
    return this.customerServiceService.logError(orderId, errorType, description, packerId);
  }

  @Get('errors')
  async getErrors(@Query('resolved') resolved?: string) {
    const resolvedBool = resolved === 'true' ? true : resolved === 'false' ? false : undefined;
    return this.customerServiceService.getErrors(resolvedBool);
  }

  @Post('errors/:errorLogId/resolve')
  async resolveError(@Param('errorLogId') errorLogId: string) {
    return this.customerServiceService.resolveError(errorLogId);
  }
}

