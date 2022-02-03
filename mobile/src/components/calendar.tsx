import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

type Day = {
  date: number;
  month: number;
  year: number;
};

const createMatrix = (year: number, month: number) => {
  const matrix: Day[][] = [];
  const date = dayjs(new Date(year, month - 1, 1));

  const firstDay = date.startOf('month').get('day');

  let day = date.subtract(firstDay, 'day');

  for (var row = 0; row < 6; row++) {
    matrix.push([]);
    for (var col = 0; col < 7; col++) {
      matrix[row].push({
        date: day.get('date'),
        month: day.get('month') + 1,
        year: day.get('year'),
      });
      day = day.add(1, 'day');
    }
  }
  console.log(matrix);
  return matrix;
};

const Week: React.FC<{week: Day[]; monthNum: number}> = ({week, monthNum}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
      {week.map((day, index) => (
        <TouchableOpacity
          onPress={() => {
            console.log(day.date, day.month, day.year);
            const date = new Date(day.year, day.month - 1, day.date);
            console.log(date);
          }}
          key={index}>
          <View
            style={{
              width: 20,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: day.month == monthNum ? 'black' : 'grey'}}>
              {day.date}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Calendar = () => {
  const [month, setMonth] = useState(dayjs());
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            setMonth(month.subtract(1, 'month'));
          }}>
          <Text>back</Text>
        </TouchableOpacity>
        <Text>{month.get('month')}</Text>
        <TouchableOpacity
          onPress={() => {
            setMonth(month.add(1, 'month'));
          }}>
          <Text>next</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        {weekDays.map(item => (
          <View style={{height: 30, width: 20, alignItems: 'center'}}>
            <Text style={{color: 'grey'}}>{item}</Text>
          </View>
        ))}
      </View>
      <Month month={month} />
    </View>
  );
};

const Month = ({month}: {month: dayjs.Dayjs}) => {
  return (
    <View>
      {createMatrix(month.get('year'), month.get('month') + 1).map(
        (week, index) => (
          <Week week={week} monthNum={month.get('month') + 1} key={index} />
        ),
      )}
    </View>
  );
};

const weekDays = ['s', 'm', 't', 'w', 't', 'f', 's'];

export default Calendar;
