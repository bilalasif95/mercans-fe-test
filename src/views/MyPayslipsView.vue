<template>
    <div class="my-payslips">
        <h1 class="app-page-title">My payslips</h1>

        <section class="payslips-shell">
            <header class="payslips-header">
                <div class="currency-tabs">
                    <button v-for="currency in currencies" :key="currency" class="currency-tab"
                        :class="{ 'currency-tab--active': currency === selectedCurrency }"
                        @click="selectedCurrency = currency">
                        {{ currency }}({{ getCountForCurrency(currency) }})
                    </button>
                </div>
            </header>

            <div class="payslips-card-body">
                <div class="payslips-top-row">
                    <div class="payslips-breadcrumb">
                        <span class="crumb-main">Payslips</span>
                        <span class="crumb-separator">›</span>
                        <span class="crumb-year">{{ activeYear }}</span>
                    </div>

                    <div class="salary-evolution-wrapper">
                        <button class="salary-evolution-btn" type="button" @click="openSalaryModal"
                            @mouseenter="showEvolutionTooltip = true" @mouseleave="showEvolutionTooltip = false">
                            <img src="../assets/icons/salary-evolution.svg" alt="Salary evolution" />
                        </button>
                        <div v-if="showEvolutionTooltip" class="evolution-tooltip">
                            View salary evolution
                        </div>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="payslips-table">
                        <thead>
                            <tr>
                                <th class="col-toggle"></th>
                                <th class="col-index">#</th>
                                <th class="col-period">Period</th>
                                <th class="col-name">Payslips</th>
                                <th class="col-gross">Gross salary</th>
                                <th class="col-net">Net pay</th>
                                <th class="col-actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(p, index) in filteredPayslips" :key="p.id">
                                <tr class="row-main" @click="toggleRow(p.id)">
                                    <td class="col-toggle">
                                        <button class="toggle-btn" type="button" @click.stop="toggleRow(p.id)"
                                            :aria-expanded="expandedRowId === p.id">
                                            <img v-if="expandedRowId === p.id" src="../assets/icons/chevron-up.svg" />
                                            <img v-else src="../assets/icons/chevron-down.svg" />
                                        </button>
                                    </td>

                                    <td class="col-index">
                                        {{ filteredPayslips.length - index }}
                                    </td>

                                    <td class="col-period">
                                        <span class="month-link">
                                            {{ p.monthLabel }}
                                        </span>
                                    </td>

                                    <td class="col-name">
                                        <span class="payslip-name" :title="p.payslipLabel">
                                            {{ p.payslipLabel }}
                                        </span>
                                    </td>

                                    <td class="col-gross">
                                        <span class="amount-pill amount-pill--gross">
                                            {{ formatMoney(p.grossAmount, p.currency) }}
                                        </span>
                                    </td>

                                    <td class="col-net">
                                        <span class="amount-pill amount-pill--net">
                                            {{ formatMoney(p.netAmount, p.currency) }}
                                        </span>
                                    </td>

                                    <td class="col-actions">
                                        <button class="more-btn" type="button" @click.stop>⋮</button>
                                    </td>
                                </tr>

                                <tr v-if="expandedRowId === p.id" class="row-details">
                                    <td class="row-details-left-border"></td>
                                    <td colspan="6">
                                        <div class="payslip-preview">
                                            <div class="payslip-preview-header">
                                                <div class="payslip-preview-title">
                                                    <span class="preview-label">Payslip</span>
                                                    <span class="preview-period">{{ p.monthLabel }}</span>
                                                </div>
                                            </div>

                                            <div class="payslip-preview-body">
                                                <iframe class="payslip-pdf-frame" :src="getPdfUrl(p.id)"
                                                    title="Payslip PDF"></iframe>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>

                    <div v-if="!filteredPayslips.length" class="no-data">
                        No payslips for selected currency.
                    </div>
                </div>
            </div>
        </section>

        <transition name="fade-scale">
            <div v-if="isSalaryModalOpen" class="evolution-modal-backdrop" @click.self="closeSalaryModal">
                <div class="evolution-modal">
                    <header class="evolution-modal-header">
                        <div class="evolution-company">Mercans USA Ltd.</div>
                        <div class="evolution-header-main">
                            <div class="evolution-title">Gross/Net Salary Evolution</div>
                            <div class="evolution-employee">
                                {{ firstEmployeeLine }}
                            </div>
                        </div>
                        <button class="evolution-close" @click="closeSalaryModal">
                            <span class="evolution-close-icon">✕</span>
                        </button>
                    </header>

                    <section class="evolution-modal-body">
                        <div class="evolution-placeholder">
                            <div class="evolution-placeholder-icon">
                                <img src="../assets/evolution.svg" alt="evolution placeholder" />
                            </div>
                            <div class="evolution-placeholder-text-main">
                                No designs yet — they’ll appear here once available.
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import payslipsRaw from "../data/payslips.json";

const mappedPayslips = payslipsRaw.map((record) => {
    const date = new Date(record.payrollDate);
    const monthLabel = date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });

    const gross = record.payslipEntries.find((e) => e.key === "GROSS");
    const net = record.payslipEntries?.find?.((e) => e.key === "NET PAY") ?? record.payslipEntries.find((e) => e.key === "NET PAY");

    const fileLabel =
        record.fileAttachment.file?.label ?? record.fileAttachment.file.label;

    return {
        id: record.fileAttachment.accessToken,
        payrollDate: date,
        monthLabel,
        year: date.getFullYear(),
        payslipLabel: fileLabel,
        grossAmount: gross ? gross.amount : null,
        netAmount: net ? net.amount : null,
        currency: gross?.currency || net?.currency || "USD",
        rawFileLabel: fileLabel,
    };
});

const sortedPayslips = computed(() =>
    [...mappedPayslips].sort(
        (a, b) => b.payrollDate - a.payrollDate
    )
);

const currencies = computed(() => {
    const set = new Set(mappedPayslips.map((p) => p.currency));
    return Array.from(set);
});
const selectedCurrency = ref(currencies.value[0] || "");

const getCountForCurrency = (currency) =>
    mappedPayslips.filter((p) => p.currency === currency).length;

const filteredPayslips = computed(() =>
    sortedPayslips.value.filter(
        (p) => !selectedCurrency.value || p.currency === selectedCurrency.value
    )
);

const activeYear = computed(() => {
    if (!filteredPayslips.value.length) return "";
    return filteredPayslips.value[0].year;
});

const formatMoney = (value, currency) => {
    if (value == null) return "-";
    const num = Number(value);
    const numberPart = num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).replace(/,/g, " ");
    return `${numberPart} ${currency || "USD"}`;
};

const expandedRowId = ref(null);
const toggleRow = (id) => {
    expandedRowId.value = expandedRowId.value === id ? null : id;
};

const getPdfUrl = (accessToken) => `/payslips/${accessToken}.pdf`;

const isSalaryModalOpen = ref(false);
const showEvolutionTooltip = ref(false);

const openSalaryModal = () => {
    isSalaryModalOpen.value = true;
};

const closeSalaryModal = () => {
    isSalaryModalOpen.value = false;
};

const firstEmployeeLine = computed(() => {
    if (!mappedPayslips.length) return "";
    const label = mappedPayslips[0].rawFileLabel || "";
    const parts = label.split(" - ");
    if (parts.length >= 3) {
        return `${parts[1]} – ${parts[2]}`;
    }
    return label.replace(".pdf", "");
});
</script>

<style scoped>
.my-payslips {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 100%;
    overflow-x: hidden;
}

.payslips-shell {
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 18px 40px rgba(7, 27, 58, 0.12);
    overflow: hidden;
    border: 1px solid #FFDFD2;
    width: 100%;
    max-width: 100%;
}

.payslips-header {
    display: flex;
    align-items: stretch;
    padding: 0;
    background: #001738;
    color: #ffffff;
}

.currency-tabs {
    display: inline-flex;
    height: 64px;
}

.currency-tab {
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0 28px;
    font-size: 13px;
    font-weight: 500;
    background: transparent;
    color: #d0dcff;
    display: flex;
    align-items: center;
    border-radius: 0;
}

.currency-tab--active {
    background: #FF5F1F;
    color: #ffffff;
}

.payslips-card-body {
    padding: 24px 32px 28px;
}

.payslips-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.payslips-breadcrumb {
    font-size: 13px;
    color: #6b7280;
}

.crumb-main {
    font-weight: 500;
}

.crumb-separator {
    margin: 0 4px;
}

.crumb-year {
    font-weight: 600;
    color: #021b3f;
}

.salary-evolution-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.salary-evolution-btn {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: none;
    background: #021b3f;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 14px rgba(7, 27, 58, 0.25);
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.salary-evolution-btn img {
    width: 18px;
    height: 18px;
    transition: transform 0.16s ease;
}

.salary-evolution-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(7, 27, 58, 0.28);
}

.salary-evolution-btn:hover img {
    transform: scale(1.06);
}

.evolution-tooltip {
    position: absolute;
    top: 50px;
    right: 0;
    background: #111827;
    color: #ffffff;
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 6px;
    white-space: nowrap;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.35);
    z-index: 10;
}

.table-wrapper {
    margin-top: 4px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    max-width: 100%;
}

.payslips-table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    font-size: 13px;
}

.payslips-table thead tr {
    background: #ffffff;
    color: #1A3E6D;
}

.payslips-table th,
.payslips-table td {
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid #e1e6f3;
    vertical-align: middle;
}

.col-toggle {
    width: 40px;
}

.payslips-table td.col-toggle {
    background: #f5f7fb;
}

.col-index {
    width: 40px;
}

.col-period {
    width: 160px;
}

.col-gross,
.col-net {
    width: 150px;
    text-align: right;
}

.col-actions {
    width: 36px;
    text-align: center;
}

.row-main {
    background: #ffffff;
    cursor: pointer;
}

.row-main:hover {
    background: #f5f7fb;
}

.toggle-btn {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toggle-btn:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
}

.month-link {
    font-size: 13px;
    color: #CC4C19;
}

.payslip-name {
    display: inline-block;
    max-width: 420px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.amount-pill {
    display: inline-flex;
    padding: 3px 12px;
    border-radius: 999px;
    font-size: 12px;
    white-space: nowrap;
}

.amount-pill--gross {
    background: #E3E6EC;
    color: #001738;
}

.amount-pill--net {
    background: #CFE7D4;
    color: #095019;
}

.more-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
}

.row-details td {
    background: #ffffff;
    border-bottom: none;
    padding-top: 0;
}

.row-details-left-border {
    border-right: 1px solid #e1e6f3;
    background: #f5f7fb;
}

.payslip-preview {
    margin: 8px 0 14px;
    border-radius: 10px;
    border: 1px solid #e1e6f3;
    background: #ffffff;
    overflow: hidden;
}

.payslip-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-bottom: 1px solid #e1e6f3;
}

.payslip-preview-title {
    font-size: 12px;
    color: #6b7280;
}

.preview-label {
    font-weight: 600;
    margin-right: 4px;
}

.preview-period {
    color: #021b3f;
}

.payslip-preview-body {
    padding: 12px 16px 14px;
    background: #f8fafc;
}

.payslip-pdf-frame {
    width: 100%;
    height: 520px;
    border: none;
    border-radius: 6px;
}

.no-data {
    padding: 12px;
    font-size: 13px;
    color: #6b7280;
}

.evolution-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.evolution-modal {
    width: calc(100% - 48px);
    height: calc(100% - 48px);
    max-width: 1440px;
    max-height: 860px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 24px 60px rgba(7, 27, 58, 0.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.evolution-modal-header {
    display: grid;
    grid-template-columns: 220px 1fr 60px;
    align-items: center;
    padding: 18px 32px 14px;
    border-bottom: 1px solid #e1e6f3;
    background: #f9fafb;
    column-gap: 24px;
}

.evolution-company {
    font-size: 13px;
    font-weight: 600;
    color: #021b3f;
    border-right: 1px solid #d1d9e6;
    padding-right: 24px;
}

.evolution-header-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.evolution-title {
    font-size: 18px;
    font-weight: 600;
    color: #021b3f;
}

.evolution-employee {
    font-size: 12px;
    color: #6b7280;
}

.evolution-close {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: none;
    background: #021b3f;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    justify-self: end;
    box-shadow: 0 8px 20px rgba(7, 27, 58, 0.35);
}

.evolution-close-icon {
    font-size: 18px;
    line-height: 1;
}

.evolution-modal-body {
    padding: 24px 32px 28px;
    background: #ffffff;
    flex: 1;
    overflow: auto;
}

.evolution-placeholder {
    border-radius: 18px;
    border: 1px dashed #d7e0f0;
    min-height: calc(100% - 8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #6b7280;
    padding: 40px 24px;
}

.evolution-placeholder-icon {
    margin-bottom: 10px;
}

.evolution-placeholder-text-main {
    font-size: 13px;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.96);
}

@media (max-width: 1200px) {
    .evolution-modal {
        width: calc(100% - 32px);
        height: calc(100% - 32px);
    }
}

@media (max-width: 900px) {
    .evolution-modal-header {
        grid-template-columns: 1fr 40px;
        grid-template-rows: auto auto;
        row-gap: 8px;
    }

    .evolution-company {
        border-right: none;
        padding-right: 0;
    }

    .evolution-header-main {
        grid-column: 1 / 2;
    }

    .evolution-close {
        grid-row: 1 / 2;
        grid-column: 2 / 3;
    }
}

@media (max-width: 1024px) {
    .payslips-card-body {
        padding: 20px 20px 24px;
    }

    .payslips-table {
        min-width: 720px;
    }
}

@media (max-width: 768px) {
    .payslips-card-body {
        padding: 16px 12px 20px;
    }

    .payslips-table th,
    .payslips-table td {
        padding: 10px 12px;
    }

    .payslips-table {
        min-width: 680px;
    }

    .evolution-modal {
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        border-radius: 0;
    }

    .evolution-modal-header {
        padding: 16px 16px 12px;
    }

    .evolution-modal-body {
        padding: 16px;
    }
}

@media (max-width: 520px) {
    .payslips-table {
        min-width: 640px;
    }

    .amount-pill {
        font-size: 11px;
        padding: 4px 10px;
    }
}
</style>
