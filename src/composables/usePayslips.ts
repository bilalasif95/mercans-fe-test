import { ref, computed } from 'vue';
import { payslipService } from '../services/payslipService';
import type { PayslipRaw, MappedPayslip } from '../types';

export function usePayslips() {
    const payslipsRaw = ref<PayslipRaw[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const mappedPayslips = computed<MappedPayslip[]>(() =>
        payslipsRaw.value.map((record) => {
            const date = new Date(record.payrollDate);
            const monthLabel = date.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
            });

            const gross = record.payslipEntries.find((e) => e.key === "GROSS");
            const net = record.payslipEntries.find((e) => e.key === "NET PAY");

            return {
                id: record.fileAttachment.accessToken,
                payrollDate: date,
                monthLabel,
                year: date.getFullYear(),
                payslipLabel: record.fileAttachment.file.label,
                grossAmount: gross ? gross.amount : null,
                netAmount: net ? net.amount : null,
                currency: gross?.currency || net?.currency || "USD",
                rawFileLabel: record.fileAttachment.file.label,
            };
        })
    );

    const fetchPayslips = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            payslipsRaw.value = await payslipService.getPayslips();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'An unknown error occurred';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        payslipsRaw,
        mappedPayslips,
        isLoading,
        error,
        fetchPayslips
    };
}
