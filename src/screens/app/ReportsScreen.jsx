import React, { useCallback, useMemo, useState } from 'react';
import { InteractionManager, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBadge, AppCard, AppListItem, AppListState, AppLoader } from '@/components/ui';
import { useCurrency } from '@/context/CurrencyContext';
import { getReports } from '@/services/reportsApi';

const months = [
    { label: 'All', value: 0 },
    { label: 'Jan', value: 1 },
    { label: 'Feb', value: 2 },
    { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 },
    { label: 'May', value: 5 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 },
    { label: 'Aug', value: 8 },
    { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 },
    { label: 'Nov', value: 11 },
    { label: 'Dec', value: 12 },
];

const ReportsScreenSkeleton = () => {
    return (
        <View className="gap-6 pb-6">
            <AppLoader card label="Loading reports..." />
            <AppLoader card label="Preparing filters..." />
            <AppLoader card label="Building lending overview..." />
            <AppLoader card label="Setting up timeline..." />
        </View>
    );
};

const formatMonthLabel = month =>
    months.find(item => item.value === month)?.label || 'Month';

const buildYearOptions = currentYear =>
    [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

const buildSummaryTiles = (summary, selectedCurrency) => {
    const currency = summary?.currency || selectedCurrency || '';
    const zeroValue = `${currency} 0`.trim();

    return [{
        accent: 'bg-primary-500',
        key: 'loans_given',
        note: summary?.loanGivenCount
            ? `${summary.loanGivenCount} lending entries synced`
            : 'No lending entries yet',
        title: 'Loans Given',
        value: summary?.loansGiven || zeroValue,
    },
    {
        accent: 'bg-[#2f7d62]',
        key: 'returned_to_me',
        note: summary?.returnedToMeCount
            ? `${summary.returnedToMeCount} returned entries synced`
            : 'No returned entries yet',
        title: 'Returned To Me',
        value: summary?.returnedToMe || zeroValue,
    },
    {
        accent: 'bg-accent-400',
        key: 'loans_taken',
        note: summary?.loansTakenCount
            ? `${summary.loansTakenCount} borrowing entries synced`
            : 'No borrowing entries yet',
        title: 'Loans Taken',
        value: summary?.loansTaken || zeroValue,
    },
    {
        accent: 'bg-[#cb5a36]',
        key: 'repaid_by_me',
        note: summary?.repaidByMeCount
            ? `${summary.repaidByMeCount} repayment entries synced`
            : 'No repayment entries yet',
        title: 'Repaid By Me',
        value: summary?.repaidByMe || zeroValue,
    },
    ];
};

export const ReportsScreen = () => {
    const {
        isCurrencyReady,
        selectedCurrency,
        syncAvailableCurrencies,
    } = useCurrency();
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const yearOptions = useMemo(() => buildYearOptions(currentYear), [currentYear]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
    const [activeBreakdown, setActiveBreakdown] = useState('all');
    const [reports, setReports] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const loadReports = useCallback(async ({ month, year }) => {
        if (!isCurrencyReady) {
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const result = await getReports({
                currency: selectedCurrency,
                ...(month ? { month } : {}),
                year,
            });
            setReports(result?.reports || {});
            syncAvailableCurrencies(
                result?.availableCurrencies,
                result?.selectedCurrency,
            );
        } catch (error) {
            setReports(null);
            setErrorMessage(error.message || 'Could not load reports.');
        } finally {
            setIsLoading(false);
        }
    }, [
        isCurrencyReady,
        selectedCurrency,
        syncAvailableCurrencies,
    ]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            setIsLoading(true);

            const interactionTask = InteractionManager.runAfterInteractions(() => {
                if (isActive) {
                    loadReports({
                        month: selectedMonth || undefined,
                        year: selectedYear,
                    });
                }
            });

            return () => {
                isActive = false;
                interactionTask.cancel();
            };
        }, [loadReports, selectedMonth, selectedYear]),
    );

    const summary = reports?.summary && typeof reports.summary === 'object' ? reports.summary : null;
    const historyBuckets = useMemo(
        () =>
            reports?.history && typeof reports.history === 'object'
                ? reports.history
                : {
                    all: [],
                    loans_given: [],
                    returned_to_me: [],
                    loans_taken: [],
                    repaid_by_me: [],
                },
        [reports],
    );
    const history = Array.isArray(historyBuckets.all) ? historyBuckets.all : [];
    const isYearView = selectedMonth === 0;
    const selectedMonthLabel = formatMonthLabel(selectedMonth);
    const selectedPeriodLabel = isYearView ? `${selectedYear}` : `${selectedMonthLabel} ${selectedYear}`;
    const lendingSnapshot =
        reports?.lendingSnapshot && typeof reports.lendingSnapshot === 'object'
            ? reports.lendingSnapshot
            : {
                people: [],
                totals: {
                    loanCount: 0,
                    loaned: `${selectedCurrency || ''} 0`.trim(),
                    peopleCount: 0,
                    remaining: `${selectedCurrency || ''} 0`.trim(),
                    returned: `${selectedCurrency || ''} 0`.trim(),
                },
            };
    const lendingTotals = lendingSnapshot.totals || {};
    const recoveryPercentage = lendingTotals.loanedAmount > 0
        ? Math.min(
            (lendingTotals.returnedAmount / lendingTotals.loanedAmount) * 100,
            100,
        )
        : 0;
    const summaryTiles = useMemo(
        () => buildSummaryTiles(summary, selectedCurrency),
        [selectedCurrency, summary],
    );
    const filteredHistory = useMemo(() => {
        const nextItems = historyBuckets[activeBreakdown] || historyBuckets.all || [];
        return Array.isArray(nextItems) ? nextItems : [];
    }, [activeBreakdown, historyBuckets]);
    const activeBreakdownLabel = useMemo(() => {
        if (activeBreakdown === 'all') {
            return 'All';
        }

        return summaryTiles.find(tile => tile.key === activeBreakdown)?.title || 'All';
    }, [activeBreakdown, summaryTiles]);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                bounces={false}
                contentContainerClassName="flex-grow px-6 pt-8 pb-32 gap-6"
                showsVerticalScrollIndicator={false}>
                <View className="flex-row items-start justify-between gap-4">
                    <View className="flex-1">
                        <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">
                            Reports
                        </Text>
                    </View>
                    <AppBadge label={selectedPeriodLabel} variant="accent" />
                </View>

                <AppCard variant="elevated">
                    <View className="gap-5">
                        <View className="flex-row items-start justify-between gap-4">
                            <Text className="flex-1 text-section font-semibold text-textPrimary">
                                Filter Reports
                            </Text>
                            <AppBadge label={isYearView ? 'Year View' : 'Month View'} variant="primary" />
                        </View>

                        <View className="gap-3">
                            <Text className="text-caption font-semibold text-textPrimary">Select year</Text>
                            <ScrollView
                                horizontal
                                contentContainerClassName="items-center gap-3"
                                showsHorizontalScrollIndicator={false}>
                                {yearOptions.map(year => {
                                    const active = year === selectedYear;

                                    return (
                                        <Pressable
                                            key={year}
                                            className={`h-10 min-w-[82px] items-center justify-center rounded-full border px-4 ${active ? 'border-primary-500 bg-primary-500' : 'border-border bg-surface'
                                                }`}
                                            onPress={() => setSelectedYear(year)}>
                                            <Text
                                                className={`text-center text-caption leading-[16px] font-normal ${active ? 'text-white' : 'text-textSecondary'
                                                    }`}>
                                                {year}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        <View className="gap-3">
                            <Text className="text-caption font-semibold text-textPrimary">Month</Text>
                            <ScrollView
                                horizontal
                                contentContainerClassName="items-center gap-3"
                                showsHorizontalScrollIndicator={false}>
                                {months.map(month => {
                                    const active = month.value === selectedMonth;

                                    return (
                                        <Pressable
                                            key={month.value}
                                            className={`h-10 min-w-[72px] items-center justify-center rounded-full border px-4 ${active ? 'border-accent-400 bg-accent-400' : 'border-border bg-surface'
                                                }`}
                                            onPress={() => setSelectedMonth(month.value)}>
                                            <Text
                                                className={`text-center text-caption leading-[16px] font-normal ${active ? 'text-white' : 'text-textSecondary'
                                                    }`}>
                                                {month.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                    </View>
                </AppCard>

                {isLoading ? (
                    <ReportsScreenSkeleton />
                ) : errorMessage ? (
                    <AppListState
                        actionLabel="Retry"
                        description={errorMessage}
                        mode="empty"
                        onActionPress={() =>
                            loadReports({
                                month: selectedMonth || undefined,
                                year: selectedYear,
                            })
                        }
                        title="Reports unavailable"
                    />
                ) : summary ? (
                    <>
                        <AppCard variant="elevated">
                            <View className="gap-5">
                                <View className="flex-row items-start justify-between gap-4">
                                    <View className="flex-1">
                                        <Text className="text-section font-semibold text-textPrimary">
                                            {isYearView ? 'Annual Snapshot' : 'Monthly Snapshot'}
                                        </Text>
                                        <Text className="mt-2 text-caption font-normal text-textSecondary">
                                            {isYearView
                                                ? `Loans given during ${selectedYear}, their returned amount, and the balance still outstanding.`
                                                : `Loans given in ${selectedMonthLabel}, how much has been returned, and how much is still outstanding.`}
                                        </Text>
                                    </View>
                                    <AppBadge
                                        label={lendingTotals.loanCount ? 'Active' : 'Quiet'}
                                        variant="primary"
                                    />
                                </View>

                                <View className="flex-row gap-4">
                                    <View className="flex-1 rounded-2xl bg-primary-500 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Total Given
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {lendingTotals.loaned}
                                        </Text>
                                    </View>

                                    <View className="flex-1 rounded-2xl bg-[#2f7d62] px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Returned
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {lendingTotals.returned}
                                        </Text>
                                    </View>
                                </View>

                                <View className="rounded-2xl bg-surfaceMuted px-4 py-4">
                                    <View className="flex-row items-center justify-between gap-3">
                                        <View>
                                            <Text className="text-caption font-normal text-textSecondary">
                                                Remaining To Receive
                                            </Text>
                                            <Text className="mt-2 text-section font-semibold text-textPrimary">
                                                {lendingTotals.remaining}
                                            </Text>
                                        </View>
                                        <AppBadge
                                            label={`${lendingTotals.peopleCount || 0} People`}
                                            variant="accent"
                                        />
                                    </View>
                                </View>

                                <View className="gap-3">
                                    <View className="h-3 overflow-hidden rounded-full bg-surfaceMuted">
                                        <View
                                            className="h-full rounded-full bg-[#2f7d62]"
                                            style={{width: `${recoveryPercentage}%`}}
                                        />
                                    </View>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-caption text-textSecondary">
                                            Recovery progress
                                        </Text>
                                        <Text className="text-caption font-semibold text-textPrimary">
                                            {Math.round(recoveryPercentage)}%
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </AppCard>

                        <View className="gap-3">
                            <Text className="text-section font-semibold text-textPrimary">Money Breakdown</Text>

                            <View className="flex-row flex-wrap justify-between">
                                {summaryTiles.map(tile => (
                                    <View key={tile.title} className="mb-4 w-[48%]">
                                        <Pressable
                                            className={`rounded-[28px] border p-5 shadow-card ${activeBreakdown === tile.key
                                                ? 'border-primary-500 bg-primary-500'
                                                : 'border-borderStrong bg-surfaceElevated'
                                                }`}
                                            onPress={() => setActiveBreakdown(tile.key)}>
                                            <View className="gap-3">
                                                <View className="flex-row items-start justify-between gap-3">
                                                    <Text
                                                        className={`flex-1 text-caption font-normal ${activeBreakdown === tile.key ? 'text-white/80' : 'text-textSecondary'
                                                            }`}>
                                                        {tile.title}
                                                    </Text>
                                                    <View className={`mt-1 h-3 w-3 rounded-full ${tile.accent}`} />
                                                </View>

                                                <Text
                                                    className={`text-section font-semibold ${activeBreakdown === tile.key ? 'text-white' : 'text-textPrimary'
                                                        }`}>
                                                    {tile.value}
                                                </Text>

                                                <Text
                                                    className={`text-caption font-normal ${activeBreakdown === tile.key ? 'text-white/80' : 'text-textSecondary'
                                                        }`}>
                                                    {tile.note}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className="gap-3">
                            {/* <View>
                                <Text className="text-section font-semibold text-textPrimary">History</Text>
                                <Text className="mt-1 text-caption font-normal text-textSecondary">
                                    Latest synced activity for the selected period. We can later split this into `gave`, `returned`, `took`, and `repaid` tabs.
                                </Text>
                            </View> */}

                            {!history.length ? (
                                <AppListState
                                    description="No transactions found for selected currency"
                                    mode="empty"
                                    title="No transactions found"
                                />
                            ) : !filteredHistory.length ? (
                                <AppListState
                                    description={`No entries found for ${activeBreakdownLabel}.`}
                                    mode="empty"
                                    title="No matching data"
                                />
                            ) : (
                                <AppCard padding="sm">
                                    <View className="gap-4">
                                        <View className="flex-row items-center justify-between gap-3">
                                            <Text className="text-section font-semibold text-textPrimary">
                                                Transaction History
                                            </Text>
                                            <View className="flex-row items-center gap-2">
                                                <Pressable onPress={() => setActiveBreakdown('all')}>
                                                    <View
                                                        className={`rounded-full border px-3 py-1 ${activeBreakdown === 'all'
                                                            ? 'border-primary-500 bg-primary-500'
                                                            : 'border-border bg-surface'
                                                            }`}>
                                                        <Text
                                                            className={`text-caption ${activeBreakdown === 'all' ? 'text-white' : 'text-textSecondary'
                                                                }`}>
                                                            All
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                                <AppBadge
                                                    label={`${filteredHistory.length} Entry(s)`}
                                                    variant="accent"
                                                />
                                            </View>
                                        </View>
                                        {filteredHistory.map((item, index) => (
                                            <AppListItem
                                                key={item.id}
                                                rightText={item.amount}
                                                showDivider={index !== filteredHistory.length - 1}
                                                subtitle={item.subtitle}
                                                title={item.title}
                                            />
                                        ))}
                                    </View>
                                </AppCard>
                            )}
                        </View>
                    </>
                ) : (
                    <AppListState
                        actionLabel="Retry"
                        description="No report data is available for the selected filters right now."
                        mode="empty"
                        onActionPress={() =>
                            loadReports({
                                month: selectedMonth || undefined,
                                year: selectedYear,
                            })
                        }
                        title="Report data unavailable"
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
