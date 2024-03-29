import {FetchResult, MutationResult, useApolloClient} from '@apollo/client';
import {
  MeDocument,
  MeQuery,
  SetSettingsMutation,
  SetSettingsMutationVariables,
  SettingsFragmentDoc,
  useSetSettingsMutation,
} from '../../generated/graphql';

export type SetSettingsFunction = (
  variables: SetSettingsMutationVariables,
) => Promise<FetchResult<SetSettingsMutation> | null>;

export const useSetSettings: () => [
  SetSettingsFunction,
  MutationResult<SetSettingsMutation>,
] = () => {
  const [setSettings, data] = useSetSettingsMutation();
  const client = useApolloClient();
  const func = async (variables: SetSettingsMutationVariables) => {
    const settings = (
      await client.query<MeQuery>({
        query: MeDocument,
      })
    ).data.me.settings;
    if (settings) {
      const result = await setSettings({
        context: {
          serializationKey: 'MUTATION',
        },
        variables: variables,
        optimisticResponse: {
          __typename: 'Mutation',
          setSettings: {
            __typename: 'Settings',
            darkMode:
              variables.darkMode == null
                ? settings.darkMode
                : variables.darkMode,
            id: settings.id,
            startOfWeek: variables.startOfWeek || settings.startOfWeek,
            startOfRotationDate:
              variables.startOfRotationDate || settings.startOfRotationDate,
            lengthOfRotation:
              variables.lengthOfRotation || settings.lengthOfRotation,
            skipWeekends:
              variables.skipWeekends == null
                ? settings.skipWeekends
                : variables.skipWeekends,
            showDoDate:
              variables.showDoDate == null
                ? settings.showDoDate
                : variables.showDoDate,
            sortTasksBy: variables.sortTasksBy || settings.sortTasksBy,
            showCompletedTasks:
              variables.showCompletedTasks == null
                ? settings.showCompletedTasks
                : variables.showCompletedTasks,
            isFirstTime:
              variables.isFirstTime == null
                ? settings.isFirstTime
                : variables.isFirstTime,
            showCalendarView:
              variables.showCalendarView == null
                ? settings.showCalendarView
                : variables.showCalendarView,
          },
        },
        update: (cache, {data}) => {
          if (!data) {
            return;
          }
          const normalizedSettingsId = `Settings:${data.setSettings.id}`;
          cache.writeFragment({
            id: normalizedSettingsId,
            fragment: SettingsFragmentDoc,
            fragmentName: 'Settings',
            data: data.setSettings,
          });
        },
      });
      return result;
    }
    return null;
  };
  return [func, data];
};
