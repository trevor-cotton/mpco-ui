import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { PrinterStatus } from '../../entities/printer.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPanelController {
  constructor(private adminPanelService: AdminPanelService) {}

  // Printer Management
  @Post('printers')
  async createPrinter(
    @Body('name') name: string,
    @Body('apiEndpoint') apiEndpoint: string,
    @Body('settings') settings?: any,
  ) {
    return this.adminPanelService.createPrinter(name, apiEndpoint, settings);
  }

  @Get('printers')
  async getPrinters() {
    return this.adminPanelService.getPrinters();
  }

  @Put('printers/:id')
  async updatePrinter(@Param('id') id: string, @Body() updates: any) {
    return this.adminPanelService.updatePrinter(id, updates);
  }

  @Delete('printers/:id')
  async deletePrinter(@Param('id') id: string) {
    return this.adminPanelService.deletePrinter(id);
  }

  // System Configuration
  @Post('config')
  async setConfig(
    @Body('key') key: string,
    @Body('value') value: string,
    @Body('description') description?: string,
  ) {
    return this.adminPanelService.setConfig(key, value, description);
  }

  @Get('config/:key')
  async getConfig(@Param('key') key: string) {
    return this.adminPanelService.getConfig(key);
  }

  @Get('config')
  async getAllConfigs() {
    return this.adminPanelService.getAllConfigs();
  }

  // User Management
  @Get('users')
  async getUsers() {
    return this.adminPanelService.getUsers();
  }

  @Put('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.adminPanelService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminPanelService.deleteUser(id);
  }

  // Reporting
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminPanelService.getDashboardStats();
  }

  @Get('analytics/orders')
  async getOrderAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminPanelService.getOrderAnalytics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('analytics/packers')
  async getPackerPerformance() {
    return this.adminPanelService.getPackerPerformance();
  }
}

