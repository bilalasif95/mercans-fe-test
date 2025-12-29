export interface MenuLink {
    ordinal: number;
    icon: string;
    title: string;
    path: string;
    enabled: boolean;
}

export interface PayslipEntry {
    key: string;
    amount: number;
    currency: string;
}

export interface PayslipFile {
    mimeType: string;
    size: number;
    label: string;
    description: string | null;
    createTime: string;
}

export interface FileAttachment {
    id: number;
    file: PayslipFile;
    accessToken: string;
}

export interface PayslipRaw {
    fileAttachment: FileAttachment;
    payrollDate: string;
    payslipEntries: PayslipEntry[];
}

export interface MappedPayslip {
    id: string;
    payrollDate: Date;
    monthLabel: string;
    year: number;
    payslipLabel: string;
    grossAmount: number | null;
    netAmount: number | null;
    currency: string;
    rawFileLabel: string;
}
