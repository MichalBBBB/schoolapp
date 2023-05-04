import {SubjectColorsObject} from '../types/Theme';

export type ExampleSubject = {
  name: string;
  color: keyof SubjectColorsObject;
};

export const exampleSubjects: ExampleSubject[] = [
  {name: 'Math', color: 'blue'},
  {name: 'English', color: 'brown'},
  {name: 'Biology', color: 'green'},
  {name: 'Chemistry', color: 'darkBlue'},
  {name: 'History', color: 'grey'},
  {name: 'Law', color: 'red'},
  {name: 'Physics', color: 'darkGreen'},
  {name: 'Programming', color: 'beige'},
  {name: 'Psychology', color: 'purple'},
  {name: 'Anatomy', color: 'orange'},
  {name: 'Fitness', color: 'yellow'},
  {name: 'Spanish', color: 'brown'},
  {name: 'French', color: 'darkGreen'},
  {name: 'Calculus', color: 'blue'},
  {name: 'Literature', color: 'brown'},
  {name: 'Business', color: 'pink'},
  {name: 'Marketing', color: 'red'},
  {name: 'Economics', color: 'orange'},
  {name: 'Engineering', color: 'grey'},
];
