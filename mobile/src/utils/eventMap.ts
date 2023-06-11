import dayjs from 'dayjs';
import {
  CalendarEventFragment,
  Lesson,
  LessonFragment,
  ProjectTaskWithProjectFragment,
  TaskFragment,
} from '../generated/graphql';
import {getEnd, getStart, isOverlap} from './eventUtils';

export type EventReference = {
  __typename: 'CalendarEvent' | 'Lesson' | 'Task';
  id: string;
};

export type MapEvent = {
  data:
    | CalendarEventFragment
    | LessonFragment
    | TaskFragment
    | ProjectTaskWithProjectFragment;
  overlaps: EventReference[];
};

export const getEventMap = (
  date: dayjs.Dayjs,
  events: CalendarEventFragment[],
  lessons: LessonFragment[],
  tasks: Array<TaskFragment | ProjectTaskWithProjectFragment>,
) => {
  const map: MapEvent[] = [];
  // go through events

  events.forEach(item => {
    const mapEvent: MapEvent = {
      data: item,
      overlaps: [],
    };
    // check if event overlaps with other events
    events.forEach(event => {
      if (isOverlap(date, item, event)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: event.id, __typename: 'CalendarEvent'},
        ];
      }
    });
    // check if event overlaps with any lessons
    lessons.forEach(lesson => {
      if (isOverlap(date, item, lesson)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: lesson.id, __typename: 'Lesson'},
        ];
      }
    });
    // check if event overlaps with any tasks
    tasks.forEach(task => {
      if (isOverlap(date, item, task)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: task.id, __typename: 'Task'},
        ];
      }
    });
    map.push(mapEvent);
  });
  // go through lessons
  lessons.forEach(item => {
    const mapEvent: MapEvent = {
      data: item,
      overlaps: [],
    };
    // check if lesson overlaps with any events
    events.forEach(event => {
      if (isOverlap(date, item, event)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: event.id, __typename: 'CalendarEvent'},
        ];
      }
    });
    console.log(tasks);
    // check if lesson overlaps with any tasks
    tasks.forEach(task => {
      if (isOverlap(date, item, task)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: task.id, __typename: 'Task'},
        ];
      }
    });
    map.push(mapEvent);
  });
  tasks.forEach(item => {
    const mapEvent: MapEvent = {
      data: item,
      overlaps: [],
    };
    // check if event overlaps with other events
    events.forEach(event => {
      if (isOverlap(date, item, event)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: event.id, __typename: 'CalendarEvent'},
        ];
      }
    });
    // check if event overlaps with any lessons
    lessons.forEach(lesson => {
      if (isOverlap(date, item, lesson)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: lesson.id, __typename: 'Lesson'},
        ];
      }
    });
    // check if event overlaps with any tasks
    tasks.forEach(task => {
      if (isOverlap(date, item, task)) {
        mapEvent.overlaps = [
          ...(mapEvent.overlaps || []),
          {id: task.id, __typename: 'Task'},
        ];
      }
    });
    map.push(mapEvent);
  });
  return map;
};

export type EventGroup = {
  data: Array<MapEvent>;
};

export const getEventGroups = (
  date: dayjs.Dayjs,
  events: CalendarEventFragment[],
  lessons: LessonFragment[],
  tasks: Array<TaskFragment | ProjectTaskWithProjectFragment>,
) => {
  var map = getEventMap(date, events, lessons, tasks);
  const getGroup = (event: MapEvent) => {
    map = map.filter(item => {
      return item.data.id !== event.data.id;
    });
    var group = [event];
    event.overlaps.forEach(item => {
      const overlapEvent = map.find(mapItem => {
        return mapItem.data.id == item.id;
      });
      if (overlapEvent) {
        const data = getGroup(overlapEvent);
        group = [...group, ...data];
      }
    });

    return group;
  };
  const groups: EventGroup[] = [];
  while (map.length > 0) {
    const group = getGroup(map[0]);
    groups.push({
      data: group,
    });
  }
  return groups;
};

export type EventBlock = {
  columns: Array<
    Array<
      | CalendarEventFragment
      | LessonFragment
      | TaskFragment
      | ProjectTaskWithProjectFragment
    >
  >;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
};

export const getEventBlocks = (
  date: dayjs.Dayjs,
  events: CalendarEventFragment[],
  lessons: LessonFragment[],
  tasks: Array<TaskFragment | ProjectTaskWithProjectFragment>,
) => {
  const groups = getEventGroups(date, events, lessons, tasks);

  const blocks: Array<EventBlock> = groups.map(group => {
    const sortedItems = group.data.map(item => {
      var startDate = getStart(item.data, date);

      var endDate = getEnd(item.data, date);
      return {
        data: item,
        startDate: startDate.valueOf(),
        endDate: endDate.valueOf(),
      };
    });
    sortedItems.sort((a, b) => {
      return a.startDate - b.startDate;
    });
    const columns: Array<typeof sortedItems> = [[]];

    sortedItems.forEach(item => {
      var columnIndex = 0;
      var isPlaced = false;
      while (!isPlaced) {
        if (columnIndex + 1 <= columns.length) {
          if (columns[columnIndex].length > 0) {
            if (
              columns[columnIndex][columns[columnIndex].length - 1].endDate <
              item.startDate
            ) {
              columns[columnIndex].push(item);
              isPlaced = true;
            } else {
              columnIndex += 1;
            }
          } else {
            columns[columnIndex] = [item];
            isPlaced = true;
          }
        } else {
          columns.push([item]);
          isPlaced = true;
        }
      }
    });
    const itemsCopy = [...sortedItems];
    itemsCopy.sort((a, b) => b.endDate - a.endDate);
    return {
      columns: columns.map(item => item.map(event => event.data.data)),
      startTime: dayjs(sortedItems[0].startDate),
      endTime: dayjs(itemsCopy[0].endDate),
    };
  });
  blocks.sort((a, b) => a.startTime.diff(b.startTime));
  return blocks;
};
