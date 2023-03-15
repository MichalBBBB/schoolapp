import dayjs from 'dayjs';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {
  GetProjectsDocument,
  ProjectTaskFragment,
  useAddProjectTaskMutation,
  useEditProjectTaskMutation,
} from '../generated/graphql';
import AddButton from './addButton';
import {BasicButton} from './basicViews/BasicButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicText} from './basicViews/BasicText';
import {BasicTextInput} from './basicViews/BasicTextInput';
import EditDateModal from './editDateWindow';
import {calendarConfigWithoutTime} from './task';
import {v4 as uuidv4} from 'uuid';

interface EditProjectTaskWindowProps {
  onClose: () => void;
  visible: boolean;
  projectTask?: ProjectTaskFragment;
  projectId: string;
}

const EditProjectTaskWindow: React.FC<EditProjectTaskWindowProps> = ({
  onClose,
  visible,
  projectTask,
  projectId,
}) => {
  const [createProjectTask] = useAddProjectTaskMutation({
    context: {
      skipQueue: true,
    },
  });
  const [editProjectTask] = useEditProjectTaskMutation({
    context: {
      skipQueue: true,
    },
  });

  const [name, setName] = useState('');
  const [viewVisible, setViewVisible] = useState<
    'main' | 'editDueDate' | 'editDoDate'
  >('main');
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>();
  const [doDate, setDoDate] = useState<dayjs.Dayjs | null>();

  useEffect(() => {
    if (visible && projectTask) {
      setName(projectTask?.name || '');
      setDoDate(projectTask.doDate ? dayjs(projectTask.doDate) : null);
      setDueDate(projectTask.dueDate ? dayjs(projectTask?.dueDate) : null);
    }
  }, [visible]);

  const closeWindow = () => {
    setName('');
    setDueDate(null);
    setDoDate(null);
    onClose();
  };

  return (
    <>
      <BasicModalCard
        backgroundColor="background"
        alignCard="flex-end"
        isVisible={visible && viewVisible == 'main'}
        avoidKeyboard={true}
        onBackdropPress={() => {
          console.log('closing window');
          closeWindow();
        }}>
        <BasicTextInput
          spacing="m"
          variant="unstyled"
          placeholder="Task name"
          value={name}
          onChangeText={setName}
          autoFocus={true}
        />
        <View style={styles.bottomContainer}>
          <BasicButton
            backgroundColor="accentBackground"
            style={styles.button}
            onPress={() => {
              setViewVisible('editDueDate');
            }}>
            <BasicText>
              {dueDate
                ? `Due: ${dueDate.calendar(null, calendarConfigWithoutTime)}`
                : 'Due date'}
            </BasicText>
          </BasicButton>
          <BasicButton
            backgroundColor="accentBackground"
            style={styles.button}
            onPress={() => {
              setViewVisible('editDoDate');
            }}>
            <BasicText>
              {doDate
                ? `Do: ${doDate.calendar(null, calendarConfigWithoutTime)}`
                : 'Schedule'}
            </BasicText>
          </BasicButton>
          <BasicButton
            spacing="m"
            borderRadius={20}
            onPress={() => {
              if (projectTask) {
                editProjectTask({
                  variables: {
                    id: projectTask.id,
                    name,
                    doDate,
                    dueDate,
                  },
                });
              } else {
                createProjectTask({
                  variables: {
                    projectId,
                    name,
                    doDate,
                    dueDate,
                  },
                  refetchQueries: [GetProjectsDocument],
                });
              }
              closeWindow();
            }}>
            <BasicText textVariant="button" color="textContrast">
              {projectTask ? 'Save' : 'Add'}
            </BasicText>
          </BasicButton>
        </View>
      </BasicModalCard>
      <EditDateModal
        isVisible={visible && viewVisible == 'editDueDate'}
        initialDate={dueDate || undefined}
        onClose={() => {
          setViewVisible('main');
        }}
        onSubmit={date => {
          setDueDate(date);
          setViewVisible('main');
        }}
      />
      <EditDateModal
        isVisible={visible && viewVisible == 'editDoDate'}
        initialDate={doDate || undefined}
        onClose={() => {
          setViewVisible('main');
        }}
        onSubmit={date => {
          setDoDate(date);
          setViewVisible('main');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    flex: 1,
    paddingHorizontal: 5,
    marginRight: 10,
  },
});

export default EditProjectTaskWindow;
