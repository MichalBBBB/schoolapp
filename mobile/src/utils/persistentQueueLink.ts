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
import {isOnlineVar, storage} from '../App';

export type QueueItem = {
  id: string;
  name: string;
  queryJSON: string;
  contextJSON: string;
  variablesJSON: string;
};

const queueStorageKey = 'queue';

export class PersistentQueueLink extends ApolloLink {
  private isOpen = false;
  private queue: QueueItem[] = [];
  private client: ApolloClient<NormalizedCacheObject> | null = null;

  // after the app goes online, we need to go through the queue and execute all mutations
  public async open() {
    // storage.set(queueStorageKey, JSON.stringify([]));
    const savedQueue = storage.getString(queueStorageKey);
    console.log('savedQueue', savedQueue);
    if (!savedQueue) {
      storage.set(queueStorageKey, JSON.stringify([]));
    }
    this.queue = JSON.parse(savedQueue || '[]');
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
            .finally(() => {
              // remove the finished operation from the queue
              this.queue = this.queue.filter(
                queueItem => queueItem.id !== item.id,
              );
            })
            .catch(err => {
              console.warn('queuelink error', err);
            }),
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

  private addRequestToQueue = (operation: Operation) => {
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
  };

  // if the app doesn't know the server is offline, or there is some other network error,
  // we need to check if there were any errors on the operation, otherwise the operation would be lost
  private forwardCatchErrors(forward: NextLink, operation: Operation) {
    // we need to return a new observable object, to control the next and error resolutions
    return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
      const sub = forward(operation).subscribe({
        // if there were no errors, just return the original value
        next: result => {
          observer.next?.(result);
        },
        error: e => {
          // if there is an optimistic response - the operation should be put into queue,
          // add it to queue and return optimistic response
          const optimisticResponse = operation.getContext().optimisticResponse;
          if (optimisticResponse) {
            this.addRequestToQueue(operation);
            observer.next?.({data: optimisticResponse} as MutationResult);
            // tell the app it is offline
            isOnlineVar(false);
            this.close();
          } else {
            observer.error?.(e);
          }
        },
        complete: () => {
          observer.complete?.();
        },
      });
      return () => {
        sub.unsubscribe();
      };
    });
  }

  public request(operation: Operation, forward: NextLink) {
    // happens when the app thinks is online - queue is open
    if (this.isOpen) {
      // preventitive measure - if there is something stuck in queue even when it is open,
      // remove it to prevent causing bigger issues
      const queue = JSON.parse(storage.getString(queueStorageKey) || '[]');
      if ((queue as Array<any>).length !== 0) {
        storage.set(queueStorageKey, JSON.stringify([]));
      }
      return this.forwardCatchErrors(forward, operation);
    }
    if (operation.getContext().skipQueue) {
      return this.forwardCatchErrors(forward, operation);
    }
    // if there was no optimisticResponse provided, we can't run the offline process
    if (!operation.getContext().optimisticResponse) {
      return this.forwardCatchErrors(forward, operation);
    }

    this.addRequestToQueue(operation);
    const context = operation.getContext();
    return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
      observer.next?.({data: context.optimisticResponse} as MutationResult);
      observer.complete?.();
      return () => {};
    });
  }
}
