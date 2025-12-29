import { apiClient } from './apiClient';
import type { PayslipRaw } from '../types';

export const payslipService = {
    async getPayslips(): Promise<PayslipRaw[]> {
        return apiClient.get<PayslipRaw[]>('/payslips.json');
    }
};
