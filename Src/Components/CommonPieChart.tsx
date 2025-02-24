import React from 'react';
import {View, Text} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {TaskPerformanceDataProps} from '../@types/general';
import {COLORS} from '../Utilities/Constants';

type PieDataType = {
  value: number;
  color: string;
  gradientCenterColor: string;
  focused?: boolean;
};

type DotProps = {
  color: string;
};

const Dot: React.FC<DotProps> = ({color}) => (
  <View
    style={{
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: color,
      marginRight: 10,
    }}
  />
);

type LegendItemProps = {
  color: string;
  label: string;
};

const LegendItem: React.FC<LegendItemProps> = ({color, label}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    }}>
    <Dot color={color} />
    <Text style={{color: COLORS.darkBlue}}>{label}</Text>
  </View>
);

const Legend = ({percentage}: {percentage: number}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    }}>
    <LegendItem color={COLORS.orange} label={`Completed: ${percentage}%`} />
    <LegendItem
      color={COLORS.webBlack}
      label={`Others: ${100 - (percentage || 0)}%`}
    />
  </View>
);

const CenterLabel = (completedTaskPercentage: number, title: string) => (
  <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <Text style={{fontSize: 22, color: COLORS.darkBlue, fontWeight: 'bold'}}>
      {completedTaskPercentage}%
    </Text>
    <Text style={{fontSize: 14, color: COLORS.darkBlue}}>{title}</Text>
  </View>
);

const PerformanceChart = ({
  taskPerformanceData,
  title,
}: {
  taskPerformanceData: number;
  title: string;
}) => (
  <View
    style={{
      padding: 16,
      borderRadius: 20,
      backgroundColor: '#fff',
    }}>
    <View style={{padding: 20, alignItems: 'center'}}>
      <PieChart
        data={[
          {
            value: taskPerformanceData,
            color: '#e45200',
            gradientCenterColor: '#FF9D4C',
            // focused: true,
          },
          {
            value: 100 - (taskPerformanceData || 0),
            color: '#363543',
            gradientCenterColor: COLORS.darkNavy,
          },
        ]}
        donut
        showGradient
        sectionAutoFocus
        radius={90}
        innerRadius={60}
        innerCircleColor={COLORS.lightOrange}
        centerLabelComponent={() => CenterLabel(taskPerformanceData, title)}
      />
    </View>
    <Legend percentage={taskPerformanceData} />
  </View>
);

const CommonPieChart = ({
  taskPerformanceData,
  title,
}: {
  taskPerformanceData: number;
  title: string;
}) => (
  <PerformanceChart taskPerformanceData={taskPerformanceData} title={title} />
);

export default CommonPieChart;
