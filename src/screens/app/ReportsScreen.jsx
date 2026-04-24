import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppBadge, AppCard, AppListItem, AppListState, AppLoader} from '@/components/ui';
import {getReports} from '@/services/reportsApi';

import {ReportsDonutChart, ReportsSummaryCard} from './components';

const months = [
  {label: 'Jan', value: 1},
  {label: 'Feb', value: 2},
  {label: 'Mar', value: 3},
  {label: 'Apr', value: 4},
  {label: 'May', value: 5},
  {label: 'Jun', value: 6},
  {label: 'Jul', value: 7},
  {label: 'Aug', value: 8},
  {label: 'Sep', value: 9},
  {label: 'Oct', value: 10},
  {label: 'Nov', value: 11},
  {label: 'Dec', value: 12},
];

export const ReportsScreen = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadReports = useCallback(async month => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getReports({
        month,
        year: currentYear,
      });
      setReports(result?.reports || {});
    } catch (error) {
      setReports(null);
      setErrorMessage(error.message || 'Could not load reports.');
    } finally {
      setIsLoading(false);
    }
  }, [currentYear]);

  useEffect(() => {
    loadReports(selectedMonth);
  }, [loadReports, selectedMonth]);

  const summary = reports?.summary && typeof reports.summary === 'object' ? reports.summary : null;
  const history = Array.isArray(reports?.history) ? reports.history : [];
  const selectedMonthLabel =
    months.find(month => month.value === selectedMonth)?.label || summary?.titleMonth || 'Month';
  const chartTotal = useMemo(
    () => (summary ? summary.rawGave + summary.rawTook : 0),
    [summary],
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 pt-8 pb-32 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              A calm monthly view of what you gave, what you took, and how it moved.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              Reports
            </Text>
          </View>
          <AppBadge label={selectedMonthLabel} variant="accent" />
        </View>

        <ScrollView
          horizontal
          contentContainerClassName="items-center gap-3"
          showsHorizontalScrollIndicator={false}>
          {months.map(month => {
            const active = month.value === selectedMonth;

            return (
              <Pressable
                key={month.value}
                className={`h-10 min-w-[72px] items-center justify-center rounded-full border px-4 ${
                  active
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-border bg-surface'
                }`}
                onPress={() => setSelectedMonth(month.value)}>
                <Text
                  className={`text-center text-caption leading-[16px] font-normal ${
                    active ? 'text-white' : 'text-textSecondary'
                  }`}>
                  {month.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <AppLoader card label="Loading reports..." />
        ) : errorMessage ? (
          <AppListState
            actionLabel="Retry"
            description={errorMessage}
            mode="empty"
            onActionPress={() => loadReports(selectedMonth)}
            title="Reports unavailable"
          />
        ) : summary ? (
          <>
            <AppCard variant="elevated">
              <View className="gap-5">
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-1">
                    <Text className="text-section font-semibold text-textPrimary">
                      Monthly Snapshot
                    </Text>
                    <Text className="mt-2 text-caption font-normal text-textSecondary">
                      Distribution of money given and money received in {selectedMonthLabel}.
                    </Text>
                  </View>
                  <AppBadge label={summary.totalEntries ? 'Active' : 'Quiet'} variant="primary" />
                </View>

                <View className="items-center">
                  <ReportsDonutChart
                    centerLabel="Monthly Total"
                    centerValue={summary.totalDisplay}
                    footerLabel="gave vs took"
                    gave={summary.rawGave}
                    took={summary.rawTook}
                    total={chartTotal}
                  />
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1 rounded-2xl bg-primary-500 px-4 py-4">
                    <Text className="text-caption font-normal text-white/80">You Gave</Text>
                    <Text className="mt-2 text-section font-semibold text-white">
                      {summary.gave}
                    </Text>
                  </View>

                  <View className="flex-1 rounded-2xl bg-accent-400 px-4 py-4">
                    <Text className="text-caption font-normal text-white/80">You Took</Text>
                    <Text className="mt-2 text-section font-semibold text-white">
                      {summary.took}
                    </Text>
                  </View>
                </View>
              </View>
            </AppCard>

            <View className="gap-4">
              <ReportsSummaryCard
                accent="primary"
                amount={summary.gave}
                note={`${summary.gaveCount} outgoing records this month`}
                title="You Gave"
              />
              <ReportsSummaryCard
                accent="accent"
                amount={summary.took}
                note={`${summary.tookCount} incoming records this month`}
                title="You Took"
              />
            </View>

            <View className="gap-3">
              <View>
                <Text className="text-section font-semibold text-textPrimary">History</Text>
                <Text className="mt-1 text-caption font-normal text-textSecondary">
                  Latest reportable activity for the selected month.
                </Text>
              </View>

              {!history.length ? (
                <AppListState
                  description="No reportable transactions were found for this month."
                  mode="empty"
                  title="No report data"
                />
              ) : (
                <AppCard padding="sm">
                  <View className="gap-4">
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="text-section font-semibold text-textPrimary">
                        Transaction History
                      </Text>
                      <AppBadge label={`${history.length} entries`} variant="accent" />
                    </View>
                    {history.map((item, index) => (
                      <AppListItem
                        key={item.id}
                        rightText={item.amount}
                        showDivider={index !== history.length - 1}
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
            description="No report data is available for this month right now."
            mode="empty"
            onActionPress={() => loadReports(selectedMonth)}
            title="Report data unavailable"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
