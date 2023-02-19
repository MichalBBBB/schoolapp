import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  MutationResult,
  NextLink,
  NormalizedCacheObject,
  Observable,
  Observer,
  Operation,
} from '@apollo/client';
import {v4 as uuidv4} from 'uuid';
import {storage} from '../App';

export type QueueItem = {
  id: string;
  name: string;
  queryJSON: string;
  contextJSON: string;
  variablesJSON: string;
};

const queueStorageKey = 'queue';

export class PersistentQueueLink extends ApolloLink {
  private isOpen = true;
  private queue: QueueItem[] = [];
  private client: ApolloClient<NormalizedCacheObject> | null = null;

  public async open() {
    // storage.set(queueStorageKey, JSON.stringify([]));
    const savedQueue = storage.getString(queueStorageKey);
    if (!savedQueue) {
      storage.set(queueStorageKey, JSON.stringify([]));
    }
    this.queue = JSON.parse(storage.getString(queueStorageKey) as string);
    this.isOpen = true;
    const promises: Promise<any>[] = [];

    if (this.client && this.client !== null) {
      this.queue.map(item => {
        const query = JSON.parse(item.queryJSON);
        const context = JSON.parse(item.contextJSON);
        const variables = JSON.parse(item.variablesJSON);
        promises.push(
          this.client!.mutate({
            variables,
            mutation: query,
            context,
            optimisticResponse: context.optimisticResponse,
          })
            .then(response => {
              this.queue.filter(queueItem => queueItem.id !== item.id);
            })
            .catch(err => console.warn('queuelink error', err)),
        );
      });
      await Promise.all(promises);
      storage.set(queueStorageKey, JSON.stringify(this.queue));
    }
  }
  public close() {
    this.isOpen = false;
  }

  public setClient(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client;
  }

  public request(operation: Operation, forward: NextLink) {
    if (this.isOpen) {
      console.log(this.isOpen);
      return forward(operation);
    }
    if (operation.getContext().skipQueue) {
      return forward(operation);
    }

    if (!operation.getContext().optimisticResponse) {
      return forward(operation);
    }

    const name: string = operation.operationName;
    const queryJSON: string = JSON.stringify(operation.query);
    const variablesJSON: string = JSON.stringify(operation.variables);
    const context = operation.getContext();
    context.cache = undefined;
    context.getCacheKey = undefined;
    const contextJSON = JSON.stringify(context);
    const id = uuidv4();
    this.queue.push({
      name,
      queryJSON,
      variablesJSON,
      contextJSON,
      id,
    });
    storage.set(queueStorageKey, JSON.stringify(this.queue));
    console.log('result', context.optimisticResponse);
    console.log('context', context);
    return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
      observer.next?.({data: context.optimisticResponse} as MutationResult);
      observer.complete?.();
      return () => {};
    });
  }
}
