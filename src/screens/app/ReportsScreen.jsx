import React, { useCallback, useMemo, useState } from 'react';
import { InteractionManager, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBadge, AppCard, AppListItem, AppListState, AppLoader } from '@/components/ui';
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

const buildSummaryTiles = summary => [
    {
        accent: 'bg-primary-500',
        key: 'loans_given',
        note: summary?.loanGivenCount
            ? `${summary.loanGivenCount} lending entries synced`
            : 'No lending entries yet',
        title: 'Loans Given',
        value: summary?.loansGiven || 'PKR 0',
    },
    {
        accent: 'bg-[#2f7d62]',
        key: 'returned_to_me',
        note: summary?.returnedToMeCount
            ? `${summary.returnedToMeCount} returned entries synced`
            : 'No returned entries yet',
        title: 'Returned To Me',
        value: summary?.returnedToMe || 'PKR 0',
    },
    {
        accent: 'bg-accent-400',
        key: 'loans_taken',
        note: summary?.loansTakenCount
            ? `${summary.loansTakenCount} borrowing entries synced`
            : 'No borrowing entries yet',
        title: 'Loans Taken',
        value: summary?.loansTaken || 'PKR 0',
    },
    {
        accent: 'bg-[#cb5a36]',
        key: 'repaid_by_me',
        note: summary?.repaidByMeCount
            ? `${summary.repaidByMeCount} repayment entries synced`
            : 'No repayment entries yet',
        title: 'Repaid By Me',
        value: summary?.repaidByMe || 'PKR 0',
    },
];

export const ReportsScreen = () => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const yearOptions = useMemo(() => buildYearOptions(currentYear), [currentYear]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
    const [activeBreakdown, setActiveBreakdown] = useState('all');
    const [reports, setReports] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const loadReports = useCallback(async ({ month, year }) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const result = await getReports({
                ...(month ? { month } : {}),
                year,
            });
            setReports(result?.reports || {});
        } catch (error) {
            setReports(null);
            setErrorMessage(error.message || 'Could not load reports.');
        } finally {
            setIsLoading(false);
        }
    }, []);

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
    const chartTotal = useMemo(
        () => (summary ? summary.rawLoansGiven + summary.rawLoansTaken : 0),
        [summary],
    );
    const gavePercentage = chartTotal > 0
        ? Math.min((summary.rawLoansGiven / chartTotal) * 100, 100)
        : 0;
    const tookPercentage = chartTotal > 0
        ? Math.min((summary.rawLoansTaken / chartTotal) * 100, 100)
        : 0;
    const summaryTiles = useMemo(() => buildSummaryTiles(summary), [summary]);
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

                        {isYearView ? (
                            <View className="rounded-[24px] border border-dashed border-borderStrong bg-surfaceMuted px-4 py-4">
                                <Text className="text-body font-semibold text-textPrimary">
                                    Full-year mode UI is ready
                                </Text>
                                <Text className="mt-1 text-caption font-normal text-textSecondary">
                                    Once you say the word, we will wire the backend so selecting a year without a month loads annual totals, annual history, and repayment-specific breakdowns.
                                </Text>
                            </View>
                        ) : null}
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
                                                ? `This layout is prepared for ${selectedYear} annual finance movement. Current values still reflect the synced month until backend filters are connected.`
                                                : `Distribution of money given and money taken in ${selectedMonthLabel}.`}
                                        </Text>
                                    </View>
                                    <AppBadge label={summary.totalEntries ? 'Active' : 'Quiet'} variant="primary" />
                                </View>

                                <View className="items-center py-2">
                                    <Text className="text-caption font-normal text-textSecondary">
                                        {isYearView ? 'Selected Year' : 'Monthly Total'}
                                    </Text>
                                    <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
                                        {summary.totalDisplay}
                                    </Text>
                                    <Text className="mt-2 text-caption font-normal text-textMuted">
                                        Gave vs Took
                                    </Text>
                                </View>

                                <View className="gap-3">
                                    <View className="h-4 flex-row overflow-hidden rounded-full bg-surfaceMuted">
                                        {gavePercentage > 0 ? (
                                            <View
                                                className="h-full bg-primary-500"
                                                style={{width: `${gavePercentage}%`}}
                                            />
                                        ) : null}
                                        {tookPercentage > 0 ? (
                                            <View
                                                className="h-full bg-accent-400"
                                                style={{width: `${tookPercentage}%`}}
                                            />
                                        ) : null}
                                    </View>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center gap-2">
                                            <View className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                                            <Text className="text-caption font-normal text-textSecondary">
                                                Gave {Math.round(gavePercentage)}%
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <View className="h-2.5 w-2.5 rounded-full bg-accent-400" />
                                            <Text className="text-caption font-normal text-textSecondary">
                                                Took {Math.round(tookPercentage)}%
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row gap-4">
                                    <View className="flex-1 rounded-2xl bg-primary-500 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">Current Synced Gave</Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {summary.loansGiven}
                                        </Text>
                                    </View>

                                    <View className="flex-1 rounded-2xl bg-accent-400 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">Current Synced Took</Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {summary.loansTaken}
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
                                    description="No reportable transactions were found for this period."
                                    mode="empty"
                                    title="No report data"
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
