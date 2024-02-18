import {SubjectColorsObject} from '../types/Theme';

export type ExampleSubject = {
  name: string;
  color: keyof SubjectColorsObject;
};

export const exampleSubjects: ExampleSubject[] = [
  {name: 'Math', color: 'darkBlue'},
  {name: 'English', color: 'darkGreen'},
  {name: 'Biology', color: 'darkYellow'},
  {name: 'Chemistry', color: 'darkBlue'},
  {name: 'History', color: 'grey'},
  {name: 'Law', color: 'yellow'},
  {name: 'Physics', color: 'red'},
  {name: 'Programming', color: 'blue'},
  {name: 'Psychology', color: 'purple'},
  {name: 'Anatomy', color: 'yellow'},
  {name: 'Fitness', color: 'green'},
  {name: 'Spanish', color: 'darkPink'},
  {name: 'French', color: 'darkGreen'},
  {name: 'Calculus', color: 'blue'},
  {name: 'Literature', color: 'orange'},
  {name: 'Business', color: 'pink'},
  {name: 'Marketing', color: 'red'},
  {name: 'Economics', color: 'beige'},
  {name: 'Engineering', color: 'brown'},
];
