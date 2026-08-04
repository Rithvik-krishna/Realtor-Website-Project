import { AdminRepository } from './admin.repository.js';

export class AdminService {
  private adminRepo: AdminRepository;

  constructor() {
    this.adminRepo = new AdminRepository();
  }

  async getDashboardStats() {
    return this.adminRepo.getDashboardStats();
  }

  async getAllUsers() {
    return this.adminRepo.getAllUsers();
  }

  async getSyncLogs() {
    return this.adminRepo.getSyncLogs();
  }
}
